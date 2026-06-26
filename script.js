// Localization strings data matrix engine block
const DICTIONARY = {
    hu: {
        "nav-products": "Kínálatunk", "nav-calc": "Kosár Kalkulátor", "nav-contact": "Kapcsolat", "nav-reserve": "Félretétel",
        "hero-loc": "Budapest, Blaha Lujza tér",
        "hero-title": "KIEGÉSZÍTŐK.",
        "hero-sub": "Prémium okostelefon kiegészítők, tokok, audio kiegészítők és SIM kártyák a Blaha Lujza tér szívében. Minőség azonnal raktárról, versenyképes árakon.",
        "hero-browse": "Böngészés →",
        "hero-wf-sub": "PRÉMIUM KIEGÉSZÍTŐK",
        "cat-tag": "[ KATEGÓRIÁK ]", "cat-title": "Kiemelt Termékeink", "cat-sub": "Válogatott, minőségi kiegészítők azonnal a készletünkről",
        "calc-tag": "[ KOSÁR ]", "calc-title": "Tartozék Árkalkulátor", "calc-sub": "Állítsd össze a csomagod, és nézd meg az azonnali végösszeget.",
        "calc-instruction": "Kattints a kiegészítőkre a hozzáadáshoz:",
        "rec-title": "Kosár Összegzés", "rec-status": "Átvétel helye:", "rec-shop": "Üzletünkben (Azonnal)",
        "rec-total": "Fizetendő:", "rec-submit": "Termékek Félretétele",
        "rec-disc": "A kiválasztott termékeket 24 órára félretesszük az Ön nevére az üzletben.",
        "foot-sub": "Az Ön megbízható GSM tartozék és kiegészítő boltja Budapest szívében. Átlátható, fix árak és hatalmas azonnali raktárkészlet.",
        "foot-loc-sub": "(A Blaha Lujza tér közvetlen közelében, a 4-es/6-os villamosvonal mentén)",
        "foot-hours": "🕒 Nyitvatartási Idő", "days-wk": "Hétfő - Szombat", "days-su": "Vasárnap", "closed": "Zárva",
        "dash-status": "ÜZLET STÁTUSZ:", "dash-stock": "KÉSZLET ERŐSSÉG:", "success": "✓ Sikeresen félretéve! Várunk."
    },
    en: {
        "nav-products": "Stock", "nav-calc": "Cart Calculator", "nav-contact": "Contact", "nav-reserve": "Hold Items",
        "hero-loc": "Budapest, Blaha Lujza square",
        "hero-title": "ACCESSORIES.",
        "hero-sub": "Premium smartphone configurations, heavy-duty armor shells, audio devices, and local prepaid SIM lines directly at the Blaha hub.",
        "hero-browse": "Browse Gear →",
        "hero-wf-sub": "PREMIUM PROTECTIVE KIT",
        "cat-tag": "[ CATEGORIES ]", "cat-title": "Boutique Inventory", "cat-sub": "Curated premium items sourced and ready for instant pickup",
        "calc-tag": "[ CART ]", "calc-title": "Gear Price Engine", "calc-sub": "Combine your setup parameters to monitor your total hardware ticket cost instantly.",
        "calc-instruction": "Click on elements to add them to your order:",
        "rec-title": "Cart Summary", "rec-status": "Pickup Window:", "rec-shop": "In-Store (Instant)",
        "rec-total": "Total Amount:", "rec-submit": "Hold My Gear",
        "rec-disc": "Your selected parts configurations will be locked on our reserve shelves for 24 hours.",
        "foot-sub": "Your transparent GSM hardware utility link at the core of Budapest. Flat rates, friendly desk staff, and wide availability matrices.",
        "foot-loc-sub": "(Directly adjacent to the Blaha Lujza intersection, right off Trams 4 and 6)",
        "foot-hours": "🕒 Boutique Hours", "days-wk": "Monday - Saturday", "days-su": "Sunday", "closed": "Closed",
        "dash-status": "SHOP STATUS:", "dash-stock": "DEPOT VOLUME:", "success": "✓ Reserved successfully! See you."
    }
};

// Target Inventory Price Points Configuration
const ACCESSORY_PRODUCTS = [
    { id: 'case', name_hu: 'Prémium Telefon Tok', name_en: 'Premium Phone Case', price: 3000 },
    { id: 'cable', name_hu: 'Gyorstöltő Kábel', name_en: 'Fast Charging Cable', price: 4000 },
    { id: 'headphones', name_hu: 'TWS Fülhallgató / Headset', name_en: 'TWS Wireless Earbuds', price: 6000 },
    { id: 'sim', name_hu: 'SIM Kártya Csomag', name_en: 'Prepaid SIM Card Pack', price: 2500 },
    { id: 'glass', name_hu: '9H Kijelzővédő Üvegfólia', name_en: '9H Tempered Glass Shield', price: 3000 },
    { id: 'charger-head', name_hu: '25W PD Gyorstöltő Fej', name_en: '25W PD Power Brick', price: 5500 }
];

