import get from 'lodash/get';
import pick from 'lodash/pick';

angular
  .module('App')
  .controller('DedicatedCloudUserEditCtrl', class DedicatedCloudUserEditCtrl {
    /* @ngInject */
    constructor(
      $state,
      $stateParams,
      $translate,
      Alerter,
      coreConfig,
      DedicatedCloud,
    ) {
      this.$state = $state;
      this.$translate = $translate;
      this.productId = $stateParams.productId;
      this.userId = $stateParams.userId;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;

      this.emailRegExp = /^(?:\S+@\S+\.\S+)?$/;
      if (coreConfig.getRegion() === 'US') {
        this.phoneRegExp = /\+1\.[0-9]{10}/;
      } else {
        this.phoneRegExp = /\+[0-9]{1,4}\.[0-9]{5,15}/;
      }
      this.phoneExample = new RandExp(this.phoneRegExp).gen();
    }

    $onInit() {
      this.loading = true;
      return this.DedicatedCloud.getUserDetail(
        this.productId,
        this.userId,
      ).then((user) => {
        this.user = user;
        this.user.tokenValidator = user.isTokenValidator;
      }).catch((err) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_USER_edit_load_error')} ${get(err, 'message', err)}`);
      }).finally(() => {
        this.loading = false;
      });
    }

    editUser() {
      return this.DedicatedCloud.updateUser(
        this.productId,
        pick(this.user, [
          'userId',
          'name',
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'tokenValidator',
          'canManageNetwork',
          'canManageIpFailOvers',
          'nsxRight',
        ]),
      ).then(() => {
        this.Alerter.success(this.$translate.instant('dedicatedCloud_USER_edit_success'));
        this.$state.go('^').then(() => this.$state.reload());
      }).catch((err) => {
        this.$state.go('^');
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_USER_edit_error')} ${get(err, 'message') || err}`);
      });
    }
  });
