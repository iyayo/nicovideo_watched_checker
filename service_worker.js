const re = new RegExp(/https:\/\/www\.nicovideo\.jp\/my\/watchlater.*/);

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (details.frameId !== 0) return;

  if (re.test(details.url)) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: () => {
          const button = document.createElement("button");
          button.className = "ContinuousPlayButton WatchLaterMenu-continuous";
          button.innerText = "視聴済みチェッカーEX";
          button.addEventListener("click", select_watched);

          function select_watched() {
            const array = document.querySelectorAll("div.NC-VideoPlaybackIndicator-inner[style='transform: scaleX(1);']");

            array.forEach(element => {
              const checkbox = element.closest("div.CheckboxVideoMediaObject.WatchLaterListItem.WatchLaterList-item.CheckboxVideoMediaObject_withFooter").getElementsByClassName("Checkbox-input")[0];

              if (!checkbox.checked) checkbox.click();
            });

            button.innerText = `${array.length}件の視聴済みを選択しました`;

            setTimeout(() => { button.innerText = "視聴済みチェッカーEX" }, 2000);
          }

          const interval = setInterval(() => {
            const container = document.querySelector("div.WatchLaterMenu");
            const before = document.querySelector("nav.Pagination.WatchLaterMenu-pagination");

            if (!container || !before) return;

            container.insertBefore(button, before);

            clearInterval(interval);
          }, 500);
      },
    });
  }
})