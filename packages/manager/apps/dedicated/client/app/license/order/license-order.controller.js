import get from 'lodash/get';
import set from 'lodash/set';
import values from 'lodash/values';

angular
  .module('Module.license')
  .controller(
    'LicenseOrderCtrl',
    (
      $q,
      $filter,
      $scope,
      $timeout,
      $translate,
      Alerter,
      License,
      licenseFeatureAvailability,
      LicenseOrder,
      User,
    ) => {
      $scope.alerts = {
        order: 'license.alerts.order',
      };

      $scope.loaders = {
        ips: false,
        orderableVersion: true,
        durations: false,
        prices: false,
        bc: false,
        agoraUrl: false,
      };

      $scope.types = {};

      $scope.selected = {
        ipBlock: null,
        ip: null,
        licenseType: null,
        version: null,
        options: [],
        duration: null,
        agoraUrl: '',
      };

      $scope.filters = {
        block: {
          type: undefined,
          search: undefined,
        },
      };

      $scope.availableIpBlock = {};

      $scope.ipValid = {
        value: false,
      };

      const getOrderableVersion = function getOrderableVersion() {
        $scope.loaders.orderableVersion = true;

        if ($scope.ipValid.value) {
          switch ($scope.selected.ipBlock.type) {
            case 'VPS':
              LicenseOrder.LicenseAgoraOrder.getAddon({
                serviceName: get($scope, 'selected.ipBlock.serviceName'),
                productType: 'vps',
              })
                .then((data) => {
                  $scope.orderType = data.length > 0 ? 'VPS' : 'LEGACY';
                })
                .catch(() => {
                  $scope.orderType = 'LEGACY';
                })
                .finally(() => {
                  $scope.loaders.orderableVersion = false;
                });
              break;

            default:
              $scope.orderType = 'LEGACY';
          }
        } else {
          $scope.loaders.orderableVersion = false;
          $scope.selectedType = {
            value: null,
          };
          $scope.nbLicence.value = values($scope.types).length || 0;
        }
      };

      $scope.resetAction = function resetAction() {
        $scope.setAction(false);
      };

      $scope.setAction = function setAction(action, data) {
        if (action) {
          $scope.currentAction = action;
          $scope.currentActionData = data;
          $scope.stepPath = `license/${$scope.currentAction}.html`;
          $('#currentAction').modal({
            keyboard: true,
            backdrop: 'static',
          });
        } else {
          $('#currentAction').modal('hide');
          $timeout(() => {
            $scope.currentActionData = null;
            $scope.stepPath = '';
          }, 300);
        }
      };

      function init() {
        $scope.agoraEnabled = licenseFeatureAvailability.allowLicenseAgoraOrder();
        $scope.powerpackModel = {
          value: false,
        };
        $scope.loaders.ips = true;

        if ($scope.agoraEnabled) {
          $scope.$watch(
            () => $scope.selected,
            (value) => {
              set(LicenseOrder, 'ip', value.ip);
            },
            true,
          );
        }

        return $q
          .all({
            ips: License.ips(),
            user: User.getUser(),
          })
          .then((results) => {
            $scope.availableIpBlock = results.ips;
            $scope.user = results.user;
          })
          .catch((err) => {
            $scope.availableIpBlock = {};
            Alerter.alertFromSWS(
              $translate.instant('license_details_loading_error'),
              err,
              $scope.alerts.order,
            );
          })
          .finally(() => {
            $scope.loaders.ips = false;
          });
      }

      $scope.ipIsValid = function ipIsValid() {
        const block = $scope.selected.ipBlock.block.split('/');
        const mask = block[1];
        const range = block[0];
        let ip = null;

        try {
          if (ipaddr.isValid($scope.selected.ip)) {
            ip = ipaddr.parse($scope.selected.ip);
            $scope.ipValid.value = ip.match(ipaddr.parse(range), mask);
          } else {
            $scope.ipValid.value = false;
          }
        } catch (e) {
          $scope.ipValid.value = false;
          throw e;
        }

        getOrderableVersion();
      };

      $scope.$watch('selected.ipBlock', (nv) => {
        $scope.selected.licenseType = null;
        $scope.selected.version = null;
        $scope.selected.ip = null;
        $scope.selected.options = [];
        $scope.selected.duration = null;
        $scope.selected.agoraUrl = '';
        $scope.loaders.bc = false;
        $scope.durations = [];
        $scope.order = null;
        $scope.ipValid.value = false;

        if (nv) {
          const block = nv.block.split('/');
          const mask = block[1];
          let range = block[0];

          try {
            range = ipaddr.parse(range);
            $scope.oneIp = false;

            if (range.kind() === 'ipv4') {
              $scope.oneIp = mask === '32';
              $scope.selected.ip = range.toString();
              $scope.ipValid.value = true;
            }
          } catch (e) {
            $scope.oneIp = false;
            throw e;
          }

          getOrderableVersion();
        }
      });

      $scope.getBlockDisplay = function getBlockDisplay(ip) {
        return ip.block + (ip.reverse ? ` (${ip.reverse})` : '');
      };

      $scope.filterBlocks = function filterBlocks() {
        $('#licenseOrderBlockFilters').click();
      };

      $scope.order = null;

      init();
    },
  );
