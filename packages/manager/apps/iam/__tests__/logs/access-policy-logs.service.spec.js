import '../../../../modules/iam/src/logs/access-policy/access-policy-logs.module';

describe('IAM access policy logs test suites', () => {
  let accessPolicyLogsService;
  let $rootScope;
  const Apiv2Service = {
    httpApiv2: jest.fn(),
  };

  beforeEach(() => {
    angular.mock.module('ovhManagerIAMAccessPolicyLogs', ($provide) => {
      $provide.value('Apiv2Service', Apiv2Service);
    });
  });

  beforeEach(
    angular.mock.inject([
      'accessPolicyLogsService',
      '$rootScope',
      (_accessPolicyLogsService_, _$rootScope_) => {
        accessPolicyLogsService = _accessPolicyLogsService_;
        $rootScope = _$rootScope_;
      },
    ]),
  );

  it('should fetch iam audit log kinds', () => {
    Apiv2Service.httpApiv2.mockResolvedValue({ data: ['kind_access'] });

    const promise = accessPolicyLogsService.getLogKinds();
    $rootScope.$apply();

    promise.then((kinds) => {
      expect(kinds).toEqual(['kind_access']);
    });
    expect(Apiv2Service.httpApiv2).toHaveBeenCalledWith({
      url: '/engine/api/v2/iam/log/kind',
      method: 'get',
    });
  });
});
