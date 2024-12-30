document.addEventListener("DOMContentLoaded", () => {
  const fromText = document.querySelector(".from-text");
  const toText = document.querySelector(".to-text");
  const selectTags = document.querySelectorAll("select");
  const exchangeIcon = document.querySelector(".exchange");
  const countValue = document.querySelector(".code_length");
  const translateBtn = document.querySelector(".translate-btn");

  // Populate language options
  selectTags.forEach((selectTag, id) => {
    for (const country_code in language) {
      let selected =
        id === 0 && country_code === "en-GB"
          ? "selected"
          : id === 1 && country_code === "hi"
          ? "selected"
          : "";
      let option = `<option value="${country_code}" ${selected}>${language[country_code]}</option>`;
      selectTag.insertAdjacentHTML("beforeend", option);
    }
  });

  // Exchange text and languages
  exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTags[0].value;
    fromText.value = toText.value;
    selectTags[0].value = selectTags[1].value;
    toText.value = tempText;
    selectTags[1].value = tempLang;
    translateText();
  });

  // Update character count
  fromText.addEventListener("input", () => {
    countValue.textContent = `${fromText.value.length}/5,000`;
  });

  // Translate text when clicking the button
  translateBtn.addEventListener("click", translateText);

  // Copy functionality
  document.querySelectorAll(".bx").forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
      let textToCopy =
        target.id === "copy-from" ? fromText.value : toText.value;
      if (!textToCopy) {
        toastr.error("Nothing to copy!");
        return;
      }
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toastr.success("Copied successfully!");
        })
        .catch((err) => {
          toastr.warning("Copy failed!");
          console.error("Copy error:", err);
        });
    });
  });

  // Translate function
  function translateText() {
    let text = fromText.value;
    let translateFrom = selectTags[0].value;
    let translateTo = selectTags[1].value;

    if (!text) {
      toastr.warning("Please enter text to translate!");
      return;
    }

    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${translateFrom}|${translateTo}`;

    // Primary API: MyMemory Translator
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.responseData.translatedText) {
          toText.value = data.responseData.translatedText;
          toText.setAttribute("placeholder", "Translation complete");
        } else {
          // Use fallback API if primary fails
          translateWithFallback(text, translateFrom, translateTo);
        }
      })
      .catch((err) => {
        console.error("Error translating with primary API:", err);
        // Use fallback API if an error occurs
        translateWithFallback(text, translateFrom, translateTo);
      });
  }

  // Fallback API: Lingva Translate
  function translateWithFallback(text, fromLang, toLang) {
    let fallbackUrl = `https://lingva.ml/api/v1/translate/${fromLang}/${toLang}/${encodeURIComponent(
      text
    )}`;

    fetch(fallbackUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.translation) {
          toText.value = data.translation;
          toText.setAttribute("placeholder", "Translation complete");
        } else {
          toText.value = "Translation failed. Please try again later.";
          toText.setAttribute("placeholder", "Error during translation");
        }
      })
      .catch((err) => {
        console.error("Error translating with fallback API:", err);
        toText.value = "Both APIs failed. Please try again later.";
        toText.setAttribute("placeholder", "Error during translation");
      });
  }

  // Speech functionality
  document.querySelector(".toSpeakIcon").addEventListener("click", () => {
    if (toText.value.trim() !== "") {
      let utterance = new SpeechSynthesisUtterance(toText.value);
      utterance.lang = selectTags[1].value;
      speechSynthesis.speak(utterance);
      toastr.success("Speaking text!");
    } else {
      toastr.error("No text available for speech synthesis");
    }
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered: ", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed: ", error);
      });
  });
}
