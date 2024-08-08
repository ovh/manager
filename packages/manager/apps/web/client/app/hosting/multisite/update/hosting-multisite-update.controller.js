import clone from 'lodash/clone';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import set from 'lodash/set';
import { GIT_STATUS } from '../hosting-multisite.constants';

angular
  .module('App')
  .controller(
    'HostingDomainModifyCtrl',
    (
      $scope,
      $stateParams,
      $translate,
      atInternet,
      HostingDomain,
      Hosting,
      HostingRuntimes,
      Alerter,
      Domain,
      WucUser,
      $q,
    ) => {
      atInternet.trackPage({ name: 'web::hosting::multisites::modify-domain' });

      $scope.isLoading = true;

      $scope.selectedOptions = {};

      const domainFromMultisite = clone($scope.currentActionData);

      $scope.selected = {
        domain: domainFromMultisite,
        domainWwwNeeded: false,
        domainWww: null,
        pathFinal: null,
        ipv6: domainFromMultisite.ipV6Enabled,
        ssl: domainFromMultisite.rawSsl,
        runtime: domainFromMultisite.runtime,
      };

      if ($scope.selected.domain.ownLog) {
        $scope.selected.ownLogDomain = {
          name: $scope.selected.domain.ownLog,
          displayName: $scope.selected.domain.ownLog,
          formattedName: $scope.selected.domain.ownLog,
        };

        $scope.selected.domain.ownLog = 'ACTIVE';
      } else {
        $scope.selected.domain.ownLog = 'NONE';
      }

      $scope.model = {
        domains: null,
        runtimes: [],
      };

      $scope.loading = {
        runtimes: false,
      };

      $scope.classes = {
        homeInvalid: '',
      };

      $scope.$watch('selected.domain.path', () => {
        if ($scope.selected.domain.path) {
          $scope.classes.homeInvalid = $scope.isPathValid() ? '' : 'error';
        } else {
          $scope.classes.homeInvalid = '';
        }
      });

      $scope.domainsAlreadyExists = () => {
        if (
          $scope.model.domains &&
          $scope.model.domains.indexOf(`www.${$scope.selected.domain.name}`) !==
            -1
        ) {
          return true;
        }
        return false;
      };

      $scope.isPathValid = () =>
        Hosting.constructor.isPathValid($scope.selected.domain.path);

      function isCountryIp(countryIps, recordIdsData) {
        let target = 'FR';

        if (
          find(
            countryIps,
            (countryIp) => countryIp.country === $scope.userInfos.ovhSubsidiary,
          )
        ) {
          target = $scope.userInfos.ovhSubsidiary;
        }

        forEach(countryIps, (country) => {
          const countryFound = find(
            recordIdsData,
            (record) =>
              country.ip === record.target && country.country !== target,
          );

          if (countryFound) {
            $scope.selected.domain.ipLocation = country;

            if ($scope.selected.domain.ipLocation !== '') {
              $scope.selectedOptions.ipLocation = true;
            }
          }
        });

        HostingDomain.getAttachedDomains($stateParams.productId, {
          params: {
            path: $scope.selected.domain.path,
          },
        })
          .then((data) => {
            $scope.domainsWithSamePath = data;
            $scope.checkDomainWithSamePath();
          })
          .finally(() => {
            $scope.isLoading = false;
          });
      }

      $scope.checkDomainWithSamePath = function checkDomainWithSamePath() {
        $scope.hasDomainWithSamePath = $scope.domainsWithSamePath.some(
          (domain) => domain !== $scope.selected.domain.name,
        );
      };

      $scope.canModifyDomainWithGit = function canModifyDomainWithGit() {
        return (
          $scope.hasDomainWithSamePath ||
          $scope.selected.domain.vcsStatus === GIT_STATUS.disabled
        );
      };

      $scope.loadStep1 = () => {
        const subDomainName = $scope
          .getSelectedDomainToDisplay()
          .replace(`.${$scope.hosting.serviceName}`, '');

        if ($scope.getSelectedDomainToDisplay().match(/^www\..*/)) {
          $scope.selected.domainWww = $scope.selected.domain.displayName;
        } else {
          $scope.selected.domainWww = [
            'www',
            $scope.selected.domain.displayName,
          ].join('.');
        }

        return HostingDomain.getExistingDomains($stateParams.productId, false)
          .then((data) => {
            $scope.model.domains = data.existingDomains;
          })
          .then(() => WucUser.getUser())
          .then((user) => {
            $scope.userInfos = user;
          })
          .then(() => Hosting.getSelected($stateParams.productId))
          .then((hosting) => {
            $scope.hosting = hosting;

            if (hosting.isCloudWeb) {
              // Load runtimes configuration
              return HostingRuntimes.list($scope.hosting.serviceName)
                .then((runtimes) => {
                  $scope.loading.runtimes = true;

                  const promises = map(runtimes, (runtimeId) =>
                    HostingRuntimes.get(
                      $scope.hosting.serviceName,
                      runtimeId,
                    ).then((runtime) => {
                      $scope.model.runtimes.push(runtime);

                      return runtime;
                    }),
                  );

                  return $q.all(promises);
                })
                .then(() => {
                  $scope.loading.runtimes = false;
                })
                .catch((err) => {
                  Alerter.alertFromSWS(
                    $translate.instant(
                      'hosting_tab_DOMAINS_configuration_add_loading_error',
                    ),
                    get(err, 'data', err),
                    $scope.alerts.main,
                  );

                  $scope.resetAction();
                });
            }

            return null;
          })
          .then(() => {
            $scope.selected.domain.ipLocation = '';
            $scope.selected.domain.ipV6Enabled = true;
          })
          .then(() => HostingDomain.getAddDomainOptions($stateParams.productId))
          .then((options) => {
            $scope.availableDomains = options.availableDomains;
          })
          .then(() =>
            Domain.getRecordsIds($stateParams.productId, {
              fieldType: 'A',
              subDomain: subDomainName,
            })
              .then(() => {
                $scope.domainWwwAvailable = true;
              })
              .catch((error) => {
                if (error.status === 404) {
                  $scope.domainWwwAvailable = false;
                  return $q.resolve([]);
                }

                return $q.reject(error);
              }),
          )
          .then((recordIds) => {
            const recordsPromises = map(recordIds, (recordId) =>
              Domain.getRecord($stateParams.productId, recordId),
            );

            return $q.all(recordsPromises);
          })
          .then((recordIdsData) => {
            $scope.selected.domain.ipLocation = null;
            isCountryIp($scope.hosting.countriesIp, recordIdsData);
          })
          .catch((err) => {
            $scope.resetAction();
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DOMAINS_configuration_add_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            if (
              $scope.hosting.hasCdn &&
              $scope.selected.domain.cdn !== 'NONE'
            ) {
              $scope.selected.domain.cdn = 'ACTIVE';
              $scope.selected.domain.ipV6Enabled = false;
            }

            if ($scope.selected.ssl) {
              $scope.selected.domain.ssl = true;
            }
          });
      };

      $scope.getSelectedDomain = (wwwNeeded) => {
        let result = '';
        if (wwwNeeded) {
          result = $scope.selected.domainWww;
        } else {
          result = $scope.selected.domain.name;
        }
        return result;
      };

      $scope.getSelectedDomainToDisplay = (wwwNeeded) => {
        let result = '';
        if (wwwNeeded) {
          result = $scope.selected.domainWww;
        } else {
          result = $scope.selected.domain.displayName;
        }
        return result;
      };

      $scope.needWwwDomain = () =>
        $scope.selected.domainWwwNeeded &&
        $scope.selected.domain.name !== $scope.selected.domainWww &&
        $scope.domainsAlreadyExists();

      $scope.loadStep2 = () => {
        $scope.selected.pathFinal = $scope.getSelectedPath();
      };

      $scope.getSelectedPath = () => {
        let home;
        if ($scope.selected.domain.path !== null) {
          if (
            /^\/.*/.test($scope.selected.domain.path) ||
            /^\.\/.*/.test($scope.selected.domain.path)
          ) {
            home = $scope.selected.domain.path;
          } else {
            home = `./${$scope.selected.domain.path}`;
          }
        }
        return home;
      };

      const resultMessages = {
        OK: $translate.instant(
          'hosting_tab_DOMAINS_configuration_modify_success',
        ),
        PARTIAL: $translate.instant(
          'hosting_tab_DOMAINS_configuration_modify_partial',
        ),
        ERROR: $translate.instant(
          'hosting_tab_DOMAINS_configuration_modify_failure',
        ),
      };

      $scope.submit = () => {
        $scope.resetAction();

        atInternet.trackClick({
          name: 'web::hosting::multisites::modify-domain::confirm',
          type: 'action',
        });

        HostingDomain.modifyDomain(
          $scope.selected.domain.name,
          $scope.selected.pathFinal,
          $scope.selected.domainWwwNeeded,
          $scope.selected.domain.cdn,
          $scope.selected.domain.ipLocation,
          $scope.selected.domain.firewall,
          $scope.selected.domain.ownLog === 'ACTIVE'
            ? $scope.selected.ownLogDomain.name
            : null,
          !!$scope.selected.domain.ssl, // mandatory because it could be 0, 1, 2 or true/false
          get($scope.selected, 'runtime.id', null),
          $stateParams.productId,
        )
          .then((data) => {
            Alerter.alertFromSWSBatchResult(
              resultMessages,
              data,
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            set(err, 'type', err.type || 'ERROR');
            if (isEqual(err.status, 403) && includes(err.data, 'updating')) {
              // show update in progress error
              Alerter.alertFromSWS(
                $translate.instant(
                  'hosting_tab_DOMAINS_configuration_modify_failure_inprogress',
                ),
                get(err, 'data', err),
                $scope.alerts.main,
              );
            } else {
              Alerter.alertFromSWS(
                $translate.instant(
                  'hosting_tab_DOMAINS_configuration_modify_failure',
                ),
                get(err, 'data', err),
                $scope.alerts.main,
              );
            }
          });
      };
    },
  );
