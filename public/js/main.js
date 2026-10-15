async function loadBoxes() {
    try {
        const response = await fetch('/api/boxes');
        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }
        const boxes = await response.json();
        
        const catalogGrid = document.getElementById('catalog-grid');
        if (catalogGrid && boxes.length > 0) {
            catalogGrid.innerHTML = boxes.map(box => `
                <div class="glass-card">
                    <div class="box-image">🎁</div>
                    <h3>${box.BoxName}</h3>
                    <p style="color: #ff0033; font-weight: 900; font-size: 20px;">${box.Price} ₽</p>
                    <button class="btn-glow" onclick="openBox(${box.BoxID})" style="width: 100%; padding: 10px;">Открыть</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Не удалось загрузить боксы:', error);
    }
}

function openBox(boxId) {
    alert(`Открываем бокс №${boxId}!`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadBoxes();
});