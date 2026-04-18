// --- 資料定義 ---
const pricingTable = [
    { label: "2-3 坪 ($12,000)", value: 12000 },
    { label: "3-5 坪 ($15,000)", value: 15000 },
    { label: "5-7 坪 ($20,000)", value: 20000 },
    { label: "7-9 坪 ($25,000)", value: 25000 }
    // 請根據您的附件繼續增加...
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
    // 填充坪數選單
    const sqftSelect = document.getElementById('sqftPrice');
    pricingTable.forEach(item => {
        let opt = document.createElement('option');
        opt.value = item.value;
        opt.innerHTML = item.label;
        sqftSelect.appendChild(opt);
    });

    // 填充品牌選單
    const brandSelect = document.getElementById('brand');
    for (let b in brands) {
        let opt = document.createElement('option');
        opt.value = b;
        opt.innerHTML = b;
        brandSelect.appendChild(opt);
    }
    updateFloorOptions();
    
    // 禁止選取週日
    const datePicker = document.getElementById('prefDate');
    datePicker.addEventListener('input', function(e){
        var day = new Date(this.value).getUTCDay();
        if([0].includes(day)){
            e.preventDefault();
            this.value = '';
            alert('週日無法預約，請選擇其他日期');
        }
    });
});

// --- 功能函數 ---
function nextStep(step) {
    document.querySelectorAll('.step-container').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
    if(step === 3) calculateTotal();
}

function prevStep(step) {
    document.querySelectorAll('.step-container').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

function updateFloorOptions() {
    const type = document.getElementById('floorType').value;
    const levelSelect = document.getElementById('floorLevel');
    levelSelect.innerHTML = '';
    if (type === 'elevator') {
        for (let i = 1; i <= 30; i++) {
            let opt = document.createElement('option');
            opt.value = 0; // 電梯不加價
            opt.innerHTML = i + " 樓";
            levelSelect.appendChild(opt);
        }
    } else {
        for (let i = 2; i <= 10; i++) {
            let opt = document.createElement('option');
            opt.value = (i - 1) * 100; // 每一層 +100 (假設從2樓開始算每一單位)
            opt.innerHTML = i + " 樓 (加收 " + opt.value + ")";
            levelSelect.appendChild(opt);
        }
    }
}

function updateSeries() {
    const brand = document.getElementById('brand').value;
    const seriesSelect = document.getElementById('series');
    seriesSelect.innerHTML = '';
    if (brands[brand]) {
        brands[brand].forEach(s => {
            let opt = document.createElement('option');
            opt.value = s;
            opt.innerHTML = s;
            seriesSelect.appendChild(opt);
        });
    }
}

function calculateTotal() {
    let total = 0;
    total += parseInt(document.getElementById('sqftPrice').value);
    total += parseInt(document.getElementById('bracket').value);
    total += parseInt(document.getElementById('drainage').value);
    total += parseInt(document.getElementById('removal').value);
    total += parseInt(document.getElementById('floorLevel').value);
    
    // 銅管計算
    let pLen = parseInt(document.getElementById('pipeLength').value) || 0;
    total += pLen * parseInt(document.getElementById('pipeType').value);
    
    // 電源線計算
    let powLen = parseInt(document.getElementById('powerLength').value) || 0;
    total += powLen * parseInt(document.getElementById('powerType').value);

    document.getElementById('totalPriceDisplay').innerText = "$" + total.toLocaleString();
    return total;
}

function submitFormToGAS() {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwSkxZ4ON1mNH9KhKOMfsxQ-Wb9R5hFXBe5RV0kuZIuiyOPD2mXt9zICT3X1ATjnp8zhA/exec
'; // 
    const formData = {
        name: document.getElementById('userName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        brandSeries: document.getElementById('brand').value + ' ' + document.getElementById('series').value,
        total: document.getElementById('totalPriceDisplay').innerText,
        desc: document.getElementById('desc').value
    };

    // 1. 發送 LINE
    const lineMsg = `您好，我想預約師傅諮詢！%0A姓名：${formData.name}%0A品牌型號：${formData.brandSeries}%0A初步估價：${formData.total}`;
    window.open(`https://line.me/R/ti/p/@ruo0988r?text=${lineMsg}`, '_blank');

    // 2. 使用 fetch 發送到 GAS
    fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // 處理跨域限制
        body: new URLSearchParams(formData)
    }).then(() => {
        alert("資料已成功傳送至系統！");
        // 可選擇是否重置表單
    });
}}
