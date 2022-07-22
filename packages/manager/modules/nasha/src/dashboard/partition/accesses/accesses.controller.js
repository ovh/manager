import { ipBlockToNumber } from '../../../nasha.utils';
import { TRANSLATE } from './accesses.constants';

export default class NashaDashboardPartitionAccessesController {
  /* @ngInject */
  constructor($q, $http, $translate, iceberg) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.iceberg = iceberg;

    this.isAccessFormShown = false;
    this.isCreatingAccess = false;
    this.isLoadingAccessForm = false;
    this.isLoadingAccesses = false;
    this.accesses = [];
    this.authorizedAccesses = null;
    this.model = { ip: null, type: null };
    this.typeOptions = [];
  }

  $onInit() {
    this.typeOptions = this.aclTypeEnum
      .filter((type) =>
        type === 'readonly' ? this.partition.protocol === 'NFS' : true,
      )
      .map((type) => ({
        label: this.translate(`list_type_${type}`),
        value: type,
      }));
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
        this.accesses = data;
        if (!this.accesses.length) {
          return this.showAccessForm().then(() => this.accesses);
        }
        return this.accesses;
      })
      .then((data) => ({
        data,
        meta: { totalCount: data.length },
      }))
      .finally(() => {
        this.isLoadingAccesses = false;
      });
  }

  showAccessForm() {
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
      const access = { ip: null, type: null };
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

  createAccess() {
    const { partitionName } = this.partition;
    const {
      ip: { ip },
      type: { value: type },
    } = this.model;

    this.isCreatingAccess = true;
    // this.translate('access_created')

    return this.$http
      .post(`${this.partitionApiUrl}/access`, { ip, type })
      .then(({ data: task }) =>
        this.trackTasks({ tasks: [task], partitionName, ip }),
      )
      .catch((error) => {
        this.alertError(error);
      })
      .finally(() => {
        this.isCreatingAccess = false;
      });
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE}_${key}`, values);
  }
}
