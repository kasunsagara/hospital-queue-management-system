import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient, PatientDocument } from './patient.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: any, hospitalId: string): Promise<Patient> {
    const createdPatient = new this.patientModel({
      ...createPatientDto,
      hospitalId: new Types.ObjectId(hospitalId),
    });
    return createdPatient.save();
  }

  async findAllByHospital(hospitalId: string): Promise<Patient[]> {
    return this.patientModel.find({ hospitalId: new Types.ObjectId(hospitalId) }).exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }
}
