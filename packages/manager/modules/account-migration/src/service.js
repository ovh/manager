import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

import moment from 'moment';

import {
  CACHED_OBJECT_LIST_PAGES,
  MIGRATION_DATES,
  MIGRATION_STATUS,
  STEP_STATES,
  STEP_TYPES,
  X_PAGINATION_MODE,
} from './constants';
import Migration from './migration.class';

export default class {
  /* @ngInject */
  constructor(
    $cacheFactory,
    $q,
    $http,
    $translate,
    OvhApiMe,
    ovhFeatureFlipping,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.migrationDetails = null;
    this.cache = $cacheFactory('AccountMigrationCache');
  }

  getMigrationDates() {
    return this.getMigrationList().then(([migration]) =>
      migration ? get(MIGRATION_DATES, migration.from, {}) : null,
    );
  }

  getFormattedDates() {
    return this.getMigrationDates().then((migrationDates) => {
      if (migrationDates) {
        let lang = this.$translate.use();
        if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
          lang = lang.toLowerCase().replace('_', '-');
        } else {
          [lang] = lang.split('_');
        }
        return {
          START: moment(migrationDates.START, 'MM/DD/YYYY', lang).format('LL'),
          END: moment(migrationDates.END, 'MM/DD/YYYY', lang).format('LL'),
        };
      }
      return null;
    });
  }

  refreshMigrationDetails() {
    this.cache.removeAll();
    return this.migrationDetails
      ? this.getMigrationDetails(this.migrationDetails.id, true)
      : this.$q.when(null);
  }

  getPendingAgreements() {
    return this.$http
      .get('/me/agreements', {
        params: {
          agreed: 'todo',
        },
        cache: this.cache,
      })
      .then((res) => res.data);
  }

  getMigrationDetails(migrationId, force) {
    return this.migrationDetails && !force
      ? this.$q.when(this.migrationDetails)
      : this.$q
          .all([
            this.getPendingAgreements(),
            this.$http.get(`/me/migration/${migrationId}`, {
              cache: this.cache,
            }),
          ])
          .then(([pendingAgreements, detail]) => {
            if (pendingAgreements.length > 0) {
              set(
                find(detail.data.steps, { name: STEP_TYPES.CONTRACTS }),
                'status',
                STEP_STATES.PENDING,
              );
              set(detail, 'data.status', MIGRATION_STATUS.TODO);
            }
            if (this.migrationDetails) {
              Object.assign(this.migrationDetails, detail.data);
            } else {
              this.migrationDetails = new Migration(detail.data);
            }
            return this.migrationDetails;
          });
  }

  getMigrationList() {
    return this.ovhFeatureFlipping
      .checkFeatureAvailability('account-migration')
      .catch(() => ({
        'account-migration': false,
      }))
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable('account-migration')
          ? this.$http
              .get('/me/migration', {
                headers: {
                  [X_PAGINATION_MODE]: CACHED_OBJECT_LIST_PAGES,
                },
                cache: this.cache,
              })
              .then((res) => res.data)
          : this.$q.when([]),
      );
  }

  getPendingMigration() {
    return this.getMigrationList().then((migrationList) =>
      find(migrationList, { status: MIGRATION_STATUS.TODO }),
    );
  }

  getAgreementDetails(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(
              `/me/migration/${migration.id}/contract/${contractId}/agreement`,
              {
                cache: this.cache,
              },
            )
            .then(({ data }) => data)
        : null;
    });
  }

  getMigrationContracts() {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(`/me/migration/${migration.id}/contract`, {
              cache: this.cache,
            })
            .then(({ data }) => data)
        : [];
    });
  }

  getContractInfo(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(`/me/migration/${migration.id}/contract/${contractId}`, {
              cache: this.cache,
            })
            .then(({ data }) => ({
              ...data,
              migrationId: migration.id,
            }))
        : null;
    });
  }

  getContractDetails(contractId) {
    return this.$q
      .all([
        this.getContractInfo(contractId),
        this.getAgreementDetails(contractId),
      ])
      .then(([contract, agreement]) => ({
        ...agreement,
        ...contract,
      }));
  }

  getAllContracts() {
    return this.getMigrationContracts().then((contractIds) =>
      this.$q.all(
        map(contractIds, (contractId) => this.getContractDetails(contractId)),
      ),
    );
  }

  acceptAgreement(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .post(`/me/migration/${migration.id}/contract/${contractId}/accept`)
            .then(() => {
              this.cache.removeAll();
            })
        : null;
    });
  }
}
