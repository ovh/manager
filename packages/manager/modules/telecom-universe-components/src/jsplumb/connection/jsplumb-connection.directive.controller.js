export default function () {
  const self = this;

  self.connection = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
   *  Directive initialization
   */
  self.$onInit = function $onInit() {
    if (!self.target) {
      throw new Error(
        'target options must be specified when instanciating a jsplumb connection.',
      );
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
