// グローバル変数
let weapons = [];
let weaponIdCounter = 0;
let items = [];
let itemIdCounter = 0;
let chart = null;

// 武器プリセットデータ
const weaponPresets = {
    wooden_sword: { name: '木の剣', cooldown: 1.4, haste: 0, stamina: 1 }, // 追加
    bloom: { name: 'ホウキ', cooldown: 1.7, haste: 0, stamina: 1.2 },
    torch: { name: 'たいまつ', cooldown: 1.4, haste: 0, stamina: 1 },
    pan: { name: 'フライパン', cooldown: 2.2, haste: 0, stamina: 2 },
    hammer: { name: 'ハンマー', cooldown: 2.0, haste: 0, stamina: 3 },
    spear: { name: 'スピア', cooldown: 1.5, haste: 0, stamina: 1 },
};

// アイテムプリセットデータ
const itemPresets = {
    banana: { name: 'バナナ', type: 'banana', cooldown: 5, haste: 0, recovery: 1 },
    hero_potion: { name: 'ヒーローポーション', type: 'hero_potion', count: 1, recovery: 2 },
    stamina_bag: { name: 'スタミナバッグ', type: 'stamina_bag', count: 1, maxBonus: 1 }
};

// カラーパレット
const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];


// 初期化
function init() {
    // 初期武器を追加
    addWeapon();
}

// 武器追加
function addWeapon() {
    const preset = document.getElementById('weaponPreset').value;
    const weapon = {
        id: weaponIdCounter++,
        name: preset ? weaponPresets[preset].name : `武器${weapons.length + 1}`,
        cooldown: preset ? weaponPresets[preset].cooldown : 1.4,
        haste: preset ? weaponPresets[preset].haste : 0,
        stamina: preset ? weaponPresets[preset].stamina : 1,
        color: colorPalette[weapons.length % colorPalette.length]
    };

    weapons.push(weapon);
    renderWeaponList();
}

// 武器削除
function removeWeapon(id) {
    weapons = weapons.filter(w => w.id !== id);
    renderWeaponList();
}

// 武器更新
function updateWeapon(id, field, value) {
    const weapon = weapons.find(w => w.id === id);
    if (weapon) {
        weapon[field] = parseFloat(value) || value;
    }
}

// 武器リスト描画
function renderWeaponList() {
    const container = document.getElementById('weaponList');
    container.innerHTML = '';

    weapons.forEach(weapon => {
        const div = document.createElement('div');
        div.className = 'weapon-item';
        div.innerHTML = `
                    <div class="weapon-header">
                        <input type="color" class="color-picker" value="${weapon.color}"
                               onchange="updateWeapon(${weapon.id}, 'color', this.value)">
                        <input type="text" value="${weapon.name}"
                               onchange="updateWeapon(${weapon.id}, 'name', this.value)">
                        <button class="btn btn-danger" onclick="removeWeapon(${weapon.id})" style="padding: 4px 8px;">×</button>
                    </div>
                    <div class="weapon-stats">
                        <div class="input-group">
                            <label>CD (秒)</label>
                            <input type="number" value="${weapon.cooldown}" step="0.1" min="0.1"
                                   onchange="updateWeapon(${weapon.id}, 'cooldown', this.value)">
                        </div>
                        <div class="input-group">
                            <label>加速 (%)</label>
                            <input type="number" value="${weapon.haste}" step="1" min="0"
                                   onchange="updateWeapon(${weapon.id}, 'haste', this.value)">
                        </div>
                        <div class="input-group">
                            <label>スタミナ</label>
                            <input type="number" value="${weapon.stamina}" step="1" min="1"
                                   onchange="updateWeapon(${weapon.id}, 'stamina', this.value)">
                        </div>
                    </div>
                `;
        container.appendChild(div);
    });
}

// アイテム追加
// アイテム追加
function addItem() {
    const preset = document.getElementById('itemPreset').value;
    if (!preset) return;

    const presetData = itemPresets[preset];
    const item = {
        id: itemIdCounter++,
        type: presetData.type,
        name: presetData.name,
        ...presetData
    };

    items.push(item);
    renderItemList();
}

// アイテム削除
function removeItem(id) {
    items = items.filter(i => i.id !== id);
    renderItemList();
}

// アイテム更新
function updateItem(id, field, value) {
    const item = items.find(i => i.id === id);
    if (item) {
        item[field] = parseFloat(value) || value;
    }
}

