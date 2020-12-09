export default /* @ngInject */ function (OvhApiOverTheBox) {
  const self = this;

  /*= ============================
    =            COUNT            =
    ============================= */

  self.getCount = function getCount() {
    return OvhApiOverTheBox.v6()
      .query()
      .$promise.then((otbIds) => otbIds.length);
  };

  /* -----  End of COUNT  ------*/
}
