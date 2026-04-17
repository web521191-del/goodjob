// 1. 初始化資料
const brandsData = {
    "大金DAIKIN空調": ["橫綱Z系列", "大關Z系列", "豪菁Z系列"],
    "日立HITACHI空調": ["尊榮NTB冷暖系列", "頂級NP冷暖系列", "頂級JP冷專系列", "旗艦HP冷暖系列", "旗艦QP冷專系列", "精品YP冷暖系列", "精品SP冷專系列", "豪華VP冷暖系列", "NR1窗型變頻冷暖系列", "JR1窗型變頻冷專系列", "QR窗型變頻冷專系列", "HR窗型變頻冷暖系列"],
    "國際牌PANASONIC空調": ["VX極致旗艦冷暖系列", "UX頂級旗艦冷暖系列", "UX旗艦冷暖系列", "UX旗艦冷專系列", "UJ精緻冷暖系列", "UJ精緻冷專系列", "K系列冷暖系列", "K系列冷專系列", "UK標準冷暖系列", "UK標準冷專系列", "Y舒適冷暖系列", "U系列窗型變頻冷暖右吹", "U系列窗型變頻冷專右吹", "U系列窗型變頻冷暖左吹", "U系列窗型變頻冷專左吹"],
    "日本富士通將軍空調": ["高級KGTB冷暖系列", "優級KMTC冷暖系列", "優級CMTD冷專系列"],
    "三菱電機空調": ["靜音大師GA冷暖系列", "靜音大師GA冷專系列", "靜音大師HA冷暖系列", "靜音大師HW冷專系列"],
    "三菱重工空調": ["晴空ZST2冷暖", "未來ZSXT2冷暖系列", "晴空ZST冷暖系列", "晴空YVST冷專系列", "晴空YXST冷專系列", "朝 日ZTLT冷暖系列"],
    "SAMPO聲寶空調": ["旗艦PH冷暖系列", "旗艦NH冷暖系列", "優選HF冷專系列", "新經典VF系列", "RH系列窗型變頻冷暖右吹", "LH系列窗型變頻冷暖右吹"],
    "RECHI瑞智空調": ["HA系列分離式冷暖空調", "HA系列變頻窗型冷專右吹"],
    "CHIMEI奇美空調": ["HT5星爵冷暖系列", "HG1星緻冷暖系列", "HA1星雅冷暖系列", "HK1星揚冷暖系列", "HW星光冷暖窗型變頻右吹"],
    "HERAN禾聯空調": ["尊榮型SL冷暖系列", "尊榮型SL冷專系列", "奢華型BT冷暖系列", "奢華型BT冷專系列", "典雅型LA冷暖系列", "典雅型LA冷專系列", "GT系列變頻窗型冷專右吹"],
    "山田空調": ["FN冷暖系列", "FN冷專系列", "FA系列變頻窗型冷專右吹"]
};

// 2. 頁面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 坪數初始化 (範例: 2-20坪)
    const sizeSelect = document.getElementById('roomSize');
    for (let i = 2; i <= 20; i++) {
        sizeSelect.innerHTML += `<option value="${i}">${i} 坪</option>`;
    }

    // 樓層初始化
    updateFloorOptions();

    // 品牌初始化
    const brandSelect = document.getElementById('brandSelect');
    for (let brand in brandsData) {
        brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
    updateSeriesOptions();
});

// 3. 切換功能
function nextStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
    window.scrollTo(0, 0);
}

function prevStep(step) {
    nextStep(step);
}

function updateFloorOptions() {
    const type = document.getElementById('floorType').value;
    const floorSelect = document.getElementById('floorNumber');
    floorSelect.innerHTML = '';
    const maxFloor = type === 'elevator' ? 30 : 10;
    for (let i = 1; i <= maxFloor; i++) {
        floorSelect.innerHTML += `<option value="${i}">${i} 樓</option>`;
    }
}

function updateSeriesOptions() {
    const brand = document.getElementById('brandSelect').value;
    const seriesSelect = document.getElementById('seriesSelect');
    seriesSelect.innerHTML = '';
    brandsData[brand].forEach(series => {
        seriesSelect.innerHTML += `<option value="${series}">${series}</option>`;
    });
}

function checkSunday(input) {
    const day = new Date(input.value).getUTCDay();
    if (day === 0) {
        alert("週日無法預約，請選擇其他日期");
        input.value = "";
    }
}

// 4. 串接 LINE 與 Google 表單
function submitToAll() {
    const name = document.getElementById('userName').value;
    const mobile = document.getElementById('telMobile').value;
    
    if (!name || !mobile) {
        alert("請填寫姓名與行動電話");
        return;
    }

    // 這裡請替換成您的 Google 表單實際連結
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/您的表單ID/viewform?usp=sf_link";
    const LINE_ID = "@ruo0988r";

    // 1. 開啟 Google 表單 (新分頁)
    window.open(GOOGLE_FORM_URL, '_blank');

    // 2. 延遲一下開啟 LINE
    setTimeout(() => {
        const message = `你好，我想預約冷氣服務！\n姓名：${name}\n電話：${mobile}\n服務：${document.getElementById('serviceType').value}\n品牌：${document.getElementById('brandSelect').value}`;
        window.location.href = `https://line.me/R/ti/p/%40ruo0988r`; 
        // 注意：手機會自動跳轉 LINE App，@ruo0988r 請確保已開啟 ID 搜尋或使用 ti/p 網址
    }, 500);
}
