# Relay — RESTful API Gateway demo

**Relay** — namunaviy endpointlarni ko‘rsatib, so‘rov va javoblarni brauzer ichida simulyatsiya qiladigan API konsoli.

## Havolalar

- [Jonli demo](https://restful-api-gateway-demo.netlify.app)
- [GitHub repository](https://github.com/Abdulvoh1d/restful-api-gateway-demo)

## Loyiha nimani ko‘rsatadi

Loyiha REST API bilan ishlashga o‘xshash interfeysni namoyish etadi: route katalogi, endpoint tavsifi va JSON namunasi, shuningdek so‘rov yuborish oynasi hamda javob ko‘rinishi. Bu haqiqiy API gateway emas — barcha so‘rov-javoblar brauzerdagi lokal simulyatordir.

## Tasdiqlangan imkoniyatlar

- Yon paneldagi to‘rtta namunaviy route orasida tanlash; tanlovga qarab HTTP usuli, yo‘l, tavsif va JSON javob namunasi yangilanadi.
- So‘rov oynasida `GET`, `POST` yoki `DELETE` usulini tanlash va yo‘lni tahrirlash. Yo‘l boshiga `/` qo‘shilib, ketma-ket slashlar me’yorlashtiriladi.
- `POST` tanlanganda tahrirlanadigan JSON obyekt maydoni ko‘rsatiladi. Noto‘g‘ri JSON yoki obyekt bo‘lmagan qiymat mahalliy `400` xatosini beradi.
- `GET /health`, `GET /users`, `POST /users`, `GET /users/usr_101` misollari uchun namunaviy javoblar qaytariladi. `GET /users/:id` faqat `usr_101` uchun topiladi; boshqa ID yoki mos kelmagan so‘rovlar namunaviy `404` qaytaradi.
- `DELETE /users/:id` lokal ravishda muvaffaqiyatli o‘chirish javobini **taqlid qiladi**, lekin hech qanday ma’lumotni o‘chirmaydi.
- Simulyatsiya qilingan status, brauzer ichida hisoblangan taxminiy davomiylik va formatlangan JSON javobi ko‘rsatiladi.
- Joriy usul, yo‘l va — `POST` bo‘lsa — JSON matni uchun misol `cURL` buyrug‘ini nusxalash mumkin. Bu buyruq ishlaydigan API manzili emas.
- Interfeys tor ekranlarga moslashadi; clipboard imkoniyati mavjud bo‘lsa brauzer clipboard API’sidan, aks holda eski `document.execCommand('copy')` usulidan foydalanishga urinadi.

## Texnologiyalar

Loyiha **HTML5**, **CSS3** va **vanilla JavaScript** asosida, qo‘shimcha framework yoki build bosqichisiz ishlaydi. Brauzerning DOM, `performance.now()` va clipboard imkoniyatlaridan foydalanadi. `localStorage` ishlatilmaydi. Interfeysdagi Node.js, Express va Redis yozuvlari faqat ulanmagan texnologiyalar haqidagi ma’lumotnoma bo‘lib, loyiha ularni o‘rnatmaydi yoki ishlatmaydi.

## Talablar va mahalliy ishga tushirish

Python 3 va zamonaviy veb-brauzer kerak. Repozitoriyani klonlab, loyiha papkasiga o‘ting va oddiy statik HTTP serverini ishga tushiring:

```sh
git clone https://github.com/Abdulvoh1d/restful-api-gateway-demo.git
cd restful-api-gateway-demo
python3 -m http.server 8765
```

Brauzerda <http://localhost:8765> manzilini oching. `npm install` yoki build buyrug‘i talab qilinmaydi. Python serveri statik fayllarni ko‘rsatish uchungina ishlatiladi; u API serveri emas.

## Fayl tuzilishi

```text
restful-api-gateway-demo/
├── index.html   # Konsol interfeysi va route katalogi
├── styles.css   # Ko‘rinish, maket va moslashuvchan dizayn
├── app.js       # Fixture ma’lumotlari va lokal simulyatsiya
└── README.md    # Loyiha haqida ma’lumot va ishga tushirish yo‘riqnomasi
```

## Ma’lumotlar, maxfiylik va demo-chegaralari

Barcha endpoint va javoblar uydirma namunaviy ma’lumotlardir. “Run simulation” tugmasi so‘rovni faqat joriy sahifadagi JavaScript orqali moslaydi: **haqiqiy API yoki serverga yuborilmaydi**. `POST` ma’lumot saqlamaydi, `DELETE` esa hech narsani o‘zgartirmaydi. Kiritilgan qiymatlar ilova tomonidan serverga yuborilmaydi yoki `localStorage`ga yozilmaydi; sahifani yopgach, kiritilgan ma’lumotlar ilovada saqlanib qolmaydi. Shunga qaramay, maxfiy yoki haqiqiy shaxsiy ma’lumotlarni demo oynasiga kiritmang.

Ko‘rsatilgan davomiylik tarmoq o‘lchovi emas, brauzer ichidagi simulyatsiya qiymatidir. Nusxalanadigan `cURL` buyrug‘i haqiqiy API’ga ulanmaydi; server yoki gateway ulanmagan. Demo orqali API’ga haqiqiy so‘rov yuborish, ma’lumot yaratish yoki o‘chirish yoxud tashqi xizmat bilan ishlash mumkin emas.

## Litsenziya

Loyiha papkasida `LICENSE` fayli yo‘q. Repozitoriy ommaga ochiq bo‘lishining o‘zi ochiq litsenziya bermaydi; qayta foydalanish va tarqatish huquqlari litsenziyasiz aniq belgilanmagan.
