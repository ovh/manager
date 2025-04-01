import '../../../../modules/iam/src/logs/audit/audit-logs.module';

describe('IAM audit logs test suites', () => {
  let auditLogsService;
  let $httpBackend;

  beforeEach(angular.mock.module('ovhManagerIAMAuditLogs'));

  beforeEach(
    angular.mock.inject([
      'auditLogsService',
      '$httpBackend',
      (_auditLogsService_, _httpBackend_) => {
        auditLogsService = _auditLogsService_;
        $httpBackend = _httpBackend_;
      },
    ]),
  );

  it('should fetch iam audit log kinds', () => {
    $httpBackend.expectGET('/me/logs/audit/log/kind').respond(['kind']);

    const promise = auditLogsService.getLogKinds();
    $httpBackend.flush();

    promise.then((kinds) => {
      expect(kinds).toEqual(['kind']);
    });
  });
});
