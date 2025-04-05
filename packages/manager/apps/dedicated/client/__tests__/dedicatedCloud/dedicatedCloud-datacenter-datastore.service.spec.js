import '@ovh-ux/ng-ovh-api-wrappers';
import '../../app/components/dedicated-cloud/datacenter/datastore';

describe('ovhManagerPccDatacenterDatastoreService test suites', () => {
  let service;
  let $q;
  let $rootScope;
  let $httpBackend;
  const icebergRequestMock = {
    execute: jest.fn(),
  };
  const icebergFnMock = {
    query: jest.fn().mockReturnThis(),
    expand: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnValue(icebergRequestMock),
  };

  beforeEach(() => {
    angular.mock.module(
      'ovhManagerDedicatedCloudDatacenterDatastoreComponent',
      ($provide) => {
        $provide.value('OvhHttp', jest.fn());
        $provide.value('iceberg', jest.fn().mockReturnValue(icebergFnMock));
      },
    );
    angular.mock.inject([
      'ovhManagerPccDatacenterDatastoreService',
      '$q',
      '$rootScope',
      '$httpBackend',
      (
        ovhManagerPccDatacenterDatastoreService,
        _$q_,
        _$rootScope_,
        _$httpBackend_,
      ) => {
        service = ovhManagerPccDatacenterDatastoreService;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
      },
    ]);
  });

  function resolvePromise(value) {
    const deffered = $q.defer();
    deffered.resolve(value);
    return deffered.promise;
  }

  const serviceName = 'pcc-123';
  const datacenterId = 123;

  const globalDatastores = [
    {
      filerId: 3,
      name: 'filer3',
    },
    {
      filerId: 4,
      name: 'filer4',
    },
    {
      filerId: 2,
      name: 'filer2',
    },
  ];

  const dcDatastores = [
    {
      filerId: 1,
      name: 'filer1',
    },
  ];

  it.each([
    {
      case: 'should retrieve all datastores sorted',
      expected: {
        data: [
          { ...dcDatastores[0], dc: datacenterId },
          globalDatastores[2],
          globalDatastores[0],
          globalDatastores[1],
        ],
        count: 4,
      },
      pageSize: 10,
      offSet: 0,
    },
    {
      case: 'should retrieve only dc datastore',
      expected: {
        data: [{ ...dcDatastores[0], dc: datacenterId }],
        count: 4,
      },
      pageSize: 1,
      offSet: 0,
    },
    {
      case: 'should retrieve only 2 global datastores',
      expected: {
        data: [globalDatastores[2], globalDatastores[0]],
        count: 4,
      },
      pageSize: 2,
      offSet: 1,
    },
  ])('$case', ({ pageSize, offSet, expected }) => {
    // given
    icebergRequestMock.execute.mockReturnValueOnce({
      $promise: resolvePromise({
        data: globalDatastores,
        headers: {},
      }),
    });
    icebergRequestMock.execute.mockReturnValueOnce({
      $promise: resolvePromise({
        data: dcDatastores,
        headers: {},
      }),
    });

    // expect
    service
      .getDatastores(serviceName, datacenterId, pageSize, offSet)
      .then(({ data, count }) => {
        expect(count).toBe(expected.count);
        expect(data).toEqual(expected.data);
      });
    $rootScope.$apply();
  });

  it('should call global datastore check compatibility', () => {
    $httpBackend
      .expectGET('/dedicatedCloud/pcc-123/filer/12/checkGlobalCompatible')
      .respond();

    const promise = service.getDatastoreGlobalCompatibility(serviceName, {
      filerId: 12,
    });
    $httpBackend.flush();
    expect(promise.then).toEqual(expect.any(Function));
  });

  it('should call datacenter datastore check compatibility', () => {
    $httpBackend
      .expectGET(
        '/dedicatedCloud/pcc-123/datacenter/123/filer/12/checkGlobalCompatible',
      )
      .respond();

    const promise = service.getDatastoreGlobalCompatibility(serviceName, {
      filerId: 12,
      dc: datacenterId,
    });
    $httpBackend.flush();
    expect(promise.then).toEqual(expect.any(Function));
  });
});
