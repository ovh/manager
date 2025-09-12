import '../../../../../../modules/iam/src/components/conditions/conditionType/name';

describe('IAMConditionName component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionName',
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
        value: 'my name',
      },
    };
    const $ctrl = $componentController('iamConditionName', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.nameValue).toBe('my name');
  });
});
