import { ipBlockToNumber } from '../../../nasha.utils';
import {
  NFS_PROTOCOL,
  READONLY_TYPE,
  PREFIX_TRACKING_ACL,
} from './accesses.constants';

export default class NashaDashboardPartitionAccessesController {
  /* @ngInject */
  constructor($q, $http, iceberg) {
    this.$q = $q;
    this.$http = $http;
    this.iceberg = iceberg;

    this.isAccessFormShown = false;
    this.isCreatingAccess = false;
    this.isLoadingAccessForm = false;
    this.isLoadingAccesses = false;
    this.accesses = [];
    this.authorizedAccesses = null;
    this.model = { ip: null, type: null, aclDescription: null };
    this.typeOptions = [];
  }

  $onInit() {
    this.typeOptions = this.aclTypeEnum.filter(({ value }) =>
      value === READONLY_TYPE ? this.partition.protocol === NFS_PROTOCOL : true,
    );
  }

  get datagridTypeOptions() {
    return {
      hideOperators: true,
      values: this.typeOptions.reduce(
        (result, { label, value }) => ({
          ...result,
          [value]: label,
        }),
        {},
      ),
    };
  }

  get canCreateAccess() {
    return (
      this.accessForm?.$valid &&
      !this.isCreatingAccess &&
      !this.isLoadingAccessForm
    );
  }

  get canShowAccessForm() {
    return (
      !this.isAccessFormShown &&
      !this.isLoadingAccesses &&
      !this.isLoadingAccessForm
    );
  }

  get isPaginationHidden() {
    return (
      this.accesses.length === 0 ||
      (this.accesses.length === 1 && this.accesses[0].isForm)
    );
  }

  loadAccesses($config) {
    const { criteria, pageSize, offset, sort } = $config;

    let accessesQuery = this.iceberg(`${this.partitionApiUrl}/access`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.property, sort.dir > 0 ? 'ASC' : 'DESC');

    criteria.forEach(({ property, value, operator }) => {
      accessesQuery = accessesQuery.addFilter(
        property,
        ...{
          bigger: ['gt', value],
          contains: ['like', `%${value}%`],
          containsNot: ['nlike', `%${value}%`],
          endsWith: ['like', `%${value}`],
          is: ['eq', value],
          isAfter: ['gt', value],
          isBefore: ['lt', value],
          isNot: ['nq', value],
          smaller: ['lt', value],
          startsWith: ['like', `${value}%`],
        }[operator],
      );
    });

    this.isLoadingAccesses = true;
    this.hideAccessForm();

    return accessesQuery
      .execute(null, true)
      .$promise.catch(({ data: error }) => {
        this.alertError(error);
        return { data: [] };
      })
      .then(({ data }) => {
        this.accesses = data.map((access) => ({
          ...access,
          typeLabel: this.aclTypeEnum.find(({ value }) => value === access.type)
            ?.label,
        }));

        return {
          data: this.accesses,
          meta: { totalCount: this.accesses.length },
        };
      })
      .finally(() => {
        this.isLoadingAccesses = false;
      });
  }

  showAccessForm() {
    this.trackClick(PREFIX_TRACKING_ACL, 'add-access');

    let promise = this.$q.when();

    if (!this.authorizedAccesses) {
      const { partitionApiUrl } = this;

      this.isLoadingAccessForm = true;

      promise = this.$q
        .all({
          ips: this.$http.get(`${partitionApiUrl}/authorizableIps`),
          blocks: this.$http.get(`${partitionApiUrl}/authorizableBlocks`),
        })
        .then(({ ips: { data: ips }, blocks: { data: blocks } }) => {
          this.authorizedAccesses = [
            ...ips
              .filter((x) => !this.accesses.find(({ ip }) => ip === `${x}/32`))
              .map((ip) => ({ type: 'IP', ip })),
            ...blocks
              .filter((block) => !this.accesses.find(({ ip }) => ip === block))
              .map((block) => ({ type: 'IP/Block', ip: block })),
          ].sort(
            ({ ip: ipBlockA }, { ip: ipBlockB }) =>
              ipBlockToNumber(ipBlockA) - ipBlockToNumber(ipBlockB),
          );
        })
        .catch(this.alertError)
        .finally(() => {
          this.isLoadingAccessForm = false;
        });
    }

    return promise.then(() => {
      const access = { ip: null, type: null, aclDescription: null };
      this.accesses.unshift({ ...access, isForm: true });
      this.isAccessFormShown = true;
      this.model = access;
    });
  }

  hideAccessForm() {
    const [access] = this.accesses;
    if (access?.isForm) {
      this.accesses.shift();
      this.isAccessFormShown = false;
    }
  }

  onCancelAccessFormClick() {
    this.trackClick(PREFIX_TRACKING_ACL, 'cancel-add-access');
    return this.hideAccessForm();
  }

  createAccess() {
    this.trackClick(PREFIX_TRACKING_ACL, 'confirm-add-access');

    const { partitionName } = this.partition;
    const {
      ip: { ip },
      type: { value: type },
      aclDescription,
    } = this.model;

    this.isCreatingAccess = true;

    return this.$http
      .post(`${this.partitionApiUrl}/access`, { ip, type, aclDescription })
      .then(({ data: task }) =>
        this.goToTrackTasks({
          tasks: [task],
          partitionName,
          ip,
          trackingData: {
            prefix: PREFIX_TRACKING_ACL,
            hit: 'close-add-access',
          },
        }),
      )
      .catch((error) => {
        this.alertError(error);
      });
  }

  onDeleteClick(ip) {
    this.trackClick(PREFIX_TRACKING_ACL, 'delete-access');
    return this.goToDelete(ip);
  }
}
