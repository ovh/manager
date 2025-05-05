import '../../../../../modules/iam/src/components/logs/data-streams';

describe('IAM logs data streams component tests suite', () => {
  let $componentController;
  let $compile;
  let $rootScope;

  beforeEach(
    angular.mock.module(
      'ovhManagerIAMLogsDataStreams',
      'pascalprecht.translate',
    ),
  );

  beforeEach(() => {
    angular.mock.inject([
      '$compile',
      '$rootScope',
      '$componentController',
      (_$compile_, _$rootScope_, _$componentController_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $componentController = _$componentController_;
      },
    ]);
  });

  function addComponentBindings(binding) {
    Object.assign(binding, {
      url: {
        LOG: 'LOG',
        LOG_SUSBSCRIPTION: 'LOG_SUSBSCRIPTION',
      },
      trackingHits: 'trackingHits',
      kind: 'kind',
      apiVersion: 'v1',
      goBack: jest.fn(),
      trackClick: jest.fn(),
    });
  }

  it('should render log to customer list', () => {
    const $scope = $rootScope.$new();
    addComponentBindings($scope);

    const component = `
    <iam-logs-data-streams
        url="url"
        track-click="trackClick"
        kind="kind"
        tracking-hits="trackingHits"
    ></iam-logs-data-streams>
    `;
    const element = $compile(component)($scope);
    $scope.$digest();
    const html = element.html();

    expect(html).toContain('<log-to-customer-list');
  });

  it('should compute controller data', () => {
    const bindings = {};
    addComponentBindings(bindings);
    const $ctrl = $componentController('iamLogsDataStreams', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.logSubscriptionApiData).toEqual({
      url: {
        LOG: 'LOG',
        LOG_SUSBSCRIPTION: 'LOG_SUSBSCRIPTION',
      },
      params: {
        kind: 'kind',
      },
    });
  });
});
