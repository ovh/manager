import '../../../../../../modules/iam/src/components/conditions/conditionType/tag';

describe('IAMConditionTag component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionTag',
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
        value: 'production',
        bracketValue: 'environment',
      },
    };
    const $ctrl = $componentController('iamConditionTag', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.tagValue).toBe('production');
    expect($ctrl.tagKey).toBe('environment');
  });
});
