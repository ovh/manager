import head from 'lodash/head';
import reject from 'lodash/reject';

export default class {
  /* @ngInject */
  constructor($scope, $translate, IpOrganisation) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpOrganisation = IpOrganisation;
  }

  $onInit() {
    const currentOrganisationId = this.ipBlock.organizationId;
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loader = false;
    this.$scope.ipBlock = this.ipBlock.ipBlock;
    this.$scope.organisationSelected = {
      value: {},
    };

    this.$scope.load = () => {
      this.$scope.loader = true;

      this.IpOrganisation.getIpOrganisation()
        .then((organisations) => {
          this.$scope.organisationList = reject(organisations, {
            organisationId: currentOrganisationId,
          });
          this.$scope.organisationSelected.value = head(
            this.$scope.organisationList,
          );
        })
        .finally(() => {
          this.$scope.loader = false;
        });
    };

    this.$scope.changeOrganisation = () => {
      this.$scope.loader = true;

      this.IpOrganisation.changeOrganisation({
        ipBlock: this.$scope.ipBlock,
        organisationId: this.$scope.organisationSelected.value.organisationId,
      })
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant(
                  'ip_organisation_change_organisations_success',
                ),
                data: 'OK',
              },
            },
            { reload: true },
          ),
        )
        .catch((err) =>
          this.goBack({
            message: {
              text: this.$translate.instant(
                'ip_organisation_change_organisations_fail',
                {
                  t0: err.message,
                },
              ),
              data: 'ERROR',
            },
          }),
        )
        .finally(() => {
          this.$scope.loader = false;
        });
    };
  }
}
