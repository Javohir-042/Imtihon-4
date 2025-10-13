import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class PhoneAdminDto {
    @ApiProperty({
        example: '+998976006787'
    })
    @IsPhoneNumber("UZ")
    phone_number: string;
}