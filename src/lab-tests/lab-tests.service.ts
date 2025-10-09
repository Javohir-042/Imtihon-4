import { Injectable } from '@nestjs/common';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { UpdateLabTestDto } from './dto/update-lab-test.dto';

@Injectable()
export class LabTestsService {
  create(createLabTestDto: CreateLabTestDto) {
    return 'This action adds a new labTest';
  }

  findAll() {
    return `This action returns all labTests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} labTest`;
  }

  update(id: number, updateLabTestDto: UpdateLabTestDto) {
    return `This action updates a #${id} labTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} labTest`;
  }
}
