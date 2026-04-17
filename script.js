// --- 基礎數據 ---
const pricingData = [
    { range: "2坪內", kw: "2.2", split: 4500, window: 1500 },
    { range: "2~4坪", kw: "2.8", split: 4500, window: 1800 },
    { range: "4~6坪", kw: "3.6", split: 5000, window: 2000 },
    { range: "6~7坪", kw: "4.1", split: 5500, window: 2500 },
    { range: "8~9坪", kw: "5.0", split: 6000, window: 2800 },
    { range: "9~10坪", kw: "6.3", split: 6000, window: 3000 },
    { range: "10~12坪", kw: "7.1~8.0", split: 7000, window: 3500 },
    { range: "12~15坪", kw: "9.0", split: 9000, window: 0 },
    { range: "15~18坪", kw: "11", split: 12000, window: 0 }
];

const brands = {
    "大金DAIKIN": ["橫綱Z系列", "大關Z系列", "豪菁Z系列"],
    "日立HITACHI": ["尊榮NTB冷暖系列", "頂級NP冷暖系列", "頂級JP冷專系列", "旗艦HP冷暖系列", "旗艦QP冷專系列", "精品YP冷暖系列", "精品SP冷專系列", "豪華VP冷暖系列", "NR1窗型變頻冷暖系列", "JR1窗型變頻冷專系列", "QR窗型變頻冷專系列", "HR窗型變頻冷暖系列"],
    "PANASONIC": ["VX極致旗艦冷暖系列", "UX頂級旗艦冷暖系列", "UX旗艦冷暖系列", "UX旗艦冷專系列", "UJ精緻冷暖系列", "UJ精緻冷專系列", "K系列冷暖系列", "K系列冷專系列", "UK標準冷暖系列", "UK標準冷專系列", "Y舒適冷暖系列", "U系列窗型變頻冷暖右吹", "U系列窗型變頻冷專右吹", "U系列窗型變頻冷暖左吹", "U系列窗型變頻冷專左吹"],
    "日本將軍": ["高級KGTB冷暖系列", "優級KMTC冷暖系列", "優級CMTD冷專系列"],
    "三菱電機": ["靜音大師GA冷暖系列", "靜音大師GA冷專系列", "靜音大師HA冷暖系列", "靜音大師HW冷專系列"],
    "三菱重工": ["晴空ZST2冷暖", "未來ZSXT2冷暖系列", "晴空ZST冷暖系列", "晴空YVST冷專系列", "晴空YXST冷專系列", "朝 日ZTLT冷暖系列"],
    "SAMPO聲寶": ["旗艦PH冷暖系列", "旗艦NH冷暖系列", "優選HF冷專系列", "新經典VF系列", "RH系列窗型變頻冷暖右吹", "LH系列窗型變頻冷暖右吹"],
    "RECHI瑞智": ["HA系列分離式冷暖空調", "HA系列變頻窗型冷專右吹"],
    "CHIMEI奇美": ["HT5星爵冷暖系列", "HG1星緻冷暖系列", "HA1星雅冷暖系列", "HK1星揚冷暖系列", "HW星光冷暖窗型變頻右吹"],
    "HERAN禾聯": ["尊榮型SL冷暖系列", "尊榮型SL冷專系列", "奢華型BT冷暖系列", "奢華型BT冷專系列", "典雅型LA冷暖系列", "典雅型LA冷專系列", "GT系列變頻窗型冷專右吹"],
    "山田空調": ["FN冷暖系列", "FN冷專系列", "FA系列變頻窗型冷專右吹"]
};

