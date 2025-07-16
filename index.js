import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('سلام علی جان! من آماده‌ام ❤️ پیام بفرست تا جواب بدم.');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await gptResponse.json();
    const reply = data.choices?.[0]?.message?.content || "پاسخی دریافت نشد";

    ctx.reply(reply);
  } catch (error) {
    console.error(error);
    ctx.reply("خطا در ارتباط با GPT 😢");
  }
});

bot.launch();
