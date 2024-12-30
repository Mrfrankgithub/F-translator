const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form .buttonGet");

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "NGN" ? "selected" : "";
    }
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (code in country_code) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  const exchangeRateTxt = document.querySelector(".exchange-rate");
  let amountVal = amount.value;
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Exchange rate loading...";

  // Primary API (ExchangeRate-API)
  let url = `https://v6.exchangerate-api.com/v6/4b7ba5f116717ba75eb7215f/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      if (result.conversion_rates) {
        const exchangeRate = result.conversion_rates[toCurrency.value];
        const totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
      } else {
        // If primary API fails, use fallback API
        getExchangeRateFallback(amountVal);
      }
    })
    .catch(() => {
      // Fallback to Currency API
      getExchangeRateFallback(amountVal);
    });
}

function getExchangeRateFallback(amountVal) {
  const exchangeRateTxt = document.querySelector(".exchange-rate");

  // Fallback API (Currency API)
  let fallbackUrl = `https://api.currencyapi.com/v3/latest?apikey=cur_live_OzBfL6IFwTKu9CcSDSWGsjR74YPJLbSzHwugOcBW&base_currency=${fromCurrency.value}`;
  fetch(fallbackUrl)
    .then((response) => response.json())
    .then((result) => {
      const exchangeRate = result.data[toCurrency.value].value;
      const totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Both APIs failed. Please try again later.";
    });
}
