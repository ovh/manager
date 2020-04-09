export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    Ip,
    ipFeatureAvailability,
    IpOrganisation,
    User,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.IpOrganisation = IpOrganisation;
    this.User = User;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.load = {
      loading: false,
      request: false,
    };

    this.$scope.newOrganisation = {
      registry: null,
      lastname: null,
      firstname: null,
      abuse_mailbox: null,
      address: null,
      zip: null,
      city: null,
      state: null,
      country: null,
      phone: null,
    };

    this.$scope.list = {
      country: [],
      registry: [],
    };

    this.$scope.formOrganisation = {
      formValid: false,
      edit: false,
    };

    this.$scope.orderByCountryAlias = (a) => {
      const result = this.$translate.instant(`country_${a}`);
      return result === 'country_' ? a : result;
    };

    this.$scope.showState = () => {
      return this.ipFeatureAvailability.showState();
    };

    this.$scope.addOrganisation = () => {
      this.$scope.load.loading = true;

      if (this.$scope.formOrganisation.edit) {
        this.IpOrganisation.putOrganisation(this.$scope.newOrganisation)
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant('ip_organisation_edit_success'),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((reason) =>
            this.goBack({
              message: {
                text: this.$translate.instant('ip_organisation_edit_error'),
                data: {
                  ...reason,
                  type: 'ERROR',
                },
              },
            }),
          )
          .finally(() => {
            this.$scope.load.loading = false;
          });
      } else {
        this.IpOrganisation.postOrganisation(this.$scope.newOrganisation)
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant('ip_organisation_add_success'),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((reason) =>
            this.goBack({
              message: {
                text: this.$translate.instant('ip_organisation_add_error'),
                data: {
                  ...reason,
                  type: 'ERROR',
                },
              },
            }),
          )
          .finally(() => {
            this.$scope.load.loading = false;
          });
      }
    };

    this.$scope.load.loading = true;

    return this.$q
      .all({
        countries: this.Ip.getNichandleCountryEnum(),
        registries: this.Ip.getNichandleIpRegistryEnum(),
        user: this.User.getUser(),
      })
      .then(({ countries, registries, user }) => {
        this.$scope.list.country = countries;
        this.$scope.list.registry = registries;
        this.$scope.newOrganisation.country = user.billingCountry;
      })
      .then(() => {
        if (this.organisation) {
          this.$scope.formOrganisation.edit = true;
          this.$scope.newOrganisation = angular.copy(this.organisation);
        }
      })
      .catch(() =>
        this.goBack({
          message: {
            text: this.$translate.instant('ip_organisation_add_load_error'),
            data: 'ERROR',
          },
        }),
      )
      .finally(() => {
        this.$scope.load.loading = false;
      });
  }
}
