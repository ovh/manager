import head from 'lodash/head';
import reject from 'lodash/reject';

export default /* @ngInject */ (
  $scope,
  $translate,
  Ip,
  IpOrganisation,
  Alerter,
) => {
  const currentOrganisationId = $scope.currentActionData.ipBlock.organizationId;
  $scope.alert = 'polling_action';
  $scope.loader = false;
  $scope.ipBlock = $scope.currentActionData.ipBlock.ipBlock;
  $scope.organisationSelected = {
    value: {},
  };

  $scope.load = function load() {
    $scope.loader = true;

    IpOrganisation.getIpOrganisation()
      .then((organisations) => {
        $scope.organisationList = reject(organisations, {
          organisationId: currentOrganisationId,
        });
        $scope.organisationSelected.value = head($scope.organisationList);
      })
      .finally(() => {
        $scope.loader = false;
      });
  };

  $scope.changeOrganisation = function changeOrganisation() {
    $scope.loader = true;

    IpOrganisation.changeOrganisation({
      ipBlock: $scope.ipBlock,
      organisationId: $scope.organisationSelected.value.organisationId,
    })
      .then(
        () => {
          Alerter.alertFromSWS(
            $translate.instant('ip_organisation_change_organisations_success'),
          );
        },
        (err) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_organisation_change_organisations_fail', {
              t0: err.message,
            }),
          );
        },
      )
      .finally(() => {
        $scope.loader = false;
        $scope.resetAction();
      });
  };
};
