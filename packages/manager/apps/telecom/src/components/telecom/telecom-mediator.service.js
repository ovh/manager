import get from 'lodash/get';

angular
  .module('managerApp')
  .service(
    'TelecomMediator',
    function TelecomMediator(
      $q,
      $translate,
      OvhApiMeVipStatus,
      TucPackMediator,
      TelephonyMediator,
      TucSmsMediator,
      TucFaxMediator,
      TucOverTheBoxMediator,
      TucToast,
    ) {
      const self = this;

      self.isVip = false;
      self.serviceCount = null;

      self.deferred = {
        vip: null,
        count: null,
      };

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      /* ----------  VIP STATUS  ----------*/

      self.initVipStatus = function initVipStatus(force) {
        if (self.deferred.vip && !force) {
          return self.deferred.vip.promise;
        }

        self.deferred.vip = $q.defer();

        // get vip status of connected user
        OvhApiMeVipStatus.v6()
          .get()
          .$promise.then((vipStatus) => {
            self.isVip = vipStatus.telecom;
            self.deferred.vip.resolve(self.isVip);
          });

        return self.deferred.vip.promise;
      };

      /* ----------  SERVICE COUNT  ----------*/

      self.initServiceCount = function initServiceCount(force) {
        if (self.deferred.count && !force) {
          return self.deferred.count.promise;
        }

        self.deferred.count = $q.defer();

        const countErrors = [];
        const handleCountError = function handleCountError(err) {
          countErrors.push(get(err, 'data.message') || err.statusText);
          return $q.when(0);
        };

        // get service count for telecom
        $q.all({
          pack: TucPackMediator.getCount().catch(handleCountError),
          telephony: TelephonyMediator.getCount().catch(handleCountError),
          sms: TucSmsMediator.getCount().catch(handleCountError),
          freefax: TucFaxMediator.getCount().catch(handleCountError),
          overTheBox: TucOverTheBoxMediator.getCount().catch(handleCountError),
        }).then((counts) => {
          if (countErrors.length) {
            $translate.refresh().then(() => {
              TucToast.error(
                `${$translate.instant(
                  'sidebar_init_error',
                )}<br/><br/>${countErrors.join('<br />')}`,
                {
                  hideAfter: false,
                },
              );
            });
          }
          self.deferred.count.resolve(counts);
        });

        return self.deferred.count.promise;
      };

      /* -----  End of INITIALIZATION  ------*/
    },
  );
