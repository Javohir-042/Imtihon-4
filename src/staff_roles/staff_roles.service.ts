import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffRoleDto } from './dto/create-staff_role.dto';
import { UpdateStaffRoleDto } from './dto/update-staff_role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { StaffRole } from './model/staff_role.model';
import { Staff } from '../staffs/model/staff.model';
import { Role } from '../roles/model/role.model';
import { ResData } from '../lib/resData';

@Injectable()
export class StaffRolesService {
  constructor(
    @InjectModel(StaffRole) private readonly staffRoleModel: typeof StaffRole,
    @InjectModel(Staff) private readonly staffModel: typeof Staff,
    @InjectModel(Role) private readonly roleModel: typeof Role,
  ){}

  async create(createStaffRoleDto: CreateStaffRoleDto) {
    const {staff_id , role_id} = createStaffRoleDto

    if(staff_id === undefined || role_id === undefined) {
      throw new NotFoundException('Barchasini kiriting')
    }

    const staff = await this.staffModel.findByPk(staff_id)
    if (!staff) {
      throw new NotFoundException('Bunday staff_id topilmadi')
    }

    const role = await this.roleModel.findByPk(role_id)
    if (!role) {
      throw new NotFoundException('Bunday role_id topilmadi')
    }

    const newStaffRole = await this.staffRoleModel.create({...createStaffRoleDto})
    return newStaffRole
  }

  async findAll(): Promise<ResData<StaffRole[]>> {
      const staff = await this.staffRoleModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })
  
      return new ResData("Staff successFully retrieved", 200, staff);
    }
  
    async findOne(id: number): Promise<ResData<StaffRole>> {
      const staffRole = await this.staffRoleModel.findByPk(id, { include: { all: true } })
      if (!staffRole) {
        throw new NotFoundException('StaffRole not found')
      }
  
      return new ResData('StaffRole retrieved by id', 200, staffRole);
    }
  
    async update(id: number, updateStaffRoleDto: UpdateStaffRoleDto): Promise<ResData<StaffRole>> {
      const staffRole = await this.staffRoleModel.findByPk(id)
      if (!staffRole) {
        throw new NotFoundException('staffRole not found')
      }
  
      const { staff_id, role_id } = updateStaffRoleDto
  
      if (staff_id) {
        const staff = await this.staffModel.findByPk(staff_id)
        if (!staff) {
          throw new NotFoundException("Bunday staff_id topilmadi")
        }
      }
  
      if (role_id) {
        const role = await this.roleModel.findByPk(role_id)
        if (!role) {
          throw new NotFoundException("Bunday role_id topilmadi")
        }
      }
  
      await staffRole.update(updateStaffRoleDto)
  
      return new ResData('staffRole successFully update', 200, staffRole[1][0]);
    }
  
    async remove(id: number): Promise<ResData<null>> {
      const removed = await this.staffRoleModel.destroy({ where: { id } });
      if (!removed) {
        throw new NotFoundException("Bunday staffRole mavjud emas");
      }
      return new ResData("StaffRole muvaffaqiyatli o'chirildi", 200, null);
    }
}
