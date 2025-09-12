import '../../../../../../modules/iam/src/components/conditions/conditionType/hour';

describe('IAMConditionHour component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionHour',
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
        value: '9,11',
      },
    };
    const $ctrl = $componentController('iamConditionHour', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.hour).toBe('9,11');
  });
});