// アイテムリスト描画
// アイテムリスト描画
function renderItemList() {
    const container = document.getElementById('itemList');
    container.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'weapon-item';

        if (item.type === 'banana') {
            div.innerHTML = `
                <div class="weapon-header">
                    <input type="text" value="${item.name}" disabled style="flex: 1;">
                    <button class="btn btn-danger" onclick="removeItem(${item.id})" style="padding: 4px 8px;">×</button>
                </div>
                <div class="weapon-stats">
                    <div class="input-group">
                        <label>CD (秒)</label>
                        <input type="number" value="${item.cooldown}" disabled>
                    </div>
                    <div class="input-group">
                        <label>加速 (%)</label>
                        <input type="number" value="${item.haste}" step="1" min="0"
                               onchange="updateItem(${item.id}, 'haste', this.value)">
                    </div>
                    <div class="input-group">
                        <label>回復量</label>
                        <input type="number" value="${item.recovery}" disabled>
                    </div>
                </div>
            `;
        } else if (item.type === 'hero_potion') {
            div.innerHTML = `
                <div class="weapon-header">
                    <input type="text" value="${item.name}" disabled style="flex: 1;">
                    <button class="btn btn-danger" onclick="removeItem(${item.id})" style="padding: 4px 8px;">×</button>
                </div>
                <div class="weapon-stats">
                    <div class="input-group">
                        <label>個数</label>
                        <input type="number" value="${item.count}" step="1" min="1" max="10"
                               onchange="updateItem(${item.id}, 'count', this.value)">
                    </div>
                    <div class="input-group">
                        <label>回復量</label>
                        <input type="number" value="${item.recovery}" disabled>
                    </div>
                </div>
            `;
        } else if (item.type === 'stamina_bag') {
            div.innerHTML = `
                <div class="weapon-header">
                    <input type="text" value="${item.name}" disabled style="flex: 1;">
                    <button class="btn btn-danger" onclick="removeItem(${item.id})" style="padding: 4px 8px;">×</button>
                </div>
                <div class="weapon-stats">
                    <div class="input-group">
                        <label>個数</label>
                        <input type="number" value="${item.count}" step="1" min="1" max="10"
                               onchange="updateItem(${item.id}, 'count', this.value)">
                    </div>
                    <div class="input-group">
                        <label>最大値ボーナス</label>
                        <input type="number" value="${item.maxBonus}" disabled>
                    </div>
                </div>
            `;
        }

        container.appendChild(div);
    });
}

// スタミナシミュレーション
function simulate() {
    const duration = parseFloat(document.getElementById('simDuration').value);
    const dt = 0.1; // 時間刻み
    const steps = Math.floor(duration / dt);

    // パラメータ取得
    const initialHeat = parseFloat(document.getElementById('initialHeat').value);
    const heatRate = parseFloat(document.getElementById('heatRate').value);
    const maxHeat = parseFloat(document.getElementById('maxHeat').value);
    const chillStacks = parseFloat(document.getElementById('chillStacks').value);

    // アイテムから最大スタミナボーナスを計算
    const staminaBags = items.filter(item => item.type === 'stamina_bag');
    const maxStaminaBonus = staminaBags.reduce((sum, bag) => sum + (bag.maxBonus * bag.count), 0);

    // 初期化
    const maxStamina = 5 + maxStaminaBonus;
    let stamina = maxStamina
    const timePoints = [];
    const staminaValues = [];
    const weaponFires = [];
    const staminaDepletions = [];

    // 武器ごとのクールダウントラッカー
    const weaponCooldowns = weapons.map(weapon => {
        const speedModifier = 1 + (initialHeat * 0.02) - (chillStacks * 0.02);
        const effectiveCd = weapon.cooldown / ((1 + weapon.haste / 100) * speedModifier);
        return effectiveCd; // 0 から effectiveCd に変更
    });

    // バナナアイテムの取得
    const bananas = items.filter(item => item.type === 'banana');
    const bananaCooldowns = bananas.map(() => 0);

    // ヒーローポーション
    const heroPotions = items.filter(item => item.type === 'hero_potion');
    const heroPotionUsed = {}; // {itemId: usedCount}

    // シミュレーション
    for (let step = 0; step <= steps; step++) {
        const time = step * dt;

        // 現在のヒート計算
        const currentHeat = Math.min(initialHeat + heatRate * time, maxHeat);

        // 冷気・ヒートによる速度補正
        const speedModifier = 1 + (currentHeat * 0.02) - (chillStacks * 0.02);

        // 自然回復（1秒に1スタミナ）
        stamina = Math.min(stamina + dt, maxStamina);

        // バナナ
        bananas.forEach((banana, idx) => {
            bananaCooldowns[idx] -= dt;
            if (bananaCooldowns[idx] <= 0) {
                const effectiveBananaCd = banana.cooldown / ((1 + banana.haste / 100) * speedModifier);
                stamina = Math.min(stamina + banana.recovery, maxStamina);
                bananaCooldowns[idx] = effectiveBananaCd;
            }
        });

        heroPotions.forEach(potion => {
            if (!heroPotionUsed[potion.id]) {
                heroPotionUsed[potion.id] = 0;
            }

            // スタミナが最大値の半分以下になったら使用
            if (stamina <= maxStamina / 2 && heroPotionUsed[potion.id] < potion.count) {
                stamina = Math.min(stamina + potion.recovery, maxStamina);
                heroPotionUsed[potion.id]++;
            }
        });

        // 武器の攻撃処理
        weapons.forEach((weapon, idx) => {
            weaponCooldowns[idx] -= dt;

            if (weaponCooldowns[idx] <= 0) {
                const effectiveCd = weapon.cooldown / ((1 + weapon.haste / 100) * speedModifier);

                if (stamina >= weapon.stamina) {
                    // 攻撃成功
                    stamina -= weapon.stamina;
                    weaponFires.push({
                        time: time,
                        weapon: weapon.name,
                        weaponId: weapon.id,
                        color: weapon.color,
                        success: true
                    });
                    weaponCooldowns[idx] = effectiveCd;
                } else {
                    // スタミナ切れ
                    weaponFires.push({
                        time: time,
                        weapon: weapon.name,
                        weaponId: weapon.id,
                        color: weapon.color,
                        success: false
                    });
                    weaponCooldowns[idx] = effectiveCd;
                }
            }
        });

        // データ記録
        timePoints.push(time);
        staminaValues.push(stamina);
    }


    return {
        timePoints,
        staminaValues,
        weaponFires,
        maxStamina
    };
}

