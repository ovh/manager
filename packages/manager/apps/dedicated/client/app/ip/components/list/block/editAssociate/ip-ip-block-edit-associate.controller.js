export default /* @ngInject */ (
  $scope,
  Alerter,
  $translate,
  IpOrganisation,
) => {
  $scope.data = $scope.currentActionData;
  $scope.editTabActive = true;
  $scope.loading = true;
  $scope.disableSubmit = true;
  $scope.ipBlock = $scope.data.ipBlock;
  $scope.model = {
    blockIpdetails: { description: null, netname: null },
    organisationDetails: null,
  };
  IpOrganisation.getBlockIpDetails($scope.ipBlock).then((data) => {
    $scope.model.blockIpdetails.netname = data.netname;
    $scope.model.blockIpdetails.description = data.description;
    $scope.loading = false;
  });
  $scope.$watch('model.blockIpdetails.description', (newValue, oldValue) => {
    if (newValue !== oldValue) $scope.disableSubmit = false;
  });

  $scope.$watch('model.blockIpdetails.netname', (newValue, oldValue) => {
    if (newValue !== oldValue) $scope.disableSubmit = false;
  });

  $scope.$watch('model.organisationDetails', (newValue, oldValue) => {
    if (newValue !== oldValue) $scope.disableSubmit = false;
  });

  $scope.getEditTabDetails = function getEditTabDetails() {
    $scope.editTabActive = true;
    $scope.disableSubmit = true;
  };

  $scope.getAssosicateTabDetails = function getAssosicateTabDetails() {
    $scope.editTabActive = false;
    $scope.disableSubmit = true;
    $scope.loading = true;
    return IpOrganisation.getIpOrganisation()
      .then((organisations) => {
        $scope.organisations = organisations;
      })
      .finally(() => {
        $scope.loading = false;
      });
  };

  $scope.onSubmit = function onSubmit(model) {
    $scope.loading = true;
    if ($scope.model.organisationDetails) {
      // Case Submit: IP and Organization association
      IpOrganisation.changeOrganisation({
        ipBlock: $scope.ipBlock.ipBlock,
        organisationId: model.organisationDetails.organisationId,
      })
        .then(
          () => {
            Alerter.alertFromSWS(
              $translate.instant(
                'ip_organisation_change_organisations_success',
              ),
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
          $scope.loading = false;
          $scope.resetAction();
        });
    } else {
      // Case Submit: Modify Block IP Details
      IpOrganisation.modifyBlockIpDetails({
        ipBlock: $scope.ipBlock.ipBlock,
        blockIpdetails: model.blockIpdetails,
      }).finally(() => {
        $scope.loading = false;
        $scope.resetAction();
      });
    }
  };
};
