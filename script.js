// --- 資料定義 ---
const pricingData = [
    { range: "2坪內", kw: "2.2 kW", split: 4500, window: 1500 },
    { range: "2~4 坪", kw: "2.8 kW", split: 4500, window: 1800 },
    { range: "4~6 坪", kw: "3.6 kW", split: 5000, window: 2000 },
    { range: "6~7 坪", kw: "4.1kW", split: 5500, window: 2500 },
    { range: "8~9 坪", kw: "5.0kW", split: 6000, window: 2800 },
    { range: "9~10 坪", kw: "6.3 kW", split: 6000, window: 3000 },
    { range: "10~12 坪", kw: "7.1 ~ 8.0 kW", split: 7000, window: 3500 },
    { range: "12~15 坪", kw: "9.0 kW", split: 9000, window: -1 },
    { range: "15~18 坪", kw: "11kW", split: 12000, window: -1 },
    { range: "18~20 坪", kw: "14kW", split: -1, window: -1 }
];

const brands = {
    "大金DAIKIN": ["橫綱Z系列", "大關Z系列", "豪菁Z系列"],
    "日立HITACHI": ["尊榮NTB冷暖系列", "頂級NP冷暖系列", "頂級JP冷專系列", "旗艦HP冷暖系列", "旗艦QP冷專系列", "精品YP冷暖系列", "精品SP冷專系列", "豪華VP冷暖系列", "NR1窗型變頻冷暖系列", "JR1窗型變頻冷專系列", "QR窗型變頻冷專系列", "HR窗型變頻冷暖系列"],
    "國際牌PANASONIC": ["VX極致旗艦冷暖系列", "UX頂級旗艦冷暖系列", "UX旗艦冷暖系列", "UX旗艦冷專系列", "UJ精緻冷暖系列", "UJ精緻冷專系列", "K系列冷暖系列", "K系列冷專系列", "UK標準冷暖系列", "UK標準冷專系列", "Y舒適冷暖系列", "U系列窗型變頻冷暖右吹", "U系列窗型變頻冷專右吹", "U系列窗型變頻冷暖左吹", "U系列窗型變頻冷專左吹"],
    "日本富士通": ["高級KGTB冷暖系列", "優級KMTC冷暖系列", "優級CMTD冷專系列"],
    "三菱電機": ["靜音大師GA冷暖系列", "靜音大師GA冷專系列", "靜音大師HA冷暖系列", "靜音大師HW冷專系列"],
    "三菱重工": ["晴空ZST2冷暖", "未來ZSXT2冷暖系列", "晴空ZST冷暖系列", "晴空YVST冷專系列", "晴空YXST冷專系列", "朝日ZTLT冷暖系列"],
    "聲寶SAMPO": ["旗艦PH冷暖系列", "旗艦NH冷暖系列", "優選HF冷專系列", "新經典VF系列", "RH系列窗型變頻冷暖右吹", "LH系列窗型變頻冷暖右吹"],
    "瑞智RECHI": ["HA系列分離式冷暖空調", "HA系列變頻窗型冷專右吹"],
    "奇美CHIMEI": ["HT5星爵冷暖系列", "HG1星緻冷暖系列", "HA1星雅冷暖系列", "HK1星揚冷暖系列", "HW星光冷暖窗型變頻右吹"],
    "禾聯HERAN": ["尊榮型SL冷暖系列", "尊榮型SL冷專系列", "奢華型BT冷暖系列", "奢華型BT冷專系列", "典雅型LA冷暖系列", "典雅型LA冷專系列", "GT系列變頻窗型冷專右吹"],
    "山田空調": ["FN冷暖系列", "FN冷專系列", "FA系列變頻窗型冷專右吹"]
};

// --- 初始化頁面 ---
document.addEventListener("DOMContentLoaded", () => {
    updateSqftOptions();
    const brandSelect = document.getElementById('brand');
    for (let b in brands) {
        let opt = document.createElement('option');
        opt.value = b;
        opt.innerHTML = b;
        brandSelect.appendChild(opt);
    }
    updateFloorOptions();
});

// --- 功能函數 ---
function updateSqftOptions() {
    const acType = document.getElementById('acType').value;
    const sqftSelect = document.getElementById('sqftPrice');
    sqftSelect.innerHTML = '';
    pricingData.forEach(item => {
        const price = (acType === 'split') ? item.split : item.window;
        let opt = document.createElement('option');
        opt.value = price;
        opt.innerHTML = (price === -1) ? `${item.range} (${item.kw}) - 需視機型現場報價` : `${item.range} (${item.kw}) - $${price.toLocaleString()}`;
        sqftSelect.appendChild(opt);
    });
}

function calculateTotal() {
    let total = 0;
    const basePrice = parseInt(document.getElementById('sqftPrice').value);
    if (basePrice === -1) {
        document.getElementById('totalPriceDisplay').innerText = "需視機型現場報價";
        return;
    }
    total += basePrice + parseInt(document.getElementById('bracket').value) + parseInt(document.getElementById('drainage').value) + parseInt(document.getElementById('removal').value) + parseInt(document.getElementById('sealing').value) + parseInt(document.getElementById('floorLevel').value);
    total += (parseInt(document.getElementById('pipeLength').value) || 0) * parseInt(document.getElementById('pipeType').value);
    total += (parseInt(document.getElementById('powerLength').value) || 0) * parseInt(document.getElementById('powerType').value);
    document.getElementById('totalPriceDisplay').innerText = "$" + total.toLocaleString();
    return total;
}

function contactLine() {
    const name = document.getElementById('userName').value;
    const brand = document.getElementById('brand').value;
    const series = document.getElementById('series').value;
    const total = document.getElementById('totalPriceDisplay').innerText;
    
    // 請將下方的 entry.xxxx 替換成您從「取得預填連結」拿到的其他正確 ID
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLScMZgUu5gs9klhSgyTSUmgYit9DASDnZSthlidPyEtwGC1eXQ/viewform?usp=pp_url` +
                          `&entry.1407722231=${encodeURIComponent(name)}` + 
                          `&entry.1407722231=${encodeURIComponent(brand + ' ' + series)}` +
                          `&entry.1407722231=${encodeURIComponent(total)}`;
    
    const lineMsg = `您好，我想預約師傅諮詢！%0A姓名：${name}%0A預約品牌：${brand} ${series}%0A初步估價：${total}%0A請協助確認報價。`;
    
    window.open(`https://line.me/R/ti/p/@ruo0988r?text=${lineMsg}`, '_blank');
    
    if(confirm("基本需求已傳送至 LINE。接下來將導向 Google 表單，請於表單頁面上傳現場照片並確認資訊，是否前往？")) {
        window.location.href = googleFormUrl;
    }
}

// 保持原本的 nextStep, prevStep, updateSeries, updateFloorOptions 函數不變...
