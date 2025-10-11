import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsDate, IsDateString } from "class-validator";

export class CreatePrescriptionDto {

    @ApiProperty({
        description: "Tibbiy yozuv (Medical Record) ID",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    medical_record_id: number;


    @ApiProperty({
        description: "Dori (Medication) ID",
        example: 2
    })
    @IsNumber()
    @IsNotEmpty()
    medication_id: number;


    @ApiProperty({
        description: "Dozalash (dosage)",
        example: "500mg"
    })
    @IsString()
    @IsNotEmpty()
    dosage: string;


    @ApiProperty({
        description: "Qanchalik tez-tez qabul qilinishi (frequency)",
        example: "Kuniga 3 marta"
    })
    @IsString()
    @IsNotEmpty()
    frequency: string;


    @ApiProperty({
        description: "Davolanish muddati (kunlarda)",
        example: 7
    })
    @IsNumber()
    @IsNotEmpty()
    duration_days: number;
    

    @ApiProperty({
        description: "Buyurilgan sana (YYYY-MM-DD formatda)",
        example: "2025-10-10"
    })
    @IsDateString()
    @IsNotEmpty()
    prescribed_date: string;
}
