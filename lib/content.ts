// Central content for KÖZ — invented brand, all copy in Turkish with a few EN accents.

export const SIGNATURE = [
  {
    name: 'Tomahawk',
    weight: '1.2 kg · 2 kişilik',
    aged: '40 gün',
    price: '4.800',
    note: 'Kemikli, kalın kesim. Sofrada dilimlenir, közün üzerinde son kez selamlanır.',
    img: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Dry-Aged Bonfile',
    weight: '320 g',
    aged: '45 gün',
    price: '2.450',
    note: 'Kuru dinlendirmenin en saf hâli — yağsız, yoğun, sade tuz ve köz.',
    img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Boğaz Wagyu',
    weight: '220 g · A5',
    aged: 'Taze',
    price: '3.900',
    note: 'İthal A5 wagyu, közün yalnızca bir nefesiyle. Erimeye yakın.',
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
  },
];

export type MenuItem = { name: string; desc: string; price: string; tag?: string };
export type MenuCategory = { id: string; title: string; kicker: string; items: MenuItem[] };

export const MENU: MenuCategory[] = [
  {
    id: 'baslangic',
    title: 'Başlangıçlar',
    kicker: 'Ateşe Giriş',
    items: [
      { name: 'İlik Kemiği', desc: 'Fırınlanmış dana iliği, közlenmiş ekşi maya, maydanoz–kapari', price: '620' },
      { name: 'Çiğ Köfte Tartar', desc: 'El kıyması bonfile, Antep isotu, sumak soğan, közde lavaş', price: '740', tag: 'İmza' },
      { name: 'Közlenmiş Kuzu Yürek', desc: 'Kekik, tereyağı, deniz tuzu', price: '580' },
      { name: 'Peynir Tabağı', desc: 'Olgunlaştırılmış Anadolu peynirleri, ceviz, üzüm pekmezi', price: '690' },
    ],
  },
  {
    id: 'kozden',
    title: 'Közden',
    kicker: 'Ana Ateş',
    items: [
      { name: 'Antrikot', desc: '400 g · 30 gün dinlendirilmiş, kemiksiz', price: '1.980' },
      { name: 'Kuru Pirzola', desc: 'Kuzu, 5’li kesim, biberiye közü', price: '1.640' },
      { name: 'Denver Kesim', desc: '300 g · yağ mermerlemesi yoğun, orta pişirme önerilir', price: '1.520', tag: 'Şef Seçimi' },
      { name: 'Közde Levrek', desc: 'Bütün, limon otu, zeytinyağı–kekik', price: '1.280' },
    ],
  },
  {
    id: 'garnitur',
    title: 'Garnitürler',
    kicker: 'Yanında',
    items: [
      { name: 'Kemik İliği Patates', desc: 'İlik yağında konfit, deniz tuzu', price: '360' },
      { name: 'Köz Patlıcan', desc: 'Sarımsaklı yoğurt, nar ekşisi', price: '320' },
      { name: 'Izgara Mevsim', desc: 'Közde sebze, tereyağı, limon', price: '340' },
      { name: 'Trüflü Püre', desc: 'Tereyağlı patates, kara trüf', price: '420', tag: 'İmza' },
    ],
  },
  {
    id: 'tatli',
    title: 'Tatlılar',
    kicker: 'Sonda',
    items: [
      { name: 'Közde Kaymaklı İncir', desc: 'Fırınlanmış incir, manda kaymağı, ceviz', price: '380' },
      { name: 'Kara Çikolata Fondan', desc: 'Tuzlu karamel, ateşte kavrulmuş fındık', price: '360' },
      { name: 'Menengiç Dondurması', desc: 'Yanık şeker, sıcak sos', price: '320' },
    ],
  },
];

export const STORY = {
  kicker: 'Hikâye',
  // Heading is split so the closing clause can be set in gold italic.
  titleLead: 'Bir oda kuruldu',
  titleAccent: 'ateşin etrafına.',
  lead:
    'KÖZ, 2019 baharında Karaköy’de, Kemankeş Caddesi’nin köşesinde açıldı. Salon kırk kişilik; loş ışık, meşe ve deri. Mutfak tek bir ocaktan, üç aşçıdan ve Anadolu bağları ile Eski Dünya arasında sessiz bir tartışma gibi okunan bir şarap listesinden ibaret.',
  bodyBefore: 'Baş şef ',
  bodyName: 'Emre Solak',
  bodyAfter:
    ', KÖZ’ü açmadan önce yirmi yılını ocak başında geçirdi. Menü tasarım gereği kısa — her hafta közün ve mevsimin getirdiğine göre değişen altı ya da yedi tabak. Bar viski ağırlıklı. Salon bir ateşin etrafına kuruldu.',
  quote: '“Altı tabak. Tek ateş. Gerisi yalnızca sabır.”',
  attribution: '— Emre Solak, Baş Şef & Kurucu',
};

export const LOCATION = {
  kicker: 'Bizi Bulun',
  place: 'Karaköy,',
  city: 'İstanbul.',
  address: [
    'Kemankeş Karamustafa Paşa Mah.',
    'Kemankeş Cad. No 41',
    'Karaköy · Beyoğlu / İstanbul',
  ],
  phone: '+90 212 244 00 00',
  phoneHref: 'tel:+902122440000',
  email: 'rezervasyon@koz.istanbul',
  emailHref: 'mailto:rezervasyon@koz.istanbul',
  hours: [
    { days: 'Pazartesi – Perşembe', time: '18:00 – 00:00' },
    { days: 'Cuma – Cumartesi', time: '17:30 – 01:00' },
    { days: 'Pazar', time: '17:30 – 23:30' },
  ],
  room: [
    'Kırk kişilik tek salon, açık köz ocağı ve viski ağırlıklı bir bar. Kadehte ve şişede şaraplar; yerli bağlar ile Eski Dünya eşit özenle seçilir.',
    'Hafta sonu vale hizmeti. Kemankeş Caddesi üzerinde sokak park. Tramvayın Karaköy durağı köşede.',
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      'İstanbul’da yediğim en dürüst et. Ateş burada bir teknik değil, bir dil. Bonfilenin dinlenmişliği damakta günlerce kalıyor.',
    name: 'Deniz Aral',
    role: 'Gastronomi Yazarı, Zeitgeist',
  },
  {
    quote:
      'Boğaz manzarası zaten yeterdi; ama asıl olay tabakta. Wagyu’nun köze değdiği o an, akşamın tamamını taşıyor.',
    name: 'Elif Kaan',
    role: 'Şef & Restoran Danışmanı',
  },
  {
    quote:
      'Loş ışık, çıtır köz sesi, kusursuz servis. KÖZ bir steakhouse’dan çok bir sahne — ve et başrolde.',
    name: 'Marco Vitale',
    role: 'The Continental Table',
  },
];
