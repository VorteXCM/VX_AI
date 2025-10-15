# VX - AI Chat Interface

یک رابط کاربری مدرن و زیبا برای اتصال به OpenRouter API

## 🚀 نحوه راه‌اندازی

### 1. دریافت API Key از OpenRouter

1. به سایت [OpenRouter.ai](https://openrouter.ai) بروید
2. ثبت‌نام کنید یا وارد شوید
3. به صفحه [Keys](https://openrouter.ai/keys) بروید
4. یک API Key جدید بسازید
5. API Key را کپی کنید (با `sk-or-` شروع می‌شود)

### 2. تنظیم API Key

سه روش برای تنظیم API Key وجود دارد:

#### روش اول: صفحه Settings (توصیه می‌شود ✅)
1. فایل `index.html` را در مرورگر باز کنید
2. روی آیکون **Settings** در sidebar کلیک کنید
3. API Key خود را وارد کنید
4. Model مورد نظر را انتخاب کنید
5. روی **"تست اتصال"** کلیک کنید
6. اگر موفق بود، روی **"ذخیره تنظیمات"** کلیک کنید

#### روش دوم: مستقیم در فایل config.js
فایل `config.js` را باز کنید و API Key خود را جایگزین کنید:

```javascript
const API_CONFIG = {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: 'sk-or-v1-YOUR_API_KEY_HERE',  // API Key خود را اینجا قرار دهید
    model: 'openai/gpt-3.5-turbo',
    temperature: 0.7,
    stream: false,
    systemMessage: 'You are VX, a helpful AI assistant.'
};
```

#### روش سوم: از طریق Console مرورگر
1. فایل `index.html` را در مرورگر باز کنید
2. Console مرورگر را باز کنید (F12)
3. این دستور را اجرا کنید:

```javascript
setApiKey('sk-or-v1-YOUR_API_KEY_HERE');
```

API Key شما در localStorage ذخیره می‌شود و برای استفاده‌های بعدی باقی می‌ماند.

### 3. انتخاب Model

OpenRouter به شما دسترسی به مدل‌های مختلف می‌دهد:

#### مدل‌های رایگان:
- `openai/gpt-3.5-turbo` - GPT-3.5 Turbo
- `meta-llama/llama-3.2-3b-instruct:free` - Llama 3.2 3B
- `google/gemini-flash-1.5` - Gemini Flash 1.5

#### مدل‌های پریمیوم:
- `openai/gpt-4` - GPT-4
- `anthropic/claude-3-opus` - Claude 3 Opus
- `google/gemini-pro-1.5` - Gemini Pro 1.5
- `meta-llama/llama-3.1-70b-instruct` - Llama 3.1 70B

لیست کامل مدل‌ها: [OpenRouter Models](https://openrouter.ai/models)

### 4. تنظیمات پیشرفته (اختیاری)

می‌توانید تنظیمات زیر را در صفحه Settings تغییر دهید:

- **Model**: مدل مورد استفاده
- **Temperature**: میزان خلاقیت پاسخ‌ها (0 تا 2)
- **System Message**: پیام سیستم برای تعریف رفتار AI
- **Site Name**: نام سایت شما برای OpenRouter

## 📋 ویژگی‌های سایت

### کلیدهای میانبر
- **Ctrl+K** (یا Cmd+K): باز کردن پنل جستجو
- **Escape**: بستن مودال‌ها
- **Enter**: ارسال پیام

### قابلیت‌ها
- ✅ رابط کاربری مدرن و زیبا
- ✅ Sidebar با منوهای کاربردی
- ✅ Search Modal با backdrop blur
- ✅ نمایش پیام‌ها با انیمیشن
- ✅ Loading indicator هنگام دریافت پاسخ
- ✅ مدیریت خطاها
- ✅ ذخیره تاریخچه مکالمات
- ✅ Responsive design

## 🔧 ساختار فایل‌ها

```
vx-interface/
├── index.html          # فایل اصلی HTML
├── style.css           # استایل‌های CSS
├── script.js           # منطق اصلی برنامه
├── config.js           # تنظیمات API
├── api.js              # کلاس مدیریت API
└── README.md           # راهنمای استفاده
```

## 🎨 سفارشی‌سازی

### تغییر پیام سیستم
برای تغییر رفتار AI، می‌توانید از Console استفاده کنید:

```javascript
vxApi.setSystemMessage('You are a helpful coding assistant specialized in JavaScript.');
```

### پاک کردن تاریخچه
```javascript
vxApi.clearHistory();
```

### مشاهده تاریخچه
```javascript
console.log(vxApi.getHistory());
```

## 💰 هزینه‌ها

OpenRouter بر اساس استفاده شما هزینه دریافت می‌کند:
- مدل‌های رایگان: بدون هزینه (با محدودیت)
- مدل‌های پریمیوم: بر اساس تعداد توکن‌ها

برای مشاهده قیمت‌ها: [OpenRouter Pricing](https://openrouter.ai/models)

## 🔐 امنیت

⚠️ **هشدار امنیتی**: 
- API Key شما در کد سمت کلاینت قابل مشاهده است
- برای استفاده در production، حتماً از یک backend استفاده کنید
- API Key را در فایل‌های عمومی commit نکنید
- می‌توانید در OpenRouter محدودیت هزینه تنظیم کنید

## 📝 مثال استفاده از API

نمونه کد برای ارسال پیام:

```javascript
const response = await vxApi.sendMessage('سلام، چطوری؟');

if (response.success) {
    console.log('پاسخ:', response.message);
} else {
    console.error('خطا:', response.error);
}
```

## 🌐 مرورگرهای پشتیبانی شده

- Chrome/Edge (آخرین نسخه)
- Firefox (آخرین نسخه)
- Safari (آخرین نسخه)

## 📞 پشتیبانی

در صورت بروز مشکل:
1. Console مرورگر را بررسی کنید
2. API Key خود را چک کنید
3. اتصال اینترنت را بررسی کنید

---

**ساخته شده با ❤️ برای VX**
