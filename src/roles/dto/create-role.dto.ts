import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({
        example: "ADMIN",
        description: "Foydalanuvchi roli nomi (masalan: ADMIN, STAFF, PATIENT)",
    })
    @IsString()
    @IsNotEmpty()
    role_name: string;

    @ApiProperty({
        example: "Some additional info",
        description: "Rol uchun qo'shimcha ustun ",
        required: false,
    })
    @IsString()
    new_column: string;
}
