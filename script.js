// 附件資料：坪數與安裝費對照
const priceData = [
    { size: "2坪內", power: "2.2 kW", splitPrice: 4500, windowPrice: 1500 },
    { size: "2~4 坪", power: "2.8 kW", splitPrice: 4500, windowPrice: 1800 },
    { size: "4~6 坪", power: "3.6 kW", splitPrice: 5000, windowPrice: 2000 },
    { size: "6~7 坪", power: "4.1kW", splitPrice: 5500, windowPrice: 2500 },
    { size: "8~9 坪", power: "5.0kW", splitPrice: 6000, windowPrice: 2800 },
    { size: "9~10 坪", power: "6.3 kW", splitPrice: 6000, windowPrice: 3000 },
    { size: "10~12 坪", power: "7.1 ~ 8.0 kW", splitPrice: 7000, windowPrice: 3500 },
    { size: "12~15 坪", power: "9.0 kW", splitPrice: 9000, windowPrice: 0 },
    { size: "15~18 坪", power: "11kW", splitPrice: 12000, windowPrice: 0 },
    { size: "18~20 坪", power: "14kW", splitPrice: 0, windowPrice: 0 }
];

const brandModels = {
    "大金DAIKIN空調": ["橫綱Z系列", "大關Z系列", "豪菁Z系列"],
    "日立HITACHI空調": ["尊榮NTB冷暖系列", "頂級NP冷暖系列", "頂級JP冷專系列", "旗艦HP冷暖系列", "旗艦QP冷專系列", "精品YP冷暖系列", "精品SP冷專系列", "豪華VP冷暖系列", "NR1窗型變頻冷暖系列", "JR1窗型變頻冷專系列", "QR窗型變頻冷專系列", "HR窗型變頻冷暖系列"],
    "國際牌PANASONIC空調": ["VX極致旗艦冷暖系列", "UX頂級旗艦冷暖系列", "UX旗艦冷暖系列", "UX旗艦冷專系列", "UJ精緻冷暖系列", "UJ精緻冷專系列", "K系列冷暖系列", "K系列冷專系列", "UK標準冷暖系列", "UK標準冷專系列", "Y舒適冷暖系列", "U系列窗型變頻冷暖右吹", "U系列窗型變頻冷專右吹", "U系列窗型變頻冷暖左吹", "U系列窗型變頻冷專左吹"],
    "日本富士通將軍空調": ["高級KGTB冷暖系列", "優級KMTC冷暖系列", "優級CMTD冷專系列"],
    "三菱電機空調": ["靜音大師GA冷暖系列", "靜音大師GA冷專系列", "靜音大師HA冷暖系列", "靜音大師HW冷專系列"],
    "三菱重工空調": ["晴空ZST2冷暖", "未來ZSXT2冷暖系列", "晴空ZST冷暖系列", "晴空YVST冷專系列", "晴空YXST冷專系列", "朝日ZTLT冷暖系列"],
    "SAMPO聲寶空調": ["旗艦PH冷暖系列", "旗艦NH冷暖系列", "優選HF冷專系列", "新經典VF系列", "RH系列窗型變頻冷暖右吹", "LH系列窗型變頻冷暖右吹"],
    "RECHI瑞智空調": ["HA系列分離式冷暖空調", "HA系列變頻窗型冷專右吹"],
    "CHIMEI奇美空調": ["HT5星爵冷暖系列", "HG1星緻冷暖系列", "HA1星雅冷暖系列", "HK1星揚冷暖系列", "HW星光冷暖窗型變頻右吹"],
    "HERAN禾聯空調": ["尊榮型SL冷暖系列", "尊榮型SL冷專系列", "奢華型BT冷暖系列", "奢華型BT冷專系列", "典雅型LA冷暖系列", "典雅型LA冷專系列", "GT系列變頻窗型冷專右吹"],
    "山田空調": ["FN冷暖系列", "FN冷專系列", "FA系列變頻窗型冷專右吹"]
};

document.addEventListener("DOMContentLoaded", () => {
    const areaSelect = document.getElementById("areaSize");
    priceData.forEach((item, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = `${item.size} (${item.power})`;
        areaSelect.appendChild(option);
    });

    const brandSelect = document.getElementById("brandSelect");
    for (let brand in brandModels) {
        let option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    }

    document.getElementById("estimationForm").addEventListener("change", calculateTotal);
    document.querySelectorAll("input").forEach(input => input.addEventListener("input", calculateTotal));
});

function calculateTotal() {
    let total = 0;
    const form = document.getElementById("estimationForm");
    const formData = new FormData(form);

    const acType = formData.get("acType");
    const priceIdx = formData.get("areaSize");
    if(priceIdx !== null && priceIdx !== "") {
        total += (acType === "分離式變頻空調冷氣") ? priceData[priceIdx].splitPrice : priceData[priceIdx].windowPrice;
    }

    total += parseInt(form.bracket.options[form.bracket.selectedIndex].dataset.price || 0);
    total += parseInt(form.drainPump.options[form.drainPump.selectedIndex].dataset.price || 0);
    total += parseInt(form.oldRemoval.options[form.oldRemoval.selectedIndex].dataset.price || 0);
    total += (parseInt(form.extraPipe.options[form.extraPipe.selectedIndex].dataset.price || 0) * parseInt(formData.get("pipeLength") || 0));
    total += (parseInt(form.powerWire.options[form.powerWire.selectedIndex].dataset.price || 0) * parseInt(formData.get("wireLength") || 0));

    if (formData.get("buildingType") === "透天或公寓" && parseInt(formData.get("floor") || 1) >= 2) {
        total += (parseInt(formData.get("floor")) - 1) * 100;
    }

    document.getElementById("totalPriceDisplay").textContent = total.toLocaleString();
    document.getElementById("totalPriceInput").value = total;
}

// 基礎功能函數
function updateModels() {
    const brand = document.getElementById("brandSelect").value;
    const modelSelect = document.getElementById("modelSelect");
    modelSelect.innerHTML = '<option value="">請選擇型號</option>';
    if (brand && brandModels[brand]) {
        brandModels[brand].forEach(m => {
            let option = document.createElement("option");
            option.value = m;
            option.textContent = m;
            modelSelect.appendChild(option);
        });
    }
}

function nextStep(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + n).classList.add('active');
    window.scrollTo(0, 0);
}

function prevStep(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + n).classList.add('active');
    window.scrollTo(0, 0);
}

// 圖片轉碼
const toBase64 = file => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            let width = img.width, height = img.height;
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
    };
});

document.getElementById("estimationForm").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    btn.disabled = true; btn.textContent = "傳送中...";
    
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((v, k) => { if(!(v instanceof File)) data[k] = v; });
    
    const files = document.getElementById("siteImages").files;
    for (let i = 0; i < files.length; i++) data['file' + (i + 1)] = await toBase64(files[i]);

    try {
        await fetch("https://script.google.com/macros/s/AKfycbw8A03QNOW_X8s48kGvR82_woEKRzpaGJBV7ADmsbSmmLjOb8hdNy7MLC52wAj3YBbuwg/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data)
        });
        alert("送出成功！");
        e.target.reset();
        nextStep(1);
    } catch(err) { alert("傳送失敗"); }
    btn.disabled = false; btn.textContent = "完成並送出預約";
};
