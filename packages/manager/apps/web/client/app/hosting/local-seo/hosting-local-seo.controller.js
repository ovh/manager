import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

angular.module('App').controller(
  'HostingTabLocalSeoCtrl',
  class HostingTabLocalSeoCtrl {
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      $window,
      atInternet,
      Alerter,
      Hosting,
      HostingLocalSeo,
      User,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.atInternet = atInternet;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingLocalSeo = HostingLocalSeo;
      this.User = User;
    }

    $onInit() {
      this.atInternet.trackPage({ name: 'web::hosting::visibility-pro' });

      this.datagridId = 'localSeoDatagrid';
      this.loading = {
        locations: false,
      };
      this.productId = this.$stateParams.productId;
      this.accounts = null;

      this.isAdmin = false;

      this.checkAdmin().then((isAdmin) => {
        this.isAdmin = isAdmin;
      });

      this.HostingLocalSeo.getVisibilityCheckerURL().then((url) => {
        this.visibilityCheckerURL = url;
      });
    }

    checkAdmin() {
      return this.$q
        .all({
          serviceInfo: this.Hosting.getServiceInfos(this.productId),
          user: this.User.getUser(),
        })
        .then(
          ({ serviceInfo, user }) =>
            serviceInfo.contactAdmin === user.nichandle,
        )
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('common_serviceinfos_error', {
              t0: this.productId,
            }),
            err,
            this.$scope.alerts.main,
          );
          return false;
        });
    }

    refresh() {
      return this.loadAccounts().then(() => this.loadLocations());
    }

    loadAccounts() {
      return this.getAccounts().then((accounts) => {
        this.accounts = accounts;
      });
    }

    getAccounts() {
      return this.HostingLocalSeo.getAccounts(this.productId).then((accounts) =>
        this.$q.all(
          map(accounts, (account) =>
            this.HostingLocalSeo.getAccount(this.productId, account),
          ),
        ),
      );
    }

    loadLocations() {
      this.loading.locations = true;
      return this.$q
        .when()
        .then(() => {
          if (!isEmpty(this.accounts)) {
            return this.getLocations();
          }
          return { data: [], meta: { totalCount: 0 } };
        })
        .finally(() => {
          this.loading.locations = false;
        });
    }

    getLocations() {
      return this.HostingLocalSeo.getLocations(this.productId).then(
        (locationIds) => ({
          data: map(locationIds, (id) => ({ id })),
          meta: {
            totalCount: locationIds.length,
          },
        }),
      );
    }

    hasAccounts() {
      return !isEmpty(this.accounts);
    }

    hasLocations() {
      return !isEmpty(this.locations);
    }

    transformItem(row) {
      this.loading.locations = true;
      return this.HostingLocalSeo.getLocation(this.productId, row.id).then(
        (result) => {
          const location = angular.copy(result);
          const accountId = get(location, 'accountId');
          if (accountId) {
            const account = find(this.accounts, { id: accountId });
            if (account) {
              location.account = account;
            }
          }
          return location;
        },
      );
    }

    goToInterface(location) {
      if (!location.accountId) {
        return;
      }

      const lang = head(this.$translate.preferredLanguage().split('_'));

      /*
        Opening the window first then setting the location prevents browsers
        from blocking it as a popup.
      */
      const win = this.$window.open('', '_blank');
      win.opener = null;
      this.HostingLocalSeo.login(this.productId, location.accountId).then(
        (token) => {
          win.location = `https://localseo.hosting.ovh.net/${lang}/app/ovh?access_token=${token}`;
        },
      );
    }
  },
);
