import '../../../../../modules/iam/src/components/logs/live-tail';

describe('IAM logs live tail component tests suite', () => {
  let $componentController;
  let $compile;
  let $rootScope;

  beforeEach(
    angular.mock.module('ovhManagerIAMLogsLiveTail', ($provide) => {
      $provide.value('coreConfig', {
        getUser: () => ({
          ovhSubsidiary: 'XX',
        }),
      });
    }),
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
      description: 'logs description',
      kind: 'kind',
      logKinds: ['kind'],
      trackClick: jest.fn(),
    });
  }

  it('should render log to customer live tail', () => {
    const $scope = $rootScope.$new();
    addComponentBindings($scope);

    const component = `
    <iam-logs-live-tail
        url="url"
        track-click="trackClick"
        kind="kind"
        tracking-hits="trackingHits"
    ></iam-logs-live-tail>
    `;
    const element = $compile(component)($scope);
    $scope.$digest();
    const html = element.html().replace(/[\r\n]/gm, '');

    expect(html).toContain('<log-to-customer-live-tail');
    expect(html).toContain(
      `<main-description>        <span data-ng-bind=":: $ctrl.description" class="ng-binding">`,
    );
  });

  it('should compute controller data', () => {
    const bindings = {};
    addComponentBindings(bindings);
    const $ctrl = $componentController('iamLogsLiveTail', null, bindings);

    expect($ctrl.logServiceGuideLink).toBe(
      'https://help.ovhcloud.com/csm/en-gb-iam-logs-forwarding?id=kb_article_view&sysparm_article=KB0060447',
    );
    expect($ctrl.logKindsKeys).toEqual({
      default: ['message'],
    });
  });
});
