import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";

export class CreateMedicationDto {
    @ApiProperty({
        description: "Dori nomi",
        example: "Paracetamol"
    })
    @IsString()
    @IsNotEmpty()
    name: string;


    @ApiProperty({
        description: "Dori kategoriyasi",
        example: "Analgesic"
    })
    @IsString()
    @IsNotEmpty()
    category: string;


    @ApiProperty({
        description: "Bir dona narxi",
        example: 5000
    })
    @IsNumber()
    @IsNotEmpty()
    unit_price: number;


    @ApiProperty({
        description: "O'lchov birligi",
        example: "tabletka"
    })
    @IsString()
    @IsNotEmpty()
    unit: string;


    @ApiProperty({
        description: "Ombordagi miqdor",
        example: 100
    })
    @IsNumber()
    @IsNotEmpty()
    stock_quantity: number;


    @ApiProperty({
        description: "Dori mavjud yoki yo'qligi",
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    is_available: boolean;
    
}
