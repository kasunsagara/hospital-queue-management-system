import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BloodRequest, BloodRequestDocument } from './blood-request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { User, UserDocument } from '../users/user.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(BloodRequest.name) private requestModel: Model<BloodRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createRequestDto: CreateRequestDto, hospitalId: string): Promise<BloodRequestDocument> {
    const newRequest = new this.requestModel({
      ...createRequestDto,
      hospitalId: new Types.ObjectId(hospitalId),
      status: 'pending',
    });
    const savedRequest = await newRequest.save();

    // Match donors and notify them
    const matchingDonors = await this.findMatchingDonors(savedRequest._id.toString());
    for (const donor of matchingDonors) {
      await this.notificationsService.sendNotification(
        donor._id.toString(),
        `Urgent: ${savedRequest.bloodGroup} blood required at nearby hospital.`,
        'new_request',
        savedRequest._id.toString(),
      );
    }

    return savedRequest;
  }

  async findAll(): Promise<BloodRequestDocument[]> {
    return this.requestModel
      .find()
      .populate('hospitalId donorId patientId', 'name email bloodGroup location')
      .exec();
  }

  async findByUserId(userId: string, role: string): Promise<BloodRequestDocument[]> {
    const query =
      role === 'hospital'
        ? { hospitalId: new Types.ObjectId(userId) }
        : { donorId: new Types.ObjectId(userId) };
    return this.requestModel
      .find(query)
      .populate('hospitalId donorId patientId', 'name email bloodGroup location')
      .exec();
  }

  async acceptRequest(requestId: string, donorId: string): Promise<BloodRequestDocument> {
    const donor = await this.userModel.findById(donorId);
    if (!donor || donor.role !== 'donor' || !donor.availability) {
      throw new BadRequestException('Donor not eligible or not available');
    }

    // Atomic update to prevent multiple donors accepting
    const request = await this.requestModel.findOneAndUpdate(
      { _id: new Types.ObjectId(requestId), status: 'pending' },
      {
        $set: {
          donorId: new Types.ObjectId(donorId),
          status: 'matched',
        },
      },
      { new: true },
    );

    if (!request) {
      throw new BadRequestException('Request not found or already accepted');
    }

    // Notify hospital
    await this.notificationsService.sendNotification(
      request.hospitalId.toString(),
      `Donor ${donor.name} has accepted your blood request.`,
      'request_accepted',
      request._id.toString(),
    );

    return request;
  }

  async updateStatus(requestId: string, status: string, hospitalId: string): Promise<BloodRequestDocument> {
    const request = await this.requestModel.findOneAndUpdate(
      { _id: new Types.ObjectId(requestId), hospitalId: new Types.ObjectId(hospitalId) },
      { $set: { status } },
      { new: true },
    );

    if (!request) {
      throw new NotFoundException('Request not found or unauthorized');
    }

    if (status === 'completed' && request.donorId) {
      // Notify donor
      await this.notificationsService.sendNotification(
        request.donorId.toString(),
        `Thank you! Your donation for request ${request._id} is completed.`,
        'request_completed',
        request._id.toString(),
      );
    }

    return request;
  }

  async findMatchingDonors(requestId: string): Promise<UserDocument[]> {
    const request = await this.requestModel.findById(requestId);
    if (!request || !request.location) {
      return [];
    }

    // Find donors within 10km (10000 meters)
    return this.userModel
      .find({
        bloodGroup: request.bloodGroup,
        availability: true,
        role: 'donor',
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: request.location.coordinates,
            },
            $maxDistance: 10000, // 10km
          },
        },
      })
      .exec();
  }
}
