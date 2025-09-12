import '../../../../../../modules/iam/src/components/conditions/conditionType/ip';

describe('IAMConditionIp component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionIP',
    );
  });

  beforeEach(() => {
    angular.mock.inject([
      '$componentController',
      (_$componentController_) => {
        $componentController = _$componentController_;
      },
    ]);
  });

  it('should init model value when condition is set', () => {
    const bindings = {
      condition: {
        value: '127.0.0.1/32,10.0.0.1/16',
      },
    };
    const $ctrl = $componentController('iamConditionIp', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.ipValue).toBe('127.0.0.1/32,10.0.0.1/16');
  });
});
