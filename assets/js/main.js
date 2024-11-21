const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accesoryCheckboxes = document.querySelectorAll('.accesory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

const basePrice = 1680000;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
    'Специальные диски': false,
    'Модель первого класса': false,
    'Добавить полный автопилот': false,
};

const pricing = {
    'Специальные диски': 15000,
    'Модель первого класса': 50000,
    'Добавить полный автопилот': 85000,
    'Аксессуары': {
        'Поддоны к центральной консоли': 3500,
        'Тонирование': 10500,
        'Погодные улучшения': 2200,
    }
}

const updateTotalPrice = () => {
    currentPrice = basePrice;

    if (selectedOptions['Специальные диски']) {
        currentPrice += pricing['Специальные диски']
    }

    if (selectedOptions['Модель первого класса']) {
        currentPrice += pricing['Модель первого класса']
    }

    if (selectedOptions['Добавить полный автопилот']) {
        currentPrice += pricing['Добавить полный автопилот']
    }

    accesoryCheckboxes.forEach((checkbox) => {
        const accesoryLabel = checkbox
            .closest('label')
            .querySelector('span')
            .textContent.trim();

        const accesoryPrice = pricing['Аксессуары'][accesoryLabel];

        if (checkbox.checked) {
            currentPrice += accesoryPrice;
        }
    });

    totalPriceElement.textContent = `${currentPrice.toLocaleString()}₽`;
    updatePaymentBreakdown();
}

const updatePaymentBreakdown = () => {
    const downPayment = currentPrice*0.1;
    downPaymentElement.textContent = `${downPayment.toLocaleString()}₽`;

    // 60 месяцев, 3% годовых
    const loanTermMonths = 60;
    const interestRate = 0.03;
    
    const loanAmount = currentPrice - downPayment;

    // Формула платежа в месяц P * (r(1+r)^n)/((1+r)^n-1)
    const monthIntInterestRate = interestRate/12;

    const monthlyPayment = (loanAmount * (monthIntInterestRate * Math.pow(1+monthIntInterestRate, loanTermMonths)))/(Math.pow(1+monthIntInterestRate, loanTermMonths)-1);

    monthlyPaymentElement.textContent = `${monthlyPayment
        .toFixed(2)
        .toLocaleString()}₽`;
};

const exteriorImages = {
    'Stealth Grey': 'assets/img/car-configurator/model-y-stealth-grey.jpg',
    'Pearl White': 'assets/img/car-configurator/model-y-pearl-white.jpg',
    'Deep Blue': 'assets/img/car-configurator/model-y-deep-blue-metallic.jpg',
    'Solid Black': 'assets/img/car-configurator/model-y-solid-black.jpg',
    'Ultra Red': 'assets/img/car-configurator/model-y-ultra-red.jpg',
    'Quicksilver': 'assets/img/car-configurator/model-y-quicksilver.jpg'
}

const interiorImages = {
    Dark: 'assets/img/car-configurator/model-y-interior-dark.jpg',
    Light: 'assets/img/car-configurator/model-y-interior-light.jpg'
}

const handleColorButtonClick = (event) => {
    let button;

    if (event.target.tagName === 'IMG') {
        button = event.target.closest('button');
    } else if (event.target.tagName === 'BUTTON') {
        button = event.target;
    }

    if (button) {
        const buttons = event.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');

        if (event.currentTarget === exteriorColorSection) {
            selectedColor = button.querySelector('img').alt;
            updateExteriorImage();
        }

        if (event.currentTarget === interiorColorSection) {
            const color = button.querySelector('img').alt;
            interiorImage.src = interiorImages[color];
        }
    }
};

const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Специальные диски'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
}

const handleWheelButtonClick = (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

        event.target.classList.add('bg-gray-700', 'text-white');

        selectedOptions['Специальные диски'] = event.target.textContent.includes('Специальные');
        updateExteriorImage();

        updateTotalPrice();
    }
}

const handlePerformanceButtonClick = () => {
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    selectedOptions['Модель первого класса'] = isSelected;
    updateTotalPrice();
};

const fullSelfDrivingChange = () => {
    const isSelected = fullSelfDrivingCheckbox.checked;
    selectedOptions['Добавить полный автопилот'] = isSelected;
    updateTotalPrice();
};

accesoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => updateTotalPrice());
});

updateTotalPrice();

exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('click', fullSelfDrivingChange);