// グラフ描画
function drawChart(results) {
    const ctx = document.getElementById('staminaChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    // 武器攻撃マーカー用データセット
    const weaponDatasets = {};
    results.weaponFires.forEach(fire => {
        const key = `${fire.weaponId}_${fire.success ? 'success' : 'fail'}`;

        if (!weaponDatasets[key]) {
            weaponDatasets[key] = {
                label: fire.success ? fire.weapon : `${fire.weapon} (スタミナ切れ)`,
                data: [],
                backgroundColor: fire.color,
                borderColor: fire.color,
                pointRadius: fire.success ? 4 : 6,
                pointStyle: fire.success ? 'circle' : 'crossRot',
                showLine: false,
                order: 1
            };
        }

        weaponDatasets[key].data.push({
            x: fire.time,
            y: 0
        });
    });


    chart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: results.timePoints,
            datasets: [
                {
                    label: 'スタミナ',
                    data: results.staminaValues.map((stamina, i) => ({
                        x: results.timePoints[i],
                        y: stamina
                    })),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointRadius: 0,
                    order: 2
                },
                ...Object.values(weaponDatasets)
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label === 'スタミナ') {
                                return `スタミナ: ${context.parsed.y.toFixed(1)}`;
                            }
                            return context.dataset.label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear', // この行を追加
                    title: {
                        display: true,
                        text: '時間 (秒)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'スタミナ'
                    },
                    beginAtZero: true,
                    max: results.maxStamina
                }
            }
        }
    });
}

// 分析結果表示
function displayAnalysis(results) {
    const container = document.getElementById('analysisResults');

    // 統計計算
    const failedFires = results.weaponFires.filter(f => !f.success);
    const firstStaminaOut = failedFires.length > 0 ? failedFires[0].time : null; // 変更

    // 失敗した武器の集計
    const failedWeapons = {};
    failedFires.forEach(f => {
        failedWeapons[f.weapon] = (failedWeapons[f.weapon] || 0) + 1;
    });

    let html = '';

    // 最初のスタミナ切れ
    if (firstStaminaOut !== null) {
        html += `
        <div class="analysis-card danger">
            <h3>最初のスタミナ切れ</h3>
            <div class="value">${firstStaminaOut.toFixed(1)} <span class="unit">秒</span></div>
        </div>
    `;
    } else {
        html += `
        <div class="analysis-card success">
            <h3>スタミナ切れ</h3>
            <div class="value">なし ✓</div>
        </div>
    `;
    }

    // スタミナ切れ回数
    if (failedFires.length > 0) {
        html += `
        <div class="analysis-card warning">
            <h3>スタミナ切れ回数</h3>
            <div class="value">${failedFires.length} <span class="unit">回</span></div>
            <h3 style="margin-top: 12px;">スタミナ切れが多い武器</h3>
            <ul class="weapon-list">
    `;

        Object.entries(failedWeapons).forEach(([name, count]) => {
            const weapon = weapons.find(w => w.name === name);
            html += `<li style="--weapon-color: ${weapon.color}"><span style="background-color: ${weapon.color}; width: 12px; height: 12px; display: inline-block; border-radius: 2px; margin-right: 8px;"></span>${name}: ${count}回</li>`;
        });

        html += `
            </ul>
        </div>
    `;
    }

    const avgStamina = results.staminaValues.reduce((a, b) => a + b, 0) / results.staminaValues.length;
    const minStamina = Math.min(...results.staminaValues);
    const minStaminaTime = results.timePoints[results.staminaValues.indexOf(minStamina)];

    // 統計情報
    html += `
                <div class="analysis-card">
                    <h3>統計情報</h3>
                    <div class="stat-row">
                        <span class="stat-label">平均スタミナ:</span>
                        <span class="stat-value">${avgStamina.toFixed(1)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">最低スタミナ:</span>
                        <span class="stat-value">${minStamina.toFixed(1)} (${minStaminaTime.toFixed(1)}秒)</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">総攻撃回数:</span>
                        <span class="stat-value">${results.weaponFires.length}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">成功攻撃:</span>
                        <span class="stat-value">${results.weaponFires.length - failedFires.length}</span>
                    </div>
                </div>
            `;

    container.innerHTML = html;
}

// 計算実行
function calculate() {
    if (weapons.length === 0) {
        return;
    }

    const results = simulate();
    drawChart(results);
    displayAnalysis(results);
}

// ページ読み込み時
window.addEventListener('load', init);
