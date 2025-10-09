import { IsString, IsEmail, IsBoolean, IsNotEmpty, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDoctorDto {

    @ApiProperty({
        example: "Javohir Quromboyev",
        description: "Shifokorning to'liq ismi",
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;


    @ApiProperty({
        example: "Cardiology",
        description: "Shifokorning ixtisosligi ",
    })
    @IsString()
    @IsNotEmpty()
    specialization: string;

    @ApiProperty({
        example: "+998888888888",
        description: "Shifokorning telefon raqami",
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: `Javohir123!`,
        description: `Strong password `,
    })
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;


    @ApiProperty({
        example: "javohir888@gmail.com",
        description: "Shifokorning email manzili",
    })
    @IsEmail({}, { message: "Email noto'g'ri formatda" })
    @IsNotEmpty()
    email: string;


    @ApiProperty({
        example: true,
        description: "Shifokor faol holatda yoki yo'qligi",
    })
    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}
