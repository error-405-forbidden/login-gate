const TOTP_SECRET = "JBSWY3DPEHPK3PXP";
const TARGET_EMAIL = "cogweb39@gmail.com";
const PASS_HASH = "b58728956973347514930b5993850125749f7e81255e63013233c7069777174e";

let DB = { sites: [], servers: [], registrars: [], domains: [] };

// --- 認証機能 ---
function handleInitialAuth() {
    const email = document.getElementById('l-email').value.trim();
    const pass = document.getElementById('l-pass').value.trim();
    if (email === TARGET_EMAIL && CryptoJS.SHA256(pass).toString() === PASS_HASH) {
        sessionStorage.setItem('tempKey', pass);
        document.getElementById('auth-fields').style.display = 'none';
        document.getElementById('2fa-fields').style.display = 'block';
    } else {
        document.getElementById('l-err').innerText = "認証に失敗しました";
    }
}

function verify2FA() {
    const code = document.getElementById('l-2fa').value.trim();
    const totp = new jsOTP.totp();
    if (code === totp.getOtp(TOTP_SECRET)) {
        sessionStorage.setItem('masterKey', sessionStorage.getItem('tempKey'));
        window.location.href = 'dashboard.html';
    } else { alert("コードが違います"); }
}

function logout() { sessionStorage.clear(); window.location.href = 'index.html'; }

// --- データ操作 ---
function loadDB() {
    const key = sessionStorage.getItem('masterKey');
    const raw = localStorage.getItem('alumina_vFinal_Full');
    if(raw && key) {
        try {
            const dec = CryptoJS.AES.decrypt(raw, key).toString(CryptoJS.enc.Utf8);
            DB = JSON.parse(dec);
        } catch(e) { logout(); }
    }
}

function saveDB() {
    const key = sessionStorage.getItem('masterKey');
    localStorage.setItem('alumina_vFinal_Full', CryptoJS.AES.encrypt(JSON.stringify(DB), key).toString());
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    document.getElementById('p-' + id).classList.add('active-page');
    if(document.getElementById('nav-' + id)) document.getElementById('nav-' + id).classList.add('active');
}

// 簡易的な表示更新（必要に応じて拡張）
function refreshUI() {
    const sQ = document.getElementById('q-site')?.value.toLowerCase() || "";
    const list = document.getElementById('t-site');
    if(list) {
        list.innerHTML = DB.sites.filter(x => (x.url + x.name).toLowerCase().includes(sQ)).map(x => `
            <tr onclick="openDetail('site', ${x.id})"><td>${x.url}</td><td>${x.name}</td><td>${x.short || ''}</td><td>${new Date().toLocaleDateString()}</td></tr>
        `).join('');
    }
    if(document.getElementById('c-site')) {
        document.getElementById('c-site').innerText = DB.sites.length;
        document.getElementById('c-sv').innerText = DB.servers.length;
        document.getElementById('c-dm').innerText = DB.domains.length;
    }
}

// モーダルと編集機能のロジック（以下略、以前の機能を継承）