// App Configurations Engine States
let activeLanguage = 'hu';
let selectedProductIds = [];

// Cache Elements Nodes References
const langToggleBtn = document.getElementById('lang-toggle');
const itemsContainer = document.getElementById('accessory-list');
const receiptItemsList = document.getElementById('receipt-items-list');
const receiptPrice = document.getElementById('receipt-price');
const bookBtn = document.getElementById('book-btn');

function init() {
    setupLanguageEngine();
    setupThemeSwitchingMatrix();
    renderInteractiveProductSelectors();
    updateReceiptEngine();
}

function syncUIStrings() {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (DICTIONARY[activeLanguage][key]) {
            element.textContent = DICTIONARY[activeLanguage][key];
        }
    });
}

function setupLanguageEngine() {
    langToggleBtn.addEventListener('click', () => {
        activeLanguage = activeLanguage === 'hu' ? 'en' : 'hu';
        langToggleBtn.textContent = activeLanguage === 'hu' ? 'EN' : 'HU';
        syncUIStrings();
        renderInteractiveProductSelectors();
        updateReceiptEngine();
        resetReservationButton();
    });
    syncUIStrings();
}

function setupThemeSwitchingMatrix() {
    document.querySelectorAll('[data-theme-trigger]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTheme = btn.getAttribute('data-theme-trigger');
            
            // Set body theme matrix configuration tokens
            document.body.setAttribute('data-theme', targetTheme);
            
            // Toggle panel indicators
            document.querySelectorAll('[data-theme-trigger]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            resetReservationButton();
        });
    });
}

function renderInteractiveProductSelectors() {
    itemsContainer.innerHTML = '';
    
    ACCESSORY_PRODUCTS.forEach(prod => {
        const isSelected = selectedProductIds.includes(prod.id);
        const name = activeLanguage === 'hu' ? prod.name_hu : prod.name_en;
        
        const row = document.createElement('div');
        row.className = `repair-item ${isSelected ? 'selected' : ''}`;
        row.innerHTML = `
            <span>${name}</span>
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-family:var(--font-mono); font-weight:700;">${prod.price.toLocaleString('hu-HU')} Ft</span>
                <div class="checkbox-indicator"></div>
            </div>
        `;
        
        row.addEventListener('click', () => {
            if (selectedProductIds.includes(prod.id)) {
                selectedProductIds = selectedProductIds.filter(id => id !== prod.id);
            } else {
                selectedProductIds.push(prod.id);
            }
            renderInteractiveProductSelectors();
            updateReceiptEngine();
            resetReservationButton();
        });
        
        itemsContainer.appendChild(row);
    });
}

function updateReceiptEngine() {
    receiptItemsList.innerHTML = '';
    let runningTotal = 0;
    
    ACCESSORY_PRODUCTS.forEach(prod => {
        if (selectedProductIds.includes(prod.id)) {
            runningTotal += prod.price;
            const name = activeLanguage === 'hu' ? prod.name_hu : prod.name_en;
            
            const row = document.createElement('div');
            row.className = 'receipt-row';
            row.innerHTML = `
                <span class="label">${name}</span>
                <span class="value">${prod.price.toLocaleString('hu-HU')} Ft</span>
            `;
            receiptItemsList.appendChild(row);
        }
    });
    
    if (selectedProductIds.length === 0) {
        receiptItemsList.innerHTML = `
            <div class="receipt-row">
                <span class="label" style="font-style: italic; color: var(--text-dark-muted);">[ Empty Cart / Üres Kosár ]</span>
            </div>
        `;
    }
    
    receiptPrice.textContent = `${runningTotal.toLocaleString('hu-HU')} Ft`;
}

bookBtn.addEventListener('click', () => {
    bookBtn.style.backgroundColor = '#10B981';
    bookBtn.style.color = '#FFF';
    bookBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
    bookBtn.textContent = DICTIONARY[activeLanguage]['success'];
    bookBtn.style.pointerEvents = 'none';
});

function resetReservationButton() {
    bookBtn.style.backgroundColor = 'var(--accent-theme-main)';
    bookBtn.style.color = '#0d0e12';
    bookBtn.style.boxShadow = '0 4px 15px var(--accent-theme-glow)';
    bookBtn.textContent = DICTIONARY[activeLanguage]['rec-submit'];
    bookBtn.style.pointerEvents = 'auto';
}

document.addEventListener('DOMContentLoaded', init);