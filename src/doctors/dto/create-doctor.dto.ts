import { IsString, IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDoctorDto {

    @ApiProperty({
        description: "Shifokorning mutaxassisligi",
        example: "Cardiology"
    })
    @IsString({ message: "specialization string bo'lishi kerak" })
    @IsNotEmpty({ message: "specialization bo'sh bo'lishi mumkin emas" })
    specialization: string;

    @ApiProperty({
        description: "Xodimlar id",
        example: 1
    })
    @IsInt({ message: "staffs_id butun son bo'lishi kerak" })
    @IsNotEmpty({ message: "staffs_id bo'sh bo'lishi mumkin emas" })
    staffs_id: number;
}
