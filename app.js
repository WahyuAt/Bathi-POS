(() => {
  'use strict';

  const STORAGE_KEY = 'pos_app_data_v1';
  const SESSION_KEY = 'pos_app_session_v1';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const nowISO = () => new Date().toISOString();
  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const money = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(Number(value || 0));

  const number = (value) => new Intl.NumberFormat('id-ID').format(Number(value || 0));

  function localDateKey(value = new Date()) {
    const d = value instanceof Date ? value : new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function localDateTime(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(value));
  }

  function localDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[c]));
  }

  function daysAgo(n, hour = 10, minute = 0) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  function seedData() {
    const products = [
      { id: 'prd_1', code: 'BRG-001', name: 'Air Mineral 600 ml', category: 'Minuman', unit: 'Botol', costPrice: 2500, sellPrice: 4000, stock: 48, minStock: 10, active: true },
      { id: 'prd_2', code: 'BRG-002', name: 'Teh Botol', category: 'Minuman', unit: 'Botol', costPrice: 3500, sellPrice: 6000, stock: 23, minStock: 8, active: true },
      { id: 'prd_3', code: 'BRG-003', name: 'Kopi Susu', category: 'Minuman', unit: 'Cup', costPrice: 7000, sellPrice: 12000, stock: 16, minStock: 5, active: true },
      { id: 'prd_4', code: 'BRG-004', name: 'Roti Cokelat', category: 'Makanan', unit: 'Pcs', costPrice: 4500, sellPrice: 8000, stock: 7, minStock: 8, active: true },
      { id: 'prd_5', code: 'BRG-005', name: 'Donat Gula', category: 'Makanan', unit: 'Pcs', costPrice: 4000, sellPrice: 7000, stock: 19, minStock: 7, active: true },
      { id: 'prd_6', code: 'BRG-006', name: 'Mie Instan Cup', category: 'Makanan', unit: 'Cup', costPrice: 6500, sellPrice: 10000, stock: 30, minStock: 10, active: true },
      { id: 'prd_7', code: 'BRG-007', name: 'Pulpen Gel', category: 'ATK', unit: 'Pcs', costPrice: 3000, sellPrice: 5000, stock: 42, minStock: 10, active: true },
      { id: 'prd_8', code: 'BRG-008', name: 'Buku Tulis A5', category: 'ATK', unit: 'Pcs', costPrice: 5500, sellPrice: 9000, stock: 12, minStock: 10, active: true },
      { id: 'prd_9', code: 'BRG-009', name: 'Tisu Saku', category: 'Kebutuhan', unit: 'Pcs', costPrice: 2500, sellPrice: 4500, stock: 5, minStock: 8, active: true }
    ];

    const customers = [
      { id: 'cus_1', code: 'CUS-001', name: 'Pelanggan Umum', phone: '', email: '', points: 0, balance: 0, active: true, createdAt: daysAgo(90) },
      { id: 'cus_2', code: 'CUS-002', name: 'Ahmad Fauzan', phone: '081234567890', email: 'ahmad@example.com', points: 12, balance: 0, active: true, createdAt: daysAgo(30) },
      { id: 'cus_3', code: 'CUS-003', name: 'Siti Rahma', phone: '081298765432', email: 'siti@example.com', points: 8, balance: 0, active: true, createdAt: daysAgo(20) }
    ];

    const users = [
      { id: 'usr_admin', username: 'admin', password: 'admin123', fullName: 'Administrator', role: 'admin', active: true, createdAt: daysAgo(120) },
      { id: 'usr_cashier', username: 'kasir', password: 'kasir123', fullName: 'Kasir Demo', role: 'cashier', active: true, createdAt: daysAgo(60) },
      { id: 'usr_manager', username: 'manager', password: 'manager123', fullName: 'Manager Toko', role: 'manager', active: true, createdAt: daysAgo(50) }
    ];

    const shifts = [
      { id: 'sh_1', userId: 'usr_admin', startTime: daysAgo(1, 8), endTime: daysAgo(1, 17), openingBalance: 300000, actualBalance: 435000, status: 'closed', cashMovements: [] }
    ];

    const transactions = [
      {
        id: 'trx_1', code: 'TRX-0001', date: daysAgo(2, 9, 15), customerId: 'cus_2', userId: 'usr_admin', shiftId: null,
        subtotal: 28000, discount: 0, tax: 0, total: 28000, status: 'paid',
        items: [
          { productId: 'prd_3', productCode: 'BRG-003', productName: 'Kopi Susu', quantity: 1, price: 12000, discount: 0, subtotal: 12000 },
          { productId: 'prd_4', productCode: 'BRG-004', productName: 'Roti Cokelat', quantity: 2, price: 8000, discount: 0, subtotal: 16000 }
        ]
      },
      {
        id: 'trx_2', code: 'TRX-0002', date: daysAgo(1, 10, 20), customerId: 'cus_3', userId: 'usr_admin', shiftId: 'sh_1',
        subtotal: 44000, discount: 4000, tax: 0, total: 40000, status: 'paid',
        items: [
          { productId: 'prd_6', productCode: 'BRG-006', productName: 'Mie Instan Cup', quantity: 2, price: 10000, discount: 0, subtotal: 20000 },
          { productId: 'prd_8', productCode: 'BRG-008', productName: 'Buku Tulis A5', quantity: 2, price: 9000, discount: 0, subtotal: 18000 },
          { productId: 'prd_7', productCode: 'BRG-007', productName: 'Pulpen Gel', quantity: 1, price: 5000, discount: 0, subtotal: 5000 },
          { productId: 'prd_9', productCode: 'BRG-009', productName: 'Tisu Saku', quantity: 1, price: 1000, discount: 0, subtotal: 1000 }
        ]
      },
      {
        id: 'trx_3', code: 'TRX-0003', date: daysAgo(1, 14, 40), customerId: 'cus_1', userId: 'usr_admin', shiftId: 'sh_1',
        subtotal: 95000, discount: 0, tax: 0, total: 95000, status: 'paid',
        items: [
          { productId: 'prd_1', productCode: 'BRG-001', productName: 'Air Mineral 600 ml', quantity: 10, price: 4000, discount: 0, subtotal: 40000 },
          { productId: 'prd_5', productCode: 'BRG-005', productName: 'Donat Gula', quantity: 5, price: 7000, discount: 0, subtotal: 35000 },
          { productId: 'prd_6', productCode: 'BRG-006', productName: 'Mie Instan Cup', quantity: 2, price: 10000, discount: 0, subtotal: 20000 }
        ]
      }
    ];

    const payments = [
      { id: 'pay_1', transactionId: 'trx_1', method: 'qris', amount: 28000, paid: 28000, change: 0, date: transactions[0].date, status: 'paid', referenceNo: 'QR-0001' },
      { id: 'pay_2', transactionId: 'trx_2', method: 'cash', amount: 40000, paid: 50000, change: 10000, date: transactions[1].date, status: 'paid', referenceNo: '' },
      { id: 'pay_3', transactionId: 'trx_3', method: 'cash', amount: 95000, paid: 100000, change: 5000, date: transactions[2].date, status: 'paid', referenceNo: '' }
    ];

    const receipts = transactions.map((t, i) => ({
      id: `rcp_${i + 1}`, transactionId: t.id, number: `RCP-${String(i + 1).padStart(4, '0')}`,
      printedAt: t.date, printedBy: t.userId, status: 'printed'
    }));

    const stockMovements = products.map((p, i) => ({
      id: `sm_seed_${i}`, productId: p.id, type: 'opening', quantity: p.stock, before: 0, after: p.stock,
      date: daysAgo(100), note: 'Stok awal', createdBy: 'usr_admin', referenceType: 'opening', referenceId: null
    }));

    return {
      version: 1,
      settings: { storeName: 'Toko Demo PoS', address: 'Jakarta, Indonesia', taxRate: 0 },
      products, customers, users, shifts, transactions, payments, receipts, stockMovements,
      counters: { transaction: 3, receipt: 3, customer: 3, product: 9 }
    };
  }

  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = seedData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    try { return JSON.parse(raw); }
    catch (e) {
      const fresh = seedData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
  }

  let db = loadData();
  let currentUser = null;
  let currentPage = 'dashboard';
  let cart = [];
  let posCustomerId = 'cus_1';
  let posDiscount = 0;

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  function getUser(id) { return db.users.find(x => x.id === id); }
  function getProduct(id) { return db.products.find(x => x.id === id); }
  function getCustomer(id) { return db.customers.find(x => x.id === id); }
  function getTransaction(id) { return db.transactions.find(x => x.id === id); }
  function getPaymentByTransaction(id) { return db.payments.find(x => x.transactionId === id); }
  function getReceiptByTransaction(id) { return db.receipts.find(x => x.transactionId === id); }

  function activeShift(userId = currentUser?.id) {
    return db.shifts.find(s => s.userId === userId && s.status === 'open') || null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦', roles: ['admin','manager','cashier'], subtitle: 'Ringkasan operasional penjualan hari ini' },
    { id: 'pos', label: 'Kasir', icon: '🛒', roles: ['admin','manager','cashier'], subtitle: 'Input transaksi penjualan dan pembayaran' },
    { id: 'products', label: 'Produk', icon: '◫', roles: ['admin','manager'], subtitle: 'Kelola produk, harga, kategori, dan satuan' },
    { id: 'stock', label: 'Stok', icon: '▥', roles: ['admin','manager'], subtitle: 'Pantau stok dan riwayat mutasi barang' },
    { id: 'customers', label: 'Pelanggan', icon: '◎', roles: ['admin','manager','cashier'], subtitle: 'Kelola data pelanggan dan riwayat belanja' },
    { id: 'payments', label: 'Pembayaran', icon: '▣', roles: ['admin','manager','cashier'], subtitle: 'Riwayat pembayaran tunai dan non-tunai' },
    { id: 'receipts', label: 'Struk', icon: '▤', roles: ['admin','manager','cashier'], subtitle: 'Cari, lihat, dan cetak ulang struk' },
    { id: 'shift', label: 'Kas / Shift', icon: '◈', roles: ['admin','manager','cashier'], subtitle: 'Buka/tutup shift dan rekonsiliasi kas' },
    { id: 'reports', label: 'Laporan Penjualan', icon: '▥', roles: ['admin','manager'], subtitle: 'Analisis penjualan berdasarkan periode' },
    { id: 'users', label: 'User Management', icon: '⚙', roles: ['admin'], subtitle: 'Kelola pengguna, role, dan status akses' }
  ];

  function allowedPage(id) {
    const item = navItems.find(n => n.id === id);
    return item && currentUser && item.roles.includes(currentUser.role);
  }

  function toast(title, message = '', type = '') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<strong>${escapeHTML(title)}</strong>${message ? `<span>${escapeHTML(message)}</span>` : ''}`;
    $('#toast-root').appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function openModal({ title, body, size = '', footer = '' }) {
    $('#modal-root').innerHTML = `
      <div class="modal-backdrop" data-modal-close>
        <div class="modal ${size ? `modal-${size}` : ''}" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}">
          <div class="modal-head">
            <h3>${escapeHTML(title)}</h3>
            <button class="icon-btn" data-modal-close aria-label="Tutup">×</button>
          </div>
          <div class="modal-body">${body}</div>
          ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
        </div>
      </div>`;
    $('[data-modal-close]', $('#modal-root'))?.focus?.();
    $$('.modal-backdrop [data-modal-close]').forEach(el => el.addEventListener('click', (e) => {
      if (e.currentTarget === e.target || e.currentTarget.matches('button')) closeModal();
    }));
  }

  function closeModal() { $('#modal-root').innerHTML = ''; }

  function nextCode(prefix, key, digits = 4) {
    db.counters[key] = (db.counters[key] || 0) + 1;
    return `${prefix}-${String(db.counters[key]).padStart(digits, '0')}`;
  }

  function statusBadge(status) {
    const map = {
      paid: ['success', 'Lunas'], printed: ['blue', 'Tercetak'], open: ['success', 'Aktif'], closed: ['muted', 'Ditutup'],
      active: ['success', 'Aktif'], inactive: ['muted', 'Nonaktif'], cash: ['success', 'Tunai'], qris: ['purple', 'QRIS'],
      transfer: ['blue', 'Transfer'], card: ['warning', 'Kartu']
    };
    const [kind, label] = map[status] || ['muted', status || '-'];
    return `<span class="badge badge-${kind}">${escapeHTML(label)}</span>`;
  }

  function login(username, password) {
    const user = db.users.find(u => u.username === username && u.password === password && u.active);
    if (!user) return false;
    currentUser = user;
    sessionStorage.setItem(SESSION_KEY, user.id);
    showApp();
    return true;
  }

  function restoreSession() {
    const id = sessionStorage.getItem(SESSION_KEY);
    if (!id) return false;
    const user = db.users.find(u => u.id === id && u.active);
    if (!user) return false;
    currentUser = user;
    showApp();
    return true;
  }

  function showApp() {
    $('#login-view').classList.add('hidden');
    $('#app').classList.remove('hidden');
    $('#sidebar-user-name').textContent = currentUser.fullName;
    $('#sidebar-user-role').textContent = currentUser.role;
    $('#user-avatar').textContent = currentUser.fullName.trim().charAt(0).toUpperCase();
    renderNav();
    if (!allowedPage(currentPage)) currentPage = 'dashboard';
    navigate(currentPage);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    currentUser = null;
    cart = [];
    $('#app').classList.add('hidden');
    $('#login-view').classList.remove('hidden');
  }

  function renderNav() {
    const visible = navItems.filter(n => n.roles.includes(currentUser.role));
    $('#main-nav').innerHTML = visible.map(n => `
      <button class="nav-item ${n.id === currentPage ? 'active' : ''}" data-page="${n.id}">
        <span class="nav-icon" aria-hidden="true">${n.icon}</span><span>${n.label}</span>
      </button>`).join('');
    $$('#main-nav [data-page]').forEach(btn => btn.addEventListener('click', () => {
      navigate(btn.dataset.page);
      $('#sidebar').classList.remove('open');
    }));
  }

  function navigate(page) {
    if (!allowedPage(page)) page = 'dashboard';
    currentPage = page;
    const item = navItems.find(n => n.id === page);
    $('#page-title').textContent = item.label;
    $('#page-subtitle').textContent = item.subtitle;
    renderNav();
    updateShiftBadge();

    const renderers = {
      dashboard: renderDashboard,
      pos: renderPOS,
      products: renderProducts,
      stock: renderStock,
      customers: renderCustomers,
      payments: renderPayments,
      receipts: renderReceipts,
      shift: renderShift,
      reports: renderReports,
      users: renderUsers
    };
    renderers[page]();
    $('#page-content').focus({ preventScroll: true });
  }

  function updateShiftBadge() {
    const sh = activeShift();
    const badge = $('#shift-badge');
    if (sh) {
      badge.className = 'badge badge-success';
      badge.textContent = `Shift aktif • ${new Date(sh.startTime).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;
    } else {
      badge.className = 'badge badge-muted';
      badge.textContent = 'Shift belum dibuka';
    }
  }

  function transactionsInRange(startKey, endKey) {
    return db.transactions.filter(t => {
      const k = localDateKey(t.date);
      return t.status === 'paid' && k >= startKey && k <= endKey;
    });
  }

  function sum(arr, keyOrFn) {
    return arr.reduce((acc, item) => acc + Number(typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn] || 0), 0);
  }

  function renderDashboard() {
    const today = localDateKey();
    const todayTrx = transactionsInRange(today, today);
    const todaySales = sum(todayTrx, 'total');
    const lowStock = db.products.filter(p => p.active && p.stock <= p.minStock);
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = localDateKey(d);
      const txs = transactionsInRange(key, key);
      last7.push({ key, label: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d), value: sum(txs, 'total') });
    }
    const max = Math.max(...last7.map(x => x.value), 1);
    const recent = [...db.transactions].filter(t => t.status === 'paid').sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 6);

    const paymentToday = db.payments.filter(p => localDateKey(p.date) === today && p.status === 'paid');
    const methodStats = ['cash','qris','transfer','card'].map(method => ({
      method, total: sum(paymentToday.filter(p => p.method === method), 'amount')
    })).filter(x => x.total > 0);

    $('#page-content').innerHTML = `
      <div class="grid grid-4">
        <div class="card kpi-card"><span class="kpi-icon">Rp</span><div class="kpi-label">Penjualan hari ini</div><div class="kpi-value">${money(todaySales)}</div><div class="kpi-foot">${todayTrx.length} transaksi berhasil</div></div>
        <div class="card kpi-card"><span class="kpi-icon">#</span><div class="kpi-label">Transaksi hari ini</div><div class="kpi-value">${number(todayTrx.length)}</div><div class="kpi-foot">Rata-rata ${money(todayTrx.length ? todaySales/todayTrx.length : 0)}</div></div>
        <div class="card kpi-card"><span class="kpi-icon">▦</span><div class="kpi-label">Produk aktif</div><div class="kpi-value">${number(db.products.filter(p => p.active).length)}</div><div class="kpi-foot">${number(sum(db.products, 'stock'))} unit stok tersedia</div></div>
        <div class="card kpi-card"><span class="kpi-icon">!</span><div class="kpi-label">Stok menipis</div><div class="kpi-value">${number(lowStock.length)}</div><div class="kpi-foot">Perlu segera dilakukan restock</div></div>
      </div>

      <div class="grid grid-2" style="margin-top:16px; align-items:start;">
        <div class="card">
          <div class="section-head"><div><h3>Penjualan 7 Hari Terakhir</h3><p>Nilai transaksi lunas per hari</p></div></div>
          <div class="chart-bars">
            ${last7.map(x => `<div class="bar-col"><div class="bar" data-value="${escapeHTML(money(x.value))}" style="height:${Math.max(3, (x.value/max)*100)}%"></div><div class="bar-label">${escapeHTML(x.label)}</div></div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="section-head"><div><h3>Ringkasan Pembayaran Hari Ini</h3><p>Distribusi metode pembayaran</p></div></div>
          ${methodStats.length ? `<div class="stat-list">${methodStats.map(s => {
            const pct = todaySales ? Math.round((s.total/todaySales)*100) : 0;
            return `<div class="stat-row"><div class="grow"><div class="flex-between"><strong>${escapeHTML(methodLabel(s.method))}</strong><span>${money(s.total)}</span></div><div class="progress"><span style="width:${pct}%"></span></div></div><span class="badge badge-blue">${pct}%</span></div>`;
          }).join('')}</div>` : `<div class="empty"><strong>Belum ada pembayaran</strong>Transaksi hari ini akan muncul di sini.</div>`}
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:16px; align-items:start;">
        <div class="card">
          <div class="section-head"><div><h3>Transaksi Terbaru</h3><p>Aktivitas penjualan terakhir</p></div><button class="btn btn-secondary btn-sm" data-go="reports">Lihat laporan</button></div>
          ${recent.length ? `<div class="table-wrap"><table><thead><tr><th>Kode</th><th>Waktu</th><th>Pelanggan</th><th>Total</th></tr></thead><tbody>${recent.map(t => `<tr><td><strong>${escapeHTML(t.code)}</strong></td><td>${localDateTime(t.date)}</td><td>${escapeHTML(getCustomer(t.customerId)?.name || 'Umum')}</td><td>${money(t.total)}</td></tr>`).join('')}</tbody></table></div>` : `<div class="empty">Belum ada transaksi.</div>`}
        </div>
        <div class="card">
          <div class="section-head"><div><h3>Stok Menipis</h3><p>Produk dengan stok ≤ batas minimum</p></div>${allowedPage('stock') ? '<button class="btn btn-secondary btn-sm" data-go="stock">Kelola stok</button>' : ''}</div>
          ${lowStock.length ? `<div class="stat-list">${lowStock.slice(0,7).map(p => `<div class="stat-row"><div><strong>${escapeHTML(p.name)}</strong><span class="small muted">${escapeHTML(p.code)} • minimum ${p.minStock}</span></div><span class="badge badge-danger">${p.stock} ${escapeHTML(p.unit)}</span></div>`).join('')}</div>` : `<div class="empty"><strong>Stok aman</strong>Tidak ada produk di bawah batas minimum.</div>`}
        </div>
      </div>`;

    $$('[data-go]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.go)));
  }

  function methodLabel(method) {
    return ({ cash: 'Tunai', qris: 'QRIS / E-Wallet', transfer: 'Transfer', card: 'Kartu Debit/Kredit' })[method] || method;
  }

  function cartTotals() {
    const subtotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
    const discount = Math.min(Math.max(Number(posDiscount || 0), 0), subtotal);
    const taxRate = Number(db.settings?.taxRate || 0);
    const tax = Math.round((subtotal - discount) * taxRate / 100);
    return { subtotal, discount, tax, total: subtotal - discount + tax };
  }

  function addToCart(productId) {
    const p = getProduct(productId);
    if (!p || !p.active || p.stock <= 0) return;
    const existing = cart.find(i => i.productId === productId);
    const currentQty = existing?.quantity || 0;
    if (currentQty + 1 > p.stock) return toast('Stok tidak cukup', `${p.name} hanya tersedia ${p.stock} ${p.unit}.`, 'error');
    if (existing) existing.quantity += 1;
    else cart.push({ productId: p.id, productCode: p.code, productName: p.name, quantity: 1, price: p.sellPrice });
    renderPOS();
  }

  function setCartQty(productId, qty) {
    const p = getProduct(productId);
    if (!p) return;
    if (qty <= 0) cart = cart.filter(i => i.productId !== productId);
    else if (qty > p.stock) toast('Stok tidak cukup', `Maksimal ${p.stock} ${p.unit}.`, 'error');
    else cart.find(i => i.productId === productId).quantity = qty;
    renderPOS();
  }

  function renderPOS() {
    const search = (window.__posSearch || '').toLowerCase();
    const cat = window.__posCategory || 'all';
    const categories = [...new Set(db.products.filter(p => p.active).map(p => p.category))].sort();
    const products = db.products.filter(p => p.active &&
      (cat === 'all' || p.category === cat) &&
      (!search || `${p.name} ${p.code} ${p.category}`.toLowerCase().includes(search))
    );
    const totals = cartTotals();
    const sh = activeShift();

    $('#page-content').innerHTML = `
      ${!sh ? `<div class="warning-box" style="margin-bottom:14px"><strong>Shift kas belum dibuka.</strong> Buka shift terlebih dahulu sebelum menyelesaikan transaksi. Produk tetap dapat dimasukkan ke keranjang.</div>` : ''}
      <div class="pos-layout">
        <div class="card">
          <div class="toolbar">
            <input id="pos-search" class="control search" placeholder="Cari produk / scan kode..." value="${escapeHTML(window.__posSearch || '')}">
            <select id="pos-category" class="control" style="max-width:180px">
              <option value="all">Semua kategori</option>
              ${categories.map(c => `<option ${c === cat ? 'selected' : ''} value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('')}
            </select>
          </div>
          ${products.length ? `<div class="product-grid">${products.map(p => `
            <button class="product-tile" data-add-product="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
              <div class="product-code">${escapeHTML(p.code)} • ${escapeHTML(p.category)}</div>
              <div class="product-name">${escapeHTML(p.name)}</div>
              <div class="product-price">${money(p.sellPrice)}</div>
              <div class="product-stock">Stok ${number(p.stock)}</div>
            </button>`).join('')}</div>` : `<div class="empty"><strong>Produk tidak ditemukan</strong>Ubah kata pencarian atau kategori.</div>`}
        </div>

        <div class="card cart-card">
          <div class="section-head"><div><h3>Keranjang</h3><p>${cart.length} jenis produk</p></div>${cart.length ? '<button id="clear-cart" class="btn btn-ghost btn-sm">Kosongkan</button>' : ''}</div>
          <div class="field">
            <label>Pelanggan</label>
            <select id="pos-customer">
              ${db.customers.filter(c => c.active).map(c => `<option value="${c.id}" ${c.id === posCustomerId ? 'selected' : ''}>${escapeHTML(c.name)}</option>`).join('')}
            </select>
          </div>
          ${cart.length ? `<div class="cart-list">${cart.map(i => {
            const p = getProduct(i.productId);
            return `<div class="cart-row"><div><strong>${escapeHTML(i.productName)}</strong><br><small>${money(i.price)} / ${escapeHTML(p?.unit || 'unit')}</small><div class="qty-control"><button data-qty="-1" data-id="${i.productId}">−</button><span>${i.quantity}</span><button data-qty="1" data-id="${i.productId}">+</button><button data-remove="${i.productId}" style="margin-left:5px">×</button></div></div><strong>${money(i.price*i.quantity)}</strong></div>`;
          }).join('')}</div>` : `<div class="empty"><strong>Keranjang masih kosong</strong>Klik produk untuk menambahkannya.</div>`}

          <div class="field">
            <label>Diskon transaksi (Rp)</label>
            <input id="pos-discount" type="number" min="0" step="1000" value="${Number(posDiscount || 0)}">
          </div>
          <div class="summary-lines">
            <div class="summary-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
            <div class="summary-line"><span>Diskon</span><strong>− ${money(totals.discount)}</strong></div>
            ${totals.tax ? `<div class="summary-line"><span>Pajak</span><strong>${money(totals.tax)}</strong></div>` : ''}
            <div class="summary-line total"><span>Total</span><span>${money(totals.total)}</span></div>
          </div>
          <button id="checkout-btn" class="btn btn-success btn-block" ${!cart.length ? 'disabled' : ''}>Bayar ${money(totals.total)}</button>
        </div>
      </div>`;

    $('#pos-search').addEventListener('input', (e) => { window.__posSearch = e.target.value; setTimeout(() => { if (currentPage === 'pos') renderPOS(); }, 60); });
    $('#pos-category').addEventListener('change', (e) => { window.__posCategory = e.target.value; renderPOS(); });
    $('#pos-customer').addEventListener('change', (e) => { posCustomerId = e.target.value; });
    $('#pos-discount').addEventListener('change', (e) => { posDiscount = Number(e.target.value || 0); renderPOS(); });
    $$('[data-add-product]').forEach(b => b.addEventListener('click', () => addToCart(b.dataset.addProduct)));
    $$('[data-qty]').forEach(b => b.addEventListener('click', () => { const i = cart.find(x => x.productId === b.dataset.id); setCartQty(b.dataset.id, i.quantity + Number(b.dataset.qty)); }));
    $$('[data-remove]').forEach(b => b.addEventListener('click', () => setCartQty(b.dataset.remove, 0)));
    $('#clear-cart')?.addEventListener('click', () => { cart = []; posDiscount = 0; renderPOS(); });
    $('#checkout-btn')?.addEventListener('click', openCheckout);
  }

  function openCheckout() {
    if (!activeShift()) {
      toast('Shift belum dibuka', 'Buka Kas/Shift sebelum melakukan pembayaran.', 'error');
      navigate('shift');
      return;
    }
    const totals = cartTotals();
    if (!cart.length || totals.total <= 0) return;
    openModal({
      title: 'Pembayaran Transaksi', size: 'sm',
      body: `
        <div class="stack-lg">
          <div class="info-box flex-between"><span>Total tagihan</span><strong style="font-size:21px">${money(totals.total)}</strong></div>
          <div class="field"><label>Metode Pembayaran</label><select id="checkout-method"><option value="cash">Tunai</option><option value="qris">QRIS / E-Wallet</option><option value="transfer">Transfer Bank</option><option value="card">Kartu Debit/Kredit</option></select></div>
          <div class="field" id="paid-field"><label>Uang diterima</label><input id="checkout-paid" type="number" min="${totals.total}" step="1000" value="${totals.total}"></div>
          <div class="field hidden" id="ref-field"><label>No. Referensi (opsional)</label><input id="checkout-ref" placeholder="Contoh: INV-BANK-001"></div>
          <div class="summary-lines"><div class="summary-line"><span>Kembalian</span><strong id="checkout-change">${money(0)}</strong></div></div>
        </div>`,
      footer: `<button class="btn btn-outline" data-modal-close>Batal</button><button id="confirm-payment" class="btn btn-success">Konfirmasi Pembayaran</button>`
    });
    const method = $('#checkout-method');
    const paid = $('#checkout-paid');
    const update = () => {
      const isCash = method.value === 'cash';
      $('#paid-field').classList.toggle('hidden', !isCash);
      $('#ref-field').classList.toggle('hidden', isCash);
      if (!isCash) paid.value = totals.total;
      $('#checkout-change').textContent = money(Math.max(0, Number(paid.value || 0) - totals.total));
    };
    method.addEventListener('change', update);
    paid.addEventListener('input', update);
    update();
    $('#confirm-payment').addEventListener('click', () => finalizeSale({
      method: method.value,
      paid: Number(paid.value || 0),
      referenceNo: $('#checkout-ref')?.value?.trim() || ''
    }));
  }

  function finalizeSale(paymentInput) {
    const sh = activeShift();
    if (!sh) return toast('Shift tidak aktif', 'Buka shift terlebih dahulu.', 'error');
    const totals = cartTotals();
    if (paymentInput.method === 'cash' && paymentInput.paid < totals.total) return toast('Pembayaran kurang', 'Uang diterima belum mencukupi total transaksi.', 'error');

    for (const item of cart) {
      const p = getProduct(item.productId);
      if (!p || item.quantity > p.stock) return toast('Stok berubah', `Stok ${item.productName} tidak mencukupi.`, 'error');
    }

    const transactionId = uid('trx');
    const transactionCode = nextCode('TRX', 'transaction');
    const date = nowISO();
    const tx = {
      id: transactionId, code: transactionCode, date, customerId: posCustomerId, userId: currentUser.id, shiftId: sh.id,
      subtotal: totals.subtotal, discount: totals.discount, tax: totals.tax, total: totals.total, status: 'paid',
      items: cart.map(i => ({ ...clone(i), discount: 0, subtotal: i.quantity * i.price }))
    };
    db.transactions.push(tx);

    for (const item of cart) {
      const p = getProduct(item.productId);
      const before = p.stock;
      p.stock -= item.quantity;
      db.stockMovements.push({
        id: uid('sm'), productId: p.id, type: 'sale', quantity: -item.quantity, before, after: p.stock,
        date, note: `Penjualan ${transactionCode}`, createdBy: currentUser.id, referenceType: 'transaction', referenceId: transactionId
      });
    }

    const paid = paymentInput.method === 'cash' ? paymentInput.paid : totals.total;
    db.payments.push({
      id: uid('pay'), transactionId, method: paymentInput.method, amount: totals.total, paid,
      change: Math.max(0, paid - totals.total), date, status: 'paid', referenceNo: paymentInput.referenceNo || ''
    });

    const receipt = {
      id: uid('rcp'), transactionId, number: nextCode('RCP', 'receipt'), printedAt: date, printedBy: currentUser.id, status: 'printed'
    };
    db.receipts.push(receipt);

    const customer = getCustomer(posCustomerId);
    if (customer && customer.id !== 'cus_1') customer.points = Number(customer.points || 0) + Math.floor(totals.total / 10000);

    saveData();
    cart = [];
    posDiscount = 0;
    closeModal();
    updateShiftBadge();
    if (currentPage === 'pos') renderPOS();
    showReceipt(transactionId, true);
    toast('Transaksi berhasil', `${transactionCode} • ${money(totals.total)}`, 'success');
  }

  function receiptHTML(transactionId) {
    const t = getTransaction(transactionId);
    const p = getPaymentByTransaction(transactionId);
    const r = getReceiptByTransaction(transactionId);
    const c = getCustomer(t.customerId);
    const u = getUser(t.userId);
    return `
      <div class="receipt print-area" id="receipt-print-area">
        <h3>${escapeHTML(db.settings.storeName)}</h3>
        <div class="center small">${escapeHTML(db.settings.address || '')}</div>
        <hr>
        <div class="receipt-line"><span>No. Struk</span><strong>${escapeHTML(r?.number || '-')}</strong></div>
        <div class="receipt-line"><span>Transaksi</span><span>${escapeHTML(t.code)}</span></div>
        <div class="receipt-line"><span>Waktu</span><span>${escapeHTML(localDateTime(t.date))}</span></div>
        <div class="receipt-line"><span>Kasir</span><span>${escapeHTML(u?.fullName || '-')}</span></div>
        <div class="receipt-line"><span>Pelanggan</span><span>${escapeHTML(c?.name || 'Umum')}</span></div>
        <hr>
        ${t.items.map(i => `<div class="receipt-item"><strong>${escapeHTML(i.productName)}</strong><div class="item-meta"><span>${i.quantity} × ${money(i.price)}</span><span>${money(i.subtotal)}</span></div></div>`).join('')}
        <hr>
        <div class="receipt-line"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
        ${t.discount ? `<div class="receipt-line"><span>Diskon</span><span>− ${money(t.discount)}</span></div>` : ''}
        ${t.tax ? `<div class="receipt-line"><span>Pajak</span><span>${money(t.tax)}</span></div>` : ''}
        <div class="receipt-line" style="font-size:14px"><strong>TOTAL</strong><strong>${money(t.total)}</strong></div>
        <div class="receipt-line"><span>${escapeHTML(methodLabel(p?.method))}</span><span>${money(p?.paid || p?.amount || 0)}</span></div>
        ${p?.change ? `<div class="receipt-line"><span>Kembalian</span><span>${money(p.change)}</span></div>` : ''}
        ${p?.referenceNo ? `<div class="receipt-line"><span>Referensi</span><span>${escapeHTML(p.referenceNo)}</span></div>` : ''}
        <hr>
        <div class="center small">Terima kasih atas kunjungan Anda.</div>
      </div>`;
  }

  function showReceipt(transactionId, fromSale = false) {
    openModal({
      title: 'Struk Penjualan', size: 'sm',
      body: receiptHTML(transactionId),
      footer: `<button class="btn btn-outline" data-modal-close>${fromSale ? 'Selesai' : 'Tutup'}</button><button class="btn btn-primary" id="print-receipt">Cetak Struk</button>`
    });
    $('#print-receipt').addEventListener('click', () => printReceipt(transactionId));
  }

  function printReceipt(transactionId) {
    const html = receiptHTML(transactionId);
    const win = window.open('', '_blank', 'width=430,height=720');
    if (!win) return toast('Popup diblokir', 'Izinkan popup browser untuk mencetak struk.', 'error');
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Struk</title><style>body{font-family:ui-monospace,monospace;padding:20px}.receipt{max-width:320px;margin:auto}.receipt h3,.center{text-align:center}.small{font-size:12px}.receipt hr{border:0;border-top:1px dashed #777;margin:12px 0}.receipt-line,.item-meta{display:flex;justify-content:space-between;gap:12px;margin:5px 0;font-size:12px}.receipt-item{margin:7px 0;font-size:12px}</style></head><body>${html}<script>window.onload=()=>{window.print();};<\/script></body></html>`);
    win.document.close();
  }

  function renderProducts() {
    const q = (window.__productSearch || '').toLowerCase();
    const rows = db.products.filter(p => !q || `${p.name} ${p.code} ${p.category}`.toLowerCase().includes(q));
    $('#page-content').innerHTML = `
      <div class="card">
        <div class="section-head"><div><h3>Master Produk</h3><p>${db.products.length} produk tersimpan</p></div><button id="add-product" class="btn btn-primary">+ Tambah Produk</button></div>
        <div class="toolbar"><input id="product-search" class="control search" placeholder="Cari nama, kode, kategori..." value="${escapeHTML(window.__productSearch || '')}"></div>
        <div class="table-wrap"><table><thead><tr><th>Kode</th><th>Produk</th><th>Kategori</th><th>Harga Jual</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
          ${rows.map(p => `<tr><td><strong>${escapeHTML(p.code)}</strong></td><td>${escapeHTML(p.name)}<br><span class="small muted">${escapeHTML(p.unit)}</span></td><td>${escapeHTML(p.category)}</td><td>${money(p.sellPrice)}</td><td>${p.stock <= p.minStock ? `<span class="badge badge-danger">${p.stock}</span>` : `<span class="badge badge-success">${p.stock}</span>`}</td><td>${statusBadge(p.active?'active':'inactive')}</td><td><div class="actions"><button class="btn btn-secondary btn-sm" data-edit-product="${p.id}">Edit</button><button class="btn btn-outline btn-sm" data-toggle-product="${p.id}">${p.active?'Nonaktifkan':'Aktifkan'}</button></div></td></tr>`).join('') || `<tr><td colspan="7"><div class="empty">Produk tidak ditemukan.</div></td></tr>`}
        </tbody></table></div>
      </div>`;
    $('#product-search').addEventListener('input', e => { window.__productSearch = e.target.value; renderProducts(); });
    $('#add-product').addEventListener('click', () => productForm());
    $$('[data-edit-product]').forEach(b => b.addEventListener('click', () => productForm(b.dataset.editProduct)));
    $$('[data-toggle-product]').forEach(b => b.addEventListener('click', () => {
      const p = getProduct(b.dataset.toggleProduct); p.active = !p.active; saveData(); renderProducts();
    }));
  }

  function productForm(id = null) {
    const p = id ? getProduct(id) : null;
    openModal({
      title: p ? 'Edit Produk' : 'Tambah Produk',
      body: `<form id="product-form" class="form-grid">
        <div class="field"><label>Kode Produk</label><input name="code" required value="${escapeHTML(p?.code || `BRG-${String((db.counters.product||0)+1).padStart(3,'0')}`)}"></div>
        <div class="field"><label>Nama Produk</label><input name="name" required value="${escapeHTML(p?.name || '')}"></div>
        <div class="field"><label>Kategori</label><input name="category" required value="${escapeHTML(p?.category || '')}" placeholder="Makanan, Minuman, ATK..."></div>
        <div class="field"><label>Satuan</label><input name="unit" required value="${escapeHTML(p?.unit || 'Pcs')}"></div>
        <div class="field"><label>Harga Modal</label><input type="number" min="0" name="costPrice" required value="${Number(p?.costPrice || 0)}"></div>
        <div class="field"><label>Harga Jual</label><input type="number" min="0" name="sellPrice" required value="${Number(p?.sellPrice || 0)}"></div>
        <div class="field"><label>Stok Minimum</label><input type="number" min="0" name="minStock" required value="${Number(p?.minStock ?? 5)}"></div>
        ${p ? `<div class="field"><label>Stok Saat Ini</label><input value="${Number(p.stock)}" disabled><span class="small muted">Ubah stok melalui menu Stok.</span></div>` : `<div class="field"><label>Stok Awal</label><input type="number" min="0" name="stock" required value="0"></div>`}
      </form>`,
      footer: `<button class="btn btn-outline" data-modal-close>Batal</button><button class="btn btn-primary" id="save-product">Simpan</button>`
    });
    $('#save-product').addEventListener('click', () => {
      const f = new FormData($('#product-form'));
      const data = Object.fromEntries(f.entries());
      if (!data.code?.trim() || !data.name?.trim() || !data.category?.trim()) return toast('Data belum lengkap', 'Kode, nama, dan kategori wajib diisi.', 'error');
      if (db.products.some(x => x.code.toLowerCase() === data.code.trim().toLowerCase() && x.id !== id)) return toast('Kode sudah digunakan', 'Gunakan kode produk yang berbeda.', 'error');
      if (p) {
        Object.assign(p, { code:data.code.trim(), name:data.name.trim(), category:data.category.trim(), unit:data.unit.trim(), costPrice:Number(data.costPrice), sellPrice:Number(data.sellPrice), minStock:Number(data.minStock) });
      } else {
        const stock = Number(data.stock || 0);
        const newP = { id: uid('prd'), code:data.code.trim(), name:data.name.trim(), category:data.category.trim(), unit:data.unit.trim(), costPrice:Number(data.costPrice), sellPrice:Number(data.sellPrice), minStock:Number(data.minStock), stock, active:true };
        db.products.push(newP); db.counters.product = (db.counters.product||0)+1;
        db.stockMovements.push({ id:uid('sm'), productId:newP.id, type:'opening', quantity:stock, before:0, after:stock, date:nowISO(), note:'Stok awal produk', createdBy:currentUser.id, referenceType:'opening', referenceId:null });
      }
      saveData(); closeModal(); renderProducts(); toast('Produk disimpan', 'Data produk berhasil diperbarui.', 'success');
    });
  }

  function renderStock() {
    const q = (window.__stockSearch || '').toLowerCase();
    const products = db.products.filter(p => !q || `${p.name} ${p.code}`.toLowerCase().includes(q));
    const movements = [...db.stockMovements].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 20);
    $('#page-content').innerHTML = `
      <div class="grid grid-3">
        <div class="card kpi-card"><div class="kpi-label">Total Unit Stok</div><div class="kpi-value">${number(sum(db.products,'stock'))}</div><div class="kpi-foot">Akumulasi semua produk</div></div>
        <div class="card kpi-card"><div class="kpi-label">Nilai Stok Modal</div><div class="kpi-value">${money(sum(db.products,p=>p.stock*p.costPrice))}</div><div class="kpi-foot">Estimasi berdasarkan harga modal</div></div>
        <div class="card kpi-card"><div class="kpi-label">Stok Menipis</div><div class="kpi-value">${db.products.filter(p=>p.stock<=p.minStock && p.active).length}</div><div class="kpi-foot">Produk perlu restock</div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="section-head"><div><h3>Stok Produk</h3><p>Lakukan penyesuaian stok masuk, keluar, atau koreksi</p></div></div>
        <div class="toolbar"><input id="stock-search" class="control search" placeholder="Cari produk..." value="${escapeHTML(window.__stockSearch || '')}"></div>
        <div class="table-wrap"><table><thead><tr><th>Kode</th><th>Produk</th><th>Stok</th><th>Minimum</th><th>Nilai Modal</th><th>Aksi</th></tr></thead><tbody>${products.map(p=>`<tr><td>${escapeHTML(p.code)}</td><td><strong>${escapeHTML(p.name)}</strong><br><span class="small muted">${escapeHTML(p.category)}</span></td><td>${p.stock<=p.minStock?`<span class="badge badge-danger">${p.stock} ${escapeHTML(p.unit)}</span>`:`<span class="badge badge-success">${p.stock} ${escapeHTML(p.unit)}</span>`}</td><td>${p.minStock}</td><td>${money(p.stock*p.costPrice)}</td><td><button class="btn btn-secondary btn-sm" data-adjust-stock="${p.id}">Penyesuaian</button></td></tr>`).join('')}</tbody></table></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="section-head"><div><h3>Mutasi Stok Terbaru</h3><p>20 pergerakan stok terakhir</p></div></div>
        <div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Produk</th><th>Tipe</th><th>Perubahan</th><th>Sebelum → Sesudah</th><th>Catatan</th></tr></thead><tbody>${movements.map(m=>{const p=getProduct(m.productId);return `<tr><td>${localDateTime(m.date)}</td><td>${escapeHTML(p?.name||'-')}</td><td>${stockTypeBadge(m.type)}</td><td><strong>${m.quantity>0?'+':''}${m.quantity}</strong></td><td>${m.before} → ${m.after}</td><td>${escapeHTML(m.note||'-')}</td></tr>`}).join('') || `<tr><td colspan="6"><div class="empty">Belum ada mutasi stok.</div></td></tr>`}</tbody></table></div>
      </div>`;
    $('#stock-search').addEventListener('input', e => { window.__stockSearch=e.target.value; renderStock(); });
    $$('[data-adjust-stock]').forEach(b=>b.addEventListener('click',()=>stockAdjustment(b.dataset.adjustStock)));
  }

  function stockTypeBadge(type) {
    const m = { opening:['blue','Stok Awal'], sale:['danger','Penjualan'], in:['success','Stok Masuk'], out:['warning','Stok Keluar'], correction:['purple','Koreksi'] };
    const x=m[type]||['muted',type]; return `<span class="badge badge-${x[0]}">${escapeHTML(x[1])}</span>`;
  }

  function stockAdjustment(id) {
    const p=getProduct(id);
    openModal({title:`Penyesuaian Stok – ${p.name}`,size:'sm',body:`
      <div class="stack-lg">
        <div class="info-box flex-between"><span>Stok saat ini</span><strong>${p.stock} ${escapeHTML(p.unit)}</strong></div>
        <div class="field"><label>Jenis Penyesuaian</label><select id="stock-type"><option value="in">Stok Masuk (+)</option><option value="out">Stok Keluar (−)</option><option value="correction">Koreksi ke jumlah tertentu</option></select></div>
        <div class="field"><label id="stock-qty-label">Jumlah</label><input id="stock-qty" type="number" min="0" value="1"></div>
        <div class="field"><label>Catatan</label><textarea id="stock-note" placeholder="Contoh: Restock supplier, barang rusak, hasil stock opname..."></textarea></div>
      </div>`,footer:`<button class="btn btn-outline" data-modal-close>Batal</button><button class="btn btn-primary" id="save-stock">Simpan Mutasi</button>`});
    $('#stock-type').addEventListener('change', e => { $('#stock-qty-label').textContent = e.target.value==='correction'?'Stok baru':'Jumlah'; });
    $('#save-stock').addEventListener('click',()=>{
      const type=$('#stock-type').value, qty=Number($('#stock-qty').value), note=$('#stock-note').value.trim();
      if (qty<0 || Number.isNaN(qty)) return toast('Jumlah tidak valid','','error');
      const before=p.stock; let after=before, movementQty=0;
      if(type==='in'){after=before+qty;movementQty=qty;}
      if(type==='out'){after=before-qty;movementQty=-qty;if(after<0)return toast('Stok tidak cukup','Stok tidak boleh menjadi negatif.','error');}
      if(type==='correction'){after=qty;movementQty=after-before;}
      p.stock=after;
      db.stockMovements.push({id:uid('sm'),productId:p.id,type,quantity:movementQty,before,after,date:nowISO(),note:note||'Penyesuaian stok',createdBy:currentUser.id,referenceType:'manual',referenceId:null});
      saveData();closeModal();renderStock();toast('Stok diperbarui',`${p.name}: ${before} → ${after}`,'success');
    });
  }

  function renderCustomers() {
    const q=(window.__customerSearch||'').toLowerCase();
    const rows=db.customers.filter(c=>!q||`${c.name} ${c.code} ${c.phone}`.toLowerCase().includes(q));
    $('#page-content').innerHTML=`<div class="card">
      <div class="section-head"><div><h3>Data Pelanggan</h3><p>${db.customers.length} pelanggan tersimpan</p></div><button id="add-customer" class="btn btn-primary">+ Tambah Pelanggan</button></div>
      <div class="toolbar"><input id="customer-search" class="control search" placeholder="Cari nama, kode, telepon..." value="${escapeHTML(window.__customerSearch||'')}"></div>
      <div class="table-wrap"><table><thead><tr><th>Kode</th><th>Nama</th><th>Kontak</th><th>Poin</th><th>Transaksi</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows.map(c=>{const txs=db.transactions.filter(t=>t.customerId===c.id&&t.status==='paid');return `<tr><td>${escapeHTML(c.code)}</td><td><strong>${escapeHTML(c.name)}</strong></td><td>${escapeHTML(c.phone||'-')}<br><span class="small muted">${escapeHTML(c.email||'')}</span></td><td>${number(c.points||0)}</td><td>${txs.length} • ${money(sum(txs,'total'))}</td><td>${statusBadge(c.active?'active':'inactive')}</td><td><div class="actions"><button class="btn btn-secondary btn-sm" data-view-customer="${c.id}">Riwayat</button>${c.id!=='cus_1'?`<button class="btn btn-outline btn-sm" data-edit-customer="${c.id}">Edit</button>`:''}</div></td></tr>`}).join('')||`<tr><td colspan="7"><div class="empty">Pelanggan tidak ditemukan.</div></td></tr>`}</tbody></table></div>
    </div>`;
    $('#customer-search').addEventListener('input',e=>{window.__customerSearch=e.target.value;renderCustomers();});
    $('#add-customer').addEventListener('click',()=>customerForm());
    $$('[data-edit-customer]').forEach(b=>b.addEventListener('click',()=>customerForm(b.dataset.editCustomer)));
    $$('[data-view-customer]').forEach(b=>b.addEventListener('click',()=>customerHistory(b.dataset.viewCustomer)));
  }

  function customerForm(id=null){
    const c=id?getCustomer(id):null;
    openModal({title:c?'Edit Pelanggan':'Tambah Pelanggan',body:`<form id="customer-form" class="form-grid">
      <div class="field"><label>Nama Pelanggan</label><input name="name" required value="${escapeHTML(c?.name||'')}"></div>
      <div class="field"><label>No. Telepon</label><input name="phone" value="${escapeHTML(c?.phone||'')}"></div>
      <div class="field"><label>Email</label><input name="email" type="email" value="${escapeHTML(c?.email||'')}"></div>
      <div class="field"><label>Status</label><select name="active"><option value="true" ${c?.active!==false?'selected':''}>Aktif</option><option value="false" ${c?.active===false?'selected':''}>Nonaktif</option></select></div>
    </form>`,footer:`<button class="btn btn-outline" data-modal-close>Batal</button><button class="btn btn-primary" id="save-customer">Simpan</button>`});
    $('#save-customer').addEventListener('click',()=>{
      const data=Object.fromEntries(new FormData($('#customer-form')).entries());
      if(!data.name?.trim())return toast('Nama wajib diisi','','error');
      if(c)Object.assign(c,{name:data.name.trim(),phone:data.phone.trim(),email:data.email.trim(),active:data.active==='true'});
      else db.customers.push({id:uid('cus'),code:nextCode('CUS','customer',3),name:data.name.trim(),phone:data.phone.trim(),email:data.email.trim(),points:0,balance:0,active:data.active==='true',createdAt:nowISO()});
      saveData();closeModal();renderCustomers();toast('Pelanggan disimpan','','success');
    });
  }

  function customerHistory(id){
    const c=getCustomer(id);const txs=[...db.transactions].filter(t=>t.customerId===id&&t.status==='paid').sort((a,b)=>new Date(b.date)-new Date(a.date));
    openModal({title:`Riwayat – ${c.name}`,size:'lg',body:`<div class="grid grid-3" style="margin-bottom:14px"><div class="info-box"><strong>${txs.length}</strong><br><span class="small">Transaksi</span></div><div class="info-box"><strong>${money(sum(txs,'total'))}</strong><br><span class="small">Total belanja</span></div><div class="info-box"><strong>${number(c.points||0)}</strong><br><span class="small">Poin</span></div></div><div class="table-wrap"><table><thead><tr><th>Kode</th><th>Tanggal</th><th>Item</th><th>Total</th></tr></thead><tbody>${txs.map(t=>`<tr><td>${escapeHTML(t.code)}</td><td>${localDateTime(t.date)}</td><td>${sum(t.items,'quantity')}</td><td>${money(t.total)}</td></tr>`).join('')||`<tr><td colspan="4"><div class="empty">Belum ada transaksi.</div></td></tr>`}</tbody></table></div>`});
  }

  function renderPayments(){
    const q=(window.__paymentSearch||'').toLowerCase();
    const method=window.__paymentMethod||'all';
    const rows=[...db.payments].sort((a,b)=>new Date(b.date)-new Date(a.date)).filter(p=>{
      const t=getTransaction(p.transactionId);return (method==='all'||p.method===method)&&(!q||`${t?.code||''} ${p.referenceNo||''} ${methodLabel(p.method)}`.toLowerCase().includes(q));
    });
    $('#page-content').innerHTML=`<div class="grid grid-4" style="margin-bottom:16px">${['cash','qris','transfer','card'].map(m=>`<div class="card kpi-card"><div class="kpi-label">${escapeHTML(methodLabel(m))}</div><div class="kpi-value" style="font-size:22px">${money(sum(db.payments.filter(p=>p.method===m&&p.status==='paid'),'amount'))}</div><div class="kpi-foot">${db.payments.filter(p=>p.method===m&&p.status==='paid').length} pembayaran</div></div>`).join('')}</div>
    <div class="card"><div class="section-head"><div><h3>Riwayat Pembayaran</h3><p>Semua pembayaran transaksi</p></div></div><div class="toolbar"><input id="payment-search" class="control search" placeholder="Cari kode transaksi / referensi..." value="${escapeHTML(window.__paymentSearch||'')}"><select id="payment-method" class="control" style="max-width:190px"><option value="all">Semua metode</option>${['cash','qris','transfer','card'].map(m=>`<option value="${m}" ${method===m?'selected':''}>${methodLabel(m)}</option>`).join('')}</select></div><div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Transaksi</th><th>Metode</th><th>Tagihan</th><th>Dibayar</th><th>Kembalian</th><th>Referensi</th><th>Status</th></tr></thead><tbody>${rows.map(p=>{const t=getTransaction(p.transactionId);return `<tr><td>${localDateTime(p.date)}</td><td><strong>${escapeHTML(t?.code||'-')}</strong></td><td>${statusBadge(p.method)}</td><td>${money(p.amount)}</td><td>${money(p.paid)}</td><td>${money(p.change)}</td><td>${escapeHTML(p.referenceNo||'-')}</td><td>${statusBadge(p.status)}</td></tr>`}).join('')||`<tr><td colspan="8"><div class="empty">Pembayaran tidak ditemukan.</div></td></tr>`}</tbody></table></div></div>`;
    $('#payment-search').addEventListener('input',e=>{window.__paymentSearch=e.target.value;renderPayments();});
    $('#payment-method').addEventListener('change',e=>{window.__paymentMethod=e.target.value;renderPayments();});
  }

  function renderReceipts(){
    const q=(window.__receiptSearch||'').toLowerCase();
    const rows=[...db.receipts].sort((a,b)=>new Date(b.printedAt)-new Date(a.printedAt)).filter(r=>{const t=getTransaction(r.transactionId);return !q||`${r.number} ${t?.code||''}`.toLowerCase().includes(q)});
    $('#page-content').innerHTML=`<div class="card"><div class="section-head"><div><h3>Arsip Struk</h3><p>Cetak ulang struk transaksi kapan saja</p></div></div><div class="toolbar"><input id="receipt-search" class="control search" placeholder="Cari nomor struk / transaksi..." value="${escapeHTML(window.__receiptSearch||'')}"></div><div class="table-wrap"><table><thead><tr><th>No. Struk</th><th>Transaksi</th><th>Tanggal</th><th>Pelanggan</th><th>Total</th><th>Kasir</th><th>Aksi</th></tr></thead><tbody>${rows.map(r=>{const t=getTransaction(r.transactionId),c=getCustomer(t?.customerId),u=getUser(t?.userId);return `<tr><td><strong>${escapeHTML(r.number)}</strong></td><td>${escapeHTML(t?.code||'-')}</td><td>${localDateTime(r.printedAt)}</td><td>${escapeHTML(c?.name||'-')}</td><td>${money(t?.total||0)}</td><td>${escapeHTML(u?.fullName||'-')}</td><td><button class="btn btn-secondary btn-sm" data-show-receipt="${r.transactionId}">Lihat / Cetak</button></td></tr>`}).join('')||`<tr><td colspan="7"><div class="empty">Struk tidak ditemukan.</div></td></tr>`}</tbody></table></div></div>`;
    $('#receipt-search').addEventListener('input',e=>{window.__receiptSearch=e.target.value;renderReceipts();});
    $$('[data-show-receipt]').forEach(b=>b.addEventListener('click',()=>showReceipt(b.dataset.showReceipt)));
  }

  function shiftSales(shiftId){return db.transactions.filter(t=>t.shiftId===shiftId&&t.status==='paid');}
  function shiftCashSales(shiftId){const ids=new Set(shiftSales(shiftId).map(t=>t.id));return sum(db.payments.filter(p=>ids.has(p.transactionId)&&p.method==='cash'),'amount');}
  function shiftExpected(sh){const cashSales=shiftCashSales(sh.id);const cashIn=sum((sh.cashMovements||[]).filter(x=>x.type==='in'),'amount');const cashOut=sum((sh.cashMovements||[]).filter(x=>x.type==='out'),'amount');return Number(sh.openingBalance||0)+cashSales+cashIn-cashOut;}

  function renderShift(){
    const sh=activeShift();const history=[...db.shifts].filter(x=>x.userId===currentUser.id).sort((a,b)=>new Date(b.startTime)-new Date(a.startTime));
    if(sh){const txs=shiftSales(sh.id),expected=shiftExpected(sh);$('#page-content').innerHTML=`
      <div class="shift-hero"><div class="muted">Shift aktif sejak ${localDateTime(sh.startTime)}</div><div class="big">${money(expected)}</div><div>Estimasi kas fisik saat ini</div></div>
      <div class="grid grid-4" style="margin-top:16px"><div class="card kpi-card"><div class="kpi-label">Saldo Awal</div><div class="kpi-value" style="font-size:23px">${money(sh.openingBalance)}</div></div><div class="card kpi-card"><div class="kpi-label">Penjualan Shift</div><div class="kpi-value" style="font-size:23px">${money(sum(txs,'total'))}</div><div class="kpi-foot">${txs.length} transaksi</div></div><div class="card kpi-card"><div class="kpi-label">Penjualan Tunai</div><div class="kpi-value" style="font-size:23px">${money(shiftCashSales(sh.id))}</div></div><div class="card kpi-card"><div class="kpi-label">Kas Masuk/Keluar</div><div class="kpi-value" style="font-size:23px">${money(sum((sh.cashMovements||[]).filter(x=>x.type==='in'),'amount')-sum((sh.cashMovements||[]).filter(x=>x.type==='out'),'amount'))}</div></div></div>
      <div class="grid grid-2" style="margin-top:16px;align-items:start"><div class="card"><div class="section-head"><div><h3>Mutasi Kas Shift</h3><p>Catat kas di luar transaksi penjualan</p></div><button id="add-cash-movement" class="btn btn-secondary btn-sm">+ Mutasi Kas</button></div><div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Tipe</th><th>Nominal</th><th>Catatan</th></tr></thead><tbody>${(sh.cashMovements||[]).slice().reverse().map(m=>`<tr><td>${localDateTime(m.date)}</td><td>${m.type==='in'?'<span class="badge badge-success">Masuk</span>':'<span class="badge badge-warning">Keluar</span>'}</td><td>${money(m.amount)}</td><td>${escapeHTML(m.note||'-')}</td></tr>`).join('')||`<tr><td colspan="4"><div class="empty">Belum ada mutasi kas.</div></td></tr>`}</tbody></table></div></div><div class="card"><div class="section-head"><div><h3>Tutup Shift</h3><p>Rekonsiliasi kas akhir shift</p></div></div><div class="summary-lines"><div class="summary-line"><span>Saldo awal</span><strong>${money(sh.openingBalance)}</strong></div><div class="summary-line"><span>Penjualan tunai</span><strong>${money(shiftCashSales(sh.id))}</strong></div><div class="summary-line total"><span>Kas seharusnya</span><strong>${money(expected)}</strong></div></div><button id="close-shift" class="btn btn-danger btn-block">Tutup Shift</button></div></div>`;
      $('#add-cash-movement').addEventListener('click',()=>cashMovementForm(sh.id));$('#close-shift').addEventListener('click',()=>closeShiftForm(sh.id));
    }else{$('#page-content').innerHTML=`<div class="card" style="max-width:620px"><div class="section-head"><div><h3>Buka Shift Kas</h3><p>Masukkan modal kas awal sebelum mulai transaksi</p></div></div><div class="field" style="max-width:320px"><label>Saldo Awal</label><input id="opening-balance" type="number" min="0" step="10000" value="300000"></div><button id="open-shift" class="btn btn-success" style="margin-top:14px">Buka Shift Sekarang</button></div>`;$('#open-shift').addEventListener('click',()=>{const bal=Number($('#opening-balance').value||0);db.shifts.push({id:uid('sh'),userId:currentUser.id,startTime:nowISO(),endTime:null,openingBalance:bal,actualBalance:null,status:'open',cashMovements:[]});saveData();updateShiftBadge();renderShift();toast('Shift dibuka',`Saldo awal ${money(bal)}`,'success');});}
    $('#page-content').insertAdjacentHTML('beforeend',`<div class="card" style="margin-top:16px"><div class="section-head"><div><h3>Riwayat Shift Saya</h3><p>Shift terbaru pengguna ini</p></div></div><div class="table-wrap"><table><thead><tr><th>Mulai</th><th>Selesai</th><th>Saldo Awal</th><th>Kas Seharusnya</th><th>Kas Aktual</th><th>Selisih</th><th>Status</th></tr></thead><tbody>${history.slice(0,12).map(s=>{const expected=s.status==='open'?shiftExpected(s):(s.expectedBalance??shiftExpected(s));return `<tr><td>${localDateTime(s.startTime)}</td><td>${s.endTime?localDateTime(s.endTime):'-'}</td><td>${money(s.openingBalance)}</td><td>${money(expected)}</td><td>${s.actualBalance==null?'-':money(s.actualBalance)}</td><td>${s.difference==null?'-':money(s.difference)}</td><td>${statusBadge(s.status)}</td></tr>`}).join('')||`<tr><td colspan="7"><div class="empty">Belum ada riwayat shift.</div></td></tr>`}</tbody></table></div></div>`);
  }

  function cashMovementForm(shiftId){const sh=db.shifts.find(x=>x.id===shiftId);openModal({title:'Tambah Mutasi Kas',size:'sm',body:`<div class="stack-lg"><div class="field"><label>Tipe</label><select id="cash-type"><option value="in">Kas Masuk</option><option value="out">Kas Keluar</option></select></div><div class="field"><label>Nominal</label><input id="cash-amount" type="number" min="0" step="1000" value="0"></div><div class="field"><label>Catatan</label><textarea id="cash-note" placeholder="Contoh: Tambah modal kecil, biaya parkir, pembelian kebutuhan..."></textarea></div></div>`,footer:`<button class="btn btn-outline" data-modal-close>Batal</button><button id="save-cash-movement" class="btn btn-primary">Simpan</button>`});$('#save-cash-movement').addEventListener('click',()=>{const amount=Number($('#cash-amount').value||0);if(amount<=0)return toast('Nominal harus lebih dari 0','','error');sh.cashMovements=sh.cashMovements||[];sh.cashMovements.push({id:uid('cash'),type:$('#cash-type').value,amount,date:nowISO(),note:$('#cash-note').value.trim()});saveData();closeModal();renderShift();toast('Mutasi kas disimpan','','success');});}

  function closeShiftForm(shiftId){const sh=db.shifts.find(x=>x.id===shiftId),expected=shiftExpected(sh);openModal({title:'Tutup Shift',size:'sm',body:`<div class="stack-lg"><div class="info-box flex-between"><span>Kas seharusnya</span><strong>${money(expected)}</strong></div><div class="field"><label>Kas aktual hasil hitung</label><input id="actual-cash" type="number" min="0" step="1000" value="${expected}"></div><div class="summary-lines"><div class="summary-line"><span>Selisih</span><strong id="cash-diff">${money(0)}</strong></div></div><div class="warning-box">Pastikan uang fisik sudah dihitung sebelum menutup shift. Shift yang ditutup tidak dapat dibuka kembali.</div></div>`,footer:`<button class="btn btn-outline" data-modal-close>Batal</button><button id="confirm-close-shift" class="btn btn-danger">Tutup Shift</button>`});$('#actual-cash').addEventListener('input',e=>{$('#cash-diff').textContent=money(Number(e.target.value||0)-expected)});$('#confirm-close-shift').addEventListener('click',()=>{const actual=Number($('#actual-cash').value||0);sh.endTime=nowISO();sh.status='closed';sh.expectedBalance=expected;sh.actualBalance=actual;sh.difference=actual-expected;saveData();closeModal();updateShiftBadge();renderShift();toast('Shift ditutup',`Selisih ${money(sh.difference)}`,'success');});}

  function renderReports(){
    const end=window.__reportEnd||localDateKey();const sd=new Date();sd.setDate(sd.getDate()-6);const start=window.__reportStart||localDateKey(sd);const txs=transactionsInRange(start,end);const sales=sum(txs,'total'),discount=sum(txs,'discount'),items=sum(txs,t=>sum(t.items,'quantity'));const avg=txs.length?sales/txs.length:0;
    const prodMap={};txs.forEach(t=>t.items.forEach(i=>{if(!prodMap[i.productId])prodMap[i.productId]={name:i.productName,qty:0,sales:0};prodMap[i.productId].qty+=i.quantity;prodMap[i.productId].sales+=i.subtotal;}));const top=Object.values(prodMap).sort((a,b)=>b.sales-a.sales);
    $('#page-content').innerHTML=`<div class="card" style="margin-bottom:16px"><div class="toolbar" style="margin-bottom:0"><div class="field"><label>Dari</label><input id="report-start" type="date" value="${start}"></div><div class="field"><label>Sampai</label><input id="report-end" type="date" value="${end}"></div><button id="apply-report" class="btn btn-primary" style="align-self:end">Terapkan</button><button id="export-report" class="btn btn-outline" style="align-self:end">Export CSV</button></div></div>
      <div class="grid grid-4"><div class="card kpi-card"><div class="kpi-label">Total Penjualan</div><div class="kpi-value" style="font-size:23px">${money(sales)}</div><div class="kpi-foot">Periode ${localDate(start)} – ${localDate(end)}</div></div><div class="card kpi-card"><div class="kpi-label">Transaksi</div><div class="kpi-value">${txs.length}</div><div class="kpi-foot">Rata-rata ${money(avg)}</div></div><div class="card kpi-card"><div class="kpi-label">Item Terjual</div><div class="kpi-value">${items}</div><div class="kpi-foot">Total kuantitas</div></div><div class="card kpi-card"><div class="kpi-label">Total Diskon</div><div class="kpi-value" style="font-size:23px">${money(discount)}</div><div class="kpi-foot">Potongan transaksi</div></div></div>
      <div class="grid grid-2" style="margin-top:16px;align-items:start"><div class="card"><div class="section-head"><div><h3>Produk Terlaris</h3><p>Berdasarkan omzet pada periode</p></div></div><div class="table-wrap"><table><thead><tr><th>Produk</th><th>Qty</th><th>Omzet</th></tr></thead><tbody>${top.map(x=>`<tr><td>${escapeHTML(x.name)}</td><td>${x.qty}</td><td>${money(x.sales)}</td></tr>`).join('')||`<tr><td colspan="3"><div class="empty">Belum ada data penjualan.</div></td></tr>`}</tbody></table></div></div><div class="card"><div class="section-head"><div><h3>Transaksi Periode</h3><p>${txs.length} transaksi ditemukan</p></div></div><div class="table-wrap"><table><thead><tr><th>Kode</th><th>Tanggal</th><th>Kasir</th><th>Total</th></tr></thead><tbody>${[...txs].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(t=>`<tr><td>${escapeHTML(t.code)}</td><td>${localDateTime(t.date)}</td><td>${escapeHTML(getUser(t.userId)?.fullName||'-')}</td><td>${money(t.total)}</td></tr>`).join('')||`<tr><td colspan="4"><div class="empty">Belum ada transaksi.</div></td></tr>`}</tbody></table></div></div></div>`;
    $('#apply-report').addEventListener('click',()=>{window.__reportStart=$('#report-start').value;window.__reportEnd=$('#report-end').value;renderReports();});
    $('#export-report').addEventListener('click',()=>exportReportCSV(txs,start,end));
  }

  function exportReportCSV(txs,start,end){
    const rows=[['Kode Transaksi','Tanggal','Pelanggan','Kasir','Metode Pembayaran','Subtotal','Diskon','Pajak','Total']];
    txs.forEach(t=>{const p=getPaymentByTransaction(t.id);rows.push([t.code,localDateTime(t.date),getCustomer(t.customerId)?.name||'',getUser(t.userId)?.fullName||'',methodLabel(p?.method||''),t.subtotal,t.discount,t.tax,t.total]);});
    const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`laporan-penjualan-${start}-sd-${end}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Laporan diekspor','File CSV menggunakan pemisah titik koma (;).','success');
  }

  function renderUsers(){
    $('#page-content').innerHTML=`<div class="card"><div class="section-head"><div><h3>Pengguna Sistem</h3><p>Kelola akun dan hak akses</p></div><button id="add-user" class="btn btn-primary">+ Tambah User</button></div><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Role</th><th>Status</th><th>Dibuat</th><th>Aksi</th></tr></thead><tbody>${db.users.map(u=>`<tr><td><strong>${escapeHTML(u.fullName)}</strong></td><td>${escapeHTML(u.username)}</td><td><span class="badge badge-purple">${escapeHTML(roleLabel(u.role))}</span></td><td>${statusBadge(u.active?'active':'inactive')}</td><td>${localDate(u.createdAt)}</td><td><div class="actions"><button class="btn btn-secondary btn-sm" data-edit-user="${u.id}">Edit</button>${u.id!==currentUser.id?`<button class="btn btn-outline btn-sm" data-toggle-user="${u.id}">${u.active?'Nonaktifkan':'Aktifkan'}</button>`:''}</div></td></tr>`).join('')}</tbody></table></div></div><div class="danger-box" style="margin-top:16px"><strong>Data demo:</strong> password disimpan di localStorage browser tanpa enkripsi. Untuk aplikasi produksi, autentikasi harus dipindahkan ke backend dan password wajib di-hash.</div>`;
    $('#add-user').addEventListener('click',()=>userForm());$$('[data-edit-user]').forEach(b=>b.addEventListener('click',()=>userForm(b.dataset.editUser)));$$('[data-toggle-user]').forEach(b=>b.addEventListener('click',()=>{const u=getUser(b.dataset.toggleUser);u.active=!u.active;saveData();renderUsers();}));
  }

  function roleLabel(role){return ({admin:'Admin',manager:'Manager',cashier:'Kasir'})[role]||role;}
  function userForm(id=null){const u=id?getUser(id):null;openModal({title:u?'Edit User':'Tambah User',body:`<form id="user-form" class="form-grid"><div class="field"><label>Nama Lengkap</label><input name="fullName" required value="${escapeHTML(u?.fullName||'')}"></div><div class="field"><label>Username</label><input name="username" required value="${escapeHTML(u?.username||'')}"></div><div class="field"><label>Password ${u?'(kosongkan jika tidak diubah)':''}</label><input name="password" type="password" ${u?'':'required'}></div><div class="field"><label>Role</label><select name="role"><option value="cashier" ${u?.role==='cashier'?'selected':''}>Kasir</option><option value="manager" ${u?.role==='manager'?'selected':''}>Manager</option><option value="admin" ${u?.role==='admin'?'selected':''}>Admin</option></select></div></form>`,footer:`<button class="btn btn-outline" data-modal-close>Batal</button><button id="save-user" class="btn btn-primary">Simpan</button>`});$('#save-user').addEventListener('click',()=>{const d=Object.fromEntries(new FormData($('#user-form')).entries());if(!d.fullName.trim()||!d.username.trim()||(!u&&!d.password))return toast('Data belum lengkap','','error');if(db.users.some(x=>x.username.toLowerCase()===d.username.trim().toLowerCase()&&x.id!==id))return toast('Username sudah digunakan','','error');if(u){u.fullName=d.fullName.trim();u.username=d.username.trim();u.role=d.role;if(d.password)u.password=d.password;}else db.users.push({id:uid('usr'),username:d.username.trim(),password:d.password,fullName:d.fullName.trim(),role:d.role,active:true,createdAt:nowISO()});saveData();closeModal();renderUsers();toast('User disimpan','','success');});}

  function bindGlobalEvents(){
    $('#login-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(!login(f.get('username').trim(),f.get('password')))toast('Login gagal','Username/password salah atau akun nonaktif.','error');});
    $('#logout-btn').addEventListener('click',logout);
    $('#quick-pos-btn').addEventListener('click',()=>navigate('pos'));
    $('#sidebar-open').addEventListener('click',()=>$('#sidebar').classList.add('open'));
    $('#sidebar-close').addEventListener('click',()=>$('#sidebar').classList.remove('open'));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();navigate('pos');setTimeout(()=>$('#pos-search')?.focus(),50);}});
  }

  bindGlobalEvents();
  restoreSession();
})();
