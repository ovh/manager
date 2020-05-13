import forEach from 'lodash/forEach';
import remove from 'lodash/remove';

import {
  EXPIRY_DATE,
  MIGRATION_STATUS,
  NEW_RANGE_LINK,
} from './vps-migration.constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, CucCloudMessage, VpsMigrationService) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsMigrationService = VpsMigrationService;
    this.MIGRATION_STATUS = MIGRATION_STATUS;
    this.NEW_RANGE_LINK = NEW_RANGE_LINK;
    this.expiryDate = moment(EXPIRY_DATE, 'DD-MM-YYYY').format('LL');
  }

  $onInit() {
    this.NEW_RANGE_LINK = NEW_RANGE_LINK[this.user.ovhSubsidiary];
    this.selectedRows = null;
    this.loadMessage();
  }

  getMigrationInfo(vps) {
    return this.getMigrationDetails(vps.name, this.catalog)
      .then((res) => {
        const migrationPlan = this.VpsMigrationService.constructor.getMigrationPlan(
          this.catalog,
          res.model,
        );
        return {
          description: this.VpsMigrationService.getVpsModelDescription(
            vps.model,
          ),
          migration: res,
          migrationPlan,
          migrationDescription: this.VpsMigrationService.getVpsModelDescription(
            migrationPlan.description,
          ),
        };
      })
      .catch((err) => {
        if (err.status === 460) {
          remove(this.vpsList, { name: vps.name });
        }
      });
  }

  // eslint-disable-next-line consistent-return
  onRowSelect(row, rows) {
    this.migrationAllowed = true;
    forEach(rows, (vps) => {
      if (vps.migration.status === this.MIGRATION_STATUS.PLANNED) {
        this.migrationAllowed = false;
      }
    });
    if (!this.migrationAllowed) {
      return false;
    }
    this.selectedRows = rows;
  }

  migrate(vps) {
    const servers = vps ? [vps] : this.selectedRows;
    this.schedulePage(servers);
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('vps.migration');
    this.messageHandler = this.CucCloudMessage.subscribe('vps.migration', {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
