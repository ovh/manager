export default /* @ngInject */ function (OvhApiFreeFax) {
  const self = this;

  /*= ============================
    =            COUNT            =
    ============================= */

  self.getCount = function getCount() {
    return OvhApiFreeFax.v7()
      .query()
      .execute()
      .$promise.then((freeFaxIds) => freeFaxIds.length);
  };

  /* -----  End of COUNT  ------*/
}
