import { DEDICATEDCLOUD_MAILING_LIST } from './dedicatedCloud-mailing-list-subscribe.constant';

export default class {
  /* @ngInject */
  constructor($translate, dedicatedCloudMailingList, User) {
    this.$translate = $translate;
    this.dedicatedCloudMailingList = dedicatedCloudMailingList;
    this.User = User;

    // controller attributes
    this.loading = {
      init: false,
      subscribe: false,
    };

    this.canSuscribe = true;
    this.model = {
      email: null,
    };

    this.pccMl = DEDICATEDCLOUD_MAILING_LIST;
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onWidzardFinish() {
    this.loading.subscribe = true;

    return this.dedicatedCloudMailingList
      .postMailingList(this.model.email, this.pccMl)
      .then(() =>
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_subscribe_mailing_step2_success',
            {
              t0: this.model.email,
            },
          )}`,
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_subscribe_mailing_step2_error',
            {
              t0: this.model.email,
            },
          )}: ${error.message || error}`,
          'danger',
        ),
      )
      .finally(() => {
        this.loading.subscribe = false;
      });
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;

    // need to check if user can subscribe to ML
    return this.dedicatedCloudMailingList
      .getAvailableMailingLists()
      .then((mailingLists) => {
        this.canSubscribe = mailingLists.indexOf(this.pccMl) > -1;

        if (this.canSubscribe) {
          return this.User.getUser().then((user) => {
            this.model.email = user.email;
          });
        }

        return this.canSubscribe;
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
