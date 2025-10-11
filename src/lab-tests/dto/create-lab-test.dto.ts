import { ApiProperty } from "@nestjs/swagger";
import { AppEnum } from "../../common/enum/app.enum";
import { IsNotEmpty, IsNumber, IsString, IsDate, IsEnum, IsDateString } from "class-validator";

export class CreateLabTestDto {
    @ApiProperty({
        description: "Shifokor ID",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    doctor_id: number;


    @ApiProperty({
        description: "Bemor ID",
        example: 2
    })
    @IsNumber()
    @IsNotEmpty()
    patient_id: number;


    @ApiProperty({
        description: "Tibbiy yozuv ID",
        example: 10
    })
    @IsNumber()
    @IsNotEmpty()
    medical_record_id: number;


    @ApiProperty({
        description: "Test nomi",
        example: "Qon tahlili"
    })
    @IsString()
    @IsNotEmpty()
    test_name: string;


    @ApiProperty({
        description: "Test sanasi (YYYY-MM-DD formatda)",
        example: "2025-10-10"
    })
    @IsDateString()
    @IsNotEmpty()
    test_date: string;


    @ApiProperty({
        description: "Test holati",
        enum: AppEnum,
        example: AppEnum.PENDING
    })
    @IsEnum(AppEnum, { message: "status AppEnum qiymatlaridan bo'lishi kerak" })
    @IsNotEmpty()
    status: AppEnum;


    @ApiProperty({
        description: "Test narxi",
        example: 150000
    })
    @IsNumber()
    @IsNotEmpty()
    cost: number;


    @ApiProperty({
        description: "Test natijasi",
        example: "Natija normal"
    })
    @IsString()
    @IsNotEmpty()
    result: string;
}
