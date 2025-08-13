import {
  EXCLUDES_VPS_NAME_REGEX,
  MAX_DISK_SIZE,
  MESSAGE_CONTAINER,
  MIGRATION_STATUS,
  VPS_VERSION_2019,
} from './outperform.constants';

export default class VpsOutperformController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    constants,
    coreConfig,
    VpsService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.constants = constants;
    this.VpsService = VpsService;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }

  $onInit() {
    this.isLoading = true;
    this.vpsNameSelected = null;
    this.loadMessages();
    this.$q
      .all({
        vpsList: this.VpsService.getVpsList(),
        catalog: this.VpsService.getCatalog(this.ovhSubsidiary),
      })
      .then(({ vpsList, catalog }) => {
        this.catalog = catalog;
        this.vpsList = vpsList.reduce((acc, current) => {
          if (VpsOutperformController.canBeUpdated(current)) {
            const { model, name, displayName } = current;
            acc.push({
              model,
              name,
              displayName,
              formatedDisplayName:
                name !== displayName ? `${name} (${displayName})` : name,
            });
          }
          return acc;
        }, []);
        if (this.vpsName) {
          this.vpsNameSelected = this.vpsList.find(
            (vps) => vps.name === this.vpsName,
          );
          return this.loadUpgradeAvailable(this.vpsNameSelected);
        }
        this.isLoading = false;
        return this.vpsList;
      });
  }

  static canBeUpdated({ model: { version, name, disk } }) {
    return (
      version === VPS_VERSION_2019 &&
      !EXCLUDES_VPS_NAME_REGEX.test(name) &&
      disk <= MAX_DISK_SIZE
    );
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(MESSAGE_CONTAINER, {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadUpgradeAvailable({ name }) {
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
    this.newPlanCodeAvailable = null;
    this.newOffer = null;
    this.isLoading = true;
    this.$q
      .all({
        renew: this.VpsService.vpsRenewPrice(name),
        migration: this.VpsService.getMigration2020(name),
      })
      .then(({ renew, migration }) => {
        this.price = `${renew.strategies[0].price.text} ${this.getRenewPeriod(
          renew.renewPeriod,
        )}`;
        this.oldProduct = this.catalog.products.find(
          (product) => product.name === migration.currentPlan,
        )?.blobs?.technical;
        if (migration.status === MIGRATION_STATUS.available) {
          this.newPlanCodeAvailable = migration.availablePlans[0].planCode;
          this.newProduct = this.catalog.products.find(
            (product) => product.name === migration.availablePlans[0].planCode,
          )?.blobs?.technical;
        } else if (
          [
            MIGRATION_STATUS.ongoing,
            MIGRATION_STATUS.planned,
            MIGRATION_STATUS.toPlan,
          ].includes(migration.status)
        ) {
          this.CucCloudMessage.info(
            this.$translate.instant('vps_outperform_already_planned'),
            MESSAGE_CONTAINER,
          );
        } else {
          this.CucCloudMessage.info(
            this.$translate.instant('vps_outperform_no_available_plan'),
            MESSAGE_CONTAINER,
          );
        }
        this.isLoading = false;
      });
  }

  getRenewPeriod(renewPeriod) {
    if (renewPeriod === 'P1M' || renewPeriod === 'P1Y') {
      return this.$translate.instant(`vps_outperform_renew_${renewPeriod}`);
    }
    const [, amount, type] = renewPeriod?.match(/P([0-9]+)(Y|M)/) || [];
    if (amount && type) {
      return this.$translate.instant(`vps_outperform_renew_PX${type}`, {
        amount,
      });
    }
    return '?';
  }

  getBandwidthDisplay(level) {
    const value = level / 1000;
    const quantityText = this.$translate.instant(
      'vps_outperform_bandwidth_quantity',
      { value },
    );

    return quantityText;
  }

  validUpgrade() {
    this.submitting = true;
    this.VpsService.postMigration2020(
      this.vpsNameSelected.name,
      this.newPlanCodeAvailable,
    )
      .then(() => {
        this.goBack(false, 'success', true, this.vpsNameSelected.name);
      })
      .catch((error) => {
        this.submitting = false;
        this.CucCloudMessage.error(
          this.$translate.instant('vps_outperform_error_message', {
            error: error?.data?.message,
          }),
          MESSAGE_CONTAINER,
        );
      });
  }
}
