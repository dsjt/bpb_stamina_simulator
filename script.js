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
    pan: { name: 'フライパン', cooldown: 2.2, haste: 0, stamina: 2 },
    short_bow: { name: 'ショートボウ', cooldown: 1.7, haste: 0, stamina: 0.7 },

    torch: { name: 'たいまつ', cooldown: 1.4, haste: 0, stamina: 1 },
    spear: { name: 'スピア', cooldown: 1.5, haste: 0, stamina: 1 },
    hammer: { name: 'ハンマー', cooldown: 2.0, haste: 0, stamina: 3 },
    totem: { name: '殻のトーテム', cooldown: 3.6, haste: 0, stamina: 2 },
    shovel: { name: 'シャベル', cooldown: 2.4, haste: 0, stamina: 1.7 },

    attack_claw: { name: 'アタッククロー', cooldown: 1.6, haste: 0, stamina: 0.5 },
    hungry_blade: { name: '飢えたる剣', cooldown: 1.6, haste: 0, stamina: 1 },
    hero_sword: { name: '英雄の剣', cooldown: 1.4, haste: 0, stamina: 0.7 },
};

// アイテムプリセットデータ
const itemPresets = {
    banana: { name: 'バナナ', type: 'banana', cooldown: 5, haste: 0, recovery: 1 },
    hero_potion: { name: 'ヒーローポーション', type: 'hero_potion', count: 1, recovery: 2 },
    stamina_bag: { name: 'スタミナバッグ', type: 'stamina_bag', count: 1, maxBonus: 1 },
    courage_star: { name: '勇気の星', type: 'courage_star', staminaReduction: 5 },
    monkey_blacksmith: { name: 'サルでもわかる鍛冶', type: 'monkey_blacksmith', staminaReduction: 25 }
};

// カラーパレット
const colorPalette = [
    '#FF6B6B', // 赤
    '#4ECDC4', // 青緑
    '#FFA500', // オレンジ
    '#9B59B6', // 紫
    '#2ECC71', // 緑
    '#F1C40F', // 黄色
];


// 初期化
function init() {
    // 初期武器を追加
    // addWeapon();
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
        weapon[field] = (typeof value === 'string' && !isNaN(value)) ? parseFloat(value) : value;
    }
    updateWeaponSelections();
}

