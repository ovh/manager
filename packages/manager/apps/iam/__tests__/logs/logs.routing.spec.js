import { FEATURE_LOGS } from '../../../../modules/iam/src/logs/logs.constants';
import logsModule from '../../../../modules/iam/src/logs/logs.module';

describe('IAM logs routing tests suite', () => {
  const iamLogsState = 'iam.logs';
  let $state;
  let $rootScope;

  function IamLogsRoutingSetup({
    activityLogsAvailability = false,
    auditLogsAvailability = false,
    accessPolicyLogsAvailability = false,
  } = {}) {
    angular.mock.module(logsModule, ($provide, $stateProvider) => {
      $provide.value('ovhFeatureFlipping', {
        checkFeatureAvailability: () => ({
          isFeatureAvailable: (feature) => {
            if (feature === FEATURE_LOGS.ACTIVITY) {
              return activityLogsAvailability;
            }
            if (feature === FEATURE_LOGS.AUDIT) {
              return auditLogsAvailability;
            }
            if (feature === FEATURE_LOGS.ACCESS_POLICY) {
              return accessPolicyLogsAvailability;
            }
            return false;
          },
        }),
      });
      $provide.value('atInternet', {});
      // mock external states
      $stateProvider.state('iam', {});
      $stateProvider.state('iam.logs.access-policy', {});
      $stateProvider.state('iam.logs.audit', {});
      $stateProvider.state('iam.logs.activity', {});
    });

    angular.mock.inject([
      '$state',
      '$rootScope',
      (_$state_, _$rootScope) => {
        $state = _$state_;
        $rootScope = _$rootScope;
      },
    ]);
  }

  describe('without log feature enabled', () => {
    it.each([
      {
        auditLogsAvailability: false,
        activityLogsAvailability: false,
        accessPolicyLogsAvailability: false,
        expectedState: 'iam',
      },
      {
        auditLogsAvailability: false,
        activityLogsAvailability: false,
        accessPolicyLogsAvailability: true,
        expectedState: 'iam.logs.access-policy',
      },
      {
        auditLogsAvailability: false,
        activityLogsAvailability: true,
        accessPolicyLogsAvailability: false,
        expectedState: 'iam.logs.activity',
      },
      {
        auditLogsAvailability: false,
        activityLogsAvailability: true,
        accessPolicyLogsAvailability: true,
        expectedState: 'iam.logs.access-policy',
      },
      {
        auditLogsAvailability: true,
        activityLogsAvailability: false,
        accessPolicyLogsAvailability: false,
        expectedState: 'iam.logs.audit',
      },
      {
        auditLogsAvailability: true,
        activityLogsAvailability: false,
        accessPolicyLogsAvailability: true,
        expectedState: 'iam.logs.access-policy',
      },
      {
        auditLogsAvailability: true,
        activityLogsAvailability: true,
        accessPolicyLogsAvailability: false,
        expectedState: 'iam.logs.activity',
      },
      {
        auditLogsAvailability: true,
        activityLogsAvailability: true,
        accessPolicyLogsAvailability: true,
        expectedState: 'iam.logs.access-policy',
      },
    ])(
      'should redirect to $expectedState when [$auditLogsAvailability, $activityLogsAvailability, $accessPolicyLogsAvailability]',
      ({
        auditLogsAvailability,
        activityLogsAvailability,
        accessPolicyLogsAvailability,
        expectedState,
      }) => {
        IamLogsRoutingSetup({
          auditLogsAvailability,
          activityLogsAvailability,
          accessPolicyLogsAvailability,
        });
        $state.go(iamLogsState);
        $rootScope.$digest();

        expect($state.current.name).toBe(expectedState);
      },
    );
  });
});
