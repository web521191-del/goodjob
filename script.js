const priceData = [
    { size: "2坪內", power: "2.2 kW", splitPrice: 4500, windowPrice: 1500 },
    { size: "2~4 坪", power: "2.8 kW", splitPrice: 4500, windowPrice: 1800 },
    { size: "4~6 坪", power: "3.6 kW", splitPrice: 5000, windowPrice: 2000 }
    // ... 其他資料請保持您原本的內容
];

// ... (品牌型號資料保持不變)

document.addEventListener("DOMContentLoaded", () => {
    const areaSelect = document.getElementById("areaSize");
    priceData.forEach((item, index) => {
        let opt = document.createElement("option");
        opt.value = index;
        opt.textContent = `${item.size} (${item.power})`;
        areaSelect.appendChild(opt);
    });

    const brandSelect = document.getElementById("brandSelect");
    brandSelect.innerHTML = '<option value="">請選擇品牌</option>';
    for (let brand in brandModels) {
        let opt = document.createElement("option");
        opt.value = brand;
        opt.textContent = brand;
        brandSelect.appendChild(opt);
    }
    
    document.getElementById("estimationForm").addEventListener("change", calculateTotal);
});

function calculateTotal() {
    const form = document.getElementById("estimationForm");
    let total = 0;
    const acType = form.acType.value;
    const idx = form.areaSize.value;
    
    // 計算邏輯
    total += (acType === "分離式變頻空調冷氣") ? priceData[idx].splitPrice : priceData[idx].windowPrice;
    // 增加其他選單金額...
    
    document.getElementById("totalPrice").textContent = total.toLocaleString();
}

document.getElementById("estimationForm").onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "處理中...";

    const formData = new FormData(e.target);
    const gasUrl = "https://script.google.com/macros/s/AKfycbxrrt2aGXlJqwlvT4xviSxrem_1lm7UIO-pKdOj0c469PwbO3WWzncmTtnV-PromWeOOA/exec";
    
    try {
        await fetch(gasUrl, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });
        alert("資料已送出！");
        e.target.reset();
    } catch (err) {
        alert("送出失敗，請聯絡客服。");
    } finally {
        btn.disabled = false;
        btn.textContent = "完成送出";
    }
};

function nextStep(n) { document.querySelectorAll('.step').forEach(s => s.classList.remove('active')); document.getElementById('step' + n).classList.add('active'); }
function prevStep(n) { document.querySelectorAll('.step').forEach(s => s.classList.remove('active')); document.getElementById('step' + n).classList.add('active'); }
function updateModels() { /* ...維持您原本的邏輯... */ }
