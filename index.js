class SnowflakeCalculator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.initializeApp();
    }

    initializeElements() {
        this.form = document.getElementById('calculatorForm');
        this.warehouse = document.getElementById('warehouse');
        this.isGen2 = document.getElementById('isGen2');
        this.cloudProvider = document.getElementById('cloudProvider');
        this.cloudProviderContainer = document.getElementById('cloudProviderContainer');
        this.minutes = document.getElementById('minutes');
        this.cost = document.getElementById('cost');
        this.multiplier = document.getElementById('multiplier');
        this.result = document.getElementById('result');
    }

    attachEventListeners() {
        ['warehouse', 'minutes', 'cost', 'multiplier', 'cloudProvider'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.calculate());
        });

        this.isGen2.addEventListener('change', () => {
            this.cloudProviderContainer.style.display = this.isGen2.checked ? 'flex' : 'none';
            this.calculate();
        });

        this.form.addEventListener('submit', (e) => e.preventDefault());
    }

    initializeApp() {
        this.retrieveFromCookie();
        document.getElementById('page').classList.remove('hidden');
    }

    calculate() {
        const warehouseMultiplier = parseInt(this.warehouse.value) || 0;
        const runtimeMinutes = parseFloat(this.minutes.value) || 0;
        let costPerCredit = parseFloat(this.cost.value) || 0;
        const multiplierValue = parseInt(this.multiplier.value);

        // Apply Gen 2 warehouse cloud provider multiplier if checked
        if (this.isGen2.checked) {
            const cloudProviderValue = this.cloudProvider.value;
            const cloudMultipliers = {
                'aws': 1.35,
                'gcp': 1.35,
                'azure': 1.25
            };
            
            if (cloudProviderValue in cloudMultipliers) {
                costPerCredit *= cloudMultipliers[cloudProviderValue];
            }
        }

        const baseResult = warehouseMultiplier * runtimeMinutes / 60 * costPerCredit;
        const formattedBase = this.formatCurrency(baseResult);

        let resultText = `Total cost: ${formattedBase}`;

        if (!isNaN(multiplierValue)) {
            const annualCost = baseResult * multiplierValue;
            resultText += `/run or ${this.formatCurrency(annualCost)}/year`;
        }

        this.result.innerHTML = resultText;
        this.saveToCookie(warehouseMultiplier, runtimeMinutes, costPerCredit, this.isGen2.checked, this.cloudProvider.value);
    }

    formatCurrency(amount) {
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    saveToCookie(warehouseMultiplier, runtimeMinutes, costPerCredit, isGen2, cloudProvider) {
        const oneYear = new Date(Date.now() + 31536000000).toUTCString();
        const cookies = [
            [`warehouseMultiplier=${warehouseMultiplier}`, oneYear],
            [`runtimeMinutes=${runtimeMinutes}`, oneYear],
            [`costPerCredit=${costPerCredit}`, oneYear],
            [`isGen2=${isGen2}`, oneYear],
            [`cloudProvider=${cloudProvider}`, oneYear]
        ];

        cookies.forEach(([value, expires]) => {
            document.cookie = `${value};expires=${expires};path=/;SameSite=Strict`;
        });
    }

    retrieveFromCookie() {
        const cookies = Object.fromEntries(
            document.cookie.split(';')
                .map(cookie => cookie.trim().split('='))
        );

        this.warehouse.value = parseInt(cookies.warehouseMultiplier) || 1;
        this.minutes.value = parseFloat(cookies.runtimeMinutes) || 60;
        this.cost.value = parseFloat(cookies.costPerCredit) || 2.00;
        
        if (cookies.isGen2 === 'true') {
            this.isGen2.checked = true;
            this.cloudProviderContainer.style.display = 'flex';
            
            if (cookies.cloudProvider) {
                this.cloudProvider.value = cookies.cloudProvider;
            }
        }

        this.calculate();
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }
}

// Initialize the calculator when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SnowflakeCalculator();
});

function showModal() {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
