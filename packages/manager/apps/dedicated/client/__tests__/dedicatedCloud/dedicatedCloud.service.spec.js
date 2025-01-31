import { VCD_MIGRATION_STATUS } from '../../app/components/dedicated-cloud/dedicatedCloud.constant';
import '../../app/components/dedicated-cloud/dedicatedCloud.service';

describe('DedicatedCloud service test suites', () => {
  beforeEach(() => {
    angular.mock.module('ovhManagerPccService', ($provide) => {
      // mocks for dependencies
      $provide.value('iceberg', {});
      $provide.value('OvhApiDedicatedCloud', {});
      $provide.value('OvhHttp', {});
      $provide.value('Poller', {});
      $provide.value('Poll', {});
      $provide.value('coreConfig', {});
    });
  });

  let DedicatedCloud;
  let $httpBackend;

  beforeEach(() => {
    angular.mock.inject([
      'DedicatedCloud',
      '$httpBackend',
      (_DedicatedCloud_, _$httpBackend_) => {
        DedicatedCloud = _DedicatedCloud_;
        $httpBackend = _$httpBackend_;
      },
    ]);
  });

  const serviceName = 'serviceName';
  it.each([
    {
      case: 'Migration not allowed',
      toMigrateTags: [],
      migrationTags: [],
      isDone: false,
      isAllowed: false,
      isToMigrate: false,
    },
    {
      case: 'Migration allowed and done',
      toMigrateTags: ['tag1'],
      migrationTags: ['tag2'],
      isDone: true,
      isAllowed: true,
      isToMigrate: false,
    },
    {
      case: 'Migration allowed but not done',
      toMigrateTags: ['tag1'],
      migrationTags: [],
      isDone: false,
      isAllowed: true,
      isToMigrate: true,
    },
  ])(
    'should compute PCC migration state for $case',
    ({ toMigrateTags, migrationTags, isAllowed, isDone, isToMigrate }) => {
      $httpBackend
        .expectGET(
          '/services?resourceName=serviceName%2Foption%2Ftovcdmigration',
        )
        .respond(200, toMigrateTags);
      $httpBackend
        .expectGET(
          '/services?resourceName=serviceName%2Foption%2Ftovcdmigration%2Fmigration',
        )
        .respond(200, migrationTags);

      const promise = DedicatedCloud.getPCCMigrationState(serviceName);

      promise.then((pccState) => {
        expect(pccState.isDone).toBe(isDone);
        expect(pccState.isAllowed).toBe(isAllowed);
        expect(pccState.isToMigrate).toBe(isToMigrate);
      });
      $httpBackend.flush();
    },
  );

  it('should compute PCC migration state when an error occurs', () => {
    $httpBackend
      .expectGET('/services?resourceName=serviceName%2Foption%2Ftovcdmigration')
      .respond(404);
    $httpBackend
      .expectGET(
        '/services?resourceName=serviceName%2Foption%2Ftovcdmigration%2Fmigration',
      )
      .respond([]);

    const promise = DedicatedCloud.getPCCMigrationState(serviceName);

    promise.then((pccState) => {
      expect(pccState.isDone).toBe(false);
      expect(pccState.isAllowed).toBe(false);
      expect(pccState.isToMigrate).toBe(false);
    });
    $httpBackend.flush();
  });

  it.each([
    {
      state: VCD_MIGRATION_STATUS.UNKNOWN,
      value: undefined,
      isEnabling: false,
      isEnabled: false,
      hasMigration: false,
    },
    {
      state: VCD_MIGRATION_STATUS.ENABLING,
      value: undefined,
      isEnabling: true,
      isEnabled: false,
      hasMigration: true,
    },
    {
      state: VCD_MIGRATION_STATUS.ENABLED,
      value: 'vcd name',
      isEnabling: false,
      isEnabled: true,
      hasMigration: true,
    },
  ])(
    'should compute VCD migration state for status $state',
    ({ value, state, isEnabling, isEnabled, hasMigration }) => {
      $httpBackend
        .expectGET('/dedicatedCloud/serviceName/tag/vcdMigration')
        .respond({ state, value });

      const promise = DedicatedCloud.getVCDMigrationState(serviceName);

      promise.then((vcdState) => {
        expect(vcdState.vcdName).toBe(value);
        expect(vcdState.isEnabling).toBe(isEnabling);
        expect(vcdState.isEnabled).toBe(isEnabled);
        expect(vcdState.hasMigration).toBe(hasMigration);
        expect(vcdState.state).toBe(state);
      });
      $httpBackend.flush();
    },
  );
});
