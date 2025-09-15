// هذا هو كود الواجهة الخلفية (الوسيط الآمن)
exports.handler = async function(event) {
  // نستقبل البيانات التي أرسلها المستخدم من صفحة الويب
  const data = JSON.parse(event.body);
  const message = data.text;

  // *** هنا المكان الذي يقرأ فيه الكود التوكن والـ ID بأمان ***
  // سيتم إدخال هذه القيم في إعدادات Netlify وليس هنا مباشرة
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  // إذا لم يتم العثور على التوكن أو الـ ID، نرجع خطأ
  if (!botToken || !chatId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Configuration error: Bot token or Chat ID is missing." }),
    };
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    // نرسل الرسالة إلى تليجرام
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    // نرجع استجابة ناجحة (هذه الاستجابة لا تظهر للمستخدم)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sent successfully" }),
    };
  } catch (error) {
    // في حال حدوث خطأ، نسجل الخطأ ونرجع رسالة خطأ
    console.error("Telegram API Error:", error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to send message to Telegram." }),
    };
  }
};
