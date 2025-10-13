import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { Bot } from './model/bot.model';
import { BOT_NAME } from '../app.constants';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) { }

  async start(ctx: Context) {
    try {
      const admin_id = ctx.from!.id;
      const admin = await this.botModel.findByPk(admin_id);
      if (!admin) {
        await this.botModel.create({
          admin_id,
          username: ctx.from!.username,
          first_name: ctx.from!.first_name,
          last_name: ctx.from!.last_name,
          language_code: ctx.from!.language_code,
          // phone_number: '+998976006787'
        });
        await ctx.replyWithHTML(`Iltimos, <b>📞 Telefon raqamni yuborish</b> tugmasini bosing`, {
          ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)],
          ])
            .oneTime()
            .resize(),
        })
      } else if (!admin.is_active) {
        await ctx.replyWithHTML(`Iltimos, <b>📞 Telefon raqamni yuborish</b> tugmasini bosing`,
          {
            ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)],
            ])
              .oneTime()
              .resize(),
          })
      } else {
        await ctx.replyWithHTML(`Bu bot orqali Xususiy sifoxona tizimida faoliyat olib borayotgan Xsusiy shifoxona  egalari uchun`,
          {
            ...Markup.removeKeyboard()  
          })
      }
    } catch (error) {
      console.log('Error on start', error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ('contact' in ctx.message!) {
        const admin_id = ctx.from!.id;
        const admin = await this.botModel.findByPk(admin_id);
        if (!admin) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)]])
              .oneTime()
              .resize(),
          });
        } else if (ctx.message!.contact.user_id && ctx.message!.contact.user_id !== admin_id) {
          await ctx.replyWithHTML("O'zingizni yuboring ", {
            ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)]])
              .oneTime()
              .resize(),
          });

        } else {
          const phone = ctx.message.contact.phone_number
          admin.is_active = true
          admin.phone_number = phone[0] == "+" ? phone : "+" + phone;
          await admin.save();
          await ctx.replyWithHTML("Tabriklayman siz Owner sifatida faollashtirildingiz ",
            {
              ...Markup.removeKeyboard()
            }
          );
        }
      }
    } catch (error) {
      console.log('Error on Contact', error);
    }
  }


  async onStop(ctx: Context) {
    try {
      const admin_id = ctx.from!.id;
      const admin = await this.botModel.findByPk(admin_id);
      await this.bot.telegram.sendChatAction(admin_id, "record_voice");
      await this.bot.telegram.sendMessage(admin_id, "Salom");

      if (admin) {
        admin.is_active = false;
        await admin.save();
        await ctx.replyWithHTML("Siz botda faoliyatni to'xtatdingiz. Qayt ishga tushirish uchu <b> start</b> bosing ", {
          ...Markup.keyboard([[(`/start`)]])
            .oneTime()
            .resize(),
        })
      }
    } catch (error) {
      console.log('Error on stop', error);
    }
  }

  async sendOtp(phone_number: string, OTP: string) {
    try {
      const admin = await this.botModel.findOne({ where: { phone_number } });
      if (!admin || !admin.is_active) {
        return false;
      }

      await this.bot.telegram.sendMessage(admin.admin_id, 'Verify code:' + OTP);
      return true;
    } catch (error) {
      console.log('Error on send OTP', error);

    }
  }

}
