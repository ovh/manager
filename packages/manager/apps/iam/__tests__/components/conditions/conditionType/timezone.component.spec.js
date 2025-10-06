import '../../../../../../modules/iam/src/components/conditions/conditionType/timezone';
import { TIMEZONES } from '../../../../../../modules/iam/src/components/conditions/conditionType/timezone/timezone.constants';

describe('IAMConditionTimezone component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMConditionTimezone',
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

  it('should init model value with provided timezone', () => {
    const locals = {
      $element: angular.element('<div></div>'),
    };
    const bindings = {
      defaultTimezone: 'Europe/London',
    };
    const $ctrl = $componentController(
      'iamConditionTimezone',
      locals,
      bindings,
    );
    $ctrl.$onInit();

    expect($ctrl.timezone).toEqual({
      utcOffset: 'UTC+0',
      timeZone: 'Europe/London',
    });
  });

  it('should init model value witch local timezone', () => {
    const locals = {
      $element: angular.element('<div></div>'),
    };
    const $ctrl = $componentController('iamConditionTimezone', locals, null);
    $ctrl.$onInit();

    expect(TIMEZONES).toContain($ctrl.timezone);
  });
});
