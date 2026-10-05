import { COMPANY, money } from './catalog.js';

// Generates an A4 PDF locally; customer data is never sent to a PDF service.
export async function createQuotePdf(q) {
  if (!window.PDFLib) throw new Error('Pustaka PDF tidak tersedia.');
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const doc = await PDFDocument.create();
  doc.setTitle(`Sebut Harga ${q.reference} - Hulubalang Katering`);
  doc.setAuthor(COMPANY.legalName); doc.setSubject('Sebut harga majlis dan deposit 10%');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const logoResponse = await fetch('assets/logo-hulubalang.png');
  if (!logoResponse.ok) throw new Error('Logo tidak dapat dimuatkan.');
  const logo = await doc.embedPng(await logoResponse.arrayBuffer());
  const ink = rgb(.09,.10,.08), muted = rgb(.35,.38,.32), gold = rgb(.94,.77,.25), pale = rgb(.98,.95,.84), line = rgb(.85,.87,.82);
  const left = 42, right = 553, width = right-left;
  let page, y;
  const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
  const clean = text => String(text ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/\t/g,' ').replace(/[\u00a0\u202f]/g, ' ').replace(/[\u2010-\u2015]/g, '-');
  function measure(text, size, font) {
    try { return font.widthOfTextAtSize(text, size); }
    catch { context.font = `${font === bold ? 'bold ' : ''}${size}px Arial`; return context.measureText(text).width; }
  }
  function wrap(text, maxWidth, size = 10, font = regular) {
    const output=[];
    for (const para of clean(text).split('\n')) {
      let current='';
      for (const word of para.split(/\s+/)) {
        if (!word) continue;
        if (measure(current ? current+' '+word : word,size,font) <= maxWidth) { current=current ? current+' '+word : word; continue; }
        if (current) { output.push(current); current=''; }
        // Split unbroken addresses, emails, or long multilingual names safely.
        for (const char of Array.from(word)) {
          if (current && measure(current+char,size,font)>maxWidth) {output.push(current);current='';}
          current+=char;
        }
      }
      output.push(current);
    }
    return output;
  }
  async function draw(text, x, baseline, size=10, font=regular, color=ink) {
    text = clean(text);
    try { font.encodeText(text); page.drawText(text,{x,y:baseline,size,font,color}); }
    catch {
      // Use the browser's Unicode font fallback for names unsupported by Helvetica.
      // Only that line becomes an image; the remainder stays searchable text.
      const scale=3, textWidth=measure(text,size,font);
      canvas.width=Math.ceil((textWidth+6)*scale);canvas.height=Math.ceil(size*1.7*scale);
      context.scale(scale,scale);context.font=`${font===bold?'bold ':''}${size}px Arial`;
      context.fillStyle=`rgb(${Math.round(color.red*255)},${Math.round(color.green*255)},${Math.round(color.blue*255)})`;
      context.textBaseline='alphabetic';context.fillText(text,0,size*1.2);
      const image=await doc.embedPng(canvas.toDataURL('image/png'));
      page.drawImage(image,{x,y:baseline-size*.5,width:canvas.width/scale,height:canvas.height/scale});
    }
  }
  async function newPage(first=false) {
    page=doc.addPage([595.28,841.89]);
    page.drawRectangle({x:0,y:833.89,width:595.28,height:8,color:gold});
    if(first) {
      page.drawImage(logo,{x:left-4,y:700,width:113,height:113});
      await draw('HULUBALANG KATERING',172,793,17,bold);
      await draw(COMPANY.legalName,172,773,11,bold);
      await draw('SSM: '+COMPANY.ssm,172,757,9,regular,muted);
      const lines=wrap(COMPANY.address,375,9);
      let row=742;for(const t of lines){await draw(t,172,row,9,regular,muted);row-=13;}
      await draw('Tel: '+COMPANY.phone,172,row,9,regular,muted);
      y=686;
    } else {
      await draw('HULUBALANG KATERING',left,799,12,bold);
      await draw(q.reference,right-measure(q.reference,9,regular),800,9,regular,muted);
      y=772;
    }
  }
  async function ensure(height) {if(y-height<62) await newPage();}
  async function paragraph(text,opts={}) {
    const size=opts.size||10, font=opts.bold?bold:regular, leading=opts.leading||15;
    for(const t of wrap(text,opts.width||width,size,font)) {await ensure(leading);await draw(t,opts.x||left,y,size,font,opts.color||ink);y-=leading;}
    y-=opts.after??7;
  }
  async function heading(text) {await ensure(45);y-=8;await paragraph(text,{size:11,bold:true,after:8});}
  async function tableHeader() {
    page.drawRectangle({x:left,y:y-25,width,height:27,color:ink});
    for(const [text,x] of [['BIL',48],['PERKARA',78],['KUANTITI',317],['HARGA/UNIT',385],['JUMLAH',483]]) await draw(text,x,y-15,8,bold,rgb(1,1,1));
    y-=36;
  }
  await newPage(true);
  await paragraph('SEBUT HARGA MAJLIS',{size:18,bold:true,after:8,leading:23});
  await paragraph('No. rujukan: '+q.reference+'     |     Tarikh: '+q.created,{size:9,color:muted,after:16});
  await paragraph('KEPADA',{size:9,bold:true,color:muted,after:4});
  await paragraph(q.customer.name,{size:11,bold:true,after:3});
  await paragraph(q.customer.address,{after:3});
  await paragraph(q.customer.email+'  |  '+q.customer.phone,{size:9,after:13});
  await paragraph('MAKLUMAT MAJLIS',{size:9,bold:true,color:muted,after:4});
  await paragraph(`${q.category.label}${q.category.groups.length>1?' — '+q.group.label:''}`,{bold:true,after:3});
  await paragraph(`${q.eventDateLabel}${q.customer.time?' | '+q.customer.time:''} | ${q.totalPax.toLocaleString('en-MY')} tetamu${q.extraPax?' (termasuk '+q.extraPax+' pax tambahan makanan)':''}`,{after:3});
  await paragraph(q.customer.location,{after:15});
  await ensure(80);await tableHeader();
  for(let i=0;i<q.lines.length;i++) {
    const item=q.lines[i], lines=wrap(item.label,228,9), quantity=wrap(item.qty+' '+item.unit,57,9);
    const height=Math.max(lines.length,quantity.length)*13+18;
    if(y-height<62){await newPage();await tableHeader();}
    await draw(String(i+1),48,y,9);
    for(let j=0;j<lines.length;j++)await draw(lines[j],78,y-j*13,9);
    for(let j=0;j<quantity.length;j++)await draw(quantity[j],317,y-j*13,9);
    const unit=money(item.unitPrice), total=money(item.total);
    await draw(unit,460-measure(unit,9,regular),y,9);
    await draw(total,547-measure(total,9,regular),y,9);
    y-=height;
    page.drawLine({start:{x:left,y:y+12},end:{x:right,y:y+12},thickness:.5,color:line});
  }
  await ensure(125);y-=8;
  for(const [label,amount,highlight] of [['Jumlah keseluruhan',q.total,false],['Deposit tempahan (10%)',q.deposit,true],['Baki selepas deposit (90%)',q.balance,false]]) {
    if(highlight)page.drawRectangle({x:280,y:y-8,width:right-280,height:28,color:pale});
    await draw(label,290,y,10,highlight?bold:regular);
    const value=money(amount);await draw(value,right-8-measure(value,10,bold),y,10,bold);y-=32;
  }
  if(q.customer.notes){await heading('CATATAN / PILIHAN MENU PELANGGAN');await paragraph(q.customer.notes);}
  await heading('MAKLUMAT TEMPAHAN');
  await paragraph('Sebut harga ini dijana berdasarkan pilihan pelanggan. Ia bukan resit pembayaran atau pengesahan tempahan. Ketersediaan tarikh, pilihan menu dan sebarang keperluan tambahan tertakluk kepada pengesahan admin.',{size:9,leading:14});
  await paragraph('Deposit ialah 10% daripada jumlah keseluruhan, termasuk tambahan yang dipilih. Rujuk Borang Terma & Syarat Hulubalang Katering untuk syarat tempahan dan pembayaran seterusnya.',{size:9,leading:14});
  await paragraph('Pembayaran: gunakan butang Bayar Deposit dalam sistem quotation. Untuk bantuan, WhatsApp 017-604 8302. Sila nyatakan nombor rujukan quotation ini.',{size:9,leading:14});
  if(q.menu.length || q.included.length) {
    await newPage();await paragraph('BUTIRAN PAKEJ DIPILIH',{size:15,bold:true,leading:22,after:10});
    await paragraph(q.category.label+(q.category.groups.length>1?' | '+q.group.label:'')+' | '+q.pax.toLocaleString('en-MY')+' tetamu',{size:10,bold:true,after:12});
    if(q.menu.length){await heading('MENU');for(const item of q.menu)await paragraph('• '+item,{size:10,after:3});}
    await heading('PAKEJ TERMASUK');for(const item of q.included)await paragraph('• '+item,{size:10,after:4});
    if(q.note){await heading('NOTA PAKEJ');await paragraph(q.note,{size:9});}
    if(q.menu.some(item=>item.includes('/')))await paragraph('Pilihan bertanda / adalah seperti dalam poster. Pilihan akhir boleh dinyatakan pada catatan pelanggan dan disahkan bersama admin.',{size:9,color:muted});
  }
  const pages=doc.getPages();
  for(let i=0;i<pages.length;i++) {
    page=pages[i];page.drawLine({start:{x:left,y:44},end:{x:right,y:44},thickness:.5,color:line});
    await draw(COMPANY.legalName+' | SSM '+COMPANY.ssm,left,29,8,regular,muted);
    const text=`${i+1} / ${pages.length}`;await draw(text,right-measure(text,8,regular),29,8,regular,muted);
  }
  return doc.save();
}

export async function downloadQuote(q) {
  const bytes=await createQuotePdf(q);
  const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
  const link=document.createElement('a');link.href=url;link.download=`Quotation-${q.reference}.pdf`;
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
