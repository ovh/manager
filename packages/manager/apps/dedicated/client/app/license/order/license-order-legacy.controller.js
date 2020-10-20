import assign from 'lodash/assign';
import capitalize from 'lodash/capitalize';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import join from 'lodash/join';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import replace from 'lodash/replace';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import split from 'lodash/split';
import values from 'lodash/values';

import {
  CPANEL_PREMIER_TYPES,
  CPANEL_ADMIN_TYPE,
  CPANEL_PRO_TYPE,
  MAX_CPANEL_PRO_ACCOUNTS,
  MAX_CPANEL_ADMIN_ACCOUNTS,
  LICENCE_TYPES,
} from './license-order.constants';

angular
  .module('Module.license')
  .controller(
    'LicenseOrderClassicCtrl',
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
    ) => {
      $scope.alerts = {
        order: 'license.alerts.order',
      };

      function getFilteredIps() {
        const typesFiltered = $filter('filter')(
          $scope.availableIpBlock.ips,
          $scope.filters.block.type,
        );
        const searchFiltered = $filter('filter')(
          typesFiltered,
          $scope.filters.block.search,
        );

        return searchFiltered;
      }

      function loadPrices(licenseInfo, durations) {
        $scope.loaders.prices = true;

        LicenseOrder.getLicensePrices(licenseInfo, durations)
          .then((prices) => {
            if (durations && durations.length === 1) {
              $scope.selected.duration = head(durations);
            }

            $scope.durations.details = prices;
          })
          .finally(() => {
            $scope.loaders.prices = false;
          });
      }

      function getExistingServiceName(licenseType) {
        return $scope.types[licenseType].existingServiceName;
      }

      const getOrderableVersion = function getOrderableVersion() {
        $scope.loaders.orderableVersion = true;

        if ($scope.ipValid.value) {
          License.orderableVersion($scope.selected.ip)
            .then((data) => {
              $scope.types = data;
              $scope.loaders.orderableVersion = false;
              $scope.nbLicence.value = 0;
              angular.forEach(values($scope.types), (value) => {
                $scope.nbLicence.value += value.options.length;
              });
            })
            .then(() => {
              $scope.getDuration();
            });
        } else {
          $scope.loaders.orderableVersion = false;
          $scope.selectedType = {
            value: null,
          };
          $scope.nbLicence.value = values($scope.types).length || 0;
        }
      };

      function isDomainNumberMandatory() {
        return (
          $scope.selected &&
          $scope.selected.version &&
          $scope.selected.version.options !== null &&
          $scope.selected.version.options.length > 0
        );
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

      $scope.types = {};

      $scope.hasMoreOptions = function hasMoreOptions() {
        return $scope.selected.options[$scope.selected.licenseType] !== null;
      };

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

      $scope.availableIpBlock = {};

      $scope.ipValid = {
        value: false,
      };

      $scope.selectType = function selectType(type) {
        if (
          type &&
          type !== $scope.selected.licenseType &&
          $scope.isAvailable(type) &&
          !$scope.loaders.prices
        ) {
          // In case of license upgrade, show an information popup and redirect to upgrade screen.
          const existingServiceName = getExistingServiceName(type);
          if (existingServiceName) {
            $scope.setAction(
              'redirection/upgrade/license-redirection-upgrade',
              {
                licenseId: existingServiceName,
                licenseType: type,
              },
            );
            return;
          }

          $scope.selected.licenseType = type;
          $scope.selected.version = null;
          if (
            $scope.types[$scope.selected.licenseType].options &&
            $scope.types[$scope.selected.licenseType].options.length > 0 &&
            $scope.types[$scope.selected.licenseType].options[0].options &&
            $scope.types[$scope.selected.licenseType].options[0].options
              .length === 1
          ) {
            // eslint-disable-next-line prefer-destructuring
            $scope.selected.version =
              $scope.types[$scope.selected.licenseType].options[0].options[0];
          }
          const { options } = $scope.types[
            $scope.selected.licenseType
          ].options[0];
          if ($scope.selected.licenseType === LICENCE_TYPES.CPANEL) {
            $scope.formatedOptions = map(options, (option) => {
              const value = get(option, 'value');
              let count = 0;
              let displayName = null;
              if (
                filter(CPANEL_PREMIER_TYPES, (cPanelType) =>
                  includes(value, cPanelType),
                ).length > 0
              ) {
                count = head(value.match(/[\d]+/));
                displayName = $translate.instant(
                  'license_designation_CPANEL_premier_option',
                  { numberOfCPANEL: count },
                );
              } else if (includes(value, CPANEL_ADMIN_TYPE)) {
                count = MAX_CPANEL_ADMIN_ACCOUNTS;
                displayName = $translate.instant(
                  'license_designation_CPANEL_admin_option',
                );
              } else if (includes(value, CPANEL_PRO_TYPE)) {
                count = MAX_CPANEL_PRO_ACCOUNTS;
                displayName = $translate.instant(
                  'license_designation_CPANEL_pro_option',
                );
              }
              set(option, 'displayName', displayName);
              set(option, 'cPanelCount', parseInt(count));
              return option;
            });
            $scope.formatedOptions = sortBy(
              $scope.formatedOptions,
              'cPanelCount',
            );
          } else if ($scope.selected.licenseType === LICENCE_TYPES.WORKLIGHT) {
            $scope.formatedOptions = map(options, (option) => {
              const value = replace(option.value, /version-/gi, '');
              set(
                option,
                'displayName',
                capitalize(join(split(value, '-'), ' ')),
              );
              return option;
            });
          } else {
            $scope.formatedOptions = map(options, (option) => {
              set(
                option,
                'displayName',
                $translate.instant(
                  `license_designation_${$scope.selected.licenseType}_version_${option.value}`,
                ),
              );
              return option;
            });
          }

          $scope.selected.options = getResetedOptions();
          $scope.selected.duration = null;
          $scope.selected.agoraUrl = '';
          $scope.loaders.bc = false;
          $scope.durations = getResetedDurations();
          $scope.order = null;
        }
      };

      $scope.isAvailable = function isAvailable(type) {
        if ($scope.types) {
          return (
            !!$scope.types[type] &&
            $scope.types[type].options &&
            $scope.types[type].options.length > 0 &&
            (!licenseFeatureAvailability.allowLicenseAgoraOrder() ||
              licenseFeatureAvailability.allowLicenseTypeAgoraOrder(type))
          );
        }

        return false;
      };

      $scope.$watch('selected.ipBlock', (nv) => {
        $scope.selected.licenseType = null;
        $scope.selected.version = null;
        $scope.selected.ip = null;
        $scope.selected.options = getResetedOptions();
        $scope.selected.duration = null;
        $scope.selected.agoraUrl = '';
        $scope.loaders.bc = false;
        $scope.durations = getResetedDurations();
        $scope.order = null;
        $scope.ipValid.value = false;

        if (nv) {
          const block = nv.block.split('/');
          const mask = block[1];
          let range = block[0];

          try {
            range = ipaddr.parse(range);
            if (range.kind() === 'ipv4') {
              if (mask === '32') {
                $scope.oneIp = true;
              } else {
                $scope.oneIp = false;
              }

              $scope.selected.ip = range.toString();
              $scope.ipValid.value = true;
            } else {
              $scope.oneIp = false;
            }
          } catch (e) {
            $scope.oneIp = false;
            throw e;
          }

          getOrderableVersion();
        }
      });

      $scope.$watch(
        'selected.version',
        () => {
          $scope.selected.options = getResetedOptions();
          $scope.selected.duration = null;
          $scope.loaders.bc = false;
          $scope.order = null;
          $scope.durations = getResetedDurations();
          $scope.getDuration();
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
          $scope.getDuration();
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

      $scope.recheckIpBlockContained = function recheckIpBlockContained() {
        if (!includes(getFilteredIps(), $scope.selected.ipBlock)) {
          $scope.selected.ipBlock = null;
          $scope.selected.ip = null;
          $scope.ipValid.value = false;
          $scope.oneIp = false;
          $scope.selected.licenseType = null;
          $scope.selected.version = null;
          $scope.selected.options = getResetedOptions();
          $scope.selected.duration = null;
          $scope.loaders.bc = false;
          $scope.durations = getResetedDurations();
          $scope.order = null;
        }
      };

      $scope.durations = getResetedDurations();

      function getWhatToSendFromSelected() {
        if (!$scope.selected.version || !$scope.selected.licenseType) {
          return null;
        }

        return {
          licenseType: $scope.selected.licenseType,
          ip: $scope.selected.ip,
          version: $scope.selected.version.value,
          options: $scope.selected.options[$scope.selected.licenseType],
        };
      }

      $scope.getDuration = function getDuration() {
        if (!$scope.loaders.durations && $scope.isSelectionValid()) {
          $scope.loaders.durations = true;
          const asking = getWhatToSendFromSelected();

          return LicenseOrder.getLicenseDurations(asking).then(
            (durations) => {
              if (angular.equals(asking, getWhatToSendFromSelected())) {
                $scope.durations.available = durations;
                loadPrices(asking, durations);
              }

              $scope.loaders.durations = false;
            },
            (data) => {
              $scope.loaders.durations = false;
              Alerter.alertFromSWS(
                $translate.instant('license_order_loading_error'),
                data.data,
                $scope.alerts.order,
              );
            },
          );
        }
        return null;
      };

      $scope.contractsValidated = {
        value: null,
      };

      $scope.selectDuration = function selectDuration() {
        $scope.contractsValidated = {
          value: null,
        };
      };

      $scope.generateBc = function generateBc() {
        $scope.loaders.bc = true;
        License.orderLicenseOrderForDuration({
          licenseType: $scope.selected.licenseType,
          ip: $scope.selected.ip,
          version: $scope.selected.version.value,
          options: $scope.selected.options[$scope.selected.licenseType],
          duration: $scope.selected.duration,
        }).then((details) => {
          $scope.order = details;
          $scope.loaders.bc = false;
        });
      };

      $scope.getAgoraUrl = function getAgoraUrl() {
        const asking = assign(
          { duration: $scope.selected.duration },
          getWhatToSendFromSelected(),
        );
        $scope.selected.agoraUrl = '';

        $scope.loaders.agoraUrl = true;
        return LicenseOrder.getFinalizeOrderUrl(asking)
          .then((url) => {
            $scope.selected.agoraUrl = url;
          })
          .finally(() => {
            $scope.loaders.agoraUrl = false;
          });
      };

      $scope.openBc = function openBc() {
        window.open($scope.order.url);
      };

      $scope.getBlockDisplay = function getBlockDisplay(ip) {
        return ip.block + (ip.reverse ? ` (${ip.reverse})` : '');
      };

      $scope.filterBlocks = function filterBlocks() {
        $('#licenseOrderBlockFilters').click();
      };

      $scope.order = null;
    },
  );
