import UIkit from 'uikit/dist/js/uikit.min.js';
import { makeElement } from "./htmlUtils.js";


export function setErrorText(text) {
  let errorTextElement = document.querySelector("#errorText");
  if (errorTextElement) {
    document.querySelector("#errorText").innerText = `Error: ${text}`;
  }
  UIkit.notification({
    message: `Error: ${text}`,
    status: 'danger',
    pos: 'top-center',
    timeout: 2000
  });
}

export function changePage(page) {
  if (pageState.currentPage) {
    pageState.currentPage.cleanup();
  }
  if (typeof page == 'object') {
    pageState.currentPage = page;
  } else {
    pageState.currentPage = realPages[page];
  }
  renderPage();
}

export function renderPage() {
  console.log("Rendering Page: ", pageState.currentPage.name);
  document.querySelector("#pageContent").innerHTML = "";
  setPageTitle(pageState.currentPage.name);
  pageState.currentPage.render();
}

export function setPageTitle(title) {
  let pageTitle = document.getElementById("pageTitle");
  pageTitle.innerHTML = "";
  if (typeof title === "string" || title instanceof String) {
    pageTitle.innerText = title;
  } else {
    pageTitle.appendChild(title);
  }
}

function currentTitleSecretText() {
  let currentSecretText = pageState.currentSecret;
  currentSecretText += pageState.currentPage.titlePrefix;

  if (pageState.currentSecretVersion != "0") currentSecretText += ` (v${pageState.currentSecretVersion})`;
  return currentSecretText;
}

export function setTitleElement(pageState) {
  const titleElement = makeElement({
    tag: "div",
    children: [
      makeElement({
        tag: "a",
        text: pageState.currentBaseMount + " ",
        onclick: _ => {
          pageState.currentSecretPath = [];
          pageState.currentSecret = "";
          pageState.currentSecretVersion = "0";

          if (pageState.currentMountType.startsWith("kv") || pageState.currentMountType == "cubbyhole") {
            changePage("KEY_VALUE_VIEW");
          } else if (pageState.currentMountType == "totp"){
            changePage("TOTP");
          } else if (pageState.currentMountType == "transit") {
            changePage("TRANSIT_VIEW");
          }
        }
      }),
      ...pageState.currentSecretPath.map(function (secretPath, index, secretPaths) {
        return makeElement({
          tag: "a",
          text: secretPath + " ",
          onclick: _ => {
            if (pageState.currentMountType.startsWith("kv")) {
              pageState.currentSecretPath = secretPaths.slice(0, index + 1);
              changePage("KEY_VALUE_VIEW");
            }
          }
        });
      }),
      makeElement({
        tag: "span",
        condition: pageState.currentSecret.length != 0,
        text: currentTitleSecretText()
      })
    ]
  });
  setPageTitle(titleElement);
  return titleElement;
}

export function setPageContent(content) {
  let pageContent = document.getElementById("pageContent");
  if (typeof content === "string" || content instanceof String) {
    pageContent.innerHTML = content;
  } else {
    pageContent.innerHTML = "";
    pageContent.appendChild(content);
  }
}