// パズルボックスとサルでもわかる鍛冶の選択肢を更新
function updateWeaponSelections() {
    // パズルボックス用
    const puzzleBoxWeaponList = document.getElementById('puzzleBoxWeaponList');
    const puzzleBoxBananaList = document.getElementById('puzzleBoxBananaList');

    // パズルボックス - 武器
    if (puzzleBoxWeaponList) {
        puzzleBoxWeaponList.innerHTML = '';
        if (weapons.length === 0) {
            puzzleBoxWeaponList.innerHTML = '<div style="color: #999; font-size: 13px;">武器がありません</div>';
        } else {
            weapons.forEach(weapon => {
                const div = document.createElement('div');
                div.className = 'checkbox-group';
                div.style.margin = '4px 0';
                div.innerHTML = `
                    <input type="checkbox" id="pbWeapon_${weapon.id}" value="${weapon.id}">
                    <label for="pbWeapon_${weapon.id}">${weapon.name} #${weapon.id}</label>
                `;
                puzzleBoxWeaponList.appendChild(div);
            });
        }
    }

    // パズルボックス - バナナ
    if (puzzleBoxBananaList) {
        puzzleBoxBananaList.innerHTML = '';
        const bananas = items.filter(item => item.type === 'banana');
        if (bananas.length === 0) {
            puzzleBoxBananaList.innerHTML = '<div style="color: #999; font-size: 13px;">バナナがありません</div>';
        } else {
            bananas.forEach(banana => {
                const div = document.createElement('div');
                div.className = 'checkbox-group';
                div.style.margin = '4px 0';
                div.innerHTML = `
                    <input type="checkbox" id="pbBanana_${banana.id}" value="${banana.id}">
                    <label for="pbBanana_${banana.id}">${banana.name}</label>
                `;
                puzzleBoxBananaList.appendChild(div);
            });
        }
    }

    // サルでもわかる鍛冶 - 各アイテムごとの武器リスト
    const monkeyBlacksmiths = items.filter(item => item.type === 'monkey_blacksmith');
    monkeyBlacksmiths.forEach(mbItem => {
        const monkeyWeaponList = document.getElementById(`mbWeaponList_${mbItem.id}`);
        if (monkeyWeaponList) {
            monkeyWeaponList.innerHTML = '';
            if (weapons.length === 0) {
                monkeyWeaponList.innerHTML = '<div style="color: #999; font-size: 13px;">武器がありません</div>';
            } else {
                weapons.forEach(weapon => {
                    const div = document.createElement('div');
                    div.className = 'checkbox-group';
                    div.style.margin = '4px 0';
                    div.innerHTML = `
                        <input type="checkbox" id="mbWeapon_${mbItem.id}_${weapon.id}" value="${weapon.id}">
                        <label for="mbWeapon_${mbItem.id}_${weapon.id}">${weapon.name} #${weapon.id}</label>
                    `;
                    monkeyWeaponList.appendChild(div);
                });
            }
        }
    });
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
                            <input type="number" value="${weapon.haste}" step="10" min="0"
                                   onchange="updateWeapon(${weapon.id}, 'haste', this.value)">
                        </div>
                        <div class="input-group">
                            <label>スタミナ</label>
                            <input type="number" value="${weapon.stamina}" step="0.1" min="1"
                                   onchange="updateWeapon(${weapon.id}, 'stamina', this.value)">
                        </div>
                    </div>
                `;
        container.appendChild(div);
    });

    updateWeaponSelections();
}

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
        item[field] = (typeof value === 'string' && !isNaN(value)) ? parseFloat(value) : value;
    }
}

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
                        <input type="number" value="${item.haste}" step="10" min="0"
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
        } else if (item.type === 'courage_star') {
            div.innerHTML = `
        <div class="weapon-header">
            <input type="text" value="${item.name}" disabled style="flex: 1;">
            <button class="btn btn-danger" onclick="removeItem(${item.id})" style="padding: 4px 8px;">×</button>
        </div>
        <div class="weapon-stats">
            <div class="input-group">
                <label>スタミナ消費削減</label>
                <input type="number" value="${item.staminaReduction}" disabled>
                <div class="info-text">-${item.staminaReduction}%</div>
            </div>
        </div>
    `;
        } else if (item.type === 'monkey_blacksmith') {
            div.innerHTML = `
                <div class="weapon-header">
                    <input type="text" value="${item.name}" disabled style="flex: 1;">
                    <button class="btn btn-danger" onclick="removeItem(${item.id})" style="padding: 4px 8px;">×</button>
                </div>
                <div class="input-group">
                    <label>星の範囲内の合成武器（スタミナ消費-25%）</label>
                    <div id="mbWeaponList_${item.id}" style="max-height: 120px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 8px; background: #f8f9fa; margin-top: 8px;">
                        <!-- 武器チェックボックスを動的生成 -->
                    </div>
                </div>
            `;
        }

        container.appendChild(div);
    });
    updateWeaponSelections(); // 追加
}

// パズルボックスによる加速補正を取得
function getPuzzleBoxHaste(time, itemId, itemType) {
    // このアイテムがパズルボックス内にあるかチェック
    let isInBox = false;
    if (itemType === 'weapon') {
        const checkbox = document.getElementById(`pbWeapon_${itemId}`);
        isInBox = checkbox && checkbox.checked;
    } else if (itemType === 'banana') {
        const checkbox = document.getElementById(`pbBanana_${itemId}`);
        isInBox = checkbox && checkbox.checked;
    }

    if (!isInBox) return 0;

    // 時間による効果切り替え
    if (time < 5) {
        return -20; // -20%
    } else {
        return 55; // +55%
    }
}

// スタミナシミュレーション
function simulate() {
    const duration = parseFloat(document.getElementById('simDuration').value);
    const dt = 0.02; // 時間刻み
    const steps = Math.floor(duration / dt);

    // パラメータ取得
    const initialHeat = parseFloat(document.getElementById('initialHeat').value);
    const freezeStacks = parseFloat(document.getElementById('freezeStacks').value);
    // ヒート・フリーズによる加速補正（%）
    const heatFreezeHaste = (initialHeat * 2) - (freezeStacks * 2);


    // デバッグ：武器の初期クールダウン計算
    console.log('--- 武器の初期クールダウン計算 ---');
    weapons.forEach(weapon => {
        const puzzleBoxHaste = getPuzzleBoxHaste(0, weapon.id, 'weapon');
        const totalHaste = weapon.haste + puzzleBoxHaste + heatFreezeHaste;
        const effectiveCd = weapon.cooldown / (1 + totalHaste / 100);
        console.log(`${weapon.name}: base=${weapon.cooldown}s, haste=${weapon.haste}%, pbHaste=${puzzleBoxHaste}%, total=${totalHaste}%, effective=${effectiveCd}s`);
    });

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

    // 武器ごとのクールダウン進行度トラッカー（0～1、1で発動）
    const weaponCooldownProgress = weapons.map(() => 0);

    // バナナアイテムの取得と進行度初期化
    const bananas = items.filter(item => item.type === 'banana');
    const bananaCooldownProgress = bananas.map(() => 0);

    // ヒーローポーション
    const heroPotions = items.filter(item => item.type === 'hero_potion');
    let heroPotionUsed = 0;
    const totalHeroPotions = heroPotions.reduce((sum, potion) => sum + potion.count, 0);
    const heroPotionRecovery = heroPotions.length > 0 ? heroPotions[0].recovery : 0;

    // 勇気の星によるスタミナ消費削減
    const courageStars = items.filter(item => item.type === 'courage_star');
    const courageStarReduction = courageStars.length > 0 ? courageStars[0].staminaReduction : 0;

    // サルでもわかる鍛冶によるスタミナ消費削減
    const monkeyBlacksmiths = items.filter(item => item.type === 'monkey_blacksmith');
    const hasMonkeyBlacksmith = monkeyBlacksmiths.length > 0;
    const monkeyBlacksmithReduction = hasMonkeyBlacksmith ? monkeyBlacksmiths[0].staminaReduction : 0;

    // シミュレーション
    for (let step = 0; step <= steps; step++) {
        const time = step * dt;

        // 自然回復（1秒に1スタミナ）
        stamina = Math.min(stamina + dt, maxStamina);

        // バナナ
        bananas.forEach((banana, idx) => {
            // 現在の加速率を計算
            const puzzleBoxHaste = getPuzzleBoxHaste(time, banana.id, 'banana');
            const totalHaste = Number(banana.haste) + Number(puzzleBoxHaste) + Number(heatFreezeHaste);
            const effectiveBananaCd = banana.cooldown / (1 + totalHaste / 100);

            // 進行度を更新
            bananaCooldownProgress[idx] += dt / effectiveBananaCd;

            // 進行度が1以上になったら発動
            if (bananaCooldownProgress[idx] >= 1) {
                stamina = Math.min(stamina + banana.recovery, maxStamina);
                bananaCooldownProgress[idx] -= 1;
            }
        });

        // 武器の攻撃処理
        weapons.forEach((weapon, idx) => {
            // 現在の加速率を計算
            const puzzleBoxHaste = getPuzzleBoxHaste(time, weapon.id, 'weapon');
            const totalHaste = Number(weapon.haste) + Number(puzzleBoxHaste) + Number(heatFreezeHaste);
            const effectiveCd = weapon.cooldown / (1 + totalHaste / 100);

            // スタミナ消費削減を計算
            let totalReduction = courageStarReduction;
            // サルでもわかる鍛冶の効果チェック
            if (hasMonkeyBlacksmith) {
                monkeyBlacksmiths.forEach(mbItem => {
                    const checkbox = document.getElementById(`mbWeapon_${mbItem.id}_${weapon.id}`);
                    if (checkbox && checkbox.checked) {
                        totalReduction += monkeyBlacksmithReduction;
                    }
                });
            }

            const actualStamina = weapon.stamina * (1 - totalReduction / 100);

            // 進行度を更新（dtをクールダウンで割った値を加算）
            weaponCooldownProgress[idx] += dt / effectiveCd;

            // 進行度が1以上になったら発動
            if (weaponCooldownProgress[idx] >= 1) {

                if (stamina >= actualStamina) {
                    // 攻撃成功
                    stamina -= actualStamina;
                    weaponFires.push({
                        time: time,
                        weapon: weapon.name,
                        weaponId: weapon.id,
                        color: weapon.color,
                        success: true
                    });
                    weaponCooldownProgress[idx] -= 1; // 進行度をリセット（余剰分は保持）
                } else {
                    // スタミナ不足
                    // ヒーローポーションがあれば使用
                    if (heroPotionUsed < totalHeroPotions && stamina + heroPotionRecovery >= actualStamina) {
                        stamina = Math.min(stamina + heroPotionRecovery, maxStamina);
                        heroPotionUsed++;

                        // ポーション使用後に攻撃成功
                        stamina -= actualStamina;
                        weaponFires.push({
                            time: time,
                            weapon: weapon.name,
                            weaponId: weapon.id,
                            color: weapon.color,
                            success: true
                        });
                        weaponCooldownProgress[idx] -= 1;
                    } else {
                        // スタミナ切れ
                        weaponFires.push({
                            time: time,
                            weapon: weapon.name,
                            weaponId: weapon.id,
                            color: weapon.color,
                            success: false
                        });
                        weaponCooldownProgress[idx] -= 1;
                    }
                }
            }
        });

        // データ記録
        timePoints.push(time);
        staminaValues.push(stamina);
    }

    let results = {
        timePoints,
        staminaValues,
        weaponFires,
        maxStamina
    };

    // デバッグ：武器の発射記録
    console.log('--- 武器の発射記録 ---');
    const weaponFireCount = {};
    results.weaponFires.forEach(fire => {
        const key = `${fire.weapon} (${fire.success ? '成功' : '失敗'})`;
        weaponFireCount[key] = (weaponFireCount[key] || 0) + 1;
    });
    Object.entries(weaponFireCount).forEach(([key, count]) => {
        console.log(`${key}: ${count}回`);
    });

    return results;

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
        // 武器IDのみをキーにする（成功/失敗を区別しない）
        const key = fire.weaponId;

        if (!weaponDatasets[key]) {
            weaponDatasets[key] = {
                label: fire.weapon, // 武器名のみ
                successData: [],
                failData: []
            };
        }

        if (fire.success) {
            weaponDatasets[key].successData.push({
                x: fire.time,
                y: 0
            });
        } else {
            weaponDatasets[key].failData.push({
                x: fire.time,
                y: 0
            });
        }
    });

    // Chart.js用のデータセットに変換
    const chartDatasets = [];
    Object.entries(weaponDatasets).forEach(([weaponId, dataset]) => {
        const weapon = weapons.find(w => w.id == weaponId);

        // 成功データ
        if (dataset.successData.length > 0) {
            chartDatasets.push({
                label: `${dataset.label} #${weaponId}`, // IDを追加
                data: dataset.successData,
                backgroundColor: weapon.color,
                borderColor: weapon.color,
                pointRadius: 4,
                pointStyle: 'circle',
                showLine: false,
                order: 1
            });
        }

        // 失敗データ
        if (dataset.failData.length > 0) {
            chartDatasets.push({
                label: `${dataset.label} #${weaponId}`, // IDを追加
                data: dataset.failData,
                backgroundColor: weapon.color,
                borderColor: weapon.color,
                pointRadius: 6,
                pointStyle: 'crossRot',
                showLine: false,
                order: 1,
            });
        }
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
                ...chartDatasets
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
                    position: 'top',
                    labels: {
                        filter: function(legendItem, chartData) {
                            // 同じラベルが既に存在する場合は2つ目以降を非表示
                            const datasets = chartData.datasets;
                            const currentLabel = legendItem.text;
                            const currentIndex = legendItem.datasetIndex;

                            for (let i = 0; i < currentIndex; i++) {
                                if (datasets[i].label === currentLabel) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    }
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

// セクション表示切り替え
function toggleSection(sectionId, show) {
    const section = document.getElementById(sectionId);
    section.style.display = show ? 'block' : 'none';
}

// 計算実行
function calculate() {
    if (weapons.length === 0) {
        return;
    }

    // デバッグ用：現在の状態を表示
    console.log('=== 計算開始 ===');
    console.log('武器一覧:');
    weapons.forEach((weapon, idx) => {
        console.log(`  [${idx}] ${weapon.name} (ID: ${weapon.id})`);
        console.log(`      CD: ${weapon.cooldown}s, 加速: ${weapon.haste}%, スタミナ: ${weapon.stamina}`);
        console.log(`      色: ${weapon.color}`);
    });

    console.log('アイテム一覧:');
    items.forEach((item, idx) => {
        console.log(`  [${idx}] ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        if (item.type === 'banana') {
            console.log(`      CD: ${item.cooldown}s, 加速: ${item.haste}%, 回復: ${item.recovery}`);
        } else if (item.type === 'hero_potion') {
            console.log(`      個数: ${item.count}, 回復: ${item.recovery}`);
        } else if (item.type === 'stamina_bag') {
            console.log(`      個数: ${item.count}, 最大値ボーナス: ${item.maxBonus}`);
        } else if (item.type === 'courage_star') {
            console.log(`      スタミナ消費削減: -${item.staminaReduction}%`);
        } else if (item.type === 'monkey_blacksmith') {
            console.log(`      スタミナ消費削減: -${item.staminaReduction}%（星範囲内）`);
        }

    });

    const initialHeat = parseFloat(document.getElementById('initialHeat').value);
    const freezeStacks = parseFloat(document.getElementById('freezeStacks').value);
    const heatFreezeHaste = (initialHeat * 2) - (freezeStacks * 2);
    console.log(`ヒート/フリーズ: ヒート=${initialHeat}, フリーズ=${freezeStacks}, 合計加速=${heatFreezeHaste}%`);

    const weaponCheckboxes = weapons.filter(w => {
        const cb = document.getElementById(`pbWeapon_${w.id}`);
        return cb && cb.checked;
    }).map(w => w.name);

    const bananaCheckboxes = items.filter(item => {
        if (item.type !== 'banana') return false;
        const cb = document.getElementById(`pbBanana_${item.id}`);
        return cb && cb.checked;
    }).map(item => item.name);

    if (weaponCheckboxes.length > 0 || bananaCheckboxes.length > 0) {
        console.log('パズルボックス: 有効');
        console.log(`  武器: ${weaponCheckboxes.join(', ') || 'なし'}`);
        console.log(`  バナナ: ${bananaCheckboxes.join(', ') || 'なし'}`);
    } else {
        console.log('パズルボックス: 無効');
    }

    // サルでもわかる鍛冶のチェック
    const monkeyBlacksmiths = items.filter(item => item.type === 'monkey_blacksmith');
    monkeyBlacksmiths.forEach(mbItem => {
        const selectedWeapons = weapons.filter(w => {
            const cb = document.getElementById(`mbWeapon_${mbItem.id}_${w.id}`);
            return cb && cb.checked;
        }).map(w => `${w.name} #${w.id}`);

        if (selectedWeapons.length > 0) {
            console.log(`サルでもわかる鍛冶 (ID: ${mbItem.id}): ${selectedWeapons.join(', ')}`);
        }
    });
    console.log('================');

    const results = simulate();
    drawChart(results);
    displayAnalysis(results);
}

// ページ読み込み時
window.addEventListener('load', init);
