import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum } from "../../common/enum/gender.enum";
import { IsNotEmpty, IsString, IsEnum, IsPhoneNumber, IsStrongPassword, IsDateString } from "class-validator";

export class CreatePatientDto {
    @ApiProperty({ example: "Javohir Quromboyev" })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({
        description: "Tug'ilgan sana (YYYY-MM-DD formatda)",
        example: "2000-05-10"
    })
    @IsDateString()
    @IsNotEmpty()
    date_of_birth: string; 

    @ApiProperty({ enum: GenderEnum, example: GenderEnum.MALE })
    @IsEnum(GenderEnum)
    @IsNotEmpty()
    gender: GenderEnum;

    @ApiProperty({ example: "+998977777777" })
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: "Toshkent sh." })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: "O+" })
    @IsString()
    @IsNotEmpty()
    blood_group: string;

    @ApiProperty({ example: "javohir@gmail.com" })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "Javohir123!" })
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