// --- 初始化功能 ---
window.onload = () => {
    // 填充坪數
    const sizeSelect = document.getElementById('sizeRange');
    pricingData.forEach((item, index) => {
        sizeSelect.options.add(new Option(`${item.range} (${item.kw}kW)`, index));
    });
    
    // 填充樓層
    updateFloorRange();
    
    // 填充品牌
    const brandSelect = document.getElementById('brandSelect');
    Object.keys(brands).forEach(b => brandSelect.options.add(new Option(b, b)));
    updateSeriesList();

    // 限制日期
    const dateInput = document.getElementById('bookDate');
    dateInput.addEventListener('input', (e) => {
        const day = new Date(e.target.value).getUTCDay();
        if (day === 0) { alert('週日無法預約'); e.target.value = ''; }
    });

    // 監聽第二頁變動即時計算
    document.querySelectorAll('.acc-option, #pipeMeters, #wireMeters, #pipeType, #wireType').forEach(el => {
        el.addEventListener('change', calculateQuote);
        el.addEventListener('input', calculateQuote);
    });
};

function updateFloorRange() {
    const type = document.getElementById('buildingType').value;
    const floorSelect = document.getElementById('floorNum');
    floorSelect.innerHTML = "";
    const max = type === "電梯大樓" ? 30 : 10;
    for (let i = 1; i <= max; i++) floorSelect.options.add(new Option(`${i}樓`, i));
}

function updateSeriesList() {
    const brand = document.getElementById('brandSelect').value;
    const seriesSelect = document.getElementById('seriesSelect');
    seriesSelect.innerHTML = "";
    brands[brand].forEach(s => seriesSelect.options.add(new Option(s, s)));
}

function goToPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page${pageNum}`).classList.add('active');
    if (pageNum === 2) calculateQuote();
    window.scrollTo(0, 0);
}

// --- 估價核心 ---
function calculateQuote() {
    const acType = document.getElementById('acType').value;
    const sizeIdx = document.getElementById('sizeRange').value;
    const basePrice = acType === '分離式' ? pricingData[sizeIdx].split : pricingData[sizeIdx].window;
    
    let total = basePrice;
    let detailHtml = `標配安裝 (${acType}): $${basePrice}<br>`;

    // 配件下拉選單
    document.querySelectorAll('.acc-option').forEach(sel => {
        const val = parseInt(sel.value);
        if (val > 0) {
            total += val;
            detailHtml += `${sel.getAttribute('data-name')}: $${val}<br>`;
        }
    });

    // 銅管計算 (5米後才算錢)
    const pMeters = Math.max(0, parseInt(document.getElementById('pipeMeters').value) || 0);
    if (pMeters > 0) {
        const pPrice = pMeters * parseInt(document.getElementById('pipeType').value);
        total += pPrice;
        detailHtml += `超出銅管 (${pMeters}米): $${pPrice}<br>`;
    }

    // 電源線計算
    const wMeters = parseInt(document.getElementById('wireMeters').value) || 0;
    if (wMeters > 0) {
        const wPrice = wMeters * parseInt(document.getElementById('wireType').value);
        total += wPrice;
        detailHtml += `電源配線 (${wMeters}米): $${wPrice}<br>`;
    }

    document.getElementById('quoteSummary').innerHTML = detailHtml;
    document.getElementById('totalPrice').innerText = `$${total.toLocaleString()}`;
}

// --- 送出功能 ---
function submitToLine() {
    const msg = `【空調估價預約】\n客戶：${document.getElementById('userName').value}\n電話：${document.getElementById('mobilePhone').value}\n地點：${document.getElementById('address').value}\n需求：${document.getElementById('serviceType').value}\n類型：${document.getElementById('acType').value}\n坪數：${pricingData[document.getElementById('sizeRange').value].range}\n品牌：${document.getElementById('brandSelect').value} ${document.getElementById('seriesSelect').value}\n預估總額：${document.getElementById('totalPrice').innerText}\n預約時間：${document.getElementById('bookDate').value} ${document.getElementById('bookTime').value}`;
    window.location.href = `https://line.me/R/oaMessage/@ruo0988r/?${encodeURIComponent(msg)}`;
}

function submitToGoogle() {
    // 這裡替換為你的 Google Form 連結
    const formUrl = "https://docs.google.com/forms/d/e/你的表單ID/viewform";
    window.open(formUrl, '_blank');
}
