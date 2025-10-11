import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsDate, IsDateString } from "class-validator";

export class CreateMedicalRecordDto {
    @ApiProperty({
        description: "Shifokor ID",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    doctor_id: number;


    @ApiProperty({
        description: "Uchrashuv (Appointment) ID",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    appointment_id: number;


    @ApiProperty({
        description: "Bemor ID",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    patient_id: number;


    @ApiProperty({
        description: "Tashxis",
        example: "O'pka yallig'lanishi"
    })
    @IsString()
    @IsNotEmpty()
    diagnosis: string;


    @ApiProperty({
        description: "Belgilar (Symptoms)",
        example: "Isitma, yo'tal, nafas qisishi"
    })
    @IsString()
    @IsNotEmpty()
    symptoms: string;


    @ApiProperty({
        description: "Davolash yo'riqnomasi",
        example: "Antibiotik kursi, dam olish"
    })
    @IsString()
    @IsNotEmpty()
    treatment: string;


    @ApiProperty({
        description: "Tibbiy yozuv sanasi (YYYY-MM-DD formatda)",
        example: "2025-10-10"
    })
    @IsDateString()
    @IsNotEmpty()
    record_date: string;
}
