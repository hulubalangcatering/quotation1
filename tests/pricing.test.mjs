import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate, CATALOG, COMPANY} from '../assets/js/catalog.js';
const quote=(category,group,pax,addons={})=>calculate({category,group,pax,addons});
const prices=[
  ['kahwin','rumah',500,13900],['kahwin','rumah',1000,18900],
  ['kahwin','dewan-sendiri',500,16900],['kahwin','dewan-sendiri',1000,21900],
  ['kahwin','raja-haji',500,15900],['kahwin','raja-haji',1000,20900],
  ['kahwin','grandiose',500,16900],['kahwin','grandiose',1000,21900],
  ['kahwin','casa-bonita',500,16900],['kahwin','casa-bonita',1000,21900],
  ['kahwin','rindu',500,16900],['kahwin','rindu',1000,21900],
  ['tunang','standard',100,2400],['tunang','standard',150,3150],['tunang','standard',200,3900],
  ['ala-carte','standard',500,10900],['ala-carte','standard',1000,15900],
  ['aqiqah','standard',100,3200],['aqiqah','standard',150,3950],['aqiqah','standard',200,4700],
  ['keraian','standard',100,1500],['keraian','standard',200,3000],['keraian','standard',300,4350],
  ['birthday','menu-a',50,1300],['birthday','menu-a',100,1900],['birthday','menu-a',150,2500],
  ['birthday','menu-b',50,1650],['birthday','menu-b',100,2550],['birthday','menu-b',150,3450],
  ['nikah','standard',100,3950],['nikah','standard',200,5450],['nikah','standard',300,6950],
  ['korporat','hi-tea',50,750],['korporat','lunch-dinner',50,1750]
];
test('Semua 34 harga asas sepadan dengan maklumat pemilik',()=>{
  assert.equal(prices.length,34);
  for(const [category,group,pax,price] of prices){const r=quote(category,group,pax);assert.equal(r.total,price*100,`${category}/${group}/${pax}`);assert.equal(r.deposit,price*10);assert.equal(r.deposit+r.balance,r.total);}
});
test('Korporat dikira per pax dan membulatkan deposit tepat kepada sen',()=>{
  const r=quote('korporat','lunch-dinner',51);assert.equal(r.total,178500);assert.equal(r.deposit,17850);
  assert.throws(()=>quote('korporat','hi-tea',49));assert.throws(()=>quote('korporat','hi-tea',50.5));
});
test('Tambahan makanan, peralatan, kakitangan, kambing dan jurugambar',()=>{
  const r=quote('aqiqah','standard',100,{extraFood:20,guestTent:2,buffetTent:1,waiter:2,goat:1,photographer:1});
  assert.equal(r.total,811000);assert.equal(r.deposit,81100);assert.equal(r.totalPax,120);
});
test('Add-on birthday dan jurugambar masuk dalam deposit',()=>{
  const r=quote('birthday','menu-b',150,{birthdayKit:1,clown:1,playground:1,photographer:1});assert.equal(r.total,630000);assert.equal(r.deposit,63000);
});
test('Tiada pakej, kuantiti atau add-on silang kategori yang tidak sah',()=>{
  for(const args of [['kahwin','rumah',100,{}],['bad','standard',100,{}],['tunang','standard',100,{clown:1}],['nikah','standard',100,{extraFood:-1}],['tunang','standard',100,{extraFood:1.5}],['kahwin','rumah',500,{photographer:2}],['tunang','standard',100,{extraFood:NaN}]])assert.throws(()=>quote(...args));
});
test('Semua kategori tersedia dan pautan WhatsApp ialah pautan pemilik',()=>{
  assert.equal(CATALOG.length,8);assert.equal(COMPANY.whatsapp,'https://www.wasap.my/60176048302/nakbookingmajlis');
});
