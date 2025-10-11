import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignInDto {
    @ApiProperty({
        description: "Foydalanuvchi email manzili",
        example: "javohirquromboyev111@gmail.com"
    })
    @IsEmail({}, { message: "Email noto'g'ri formatda kiritilgan" })
    @IsNotEmpty({ message: "Email kiritilishi shart" })
    email: string;

    @ApiProperty({
        description: "Foydalanuvchi paroli",
        example: "Javohir123!"
    })
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
