import get from 'lodash/get';
import { INSTANCE_PRICING_LINKS } from '../../instances.constants';

export default class PciInstanceActiveMonthlyBillingController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.instancePricesLink =
      INSTANCE_PRICING_LINKS[coreConfig.getUser()?.ovhSubsidiary] ||
      INSTANCE_PRICING_LINKS.DEFAULT;
  }

  $onInit() {
    this.isLoading = false;
  }

  activeMonthlyBilling() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.activeMonthlyBilling(
      this.projectId,
      this.instance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_active-monthly-billing_success_message',
            {
              instance: this.instance.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_active-monthly-billing_error_enable',
            {
              message: get(err, 'data.message', null),
              instance: this.instance.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
