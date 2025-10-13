import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
    constructor(private readonly botService: BotService) { }

    @Start()
    async start(@Ctx() ctx: Context) {
        await this.botService.start(ctx);
    }

    @On("contact")
    async onContact(@Ctx() ctx: Context) {
        await this.botService.onContact(ctx);
    }

    @Command("stop")
    async onStop(@Ctx() ctx: Context) {
        await this.botService.onStop(ctx)
    }
}