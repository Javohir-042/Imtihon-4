import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { Role } from "../../common/enum/admin.enum";

export class CreateAdminDto {
  @ApiProperty({
    example: `Javohir Quromboyev`,
    description: `To'liq ism familiya`,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: `javohirquromboyev933@gmial.com`,
    description: `Admin email manzili`,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: `Javohir_042`,
    description: `Admin foydalanuvchi nomi`,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: `Javohir123!`,
    description: `Strong password `,
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: Role.ADMIN,
    enum: Role,
    description: `Adminning roli `,
  })
  @IsEnum(Role, {
    message: `role faqat oldindan belgilangan qiymatlardan biri bo'lishi kerak`,
  })
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    example: true,
    description: `Admin faol yoki yo'qligini bildiradi`,
  })
  @IsBoolean({ message: `is_active qiymati true yoki false bo'lishi kerak` })
  is_active: boolean;


}
