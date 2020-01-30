import get from 'lodash/get';

angular.module('App').controller(
  'DedicatedCloudMailingCtrl',
  class DedicatedCloudMailingCtrl {
    constructor(
      $state,
      User,
      dedicatedCloudMailingList,
      Alerter,
      $translate,
      DEDICATEDCLOUD_MAILING_LIST,
    ) {
      // dependencies injections
      this.$state = $state;
      this.User = User;
      this.dedicatedCloudMailingList = dedicatedCloudMailingList;
      this.Alerter = Alerter;
      this.$translate = $translate;

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
          this.Alerter.success(
            this.$translate.instant(
              'dedicatedCloud_subscribe_mailing_step2_success',
              {
                t0: this.model.email,
              },
            ),
          ),
        )
        .catch((error) =>
          this.Alerter.error(
            [
              this.$translate.instant(
                'dedicatedCloud_subscribe_mailing_step2_error',
                {
                  t0: this.model.email,
                },
              ),
              get(error, 'message'),
            ].join('. '),
          ),
        )
        .finally(() => {
          this.onWidzardCancel();
          this.loading.subscribe = false;
        });
    }

    onWidzardCancel() {
      this.$state.go('^');
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
  },
);
