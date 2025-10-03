import '../../../../../../modules/iam/src/components/conditions/conditionType/timezone';
import { TIMEZONES } from '../../../../../../modules/iam/src/components/conditions/conditionType/timezone/timezone.constants';

describe('IAMConditionDate component tests suite', () => {
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
    const bindings = {
      defaultTimezone: 'Europe/London',
    };
    const $ctrl = $componentController('iamConditionTimezone', null, bindings);
    $ctrl.$onInit();

    expect($ctrl.timezone).toEqual({
      utcOffset: 'UTC+0',
      timeZone: 'Europe/London',
    });
  });

  it('should init model value witch local timezone', () => {
    const $ctrl = $componentController('iamConditionTimezone', null, null);
    $ctrl.$onInit();

    expect(TIMEZONES).toContain($ctrl.timezone);
  });
});
