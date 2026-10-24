export const mockProducts = [
  {
    id: "prod-1",
    name: "Apple iPhone 16 Pro Max 256GB Desert Titanium",
    nameRu: "Apple iPhone 16 Pro Max 256GB Пустынный титан",
    nameEn: "Apple iPhone 16 Pro Max 256GB Desert Titanium",
    category: "smartphones",
    brand: "Apple",
    price: 16800000,
    oldPrice: 18500000,
    rating: 4.9,
    reviewsCount: 38,
    stock: 12,
    isNew: true,
    isSale: true,
    isPopular: true,
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium", "White Titanium"],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Eng so'nggi A18 Pro protsessori, 48MP Fusion kamerasi va yangi Camera Control tugmasi bilan jihozlangan eng ilg'or iPhone. Titandan ishlangan mustahkam va yengil korpus.",
    descriptionRu: "Новейший процессор A18 Pro, камера 48 МП Fusion и кнопка управления камерой Camera Control. Сверхпрочный и легкий корпус из титана 5-го класса.",
    descriptionEn: "Powered by the groundbreaking A18 Pro chip, 48MP Fusion camera system with Camera Control. Durable and lightweight Grade 5 titanium design.",
    specs: {
      "Ekran / Экран / Display": "6.9\" Super Retina XDR OLED, 120Hz ProMotion",
      "Protsessor / Процессор / CPU": "Apple A18 Pro (3 nm)",
      "Doimiy xotira / Память / Storage": "256 GB",
      "Tezkor xotira / ОЗУ / RAM": "8 GB",
      "Kamera / Камера / Cameras": "48 MP + 48 MP (Ultra Wide) + 12 MP (5x Telephoto)",
      "Akkumulyator / Батарея / Battery": "4685 mAh, 50% in 30 min",
      "Vazni / Вес / Weight": "227 g"
    },
    reviews: [
      { id: 1, author: "Javohir Alimov", rating: 5, date: "2026-10-18", comment: "Kamera sifati va batareya chidamliligi ajoyib! 1 kunda yetkazib berishdi." },
      { id: 2, author: "Madina Karimova", rating: 5, date: "2026-10-12", comment: "Desert Titanium rangi juda nafis. Original mahsulot, tavsiya qilaman!" }
    ]
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
    nameRu: "Samsung Galaxy S24 Ultra 512GB Серый титан",
    nameEn: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
    category: "smartphones",
    brand: "Samsung",
    price: 15400000,
    oldPrice: 17200000,
    rating: 4.8,
    reviewsCount: 29,
    stock: 9,
    isNew: false,
    isSale: true,
    isPopular: true,
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet"],
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Galaxy AI imkoniyatlari, 200MP kamera va o'rnatilgan S-Pen qalami bilan flagman Android smartfon. Corning Gorilla Armor aks etishga qarshi shisha.",
    descriptionRu: "Искусственный интеллект Galaxy AI, камера 200 МП и встроенный стилус S-Pen. Инновационное антибликовое стекло Corning Gorilla Armor.",
    descriptionEn: "Unleash Galaxy AI, 200MP crystal clear camera, and built-in S-Pen. Anti-reflective Corning Gorilla Armor front glass.",
    specs: {
      "Ekran / Экран / Display": "6.8\" Dynamic AMOLED 2X, 120Hz, 2600 nits",
      "Protsessor / Процессор / CPU": "Snapdragon 8 Gen 3 for Galaxy",
      "Doimiy xotira / Память / Storage": "512 GB",
      "Tezkor xotira / ОЗУ / RAM": "12 GB",
      "Kamera / Камера / Cameras": "200 MP + 50 MP + 10 MP + 12 MP",
      "Akkumulyator / Батарея / Battery": "5000 mAh, 45W fast charging",
      "Vazni / Вес / Weight": "232 g"
    },
    reviews: [
      { id: 1, author: "Sherzodbek", rating: 5, date: "2026-10-15", comment: "Galaxy AI funksiyalari va zum kamerasi tengsiz!" }
    ]
  },
  {
    id: "prod-3",
    name: "Apple MacBook Pro 16\" M3 Max 36GB / 1TB Space Black",
    nameRu: "Apple MacBook Pro 16\" M3 Max 36GB / 1TB Космический черный",
    nameEn: "Apple MacBook Pro 16\" M3 Max 36GB / 1TB Space Black",
    category: "laptops",
    brand: "Apple",
    price: 43500000,
    oldPrice: 47000000,
    rating: 5.0,
    reviewsCount: 17,
    stock: 4, // low stock alert trigger!
    isNew: true,
    isSale: false,
    isPopular: true,
    colors: ["Space Black", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Professional dasturchilar, dizaynerlar va 3D mutaxassislar uchun misli ko'rilmagan quvvat. 22 soatgacha uzluksiz avtonom ishlash.",
    descriptionRu: "Бескомпромиссная мощность для разработчиков, дизайнеров и создателей контента. До 22 часов автономной работы без подзарядки.",
    descriptionEn: "Unrivaled performance for professionals, developers, and creators. Up to 22 hours of battery life with breathtaking Liquid Retina XDR display.",
    specs: {
      "Ekran / Экран / Display": "16.2\" Liquid Retina XDR, 3456x2234, 120Hz ProMotion",
      "Protsessor / Процессор / CPU": "Apple M3 Max (14-core CPU, 30-core GPU)",
      "Doimiy xotira / Память / Storage": "1 TB SSD",
      "Tezkor xotira / ОЗУ / RAM": "36 GB Unified Memory",
      "Portlar / Порты / Ports": "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      "Vazni / Вес / Weight": "2.16 kg"
    },
    reviews: [
      { id: 1, author: "Umidjon IT", rating: 5, date: "2026-10-09", comment: "Dasturlash va render uchun monster! Hech qachon qizimaydi va shovqinsiz." }
    ]
  },
  {
    id: "prod-4",
    name: "Sony WH-1000XM5 Wireless ANC Headphones",
    nameRu: "Беспроводные наушники Sony WH-1000XM5 с шумоподавлением",
    nameEn: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "audio",
    brand: "Sony",
    price: 4350000,
    oldPrice: 4900000,
    rating: 4.9,
    reviewsCount: 44,
    stock: 15,
    isNew: false,
    isSale: true,
    isPopular: true,
    colors: ["Black", "Silver", "Midnight Blue"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Bozordagi eng yaxshi faol shovqin bekor qilish (ANC) tizimi, 8 ta mikrofon va 30 soatlik batareya. LDAC yuqori aniqlikdagi audio kodek qo'llab-quvvatlashi.",
    descriptionRu: "Лучшее в индустрии активное шумоподавление с 8 микрофонами и процессором V1. До 30 часов автономной работы и кристально чистый звук.",
    descriptionEn: "Industry-leading active noise canceling with two processors and 8 microphones. 30-hour battery life with ultra-comfortable lightweight design.",
    specs: {
      "Turi / Тип / Type": "Over-Ear Wireless ANC",
      "Ulanish / Подключение / Connectivity": "Bluetooth 5.2, LDAC, AAC, SBC, 3.5mm Jack",
      "Batareya / Батарея / Battery": "30 soat (ANC yoqilgan), 3 daqiqa zaryad = 3 soat musiqa",
      "Mikrofon / Микрофон / Mic": "8 ta mikrofonli AI Beamforming",
      "Vazni / Вес / Weight": "250 g"
    },
    reviews: [
      { id: 1, author: "Otabek", rating: 5, date: "2026-10-17", comment: "Samolyotda va ofisda shovqinni mutlaqo yo'qotadi. Ovoz sifati super!" }
    ]
  },
  {
    id: "prod-5",
    name: "Apple Watch Ultra 2 Titanium 49mm",
    nameRu: "Смарт-часы Apple Watch Ultra 2 Титан 49мм",
    nameEn: "Apple Watch Ultra 2 Titanium 49mm Ocean Band",
    category: "wearables",
    brand: "Apple",
    price: 10500000,
    oldPrice: 11900000,
    rating: 4.9,
    reviewsCount: 22,
    stock: 7,
    isNew: true,
    isSale: true,
    isPopular: true,
    colors: ["Titanium / Orange Ocean", "Titanium / Blue Trail", "Titanium / Olive Alpine"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Ekstremal sharoitlar va sportchilar uchun yaratilgan mustahkam titan soat. 3000 nit yorqinlikdagi displey va 100 metrgacha suv o'tkazmaslik.",
    descriptionRu: "Самые прочные и функциональные часы Apple Watch для экстремальных приключений и спорта. Яркость экрана 3000 нит.",
    descriptionEn: "The most rugged and capable Apple Watch. Engineered for outdoor adventures and endurance athletes with 3,000 nits display.",
    specs: {
      "Korpus / Корпус / Case": "49 mm Grade 5 Titanium",
      "Ekran / Экран / Display": "Always-On Retina LTPO OLED, 3000 nits",
      "Suvga chidamlilik / Водозащита / Water": "100 m (40m sho'ng'ish uchun sertifikatlangan)",
      "Batareya / Батарея / Battery": "36 soat (Low Power rejimida 72 soat)",
      "Sensorlar / Датчики / Sensors": "EKG, Yurak urishi, SpO2, Chuqurlik o'lchagich, Suv harorati"
    },
    reviews: [
      { id: 1, author: "Rustam T.", rating: 5, date: "2026-10-14", comment: "Tog' yurishlari va yugurish uchun eng zo'r soat. Batareyasi bemalol 3 kunga yetadi." }
    ]
  },
  {
    id: "prod-6",
    name: "Asus ROG Zephyrus G16 OLED Core Ultra 9 / RTX 4080",
    nameRu: "Игровой ноутбук Asus ROG Zephyrus G16 OLED RTX 4080",
    nameEn: "Asus ROG Zephyrus G16 OLED Gaming Laptop Intel Core Ultra 9",
    category: "laptops",
    brand: "Asus",
    price: 36800000,
    oldPrice: 39500000,
    rating: 4.8,
    reviewsCount: 15,
    stock: 3, // low stock!
    isNew: true,
    isSale: false,
    isPopular: true,
    colors: ["Eclipse Gray", "Platinum White"],
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Ultra yupqa alyuminiy korpus, ROG Nebula OLED 240Hz ekrani va kuchli NVIDIA GeForce RTX 4080 grafik kartasi bilan qurollangan flagman geyming noutbuk.",
    descriptionRu: "Ультратонкий корпус, потрясающий дисплей ROG Nebula OLED 240 Гц и видеокарта NVIDIA RTX 4080 для любых современных игр и задач.",
    descriptionEn: "CNC-machined aluminum chassis, breathtaking 240Hz OLED Nebula display powered by Intel Core Ultra 9 and NVIDIA RTX 4080.",
    specs: {
      "Ekran / Экран / Display": "16\" 2.5K OLED 240Hz 0.2ms, G-Sync",
      "Protsessor / Процессор / CPU": "Intel Core Ultra 9 185H (16 cores, up to 5.1 GHz)",
      "Video karta / Графика / GPU": "NVIDIA GeForce RTX 4080 12GB GDDR6",
      "Xotira / Память / RAM & SSD": "32 GB LPDDR5X + 2 TB PCIe 4.0 SSD",
      "Vazni / Вес / Weight": "1.85 kg"
    },
    reviews: [
      { id: 1, author: "Sanjarbek Gamer", rating: 5, date: "2026-10-11", comment: "Cyberpunk 2077 va barcha og'ir o'yinlar maksimal grafikada uchadi!" }
    ]
  },
  {
    id: "prod-7",
    name: "Apple AirPods Pro 2nd Gen USB-C MagSafe",
    nameRu: "Беспроводные наушники Apple AirPods Pro 2 USB-C",
    nameEn: "Apple AirPods Pro (2nd Generation) with MagSafe USB-C Case",
    category: "audio",
    brand: "Apple",
    price: 3100000,
    oldPrice: 3500000,
    rating: 4.9,
    reviewsCount: 65,
    stock: 24,
    isNew: false,
    isSale: true,
    isPopular: true,
    colors: ["White"],
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "H2 chipi, 2 baravar kuchliroq shovqin bekor qilish, moslashuvchan audio (Adaptive Audio) va USB-C zaryadlash qutisi bilan Apple flagman quloqchinlari.",
    descriptionRu: "Чип H2, адаптивное аудио, активное шумоподавление нового поколения и кейс с разъемом USB-C и динамиком для поиска.",
    descriptionEn: "Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and USB-C MagSafe charging case.",
    specs: {
      "Protsessor / Чип / Chip": "Apple H2 headphone chip, Apple U1 chip in case",
      "Shovqinni bostirish / Шумоподавление / ANC": "Active Noise Cancellation + Adaptive Audio",
      "Batareya / Автономность / Battery": "6 soat (keys bilan 30 soatgacha)",
      "Himoya / Защита / Rating": "IP54 chang va suv tomchilariga chidamli"
    },
    reviews: [
      { id: 1, author: "Dilshod", rating: 5, date: "2026-10-21", comment: "Ovoz va shovqin bosish darajasi ajoyib darajada qulay." }
    ]
  },
  {
    id: "prod-8",
    name: "Xiaomi 14 Ultra 512GB Leica Photography",
    nameRu: "Смартфон Xiaomi 14 Ultra 512GB Камера Leica",
    nameEn: "Xiaomi 14 Ultra 512GB Leica Quad Camera System",
    category: "smartphones",
    brand: "Xiaomi",
    price: 13900000,
    oldPrice: 15500000,
    rating: 4.7,
    reviewsCount: 20,
    stock: 8,
    isNew: true,
    isSale: true,
    isPopular: false,
    colors: ["Black Leather", "White Leather"],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Leica Summilux optikasi, 1 dyuymli Sony LYT-900 asosiy sensori va 4 ta 50MP kamera bilan haqiqiy fotosurat durdonasi.",
    descriptionRu: "Оптика Leica Summilux, 1-дюймовый сенсор Sony LYT-900 с плавающей диафрагмой и квадрокамера 50 МП.",
    descriptionEn: "All-star quad Leica camera system with 1-inch LYT-900 sensor and stepless variable aperture f/1.63-f/4.0.",
    specs: {
      "Ekran / Экран / Display": "6.73\" WQHD+ AMOLED 120Hz LTPO, 3000 nits",
      "Protsessor / Процессор / CPU": "Qualcomm Snapdragon 8 Gen 3",
      "Xotira / Память / RAM & Storage": "16 GB RAM + 512 GB UFS 4.0",
      "Kamera / Камера / Cameras": "50MP (1\") + 50MP (Tele) + 50MP (Periscope 5x) + 50MP (Ultrawide)",
      "Akkumulyator / Батарея / Battery": "5000 mAh, 90W simli, 80W simsiz quvvatlash"
    },
    reviews: [
      { id: 1, author: "Akmaljon", rating: 5, date: "2026-10-04", comment: "Suratga olish bo'yicha dunyodagi eng zo'r smartfon." }
    ]
  },
  {
    id: "prod-9",
    name: "Marshall Major IV Wireless On-Ear Brown",
    nameRu: "Беспроводные наушники Marshall Major IV Коричневые",
    nameEn: "Marshall Major IV Bluetooth On-Ear Headphones Brown",
    category: "audio",
    brand: "Marshall",
    price: 1850000,
    oldPrice: 2200000,
    rating: 4.8,
    reviewsCount: 31,
    stock: 14,
    isNew: false,
    isSale: true,
    isPopular: true,
    colors: ["Brown", "Black"],
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "80 dan ortiq soatlik simsiz musiqa tinglash imkoniyati, afsonaviy retro Marshall dizayni va simsiz quvvatlanish funksiyasi.",
    descriptionRu: "Более 80 часов воспроизведения без проводов, беспроводная зарядка и легендарный классический стиль Marshall.",
    descriptionEn: "80+ solid hours of wireless playtime with quick-charging capability and iconic ergonomic Marshall vintage styling.",
    specs: {
      "Batareya / Автономность / Playtime": "80+ soat uzluksiz musiqa",
      "Quvvatlanish / Зарядка / Charging": "USB-C + Qi simsiz zaryadlash (15 daqiqa = 15 soat)",
      "Drayver / Динамик / Driver": "40 mm dinamik drayverlar",
      "Boshqaruv / Управление / Controls": "Ko'p yo'nalishli analog boshqaruv joystiki"
    },
    reviews: [
      { id: 1, author: "Farrux", rating: 5, date: "2026-09-28", comment: "Batareyasi umuman tugamaydi! Dizayni juda chiroyli." }
    ]
  },
  {
    id: "prod-10",
    name: "Anker 737 PowerBank 24000mAh 140W GaN",
    nameRu: "Внешний аккумулятор Anker 737 PowerBank 24000мАч 140Вт",
    nameEn: "Anker 737 Power Bank (PowerCore 24K) 140W High-Speed Output",
    category: "accessories",
    brand: "Anker",
    price: 1650000,
    oldPrice: 1900000,
    rating: 4.9,
    reviewsCount: 26,
    stock: 18,
    isNew: false,
    isSale: true,
    isPopular: false,
    colors: ["Dark Gray"],
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Rangli aqlli displey, 140W ultra-tezkor quvvatlash va bir vaqtning o'zida MacBook Pro va iPhone ni to'liq tezlikda quvvatlash imkoniyati.",
    descriptionRu: "Интеллектуальный цифровой дисплей, мощность 140 Вт и зарядка ноутбуков и смартфонов на максимальной скорости.",
    descriptionEn: "Equipped with Power Delivery 3.1 and bi-directional technology to quickly charge laptops or recharge itself at 140W.",
    specs: {
      "Sig'im / Емкость / Capacity": "24,000 mAh (86.4Wh)",
      "Maksimal quvvat / Макс. мощность / Max Output": "140W USB-C PD 3.1",
      "Portlar / Разъемы / Ports": "2x USB-C + 1x USB-A",
      "Displey / Дисплей / Display": "Rangli Smart OLED (quvvat, harorat, batareya salomatligi)"
    },
    reviews: [
      { id: 1, author: "Bobur", rating: 5, date: "2026-10-19", comment: "Macbook noutbukimni bemalol to'liq zaryadlab beradi. Ekranida barcha quvvat parametrlari ko'rinadi." }
    ]
  },
  {
    id: "prod-11",
    name: "Apple MacBook Air 15\" M3 16GB / 512GB Midnight",
    nameRu: "Apple MacBook Air 15\" M3 16GB / 512GB Темная ночь",
    nameEn: "Apple MacBook Air 15\" M3 16GB / 512GB Midnight",
    category: "laptops",
    brand: "Apple",
    price: 19800000,
    oldPrice: 21500000,
    rating: 4.9,
    reviewsCount: 19,
    stock: 6,
    isNew: true,
    isSale: true,
    isPopular: true,
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Katta va tiniq 15.3 dyuymli Liquid Retina ekrani, kuchli M3 chipi va bor-yo'g'i 11.5 mm qalinlikdagi nafis korpus. 18 soatlik avtonomiya.",
    descriptionRu: "Большой экран 15.3 дюйма, мощный процессор M3 и поразительно тонкий алюминиевый корпус 11.5 мм.",
    descriptionEn: "Strikingly thin and fast with 15.3-inch Liquid Retina display and up to 18 hours of all-day battery life.",
    specs: {
      "Ekran / Экран / Display": "15.3\" Liquid Retina IPS, 2880x1864, 500 nits",
      "Protsessor / Процессор / CPU": "Apple M3 (8-core CPU, 10-core GPU, 16-core Neural Engine)",
      "Xotira / Память / RAM & SSD": "16 GB Unified Memory + 512 GB SSD",
      "Vazni / Вес / Weight": "1.51 kg"
    },
    reviews: [
      { id: 1, author: "Shahnoza", rating: 5, date: "2026-10-08", comment: "O'qish va ofis ishlari uchun eng qulay noutbuk. Katta ekran, yengil vazn!" }
    ]
  },
  {
    id: "prod-12",
    name: "JBL Charge 5 Waterproof Portable Speaker",
    nameRu: "Портативная колонка JBL Charge 5 Водонепроницаемая",
    nameEn: "JBL Charge 5 Portable Waterproof Bluetooth Speaker",
    category: "audio",
    brand: "JBL",
    price: 2100000,
    oldPrice: 2400000,
    rating: 4.8,
    reviewsCount: 37,
    stock: 16,
    isNew: false,
    isSale: true,
    isPopular: false,
    colors: ["Squad Camo", "Black", "Blue", "Red"],
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Chuqur bas ovoz, IP67 suv va changdan himoya, 20 soatlik uzluksiz musiqiy quvvat va smartfonlarni zaryadlovchi o'rnatilgan powerbank.",
    descriptionRu: "Мощный звук JBL Original Pro Sound, влагозащита IP67, 20 часов воспроизведения и функция пауэрбанка.",
    descriptionEn: "Bold JBL Original Pro Sound with long excursion driver, separate tweeter and dual pumping bass radiators.",
    specs: {
      "Quvvat / Мощность / Output": "40W RMS (30W Woofer + 10W Tweeter)",
      "Batareya / Автономность / Battery": "20 soat (7500 mAh)",
      "Himoya / Защита / Rating": "IP67 to'liq suv va chang o'tkazmaydi",
      "Ulanish / Подключение / Connectivity": "Bluetooth 5.1, JBL PartyBoost"
    },
    reviews: [
      { id: 1, author: "Bekzod", rating: 5, date: "2026-09-30", comment: "Dala hovli va tabiatga chiqish uchun almashtirib bo'lmaydi. Basi juda kuchli." }
    ]
  }
];
