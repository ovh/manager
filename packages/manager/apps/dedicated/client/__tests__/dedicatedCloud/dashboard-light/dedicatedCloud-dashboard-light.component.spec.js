import { VCD_MIGRATION_STATUS } from '../../../app/components/dedicated-cloud/dedicatedCloud.constant';
import VCDMigrationState from '../../../app/components/dedicated-cloud/vcdMigrationState.class';
import '../../../app/components/dedicated-cloud/dashboard-light/index';

describe('pccDashboardLight component tests suite', () => {
  let $componentController;
  let $compile;
  let $rootScope;

  const mockCoreURLBuilder = {
    buildURL: jest.fn().mockReturnValue('https://vcdurl'),
  };

  const mockDedicatedCloud = {
    getLocation: jest.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerPccDashboardLight',
      ($provide) => {
        $provide.value('DedicatedCloud', mockDedicatedCloud);
        $provide.value('Alerter', {});
        $provide.value('coreURLBuilder', mockCoreURLBuilder);
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
      currentService: {
        ipArinCount: 0,
        ipRipeCount: 0,
        ips: [],
        solution: 'solution',
        version: 1,
        isMinorSolutionUpdateAvailable: jest.fn().mockReturnValue(false),
        isMajorSolutionUpdateAvailable: jest.fn().mockReturnValue(false),
      },
      editDetails: jest.fn(),
      associateIpBlockLink: jest.fn(),
      trackingPrefix: 'tracking::hit::',
      dedicatedCloudVCDMigrationState: new VCDMigrationState({
        state: VCD_MIGRATION_STATUS.ENABLED,
        value: 'VCD_name',
      }),
    });
  }

  it('should render pccDashboardLight component with general information tile', () => {
    const $scope = $rootScope.$new();
    addComponentBindings($scope);

    const component = `
    <pcc-dashboard-light
        current-service="currentService"
        edit-details="editDetails"
        associate-ip-block-link="associateIpBlockLink"
        tracking-prefix="trackingPrefix"
        dedicated-cloud-v-c-d-migration-state="dedicatedCloudVCDMigrationState"
    ></pcc-dashboard-light>
    `;
    const element = $compile(component)($scope);
    $scope.$digest();
    const html = element.html();

    expect(html).toContain('<ovh-manager-pcc-dashboard-general-information');
    expect(html).toContain(
      '<oui-tile class="h-100 ng-isolate-scope" data-heading="ovhManagerPccDashboardGeneralInformation_heading" data-loading="$ctrl.isLoading">',
    );
  });

  it('should compute VCD URL', () => {
    const bindings = {};
    addComponentBindings(bindings);
    Object.assign(bindings, {
      vcdMigrationState: bindings.dedicatedCloudVCDMigrationState,
      hasVcdMigration: true,
    });
    const $ctrl = $componentController(
      'ovhManagerPccDashboardGeneralInformation', // component used in pccDashboardLight
      null,
      bindings,
    );
    $ctrl.$onInit();

    expect(mockDedicatedCloud.getLocation).toHaveBeenCalledTimes(1);
    expect(mockCoreURLBuilder.buildURL).toHaveBeenCalledTimes(1);
    expect(mockCoreURLBuilder.buildURL).toHaveBeenCalledWith(
      'hpc-vmware-public-vcf-aas',
      '#/VCD_name',
    );
    expect($ctrl.vcdDashboardRedirectURL).toBe('https://vcdurl');
  });
});
