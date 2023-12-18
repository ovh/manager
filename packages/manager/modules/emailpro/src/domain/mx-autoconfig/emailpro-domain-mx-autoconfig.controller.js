export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  EmailPro,
  EmailProDomains,
) => {
  $scope.domain = $scope.currentActionData;
  $scope.domainDiag = {};
  $scope.domainDiag.mx = {};
  $scope.domainDiag.mx.spam = [];

  $scope.init = function init() {
    EmailProDomains.getDnsSettings(
      $stateParams.productId,
      $scope.domain.name,
    ).then(
      (data) => {
        $scope.domainDiag.isOvhDomain = data.isOvhDomain;
        $scope.domainDiag.mx.noSpam = data.mx.noSpam;
      },
      (failure) => {
        $scope.resetAction();
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
      },
    );

    EmailProDomains.getExpectedDNSSettings(
      $stateParams.productId,
      $scope.domain.name,
    ).then(
      ({ data }) => {
        const re = /^IN ([A-Z]*) (\d+) ([^ ]*)$/i;
        data.expectedMX.forEach((mx) => {
          const extract = mx.match(re);
          $scope.domainDiag.mx.spam.push({
            fieldType: extract[1],
            target: extract[3],
            priority: extract[2],
            weight: null,
            port: null,
            subDomain: null,
          });
        });
      },
      (failure) => {
        $scope.resetAction();
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
      },
    );
  };

  const prepareModel = function prepareModel() {
    let data = [];
    if ($scope.model.antiSpam === true) {
      data = $scope.domainDiag.mx.spam;
    } else {
      data = $scope.domainDiag.mx.noSpam;
    }
    return {
      domain: $scope.domain.name,
      fieldList: data,
    };
  };

  $scope.configMX = function configMX() {
    $scope.resetAction();

    EmailProDomains.addZoneDnsField(
      $stateParams.productId,
      prepareModel(),
    ).then(
      (success) => {
        if (success.state === 'OK') {
          $scope.setMessage(
            $translate.instant(
              'emailpro_tab_domain_diagnostic_add_field_success',
            ),
            { status: 'done' },
          );
        } else {
          $scope.setMessage(
            $translate.instant(
              'emailpro_tab_domain_diagnostic_add_field_failure',
            ),
            { status: 'error' },
          );
        }
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
      },
    );
  };
};
