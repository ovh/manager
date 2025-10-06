import '../../../../../../modules/iam/src/components/conditions/conditionType/productType';
import '../../../../../../modules/iam/src/components/resourceSelect/resourceType';

describe('IAMConditionProductType component tests suite', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerIAMComponentsResourceType',
      'ovhManagerIAMConditionProductType',
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
        value: 'dnsZone,cdnArray',
      },
    };
    const $ctrl = $componentController(
      'iamConditionProductType',
      locals,
      bindings,
    );
    $ctrl.$onInit();

    expect($ctrl.productTypes).toEqual(['dnsZone', 'cdnArray']);
  });
});
