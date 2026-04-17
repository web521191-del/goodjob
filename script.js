// 數據載入 (對應附件 CSV)
const pricingData = [
    { range: "2坪內", kw: "2.2", split: 4500, window: 1500 },
    { range: "2~4坪", kw: "2.8", split: 4500, window: 1800 },
    { range: "4~6坪", kw: "3.6", split: 5000, window: 2000 },
    { range: "6~7坪", kw: "4.1", split: 5500, window: 2500 },
    { range: "8~9坪", kw: "5.0", split: 6000, window: 2800 },
    { range: "9~10坪", kw: "6.3", split: 6000, window: 3000 },
    { range: "10~12坪", kw: "7.1~8.0", split: 7000, window: 3500 }
];

const accessoryData = [
    { name: "室外機L架(白鐵)", price: 2000 },
    { name: "牆壁洗孔(磚牆)", price: 1000 },
    { name: "室內機排水器", price: 2500 },
    { name: "電源配線(每米)", price: 100 }
];

// 初始化選單
window.onload = () => {
    const sizeSelect = document.getElementById('sizeRange');
    pricingData.forEach((item, index) => {
        sizeSelect.options.add(new Option(item.range + ` (${item.kw}kW)`, index));
    });

    const accDiv = document.getElementById('accessoryList');
    accessoryData.forEach((item, index) => {
        accDiv.innerHTML += `
            <div class="form-check">
                <input class="form-check-input acc-item" type="checkbox" value="${item.price}" data-name="${item.name}" id="acc${index}">
                <label class="form-check-label" for="acc${index}">${item.name} (+$${item.price})</label>
            </div>`;
    });

    // 限制週日不可選
    const dateInput = document.getElementById('bookDate');
    dateInput.addEventListener('input', (e) => {
        const day = new Date(e.target.value).getUTCDay();
        if (day === 0) {
            alert('週日無法預約，請選擇其他日期');
            e.target.value = '';
        }
    });
};

function goToPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page${pageNum}`).classList.add('active');
    if (pageNum === 2) calculateQuote();
}

function calculateQuote() {
    const acType = document.getElementById('acType').value;
    const sizeIdx = document.getElementById('sizeRange').value;
    const selectedData = pricingData[sizeIdx];
    
    let basePrice = acType === '分離式' ? selectedData.split : selectedData.window;
    let accPrice = 0;
    let accNames = [];

    document.querySelectorAll('.acc-item:checked').forEach(el => {
        accPrice += parseInt(el.value);
        accNames.push(el.getAttribute('data-name'));
    });

    const total = basePrice + accPrice;
    document.getElementById('quoteDetail').innerHTML = `
        <p>基本安裝費 (${acType}): $${basePrice}</p>
        <p>配件費用: $${accPrice} (${accNames.join(', ') || '無'})</p>
        <p class="fw-bold">預估總計: <span class="text-danger">$${total}</span></p>
        <small>* 此價格僅為基本預估，實際依現場師傅報價為準。</small>
    `;

    // 品牌推薦模擬 (實際可根據 kW 數篩選)
    document.getElementById('recommendations').innerHTML = `
        <div class="col-6 mb-2"><div class="p-2 border rounded text-center">Panasonic ${selectedData.kw}kW<br>$2X,XXX</div></div>
        <div class="col-6 mb-2"><div class="p-2 border rounded text-center">Daikin ${selectedData.kw}kW<br>$3X,XXX</div></div>
    `;
}

// 串接 LINE
function submitToLine() {
    const message = encodeURIComponent(
        `【空調預約需求】\n` +
        `客戶：${document.getElementById('userName').value}\n` +
        `電話：${document.getElementById('mobilePhone').value}\n` +
        `地址：${document.getElementById('address').value}\n` +
        `需求：${document.getElementById('serviceType').value} - ${document.getElementById('acType').value}\n` +
        `預約時間：${document.getElementById('bookDate').value} ${document.getElementById('bookTime').value}\n` +
        `備註：${document.getElementById('description').value}`
    );
    // 替換為你的 LINE ID 連結
    window.location.href = `https://line.me/R/oaMessage/@你的LINEID/?${message}`;
}

// 串接 Google 表單 (需先建立表單並獲取 entry ID)
function submitToGoogle() {
    const formUrl = "https://docs.google.com/forms/d/e/你的表單ID/viewform";
    // 透過 URL 參數自動填寫部分內容 (選填)
    const query = `?usp=pp_url&entry.123456=${document.getElementById('userName').value}`;
    window.open(formUrl + query, '_blank');
}
