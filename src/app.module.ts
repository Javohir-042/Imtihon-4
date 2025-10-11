import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { AdminsModule } from "./admins/admins.module";
import { AuthModule } from "./auth/auth.module";
import { StaffsModule } from "./staffs/staffs.module";
import { DoctorsModule } from './doctors/doctors.module';
import { MedicationsModule } from './medications/medications.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PatientsModule } from './patients/patients.module';
import { PaymentsModule } from './payments/payments.module';
import { LabTestsModule } from './lab-tests/lab-tests.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { RolesModule } from './roles/roles.module';
import { StaffRolesModule } from './staff_roles/staff_roles.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),

    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASSWORD),
      database: process.env.PG_DATABASE,

      autoLoadModels: true,
      logging: false,
      sync: { alter: true }, // force bu tablellarni ochirib tashlaydi  alter ishatish
    }),

    AdminsModule,

    AuthModule,

    StaffsModule,

    DoctorsModule,

    MedicationsModule,

    PrescriptionsModule,

    PatientsModule,

    PaymentsModule,

    LabTestsModule,

    MedicalRecordsModule,

    AppointmentsModule,

    RolesModule,

    StaffRolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
