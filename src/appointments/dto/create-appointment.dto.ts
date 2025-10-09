import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AppEnum } from "../../common/enum/app.enum";

export class CreateAppointmentDto {
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
        description: "Uchrashuv sanasi (YYYY-MM-DD formatda)",
        example: "2025-10-10"
    })
    @IsDateString()
    @IsNotEmpty()
    appointment_date: string;

    @ApiProperty({
        description: "Uchrashuv vaqti (HH:MM formatda)",
        example: "14:30"
    })
    @IsString()
    @IsNotEmpty()
    appointment_time: string;

    @ApiProperty({
        description: "Uchrashuv holati",
        enum: AppEnum,
        example: AppEnum.PENDING
    })
    @IsEnum(AppEnum)
    @IsNotEmpty()
    status: AppEnum;


    @ApiProperty({
        description: "Uchrashuv sababi",
        example: "Yillik tekshiruv"
    })
    @IsString()
    @IsNotEmpty()
    reason: string;
}
