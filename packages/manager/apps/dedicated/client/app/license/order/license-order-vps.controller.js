import dropRight from 'lodash/dropRight';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isNaN from 'lodash/isNaN';
import last from 'lodash/last';
import set from 'lodash/set';
import startsWith from 'lodash/startsWith';
import values from 'lodash/values';

angular
  .module('Module.license')
  .controller(
    'LicenseOrderVpsCtrl',
    (
      $scope,
      $translate,
      Alerter,
      License,
      licenseFeatureAvailability,
      LicenseOrder,
      User,
    ) => {
      $scope.nbLicence = {
        value: 0,
      };

      $scope.availableTypes = License.types;

      $scope.loaders = {
        ips: false,
        orderableVersion: true,
        durations: false,
        prices: false,
        bc: false,
        agoraUrl: false,
      };

      const getOrderableVersion = function getOrderableVersion() {
        $scope.loaders.orderableVersion = true;

        LicenseOrder.LicenseAgoraOrder.getAddon({
          productType: 'vps',
          serviceName: get($scope, 'selected.ipBlock.serviceName'),
        })
          .then((data) => {
            const filteredData = filter(data, (license) => {
              const type = license.family.toUpperCase();
              return Object.keys(
                LicenseOrder.LicenseAgoraOrder.licenseTypeToCatalog,
              ).find((l) => startsWith(type, l));
            });

            $scope.types = groupBy(filteredData, (license) =>
              license.planCode.split('-')[1].toUpperCase(),
            );

            $scope.nbLicence.value = values($scope.types).length || 0;
          })
          .catch(() => {
            $scope.selectedType = {
              value: null,
            };
            $scope.nbLicence.value = values($scope.types).length || 0;
          })
          .finally(() => {
            $scope.loaders.orderableVersion = false;
          });
      };

      function isDomainNumberMandatory() {
        return get($scope.selected, 'version.options', []).length > 0;
      }

      function getResetedOptions() {
        return {
          PLESK: {
            domainNumber: {
              mandatory: isDomainNumberMandatory(),
              value: null,
            },
            antivirus: null,
            languagePackNumber: null,
            powerpack: null,
          },
          VIRTUOZZO: {
            containerNumber: {
              mandatory: true,
              value: null,
            },
          },
          WINDOWS: {
            sqlVersion: null,
          },
          WORKLIGHT: {
            lessThan1000Users: {
              mandatory: true,
              value: null,
              shouldBeEqualsTo: true,
            },
          },
        };
      }

      function getResetedDurations() {
        return {
          available: null,
          details: {},
        };
      }

      $scope.isSelectionValid = function isSelectionValid() {
        let valid =
          $scope.selected.licenseType !== null &&
          $scope.selected.version !== null &&
          $scope.selected.ip !== null;
        let moreOptions;
        if (
          $scope.selected.licenseType &&
          $scope.selected.options[$scope.selected.licenseType]
        ) {
          moreOptions = $scope.selected.options[$scope.selected.licenseType];
          angular.forEach(moreOptions, (value) => {
            valid =
              valid &&
              (value === null ||
                !value.mandatory ||
                (value.mandatory &&
                  value.value !== null &&
                  (value.shouldBeEqualsTo === undefined ||
                    value.shouldBeEqualsTo === value.value)));
          });
        }

        return valid;
      };

      $scope.selectType = function selectType(type) {
        if (
          type &&
          type !== $scope.selected.licenseType &&
          !$scope.loaders.prices
        ) {
          $scope.selected.licenseType = type.map((licenseType) => {
            let planCode = get(licenseType, 'planCode');

            const licenseCount = parseInt(
              last(licenseType.planCode.split('-')),
              10,
            );
            if (!isNaN(licenseCount)) {
              planCode = dropRight(planCode.split('-')).join('-');
            }

            const translateKey = `license_designation_${licenseType.family.toUpperCase()}_version_${planCode}`;
            const translateValue = $translate.instant(translateKey, {
              licenseCount,
            });

            if (translateKey !== translateValue) {
              set(licenseType, 'productName', translateValue);
            }

            return licenseType;
          });
          $scope.selected.version = null;
          [$scope.selected.version] = type;
          $scope.selected.duration = null;
          $scope.selected.agoraUrl = '';
          $scope.loaders.bc = false;
          $scope.order = null;
          $scope.selected.version.prices = get(
            $scope.selected,
            'version.prices',
            [],
          ).filter((price) => price.duration !== 'P0D');
        }
      };

      function init() {
        $scope.agoraEnabled = true;
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

        getOrderableVersion();
      }

      $scope.$watch(
        'selected.version',
        () => {
          $scope.selected.options = getResetedOptions();
          $scope.selected.duration = null;
          $scope.loaders.bc = false;
          $scope.order = null;
          $scope.durations = getResetedDurations();
          if ($scope.selected.version) {
            $scope.selected.version.prices = get(
              $scope.selected,
              'version.prices',
              [],
            ).filter((price) => price.duration !== 'P0D');
          }
        },
        true,
      );

      $scope.$watch(
        'selected.options',
        () => {
          $scope.selected.duration = null;
          $scope.loaders.bc = false;
          $scope.order = null;
          $scope.durations = getResetedDurations();
        },
        true,
      );

      /**
       *  For plesk powerpack option only (and only for agora order)
       */
      $scope.onPowerpackOptionChange = function onPowerpackOptionChange() {
        $scope.selected.options.PLESK.powerpack = $scope.powerpackModel.value
          ? { value: $scope.selected.version.more.powerPackPlanCode }
          : null;
      };

      $scope.$watch(
        'selected.duration',
        () => {
          $scope.loaders.bc = false;
          $scope.order = null;
          if ($scope.agoraEnabled && $scope.selected.duration) {
            $scope.getAgoraUrl();
          }
        },
        true,
      );

      $scope.durations = getResetedDurations();

      $scope.contractsValidated = {
        value: null,
      };

      $scope.selectDuration = function selectDuration() {
        $scope.contractsValidated = {
          value: null,
        };
      };

      $scope.getAgoraUrl = function getAgoraUrl() {
        $scope.loaders.agoraUrl = true;
        const expressParams = {
          productId: 'vps',
          serviceName: get($scope.selected, 'ipBlock.serviceName'),
          planCode: get($scope.selected, 'version.planCode'),
          duration: get($scope.selected, 'duration.duration'),
          pricingMode: get($scope.selected, 'duration.pricingMode'),
          quantity: 1,
        };

        return User.getUrlOf('express_order_resume')
          .then((url) => {
            $scope.selected.agoraUrl = `${url}?products=${JSURL.stringify([
              expressParams,
            ])}`;
          })
          .catch((err) =>
            Alerter.alertFromSWS(
              $translate.instant('license_order_loading_error'),
              err,
              $scope.alerts.order,
            ),
          )
          .finally(() => {
            $scope.loaders.agoraUrl = false;
          });
      };

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
