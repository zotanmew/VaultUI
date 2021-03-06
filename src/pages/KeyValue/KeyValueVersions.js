import { Page } from "../../types/Page.js";
import { getSecretMetadata } from "../../api.js";
import { setPageContent, setTitleElement, changePage } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";

export class KeyValueVersionsPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("KEY_VALUE_SECRETS");
  }
  async render() {
    setTitleElement(pageState);

    let versionsList = makeElement({
      tag: "ul",
      id: "versionsList",
      class: ["uk-nav", "uk-nav-default"]
    });
    setPageContent(versionsList);

    let metadata = await getSecretMetadata(
      pageState.currentBaseMount,
      pageState.currentSecretPath,
      pageState.currentSecret
    );

    new Map(Object.entries(metadata.versions)).forEach((_, ver) => {
      versionsList.appendChild(makeElement({
        tag: "li",
        children: makeElement({
          tag: "a",
          text: `v${ver}`,
          onclick: _ => {
            pageState.currentSecretVersion = ver;
            changePage("KEY_VALUE_SECRETS");
          }
        })
      }));
    });
  }

  get titlePrefix() {
    return " (versions)";
  }

  get name() {
    return "K/V Versions";
  }
}