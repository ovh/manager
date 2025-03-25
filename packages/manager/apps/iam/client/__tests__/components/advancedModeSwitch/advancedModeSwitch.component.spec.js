import { waitFor } from '@testing-library/dom';
import advancedModeSwitchComponent from '../../../../../../modules/iam/src/components/advancedModeSwitch';
import { TAG } from '../../../../../../modules/iam/src/iam.constants';

describe('pccDashboardLight component tests suite', () => {
  let $compile;
  let $rootScope;
  let $componentController;

  const mockIAMService = {
    enableAdvancedMode: jest.fn().mockResolvedValue({}),
    disableAdvancedMode: jest.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      advancedModeSwitchComponent,
      ($provide) => {
        $provide.value('IAMService', mockIAMService);
      },
    );
  });

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
      advancedMode: false,
      alert: {
        error: jest.fn(),
      },
      goTo: jest.fn().mockReturnValue(false),
      trackClick: jest.fn().mockReturnValue(false),
    });
  }

  it('should render iam-advanced-mode-switch component with a switch and a button', () => {
    const $scope = $rootScope.$new();
    addComponentBindings($scope);

    const component = `
    <iam-advanced-mode-switch
        advanced-mode="advancedMode"
        alert="alert"
        go-to="goTo"
        track-click="trackClick"
    ></iam-advanced-mode-switch>
    `;
    const element = $compile(component)($scope);
    $scope.$digest();
    const html = element.html();

    expect(html).toContain('<oui-switch ');
    expect(html).toContain(
      '<button type="button" class="ml-3 oui-popover-button"',
    );
  });

  it('should compute iam-advanced-mode-switch', () => {
    const bindings = {};
    addComponentBindings(bindings);
    const $ctrl = $componentController('iamAdvancedModeSwitch', null, bindings);
    $ctrl.onAdvancedModeChanged(true);

    expect(mockIAMService.enableAdvancedMode).toHaveBeenCalledTimes(1);
    expect(mockIAMService.disableAdvancedMode).not.toHaveBeenCalled();
    expect(bindings.trackClick).toHaveBeenCalledWith(TAG.ENABLE_ADVANCED_MODE);
    waitFor(() => {
      expect(bindings.goTo).toHaveBeenCalledTimes(1);
      expect(bindings.goTo).toHaveBeenCalledWith({ name: '.', reload: true });
    });
  });
});
