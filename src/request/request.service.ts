import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BloodRequest, BloodRequestDocument } from './blood-request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(BloodRequest.name) private requestModel: Model<BloodRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createRequestDto: CreateRequestDto, hospitalId: string): Promise<BloodRequestDocument> {
    const newRequest = new this.requestModel({
      ...createRequestDto,
      hospitalId: new Types.ObjectId(hospitalId),
      status: 'pending',
    });
    return newRequest.save();
  }

  async findAll(): Promise<BloodRequestDocument[]> {
    return this.requestModel.find().populate('hospitalId donorId', 'name email bloodGroup location').exec();
  }

  async findByUserId(userId: string, role: string): Promise<BloodRequestDocument[]> {
    const query = role === 'hospital' 
      ? { hospitalId: new Types.ObjectId(userId) }
      : { donorId: new Types.ObjectId(userId) };
    return this.requestModel.find(query).populate('hospitalId donorId', 'name email bloodGroup location').exec();
  }

  async acceptRequest(requestId: string, donorId: string): Promise<BloodRequestDocument> {
    const donor = await this.userModel.findById(donorId);
    if (!donor || donor.role !== 'donor' || !donor.availability) {
      throw new BadRequestException('Donor not eligible or not available');
    }

    const request = await this.requestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Request is no longer pending');
    }

    if (request.bloodGroup !== donor.bloodGroup) {
      throw new BadRequestException('Blood group mismatch');
    }

    request.donorId = new Types.ObjectId(donorId);
    request.status = 'matched';
    return request.save();
  }

  async completeRequest(requestId: string): Promise<BloodRequestDocument> {
    const request = await this.requestModel.findByIdAndUpdate(
      requestId,
      { status: 'completed' },
      { new: true },
    ).exec();

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async findMatchingDonors(requestId: string): Promise<UserDocument[]> {
    const request = await this.requestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return this.userModel.find({
      bloodGroup: request.bloodGroup,
      location: request.location,
      availability: true,
      role: 'donor',
    }).exec();
  }
}
