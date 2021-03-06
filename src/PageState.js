import { Page } from "./types/Page.js";
import {
  getKeyByObjectPropertyValue,
} from "./utils.js";

export class PageState extends Page {
  constructor() {
    super();
    this._currentPage = new Page();
  }

  // NOTE: When a item in the page state isn't a string (e.g it is a array or object),
  // you need to add helper methods to mutate it or else it wont save.
  // example: currentSecretPath is a array so when you try to .push() to it
  // it will modify the object that was getted from this class
  // then when you try to access it again, there will be a different object.
  // I guess you could make another class that emulates a Array or Map 
  // by using a bunch of functions and modifying localStorage in order to remove some of
  // the clunkyness of this approach, but for now, this works.

  get currentBaseMount() {
    return localStorage.getItem('currentBaseMount') || "";
  }
  set currentBaseMount(value) {
    localStorage.setItem('currentBaseMount', value);
  }


  // Since this is a array we can't act directly on it so we need
  // functions to do the same modifications.
  // See the note at the start o
  popCurrentSecretPath() {
    let secPath = this.currentSecretPath;
    secPath.pop();
    this.currentSecretPath = secPath;
  }
  pushCurrentSecretPath(...args) {
    let secPath = this.currentSecretPath;
    secPath.push(...args);
    this.currentSecretPath = secPath;
  }
  get currentSecretPath() {
    return JSON.parse(localStorage.getItem('currentSecretPath') || "[]");
  }
  set currentSecretPath(value) {
    localStorage.setItem('currentSecretPath', JSON.stringify(value));
  }

  get currentSecretVersion() {
    return localStorage.getItem('currentSecretVersion') || "0";
  }
  set currentSecretVersion(value) {
    localStorage.setItem('currentSecretVersion', value);
  }

  get currentSecret() {
    return localStorage.getItem('currentSecret') || "";
  }
  set currentSecret(value) {
    localStorage.setItem('currentSecret', value);
  }

  get currentMountType() {
    return localStorage.getItem('currentMountType') || "";
  }
  set currentMountType(value) {
    localStorage.setItem('currentMountType', value);
  }
  get currentPage() {
    let curPage = localStorage.getItem('currentPage') || "HOME";
    return realPages[curPage];
  }
  set currentPage(value) {
    let key = getKeyByObjectPropertyValue(realPages, value);
    localStorage.setItem('currentPage', key);
  }
}