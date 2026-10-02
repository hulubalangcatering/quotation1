import { CATALOG, ADDONS, COMPANY, calculate, money } from './catalog.js';

const $ = selector => document.querySelector(selector);
const paths = {
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  tent: '<path d="m3 20 9-17 9 17H3Zm5 0 4-8 4 8M12 3V1"/>',
  utensils: '<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M19 21V3c-4 3-5 10 0 10"/>',
  cake: '<path d="M3 21h18M4 21V11h16v10M4 15c2 3 4-3 6 0s4-3 6 0 4 0 4 0M8 11V7m8 4V7M8 3v1m8-1v1M12 11V6m0-4v1"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12c6 4 12 4 18 0M10 13h4v4h-4z"/>',
  chat: '<path d="M21 11.5a9 9 0 0 1-13.8 7.6L3 21l1.9-4.2A9 9 0 1 1 21 11.5Z"/><path d="M8 8c1 4 3 6 7 7l1-2-3-1-1 1-2-2 1-1-1-3-2 1Z"/>',
  shield: '<path d="m12 3 9 4v5c0 5-9 10-9 10S3 17 3 12V7l9-4Z"/><path d="m8 12 3 3 5-6"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>',
  file: '<path d="M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8M8 16h8"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'
};
const icon = id => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[id] || paths.file}</svg>`;
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const state = { category: 'kahwin', group: 'rumah', pax: 500, addons: {} };
let quote = null;
let lastFingerprint = '';
let toastTimer;
const form = $('#quotation-form');
form.reset();
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
$('#event-date').min = today();
const dateLabel = iso => iso ? new Intl.DateTimeFormat('ms-MY', { dateStyle: 'long' }).format(new Date(iso + 'T12:00:00')) : 'Belum ditetapkan';
const selectedCategory = () => CATALOG.find(c => c.id === state.category);
const selectedGroup = () => selectedCategory().groups.find(g => g.id === state.group);

function toast(message) {
  const target = $('#toast'); target.textContent = message; target.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { target.hidden = true; }, 5500);
}
function invalidateQuote() {
  quote = null; lastFingerprint = ''; $('#quote-panel').hidden = true;
}
function renderCategories() {
  $('#category-grid').innerHTML = CATALOG.map(c => `<button type="button" class="category-button" data-category="${c.id}" aria-pressed="${c.id === state.category}">${icon(c.icon)}<span>${c.label}</span></button>`).join('');
}
function renderOptions(resetPax = false) {
  const category = selectedCategory();
  $('#group-field').hidden = category.groups.length === 1;
  $('#group-label').textContent = category.groupLabel || 'Pilihan pakej';
  $('#group-select').innerHTML = category.groups.map(g => `<option value="${g.id}" ${g.id === state.group ? 'selected' : ''}>${escape(g.label)}</option>`).join('');
  const group = selectedGroup();
  $('#pax-field').hidden = !!group.rate;
  $('#pax-select').disabled = !!group.rate;
  $('#custom-pax-field').hidden = !group.rate;
  $('#custom-pax').disabled = !group.rate;
  if (group.rate) {
    if (resetPax || state.pax < group.minPax) state.pax = group.minPax;
    $('#custom-pax').value = state.pax;
    $('#rate-note').textContent = `${money(group.rate * 100)} seorang · minimum ${group.minPax} tetamu`;
  } else {
    if (resetPax || !group.tiers.some(t => t.pax === Number(state.pax))) state.pax = group.tiers[0].pax;
    $('#pax-select').innerHTML = group.tiers.map(t => `<option value="${t.pax}" ${t.pax === Number(state.pax) ? 'selected' : ''}>${t.pax.toLocaleString('en-MY')} tetamu — ${money(t.price * 100)}</option>`).join('');
  }
  const menu = category.menus?.[group.id] || category.menu || [];
  $('#package-details-content').innerHTML = `<p>${escape(category.description)}</p>${menu.length ? `<h3>Menu</h3><ul>${menu.map(m => `<li>${escape(m)}</li>`).join('')}</ul>` : ''}<h3>Pakej termasuk</h3><ul>${category.included.map(m => `<li>${escape(m)}</li>`).join('')}</ul>${category.note ? `<p class="detail-note">${escape(category.note)}</p>` : ''}`;
  $('#location-hint').textContent = state.category === 'kahwin' ? `Pilihan pakej: ${group.label}. Lengkapkan alamat atau butiran lokasi majlis.` : 'Nyatakan lokasi untuk rujukan pihak Hulubalang Katering.';
}
function renderAddons() {
  $('#addons-list').innerHTML = selectedCategory().addons.map(id => {
    const a = ADDONS[id];
    return `<div class="addon-row"><div class="addon-copy"><label for="addon-${id}">${escape(a.label)}</label><span>${money(a.price * 100)} / ${a.unit}</span></div>${a.max === 1 ? `<input id="addon-${id}" data-addon="${id}" type="checkbox" ${state.addons[id] ? 'checked' : ''}>` : `<input id="addon-${id}" class="quantity-input" data-addon="${id}" type="number" min="0" max="${a.max}" step="1" value="${state.addons[id] || 0}" inputmode="numeric" aria-label="Kuantiti ${escape(a.label)}">`}</div>`;
  }).join('');
}
function renderSummary() {
  try {
    const result = calculate(state);
    $('#summary-package').textContent = result.category.label;
    $('#summary-detail').textContent = `${result.category.groups.length > 1 ? result.group.label + ' · ' : ''}${result.pax.toLocaleString('en-MY')} tetamu${result.extraPax ? ' + ' + result.extraPax + ' pax makanan tambahan' : ''}`;
    $('#summary-lines').innerHTML = result.lines.map((line, i) => `<div class="summary-line"><span>${i ? escape(line.label) + (line.qty > 1 ? ' × ' + line.qty : '') : 'Harga pakej'}</span><span>${money(line.total)}</span></div>`).join('');
    $('#total-price').textContent = money(result.total);
    $('#deposit-price').textContent = money(result.deposit);
    $('#balance-price').textContent = money(result.balance);
    $('#mobile-total').textContent = money(result.total);
    $('#mobile-deposit').textContent = money(result.deposit);
    $('#pricing-error').hidden = true;
    $('#pay-button').disabled = false;
    return result;
  } catch (error) {
    $('#pricing-error').textContent = error.message;
    $('#pricing-error').hidden = false;
    $('#total-price').textContent = '—'; $('#deposit-price').textContent = '—'; $('#balance-price').textContent = '—';
    $('#mobile-total').textContent = '—'; $('#mobile-deposit').textContent = '—';
    $('#pay-button').disabled = true;
    return null;
  }
}
function getCustomer() {
  const data = Object.fromEntries(new FormData(form));
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value).trim()]));
}
function validateForm() {
  form.querySelectorAll('[required]').forEach(input => {
    input.setCustomValidity(input.value.trim() ? '' : 'Sila lengkapkan maklumat ini.');
  });
  const phone = $('#customer-phone');
  if (phone.value.trim()) phone.setCustomValidity(/^[+\d\s()-]+$/.test(phone.value) && /^[0-9]{8,15}$/.test(phone.value.replace(/\D/g, '')) ? '' : 'Sila masukkan nombor telefon yang sah (8–15 digit).');
  if (!form.reportValidity()) return false;
  return !!renderSummary();
}
function buildQuote() {
  if (!validateForm()) return null;
  const result = calculate(state); const customer = getCustomer();
  const fingerprint = JSON.stringify({ state, customer });
  if (quote && fingerprint === lastFingerprint) return quote;
  const random = Array.from(crypto.getRandomValues(new Uint8Array(4)), n => n.toString(16).padStart(2, '0')).join('').toUpperCase();
  quote = { ...result, customer, reference: `HBK-${today().replaceAll('-', '')}-${random}`, created: today(), eventDateLabel: dateLabel(customer.date) };
  lastFingerprint = fingerprint;
  return quote;
}
function renderQuote(q, focus = false) {
  $('#quote-content').innerHTML = `
    <p class="quote-reference"><strong>${escape(q.reference)}</strong> · ${dateLabel(q.created)}</p>
    <div class="quote-meta"><div><strong>Kepada</strong><p>${escape(q.customer.name)}\n${escape(q.customer.address)}\n${escape(q.customer.email)}\n${escape(q.customer.phone)}</p></div><div><strong>Maklumat majlis</strong><p>${escape(q.category.label)}\n${escape(q.eventDateLabel)}${q.customer.time ? ' · ' + escape(q.customer.time) : ''}\n${escape(q.customer.location)}\n${q.totalPax.toLocaleString('en-MY')} tetamu${q.extraPax ? ' (termasuk tambahan makanan)' : ''}</p></div></div>
    <div class="quote-table-wrap"><table class="quote-table"><thead><tr><th>Perkara</th><th>Kuantiti</th><th>Jumlah</th></tr></thead><tbody>${q.lines.map(line => `<tr><td>${escape(line.label)}<br><span class="muted">${money(line.unitPrice)} / ${line.unit}</span></td><td>${line.qty} ${line.unit}</td><td>${money(line.total)}</td></tr>`).join('')}</tbody></table></div>
    <div class="quote-totals"><div><span>Jumlah keseluruhan</span><strong>${money(q.total)}</strong></div><div class="highlight"><span>Deposit 10%</span><strong>${money(q.deposit)}</strong></div><div><span>Baki selepas deposit</span><strong>${money(q.balance)}</strong></div></div>
    ${q.customer.notes ? `<p class="quote-notes"><strong>Catatan pelanggan</strong><br>${escape(q.customer.notes)}</p>` : ''}`;
  $('#quote-panel').hidden = false;
  if (focus) { $('#quote-panel').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#quote-heading').focus({ preventScroll: true }); }
}
$('#category-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-category]'); if (!button) return;
  if (state.category === button.dataset.category) return;
  state.category = button.dataset.category; state.group = selectedCategory().groups[0].id; state.addons = {};
  invalidateQuote(); renderCategories(); renderOptions(true); renderAddons(); renderSummary();
  $(`[data-category="${state.category}"]`).focus();
});
$('#group-select').addEventListener('change', event => { state.group = event.target.value; invalidateQuote(); renderOptions(); renderSummary(); });
$('#pax-select').addEventListener('change', event => { state.pax = Number(event.target.value); invalidateQuote(); renderSummary(); });
$('#custom-pax').addEventListener('input', event => { state.pax = event.target.value; invalidateQuote(); renderSummary(); });
$('#addons-list').addEventListener('input', event => {
  const input = event.target; if (!input.dataset.addon) return;
  state.addons[input.dataset.addon] = input.type === 'checkbox' ? Number(input.checked) : (input.value === '' ? NaN : Number(input.value));
  invalidateQuote(); renderSummary();
});
form.addEventListener('input', event => { if (event.target.name) { event.target.setCustomValidity(''); invalidateQuote(); } });
form.addEventListener('submit', event => { event.preventDefault(); const q = buildQuote(); if (q) renderQuote(q, true); });
$('#download-pdf').addEventListener('click', async () => {
  const q = buildQuote(); if (!q) return;
  const button = $('#download-pdf'); button.disabled = true; const original = button.innerHTML; button.textContent = 'Menyediakan PDF…';
  try {
    const { downloadQuote } = await import('./pdf.js');
    await downloadQuote(q); toast('Quotation PDF anda sudah disediakan.');
  } catch (error) { console.error('PDF gagal:', error); toast('PDF tidak dapat disediakan. Cuba lagi atau hubungi admin.'); }
  finally { button.disabled = false; button.innerHTML = original; }
});
$('#pay-button').addEventListener('click', () => {
  const q = buildQuote(); if (!q) return; renderQuote(q);
  $('#payment-amount').textContent = money(q.deposit);
  $('#payment-reference').textContent = q.reference;
  const amount = (q.deposit / 100).toFixed(2);
  const frameUrl = 'payment.html?amount=' + encodeURIComponent(amount);
  let frame = $('#payment-embed-container iframe');
  if (!frame) {
    frame = document.createElement('iframe'); frame.title = 'Borang pembayaran deposit BCL'; frame.className = 'payment-frame'; frame.referrerPolicy = 'strict-origin-when-cross-origin';
    $('#payment-embed-container').append(frame);
  }
  // The official BCL loader forwards the amount query to its form.
  // Reset the form when the deposit changes so a stale amount cannot be reused.
  if (frame.getAttribute('src') !== frameUrl || frame.dataset.quoteReference !== q.reference) frame.src = frameUrl;
  frame.dataset.quoteReference = q.reference;
  $('.payment-fallback a').href = COMPANY.payment + '?amount=' + encodeURIComponent(amount);
  $('#payment-dialog').showModal();
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
document.querySelectorAll('.privacy-trigger').forEach(button => button.addEventListener('click', () => $('#privacy-dialog').showModal()));
$('#copy-reference').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('#payment-reference').textContent); toast('Nombor quotation disalin.'); }
  catch { toast('Sila salin nombor quotation yang dipaparkan.'); }
});
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }));
renderCategories(); renderOptions(); renderAddons(); renderSummary();

// Optional browser agent access, using the exact same pricing rules as the UI.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  Promise.resolve(document.modelContext.registerTool({
    name: 'read_hulubalang_quote_prices', title: 'Baca ringkasan harga Hulubalang',
    description: 'Read the currently selected package, total and deposit. Does not return customer details, submit forms or make payments.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute(input) {
      if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Tiada parameter diperlukan.');
      const r = calculate(state);
      return { package: r.category.label, option: r.group.label, pax: r.totalPax, currency: 'MYR', total: r.total / 100, deposit: r.deposit / 100, balance: r.balance / 100 };
    }
  }, { signal: lifecycle.signal })).catch(() => {});
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
