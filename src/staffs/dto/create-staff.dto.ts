import {
    IsString,
    IsEmail,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsPhoneNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { StaffEnum } from "../../common/enum/staffs.enum";

export class CreateStaffDto {

    @ApiProperty({
        example: "Javohir Quromboyev",
        description: "Xodimning to'liq ismi",
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;


    @ApiProperty({
        example: StaffEnum.TECHNICIAN,
        description: "Xodimning roli",
        enum: StaffEnum,
    })
    @IsEnum(StaffEnum, { message: "Role StaffEnum enum ichidan bo'lishi kerak( NURSE,RECEPTIONIST,TECHNICIAN )" })
    @IsNotEmpty()
    role: StaffEnum;


    @ApiProperty({
        example: "+998976006787",
        description: "Xodim telefon raqami",
    })
    @IsPhoneNumber('UZ')
    @IsNotEmpty()
    phone: string;


    @ApiProperty({
        example: "javohirquromboyev123@gmail.com",
        description: "Xodim email manzili",
    })
    @IsEmail({}, { message: "Email noto'g'ri formatda" })
    @IsNotEmpty()
    email: string;


    @ApiProperty({
        example: true,
        description: "Xodim faol yoki yo'qligi"
    })
    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}
