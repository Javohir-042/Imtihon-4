import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const PORT = Number(process.env.PORT ?? 4000);

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });

  app.use(cookieParser());

  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Xususiy shifoxona")
    .setDescription("The Xususiy shifoxona API description")
    .setVersion("1.0")
    .addTag(
      "NestJS,PostgreSQL, Sequelize ORM, JWT, Cookies, Email, Guardlar, DTO-validatsiyalar, Swagger ",
    )
    .addBearerAuth({
      type: "http",
      scheme: "Bearer",
      in: "Header",
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory);

  await app.listen(
    PORT,
    () => (
      console.log(`Server started at: http://localhost:${PORT}`),
      console.log(`Server started at: http://localhost:${PORT}/api/docs`)
    ),
  );
}
bootstrap();
