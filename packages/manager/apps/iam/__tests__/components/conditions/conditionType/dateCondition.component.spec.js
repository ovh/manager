import '../../../../../../modules/iam/src/components/conditions/conditionType/date';

describe('IAMConditionDate component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionDate',
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
    const locals = {
      $element: angular.element('<div></div>'),
    };
    const bindings = {
      condition: {
        value: '2025-09-01,2025-O9-10',
      },
    };
    const $ctrl = $componentController('iamConditionDate', locals, bindings);
    $ctrl.$onInit();

    expect($ctrl.dates).toBe('2025-09-01, 2025-O9-10');
  });
});
