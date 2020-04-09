export default class {
  /* @ngInject */
  constructor($q, $scope, $translate, Ip) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.model = { serviceName: null, nexthop: null };
    this.$scope.noTasksPending = false;
    this.$scope.ipCanBeMovedTo = false;
    this.$scope.ipCanBeMovedToError = '';

    this.$scope.loading = {
      init: true,
      ipCanBeMovedTo: true,
      save: false,
    };

    this.$scope.checkIfIpCanBeMovedTo = () => {
      if (this.$scope.model.serviceName !== '_PARK') {
        this.$scope.ipCanBeMovedToError = '';
        this.$scope.loading.ipCanBeMovedTo = true;
        this.Ip.checkIfIpCanBeMovedTo(
          this.$scope.model.serviceName,
          this.ipBlock.ipBlock,
        )
          .then(() => {
            this.$scope.ipCanBeMovedTo = true;
          })
          .catch((data) => {
            if (data && data.message) {
              this.$scope.ipCanBeMovedToError = data.message;
            }
            this.$scope.ipCanBeMovedTo = false;
          })
          .finally(() => {
            this.$scope.loading.ipCanBeMovedTo = false;
          });
      } else {
        this.$scope.ipCanBeMovedTo = true;
        this.$scope.loading.ipCanBeMovedTo = false;
      }
    };

    this.$scope.moveIpBlock = () => {
      this.$scope.loading.save = true;
      if (this.$scope.model.serviceName.serviceType === '_PARK') {
        this.Ip.moveIpBlockToPark(this.ipBlock.ipBlock)
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant(
                    'ip_table_manage_move_ipblock_success',
                    {
                      t0: this.ipBlock.ipBlock,
                      t1:
                        this.$translate.instant(
                          `ip_service${this.$scope.model.serviceName.service}`,
                        ) || this.$scope.model.serviceName.service,
                    },
                  ),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((reason) =>
            this.goBack({
              message: {
                text: this.$translate.instant(
                  'ip_table_manage_move_ipblock_failure',
                  {
                    t0: this.ipBlock.ipBlock,
                    t1:
                      this.$translate.instant(
                        `ip_service${this.$scope.model.serviceName.service}`,
                      ) || this.$scope.model.serviceName.service,
                  },
                ),
                data: {
                  ...reason,
                  type: 'ERROR',
                },
              },
            }),
          );
      } else {
        this.Ip.moveIpBlock(
          this.$scope.model.serviceName.service,
          this.ipBlock.ipBlock,
          this.$scope.model.nexthop,
        )
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant(
                    'ip_table_manage_move_ipblock_success',
                    {
                      t0: this.ipBlock.ipBlock,
                      t1: this.$scope.model.serviceName.service,
                    },
                  ),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((reason) =>
            this.goBack({
              message: {
                text: this.$translate.instant(
                  'ip_table_manage_move_ipblock_failure',
                  {
                    t0: this.ipBlock.ipBlock,
                    t1: this.$scope.model.serviceName.service,
                  },
                ),
                data: {
                  ...reason,
                  type: 'ERROR',
                },
              },
            }),
          );
      }
    };

    this.$scope.canMove = () => {
      const serviceNameChoosed =
        this.$scope.model.serviceName &&
        this.$scope.model.serviceName.service &&
        this.$scope.noTasksPending;
      const nextHopSelectedPCC = () =>
        this.$scope.model.serviceName.serviceType === 'dedicatedCloud' &&
        this.$scope.model.nexthop;
      const nextHopSelectedOther = () =>
        this.$scope.model.serviceName.serviceType !== 'dedicatedCloud';

      return (
        serviceNameChoosed && (nextHopSelectedPCC() || nextHopSelectedOther())
      );
    };

    return this.init();
  }

  init() {
    const queue = [];

    queue.push(
      this.Ip.checkTaskUnique(
        this.ipBlock.ipBlock,
        'genericMoveFloatingIp',
      ).then((tasks) => {
        this.$scope.noTasksPending = !(tasks && tasks.length);
      }),
    );

    queue.push(
      this.Ip.getIpMove(this.ipBlock.ipBlock).then((result) => {
        this.$scope.ipDestinations = result;
        this.$scope.ipDestinations.push({
          service: this.$translate.instant('ip_servicetype__PARK'),
          serviceType: '_PARK',
          nexthop: [],
        });
      }),
    );

    return this.$q.all(queue).finally(() => {
      this.$scope.loading.init = false;
    });
  }
}
