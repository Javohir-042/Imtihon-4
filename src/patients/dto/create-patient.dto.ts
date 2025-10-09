import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum } from "../../common/enum/gender.enum";
import { IsNotEmpty, IsString, IsDate, IsEnum, IsPhoneNumber } from "class-validator";

export class CreatePatientDto {
    @ApiProperty({
        description: "Bemorning to'liq ismi",
        example: "Javohir Quromboyev"
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;


    @ApiProperty({
        description: "Tug'ilgan sana (YYYY-MM-DD formatda)",
        example: "2000-05-10"
    })
    @IsDate()
    @IsNotEmpty()
    data_of_birth: Date;


    @ApiProperty({
        description: "Jins",
        enum: GenderEnum,
        example: GenderEnum.MALE
    })
    @IsEnum(GenderEnum, { message: "gender (MALE, FEMALE) qiymatlaridan bo'lishi kerak" })
    @IsNotEmpty()
    gender: GenderEnum;


    @ApiProperty({
        description: "Telefon raqam",
        example: "+998977777777"
    })
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;


    @ApiProperty({
        description: "Manzil",
        example: "Toshkent sh., Chilonzor tumani"
    })
    @IsString()
    @IsNotEmpty()
    address: string;


    @ApiProperty({
        description: "Qon guruhi",
        example: "|||"
    })
    @IsString()
    @IsNotEmpty()
    blood_group: string;
}
