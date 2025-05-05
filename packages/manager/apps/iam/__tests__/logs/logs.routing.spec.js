import { FEATURE_LOGS } from '../../../../modules/iam/src/logs/logs.constants';
import logsModule from '../../../../modules/iam/src/logs/logs.module';

describe('IAM logs routing tests suite', () => {
  const iamLogsState = 'iam.logs';
  let $state;
  let $rootScope;

  function IamLogsRoutingSetup(
    logsAvailability = false,
    auditLogsAvailability = false,
  ) {
    beforeEach(() => {
      angular.mock.module(logsModule, ($provide, $stateProvider) => {
        $provide.value('ovhFeatureFlipping', {
          checkFeatureAvailability: () => ({
            isFeatureAvailable: (feature) => {
              let result = false;
              if (feature === FEATURE_LOGS.ROOT) {
                result = logsAvailability;
              }
              if (feature === FEATURE_LOGS.AUDIT) {
                result = auditLogsAvailability;
              }
              return result;
            },
          }),
        });
        $provide.value('atInternet', {});
        // mock external states
        $stateProvider.state('iam', {});
        $stateProvider.state('iam.logs.access-policy', {});
        $stateProvider.state('iam.logs.audit', {});
      });
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

  describe('without log feature enabled', () => {
    IamLogsRoutingSetup();

    it('should redirect to root state', () => {
      $state.go(iamLogsState);
      $rootScope.$digest();

      expect($state.current.name).toBe('iam');
    });
  });

  describe('with only log feature enabled', () => {
    IamLogsRoutingSetup(true, false);

    it('should redirect to access policy logs', () => {
      $state.go(iamLogsState);
      $rootScope.$digest();

      expect($state.current.name).toBe('iam.logs.access-policy');
    });
  });

  describe('with all log features enabled', () => {
    IamLogsRoutingSetup(true, true);

    it('should redirect to audit logs', () => {
      $state.go(iamLogsState);
      $rootScope.$digest();

      expect($state.current.name).toBe('iam.logs.audit');
    });
  });
});
