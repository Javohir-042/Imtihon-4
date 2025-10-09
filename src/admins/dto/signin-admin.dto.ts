import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SigninAdminDto {
  @ApiProperty({
    type: String,
    example: "javohirquromboyev933@gmial.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: "Javohir123!",
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
