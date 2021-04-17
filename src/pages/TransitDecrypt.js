import { Page } from "../types/Page.js";
import { transitDecrypt } from "../api.js";
import { setPageContent, setTitleElement, setErrorText } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { Margin } from "../elements/Margin.js";
import { CopyableModal } from "../elements/CopyableModal.js";
import UIkit from 'uikit/dist/js/uikit.min.js';


export class TransitDecryptPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage(pages.TRANSIT_VIEW_SECRET);
  }
  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div"
    }));
    this.transitDecryptForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "textarea",
          class: ["uk-textarea", "uk-form-width-medium"],
          attributes: {
            placeholder: "Ciphertext",
            name: "ciphertext",
          }
        })),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Decrypt",
          attributes: {
            type: "submit",
          }
        })
      ]
    });
    setPageContent(this.transitDecryptForm);
    this.transitDecryptForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.transitEncryptFormHandler();
    }.bind(this));
  }

  transitEncryptFormHandler() {
    let formData = new FormData(this.transitDecryptForm);

    transitDecrypt(pageState.currentBaseMount, pageState.currentSecret, formData.get("ciphertext")).then(res => {
      let modal = CopyableModal("Decryption Result", res.plaintext);
      pageContent.appendChild(modal);
      UIkit.modal(modal).show();
    }).catch(e => {
      setErrorText(`API Error: ${e.message}`);
    });
  }

  get name() {
    return "Transit Decrypt";
  }
}