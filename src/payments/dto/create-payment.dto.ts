import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethodEnum, PaymentStatusEnum } from "../../common/enum/paymentMetod.enum";
import { IsNotEmpty, IsNumber, IsEnum, IsDate, IsDateString } from "class-validator";

export class CreatePaymentDto {

    @ApiProperty({
        description: "Uchrashuv (Appointment) ID",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    appointment_id: number;


    @ApiProperty({
        description: "Bemor ID",
        example: 2
    })
    @IsNumber()
    @IsNotEmpty()
    patient_id: number;


    @ApiProperty({
        description: "To'lov miqdori",
        example: 150000
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number;


    @ApiProperty({
        description: "To'lov usuli",
        enum: PaymentMethodEnum,
        example: PaymentMethodEnum.CARD
    })
    @IsEnum(PaymentMethodEnum, { message: "payment_method (CASH,CARD) qiymatlaridan bo'lishi kerak" })
    @IsNotEmpty()
    payment_method: PaymentMethodEnum;


    @ApiProperty({
        description: "To'lov holati",
        enum: PaymentStatusEnum,
        example: PaymentStatusEnum.PAID
    })
    @IsEnum(PaymentStatusEnum, { message: "payment_status (PAID, PENDING) qiymatlaridan bo'lishi kerak" })
    @IsNotEmpty()
    payment_status: PaymentStatusEnum;
    

    @ApiProperty({
        description: "To'lov sanasi (YYYY-MM-DD formatda)",
        example: "2025-10-10"
    })
    @IsDateString()
    @IsNotEmpty()
    payment_date: string;
    
}
