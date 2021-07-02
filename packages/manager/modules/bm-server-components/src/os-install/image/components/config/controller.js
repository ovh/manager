export default class BmServerComponentsOsInstallImageConfigCtrl {
  addHttpHeader() {
    this.model.httpHeader.push({
      added: false,
      model: {},
    });
  }

  /*= =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    [this.model.imageType] = this.imageTypeEnum;
    [this.model.checkSumType] = this.checksumTypeEnum;
    this.addHttpHeader();
  }

  /* -----  End of Initialization  ------*/

  /*= =============================
  =            Events            =
  ============================== */

  onHttpHeaderAddBtnClick(index) {
    this.model.httpHeader[index].added = true;
    this.addHttpHeader();
  }

  onHttpHeaderDeleteBtnClick(index) {
    this.model.httpHeader.splice(index, 1);
  }

  /* -----  End of Events  ------*/
}
