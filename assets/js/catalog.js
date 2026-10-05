// Semua harga dalam Ringgit Malaysia. Sumber: maklumat dan poster pemilik.
const tiers = (paxes, prices) => paxes.map((pax, i) => ({ pax, price: prices[i] }));
const group = (id, label, paxes, prices) => ({ id, label, tiers: tiers(paxes, prices) });
const standardMenu = [
  'Nasi beriyani / hujan panas', 'Ayam masak merah',
  'Daging masak hitam / kurma', 'Acar jelatah',
  'Buah tembikai / oren', 'Air Sunquick / sirap limau', 'Peralatan hidangan'
];
const homeWedding = {
  menu: ['Nasi minyak / beriyani / hujan panas', 'Nasi putih 20%', 'Ayam masak merah / goreng berempah', 'Daging masak hitam / kurma', 'Acar jelatah', 'Dalca sayur / masak lemak nenas + ikan masin', 'Ulam + sambal belacan + ikan masin / papadom', 'Buah tembikai / oren', 'Air 2 balang / 5 balang'],
  sections: [
    { title: 'Bridal', items: ['Pelamin eksklusif', 'Walkway 6 pcs', 'Pintu gerbang', '1 × makeup', '1 set busana lelaki dan perempuan', 'Payung', 'Kipas', 'Set renjis', 'Aksesori'] },
    { title: 'Set kelengkapan rumah / dewan', items: ['24 set meja tetamu', '1 set meja makan beradab', '2 set buffet table', '6 stall station', '2 unit aircooler', '6 unit mist fan', '1 bilik persalinan'] },
    { title: 'Set hidangan raja sehari dan VIP', items: ['1 set ayam mempelai', '1 set udang cucuk', '1 set udang butter', '1 set ketam butter', '1 set siakap 3 rasa', '1 set buah berhias', '2 set dome (pihak sebelah)'] },
    { title: 'Hiburan & audio', items: ['DJ & PA System'] }
  ],
  note: 'Pilihan menu dan jumlah balang air disahkan bersama admin.'
};
export const ADDONS = {
  photographer: { label: 'Jurugambar', price: 1600, unit: 'pakej', max: 1, note: 'Rakaman kenangan majlis anda' },
  extraFood: { label: 'Tambahan makanan', price: 15, unit: 'pax', max: 10000 },
  guestTent: { label: 'Khemah tetamu', price: 380, unit: 'set', max: 100 },
  buffetTent: { label: 'Khemah buffet', price: 250, unit: 'set', max: 100 },
  waiter: { label: 'Pramusaji', price: 100, unit: 'orang', max: 100 },
  goat: { label: 'Tambahan kambing', price: 1800, unit: 'ekor', max: 100 },
  birthdayKit: { label: 'Birthday kit', price: 50, unit: 'pakej', max: 1 },
  clown: { label: 'Badut (clown services)', price: 700, unit: 'pakej', max: 1 },
  playground: { label: 'Mini balloon playground (Soopa Doopa)', price: 500, unit: 'pakej', max: 1 }
};
export const CATALOG = [
  { id: 'kahwin', label: 'Pakej Kahwin', icon: 'heart', description: 'Pilihan pakej mengikut tempat majlis', groupLabel: 'Tempat majlis',
    groups: [
      { ...group('rumah', 'Majlis di rumah', [500, 1000], [13900, 18900]), ...homeWedding },
      { ...group('dewan-sendiri', 'Dewan sendiri', [500, 1000], [16900, 21900]), ...homeWedding },
      group('raja-haji', 'Dewan Raja Haji, Bukit Baru', [500, 1000], [15900, 20900]),
      group('grandiose', 'Grandiose Event Hall, Ayer Keroh', [500, 1000], [16900, 21900]),
      group('casa-bonita', 'Casa Bonita Hotel, Limbongan', [500, 1000], [16900, 21900]),
      group('rindu', 'The Rindu Homestay, Merlimau', [500, 1000], [16900, 21900])
    ],
    menu: [], included: ['Pakej perkahwinan mengikut lokasi dan jumlah tetamu yang dipilih.'],
    note: 'Hubungi admin untuk senarai penuh kelengkapan dan menu pakej kahwin.',
    addons: ['photographer']
  },
  { id: 'tunang', label: 'Pakej Tunang', icon: 'heart', description: 'Katering, pelamin dan persiapan pertunangan',
    groups: [group('standard', 'Pakej Tunang', [100, 150, 200], [2400, 3150, 3900])],
    menu: standardMenu, included: ['Pelamin', 'Makeup', 'Bunga tangan'],
    addons: ['extraFood', 'guestTent', 'photographer']
  },
  { id: 'ala-carte', label: 'Pakej Ala Carte', icon: 'tent', description: 'Katering tetamu dan setup kanopi',
    groups: [group('standard', 'Pakej Ala Carte', [500, 1000], [10900, 15900])],
    menu: ['Nasi putih 20%', 'Nasi minyak / beriyani / hujan panas 80%', 'Ayam masak merah / goreng berempah', 'Daging masak hitam / kurma', 'Acar jelatah', 'Dalca sayur / masak lemak nenas + ikan masin', 'Ulam + sambal belacan + ikan masin / papadom', 'Buah tembikai / oren', 'Air 5 balang / 2 balang'],
    included: ['3 khemah tetamu untuk 500 pax; 4 khemah tetamu untuk 1,000 pax', '1 khemah buffet, 1 khemah makan beradab dan 1 khemah sambut tetamu', 'Hidangan pengantin: 1 set setiap satu — ayam mempelai, udang cucuk, udang butter, ketam butter, siakap 3 rasa dan buah berhias', '2 set dome (pihak sebelah)', 'Pramusaji 6–11 orang, peralatan hidangan, hidangan VIP, tisu dan mineral'],
    note: 'Turut tersedia untuk majlis di dewan sendiri. Aturan kanopi, pramusaji dan jumlah balang air akan disahkan oleh admin.',
    addons: ['photographer']
  },
  { id: 'aqiqah', label: 'Pakej Aqiqah', icon: 'utensils', description: 'Katering bersama 1 ekor kambing',
    groups: [group('standard', 'Pakej Aqiqah', [100, 150, 200], [3200, 3950, 4700])],
    menu: [...standardMenu.slice(0, 3), 'Dalca sayur', ...standardMenu.slice(3)],
    included: ['1 ekor kambing golek bersama coleslaw dan sos blackpepper, atau masakan kambing beriyani / masala / kurma / kari', 'Set peralatan hidangan dan tray buffet', 'Dekorasi buffet', 'Pinggan dan cawan pakai buang', 'Tisu dan air mineral'],
    addons: ['extraFood', 'goat', 'guestTent', 'buffetTent', 'waiter', 'photographer']
  },
  { id: 'keraian', label: 'Majlis Keraian', icon: 'utensils', description: 'Jamuan untuk keluarga dan kenalan',
    groups: [group('standard', 'Majlis Keraian', [100, 200, 300], [1500, 3000, 4350])],
    menu: [...standardMenu.slice(0, 3), 'Dalca sayur', ...standardMenu.slice(3)],
    included: ['Minimum tempahan 100 pax'], addons: ['guestTent', 'buffetTent', 'waiter', 'photographer']
  },
  { id: 'birthday', label: 'Pakej Birthday', icon: 'cake', description: 'Jamuan, kek dan dekorasi hari lahir', groupLabel: 'Pilihan menu birthday',
    groups: [group('menu-a', 'Menu A', [50, 100, 150], [1300, 1900, 2500]), group('menu-b', 'Menu B', [50, 100, 150], [1650, 2550, 3450])],
    menus: {
      'menu-a': ['Nasi goreng Cina / bihun', 'Nugget', 'Fries', 'Kuih-muih', 'Buah-buahan', 'Air kordial sejuk', 'Kek birthday'],
      'menu-b': ['Nasi tomato / nasi jagung', 'Ayam masak merah / kurma', 'Nugget', 'Fries', 'Kuih-muih', 'Buah-buahan', 'Air kordial sejuk', 'Kek birthday']
    },
    included: ['Birthday party decoration', 'Set peralatan hidangan'], addons: ['birthdayKit', 'clown', 'playground', 'photographer']
  },
  { id: 'nikah', label: 'Pakej Nikah', icon: 'heart', description: 'Katering, set bridal nikah dan kanopi',
    groups: [group('standard', 'Pakej Nikah', [100, 200, 300], [3950, 5450, 6950])],
    menu: standardMenu,
    included: ['Pelamin mini eksklusif', 'Makeup 1 kali', 'Baju nikah', 'Meja nikah', 'Aksesori LP (seperti dalam poster)', '1 set khemah tetamu', '1 set khemah buffet'],
    addons: ['extraFood', 'waiter', 'photographer']
  },
  { id: 'korporat', label: 'Pakej Korporat', icon: 'briefcase', description: 'Hi-Tea atau Lunch/Dinner, minimum 50 pax', groupLabel: 'Pilihan hidangan korporat',
    groups: [{ id: 'hi-tea', label: 'Set Hi-Tea', rate: 15, minPax: 50 }, { id: 'lunch-dinner', label: 'Set Lunch/Dinner', rate: 35, minPax: 50 }],
    menus: {
      'hi-tea': ['Mihun goreng', '3 jenis kuih', 'Teh O panas', 'Peralatan hidangan'],
      'lunch-dinner': ['Nasi beriyani', 'Daging masak hitam / beriyani', 'Ayam masak merah', 'Kuah dalca sayur / acar jelatah', 'Buah tembikai', 'Kuih-muih', 'Air minuman kordial sejuk', 'Peralatan hidangan']
    },
    included: ['Minimum tempahan 50 pax', 'Sesuai untuk mesyuarat korporat, seminar, kursus, bengkel, majlis korporat dan jamuan pejabat'],
    addons: ['photographer']
  }
];
export const COMPANY = {
  brand: 'Hulubalang Katering', legalName: 'Hazami Jaya Enterprise',
  ssm: '200603190734 (MA0103688-D)',
  address: 'No. 12A-1, Jalan Inang 1, Taman Paya Rumput Utama, 76450 Melaka.',
  phone: '017-604 8302 / 06-337 1721',
  whatsapp: 'https://www.wasap.my/60176048302/nakbookingmajlis',
  payment: 'https://hulubalangkatering.bcl.my/embed/form/pembayarandeposit'
};

