import '../../../app/components/dedicated-cloud/dashboard-light/index';
import '../../../app/dedicatedCloud/dashboard-light/dedicatedCloudLight.module';

describe('DedicatedCloud light dashboard routing tests suite', () => {
  const dashboardLightState = 'app.dedicatedCloud.details.dashboard-light';
  let $state;
  let $rootScope;

  function DedicatedCloudLightDashboardSpecSetup(hasVCDMigration = false) {
    beforeEach(() => {
      angular.mock.module(
        'ovhManagerPccDashboardLight',
        'ovhManagerDedicatedCloudLightModule',
        ($provide, $stateProvider) => {
          $provide.value('hasVCDMigration', hasVCDMigration);
          // mock parent states
          $stateProvider
            .state('app', {})
            .state('app.dedicatedCloud', {})
            .state('app.dedicatedCloud.details', {})
            .state('app.dedicatedCloud.details.dashboard', {});
        },
      );
    });

    beforeEach(() => {
      angular.mock.inject([
        '$state',
        '$rootScope',
        (_$state_, _$rootScope) => {
          $state = _$state_;
          $rootScope = _$rootScope;
        },
      ]);
    });
  }

  describe('without migration', () => {
    DedicatedCloudLightDashboardSpecSetup();

    it('should redirect to classic dashboard when VCD migration is not enabled', () => {
      $state.go(dashboardLightState);
      $rootScope.$digest();

      expect($state.current.name).toBe('app.dedicatedCloud.details.dashboard');
    });
  });

  describe('with migration', () => {
    DedicatedCloudLightDashboardSpecSetup(true);

    it('should redirect to light dashboard when VCD migration is enabled', () => {
      $state.go(dashboardLightState);
      $rootScope.$digest();

      expect($state.current.name).toBe(dashboardLightState);
    });
  });
});
