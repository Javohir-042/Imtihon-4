import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./model/role.model";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const { role_name, new_column } = createRoleDto;

    if (!role_name) {
      throw new BadRequestException("Role nomi kiritilishi shart");
    }

    const exist = await this.roleModel.findOne({ where: { role_name } });
    if (exist) {
      throw new BadRequestException("Bu rol allaqachon mavjud");
    }

    const newRole = await this.roleModel.create({
      role_name,
      new_column,
    });

    return {
      message: "Rol muvaffaqiyatli yaratildi",
      data: newRole,
    };
  }


  async findAll() {
    return this.roleModel.findAll({
      include: { all: true },
      order: [["id", "ASC"]],
    });
  }

  async findOne(id: number) {
    const role = await this.roleModel.findByPk(id, {
      include: { all: true },
    });

    if (!role) {
      throw new NotFoundException("Bunday rol topilmadi");
    }

    return role;
  }


  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleModel.findByPk(id);

    if (!role) {
      throw new NotFoundException("Rol topilmadi");
    }

    if (updateRoleDto.role_name) {
      role.role_name = updateRoleDto.role_name;
    }

    if (updateRoleDto.new_column) {
      role.new_column = updateRoleDto.new_column;
    }

    await role.save();

    return {
      message: "Rol muvaffaqiyatli yangilandi",
      data: role,
    };
  }

  async remove(id: number) {
    const role = await this.roleModel.findByPk(id);
    if (!role) {
      throw new NotFoundException("Rol topilmadi");
    }

    await role.destroy();
    return { message: "Rol muvaffaqiyatli o'chirildi" };
  }
}
