import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateStaffRoleDto {
    @ApiProperty({
        example: 1,
        description: "Xodim ID ",
    })
    @IsNotEmpty({ message: "staff_id bo'sh bo'lmasligi kerak" })
    @IsInt({ message: "staff_id butun son bo'lishi kerak" })
    staff_id: number;

    @ApiProperty({
        example: 2,
        description: "role ID",
    })
    @IsNotEmpty({ message: "role_id bo'sh bo'lmasligi kerak" })
    @IsInt({ message: "role_id butun son bo'lishi kerak" })
    role_id: number;
}
