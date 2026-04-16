
// 冷氣估價系統 核心邏輯
let currentData = {
    area: 5,
    isWest: false,
    isTop: false,
    suggestKW: 2.8,
    bracketPrice: 0,
    holeQty: 0,
    pipeQty: 0,
    brandName: '日立 Hitachi',
    brandFactor: 1.1
};

// 1. 初始化監聽
document.getElementById('input-area').addEventListener('input', function(e) {
    currentData.area = parseInt(e.target.value);
    document.getElementById('display-area').innerText = currentData.area;
    updateCalculation();
});

// 2. 切換多選選項 (西曬、頂樓)
function toggleOption(el, type) {
    el.classList.toggle('active');
    if (type === 'west') currentData.isWest = !currentData.isWest;
    if (type === 'top') currentData.isTop = !currentData.isTop;
    updateCalculation();
}

// 3. 單選選項 (架子)
function selectSingle(el, type, price) {
    const parent = el.parentElement;
    parent.querySelectorAll('.option-card').forEach(card => card.classList.remove('active'));
    el.classList.add('active');
    
    if (type === 'bracket') currentData.bracketPrice = price;
    updateCalculation();
}

// 4. 品牌選擇
function selectBrand(el, name, factor) {
    const parent = el.parentElement;
    parent.querySelectorAll('.option-card').forEach(card => card.classList.remove('active'));
    el.classList.add('active');
    
    currentData.brandName = name;
    currentData.brandFactor = factor;
    updateCalculation();
}

// 5. 數量增減
function changeQty(type, delta) {
    if (type === 'hole') {
        currentData.holeQty = Math.max(0, currentData.holeQty + delta);
        document.getElementById('qty-hole').innerText = currentData.holeQty;
    }
    if (type === 'pipe') {
        currentData.pipeQty = Math.max(0, currentData.pipeQty + delta);
        document.getElementById('qty-pipe').innerText = currentData.pipeQty;
    }
    updateCalculation();
}

// 6. 核心計算邏輯
function updateCalculation() {
    // A. 計算建議 kW (基本 0.52kW/坪)
    let kw = currentData.area * 0.52;
    if (currentData.isWest) kw *= 1.2;
    if (currentData.isTop) kw *= 1.2;
    currentData.suggestKW = kw.toFixed(1);
    document.getElementById('suggest-kw').innerText = currentData.suggestKW;

    // B. 機器與標安基準價 (以 2.8kW 為例標安約 22000 起，隨品牌調整)
    const baseMachinePrice = (currentData.suggestKW * 8000) + 10000;
    const finalMachinePrice = baseMachinePrice * currentData.brandFactor;

    // C. 施工額外費用
    const extraPrice = currentData.bracketPrice + (currentData.holeQty * 1000) + (currentData.pipeQty * 500);

    // D. 總計
    const total = finalMachinePrice + extraPrice;
    document.getElementById('total-price').innerText = Math.round(total).toLocaleString();
}

// 7. 步驟切換
function nextStep(step) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
    
    // 更新指標樣式
    document.querySelectorAll('.step-indicator').forEach((ind, index) => {
        if (index + 1 === step) {
            ind.classList.add('text-blue-600', 'font-bold');
            ind.classList.remove('text-gray-400');
        } else if (index + 1 < step) {
            ind.classList.add('text-green-500');
            ind.classList.remove('text-blue-600', 'font-bold');
        } else {
            ind.classList.add('text-gray-400');
            ind.classList.remove('text-blue-600', 'font-bold', 'text-green-500');
        }
    });
}

// 8. 顯示報價單
function showSummary() {
    const list = document.getElementById('summary-list');
    const total = document.getElementById('total-price').innerText;
    
    list.innerHTML = `
        <div class="flex justify-between border-b pb-2"><span>安裝空間</span> <span>${currentData.area} 坪</span></div>
        <div class="flex justify-between border-b pb-2"><span>建議能力</span> <span>${currentData.suggestKW} kW</span></div>
        <div class="flex justify-between border-b pb-2"><span>選用品牌</span> <span>${currentData.brandName}</span></div>
        <div class="flex justify-between border-b pb-2"><span>架子費用</span> <span>$${currentData.bracketPrice.toLocaleString()}</span></div>
        <div class="flex justify-between border-b pb-2"><span>洗孔費用 (${currentData.holeQty}孔)</span> <span>$${(currentData.holeQty * 1000).toLocaleString()}</span></div>
        <div class="flex justify-between border-b pb-2"><span>超出銅管 (${currentData.pipeQty}米)</span> <span>$${(currentData.pipeQty * 500).toLocaleString()}</span></div>
        <div class="flex justify-between pt-4 text-xl font-bold text-orange-600">
            <span>總計預算</span> <span>NT$ ${total}</span>
        </div>
        <p class="text-[10px] text-gray-400 mt-4 text-center">* 此為系統初步估算，實際價格依師傅現場勘查為準。</p>
    `;
    
    document.getElementById('modal-summary').classList.remove('hidden');
    document.getElementById('modal-summary').classList.add('flex');
}

function closeModal() {
    document.getElementById('modal-summary').classList.add('hidden');
    document.getElementById('modal-summary').classList.remove('flex');
}

// 啟動首次計算
updateCalculation();