export const money = cents => new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(cents / 100);
export function calculate(selection) {
  const category = CATALOG.find(c => c.id === selection.category);
  const selectedGroup = category?.groups.find(g => g.id === selection.group);
  if (!category || !selectedGroup) throw new Error('Sila pilih pakej yang sah.');
  const pax = Number(selection.pax);
  if (!Number.isSafeInteger(pax) || pax < 1 || pax > 100000) throw new Error('Bilangan tetamu mesti nombor bulat yang sah.');
  const tier = selectedGroup.tiers?.find(t => t.pax === pax);
  if (selectedGroup.rate ? pax < selectedGroup.minPax : !tier) throw new Error('Bilangan tetamu tidak sepadan dengan pakej.');
  const unitPrice = selectedGroup.rate ? selectedGroup.rate * 100 : tier.price * 100;
  const base = selectedGroup.rate ? pax * unitPrice : unitPrice;
  const lines = [{ label: category.label + (category.groups.length > 1 ? ' — ' + selectedGroup.label : ''), qty: selectedGroup.rate ? pax : 1, unit: selectedGroup.rate ? 'pax' : 'pakej', unitPrice, total: base }];
  let extraPax = 0;
  for (const [id, rawQuantity] of Object.entries(selection.addons || {})) {
    const quantity = Number(rawQuantity);
    if (!Number.isSafeInteger(quantity) || quantity < 0) throw new Error('Kuantiti tambahan mesti nombor bulat positif.');
    if (!quantity) continue;
    const addon = ADDONS[id];
    if (!addon || !category.addons.includes(id) || quantity > addon.max) throw new Error('Pilihan tambahan tidak sah untuk pakej ini.');
    lines.push({ label: addon.label, qty: quantity, unit: addon.unit, unitPrice: addon.price * 100, total: quantity * addon.price * 100 });
    if (id === 'extraFood') extraPax += quantity;
  }
  const total = lines.reduce((sum, line) => sum + line.total, 0);
  const deposit = Math.round(total / 10);
  return { category, group: selectedGroup, pax, extraPax, totalPax: pax + extraPax, base, lines, total, deposit, balance: total - deposit, menu: selectedGroup.menu || category.menus?.[selectedGroup.id] || category.menu || [], included: selectedGroup.sections ? selectedGroup.sections.flatMap(section => section.items.map(item => section.title + ': ' + item)) : category.included, note: selectedGroup.note ?? category.note };
}
