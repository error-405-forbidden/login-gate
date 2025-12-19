// --- 認証設定 ---
const TOTP_SECRET = "JBSWY3DPEHPK3PXP";
const TARGET_EMAIL = "cogweb39@gmail.com";
const PASS_HASH = "b58728956973347514930b5993850125749f7e81255e63013233c7069777174e"; // CogWeb#Alumina!2025

let DB = { sites: [], servers: [], registrars: [], domains: [] };

// ログイン処理
function handleInitialAuth() {
    const email = document.getElementById('l-email').value.trim();
    const pass = document.getElementById('l-pass').value.trim();
    if (email === TARGET_EMAIL && CryptoJS.SHA256(pass).toString() === PASS_HASH) {
        // パスワードを一時的にセッションに保存（復号鍵として使用）
        sessionStorage.setItem('tempKey', pass);
        document.getElementById('auth-fields').style.display = 'none';
        document.getElementById('2fa-fields').style.display = 'block';
    } else {
        document.getElementById('l-err').innerText = "認証失敗";
    }
}

function verify2FA() {
    const code = document.getElementById('l-2fa').value.trim();
    const totp = new jsOTP.totp();
    if (code === totp.getOtp(TOTP_SECRET)) {
        sessionStorage.setItem('masterKey', sessionStorage.getItem('tempKey'));
        window.location.href = 'dashboard.html'; // 管理画面へ
    } else {
        alert("コードが違います");
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// --- データ操作 (以前のsaveData, refreshUI等をここに配置) ---
function loadDB() {
    const key = sessionStorage.getItem('masterKey');
    const raw = localStorage.getItem('alumina_vFinal_Full');
    if(raw && key) {
        const dec = CryptoJS.AES.decrypt(raw, key).toString(CryptoJS.enc.Utf8);
        DB = JSON.parse(dec);
    }
}
