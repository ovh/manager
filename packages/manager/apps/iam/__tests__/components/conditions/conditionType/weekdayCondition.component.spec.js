import '../../../../../../modules/iam/src/components/conditions/conditionType/weekday';

describe('IAMConditionWeekday component tests suite', () => {
  let $componentController;

  const weekdays = [
    {
      label: 'monday label',
      value: 'Monday',
    },
    {
      label: 'tuesday label',
      value: 'Tuesday',
    },
    {
      label: 'friday label',
      value: 'Friday',
    },
  ];

  const mockIamConditionWeekdayService = {
    getWeekdays: jest.fn().mockReturnValue(weekdays),
  };

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionWeekday',
      ($provide) => {
        $provide.value(
          'iamConditionWeekdayService',
          mockIamConditionWeekdayService,
        );
      },
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
        value: 'Monday,Friday',
      },
    };
    const $ctrl = $componentController('iamConditionWeekday', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.weekdays).toBe(weekdays);
    expect($ctrl.weekday).toEqual([weekdays[0], weekdays[2]]);
  });
});
