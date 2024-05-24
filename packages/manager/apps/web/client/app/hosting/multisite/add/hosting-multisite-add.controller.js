import forEach from 'lodash/forEach';
import get from 'lodash/get';
import includes from 'lodash/includes';
import { HOSTING_OFFER } from '../hosting-multisite.constants';

angular
  .module('App')
  .controller(
    'HostingDomainAttachCtrl',
    (
      $scope,
      $state,
      $stateParams,
      $rootScope,
      $translate,
      Hosting,
      HostingDomain,
      HostingRuntimes,
      Alerter,
      $q,
      WucValidator,
      COMPOSED_TLD,
    ) => {
      $scope.model = {
        conflicts: null,
        domains: null,
        hosting: null,
        mode: {
          OVH: 'OVH',
          EXTERNAL: 'EXTERNAL',
        },
        domainsCount:
          $scope.currentActionData && $scope.currentActionData.domains
            ? $scope.currentActionData.domains.count
            : -1,
        options: null,
        step2Valid: null,
        token: null,
        tokenSubdomain: null,
        runtimes: [],
      };

      $scope.MAX_DOMAIN_LENGTH = WucValidator.MAX_DOMAIN_LENGTH;

      $scope.isStep1Valid = () => {
        if (
          !$scope.model.options &&
          !$scope.model.moreThanOneDomainCountWithOneAttached
        ) {
          return false;
        }
        if (
          $scope.model.capabilities &&
          $scope.model.domainsCount >=
            $scope.model.capabilities.attachedDomains &&
          !$scope.model.moreThanOneDomainCountWithOneAttached
        ) {
          return true;
        }
        if (
          !$scope.selected.mode &&
          !$scope.model.moreThanOneDomainCountWithOneAttached
        ) {
          return false;
        }
        if (
          $scope.selected.mode === $scope.model.mode.OVH &&
          !$scope.model.moreThanOneDomainCountWithOneAttached
        ) {
          return $scope.selected.baseDomain !== null;
        }
        return true;
      };

      $scope.selected = {
        autoconfigure: true,
        baseDomain: null,
        domain: $scope.currentActionData.subdomain || '',
        hosting: $scope.currentActionData
          ? $scope.currentActionData.hosting
          : null,
        domainWww: null,
        domainWwwNeeded: true,
        mode: $scope.model.mode.OVH,
        path: '',
        pathFinal: null,
        search: '',
        activeCDN: 'NONE',
        countryIp: null,
        firewall: 'NONE',
        ownLog: null,
        ssl: true,
        runtime: null,
      };

      $scope.hosting = $scope.currentActionData
        ? $scope.currentActionData.hosting || $scope.hosting
        : $scope.hosting;

      $scope.selectedOptions = { value: 'none' };

      $scope.loaders = {
        hosting: false,
        conflicts: false,
        runtime: false,
      };

      const pattern = {
        domainWithSubdomain: /^(.*)\.([^.]+\.[^.]+)$/,
        domainWithoutSubdomain: /^([^.]+\.[^.]+)$/,
      };

      $scope.getHostingIp = (hosting, activeCDN, ipv6) =>
        hosting[
          (activeCDN === 'ACTIVE' ? 'hostingIp' : 'clusterIp') +
            (ipv6 ? 'v6' : '')
        ];

      $scope.isPathValid = () =>
        Hosting.constructor.isPathValid($scope.selected.path);

      $scope.getTokenDomain = () => {
        let result;
        if ($scope.model.tokenSubdomain && $scope.selected.domain) {
          result = $scope.model.tokenSubdomain;
          const subDomainPattern = $scope.selected.domain.match(
            pattern.domainWithSubdomain,
          );
          if (subDomainPattern !== null) {
            result += `.${
              includes(COMPOSED_TLD, subDomainPattern[2])
                ? $scope.selected.domain
                : subDomainPattern[2]
            }`;
          } else if (
            $scope.selected.domain.match(pattern.domainWithoutSubdomain) !==
            null
          ) {
            result += `.${$scope.selected.domain}`;
          }
        }
        return result;
      };

      $scope.$watch('selected.domain', () => {
        if (
          $scope.selected.domain !== undefined &&
          $scope.selected.domain !== null
        ) {
          if ($scope.getSelectedDomainToDisplay().match(/^www\..*/)) {
            $scope.selected.domainWww = $scope.selected.domain;
          } else {
            $scope.selected.domainWww = `www.${$scope.selected.domain}`;
          }
        }
      });

      $scope.upgradeProductOnNextButtonClicked = () => {
        if ($scope.showMessagesNoDomainLeft()) {
          $state.go('app.hosting.dashboard.upgrade', {
            productId: $stateParams.productId,
          });
        }
      };

      $scope.showMessagesNoDomainLeft = () => {
        return (
          $scope.model.hosting &&
          $scope.model.options &&
          $scope.model.domainsCount >=
            $scope.model.capabilities.attachedDomains &&
          !$scope.model.moreThanOneDomainCountWithOneAttached
        );
      };

      $scope.loadHosting = () => {
        let futuresOptions;
        let futureHosting;

        if ($scope.currentActionData && $scope.currentActionData.hosting) {
          $scope.selected.baseDomain = $scope.currentActionData.domain;
          $scope.model.domains = [];

          futuresOptions = HostingDomain.getAddDomainOptions(
            $scope.currentActionData.hosting,
          )
            .then((options) => {
              $scope.model.options = options;
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
            });

          futureHosting = Hosting.getHosting($scope.currentActionData.hosting)
            .then((hosting) => {
              $scope.model.hosting = hosting;
              $scope.hosting = hosting;
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
            });
        } else {
          futuresOptions = HostingDomain.getAddDomainOptions()
            .then((options) => {
              $scope.model.options = options;
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
            });

          futureHosting = Hosting.getSelected($stateParams.productId)
            .then((hosting) => {
              $scope.model.hosting = hosting;
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
            });
        }

        $q.all([futuresOptions, futureHosting])
          .then(() => {
            const promises = [
              Hosting.getOfferCapabilities($scope.hosting.offer),
            ];

            if ($scope.model.domainsCount === -1) {
              promises.push(
                HostingDomain.getAttachedDomains($scope.hosting.serviceName),
              );
            }
            return $q.all(promises);
          })
          .then((resp) => {
            [$scope.model.capabilities] = resp;

            if (resp.length > 1) {
              $scope.model.domainsCount = resp[1].length;
            }

            $scope.model.moreThanOneDomainCountWithOneAttached =
              $scope.model.domainsCount >= 1 &&
              $scope.model.capabilities.attachedDomains === 1;

            if ($scope.model.moreThanOneDomainCountWithOneAttached) {
              $scope.wizardConfirmButtonText = $translate.instant(
                'hosting_tab_DOMAINS_configuration_add_buttom_update_offer',
              );
              $scope.onFinish = () =>
                $state.go('app.hosting.dashboard.upgrade', {
                  productId: $stateParams.productId,
                });
            }

            if ($scope.currentActionData && $scope.currentActionData.hosting) {
              if (
                $scope.model.domainsCount <
                $scope.model.capabilities.attachedDomains
              ) {
                $scope.loadStep2();
                $rootScope.$broadcast('wizard-goToStep', 3);
              }
            } else {
              angular.forEach(
                $scope.model.options.availableDomains,
                (domain) => {
                  if (domain.name === $scope.model.hosting.serviceName) {
                    $scope.selected.baseDomain = domain;
                  }
                },
              );
            }
          })
          .catch((err) => {
            $scope.resetAction();
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DOMAINS_configuration_add_loading_error',
              ),
              err,
              $scope.alerts.main,
            );
          });
      };

      $scope.getStep2View = () => {
        if ($scope.selected.mode) {
          return `hosting/multisite/add/${$scope.selected.mode.toLowerCase()}/hosting-multisite-add-${$scope.selected.mode.toLowerCase()}.html`;
        }
        return '';
      };

      const resultMessages = {
        OK: $translate.instant('hosting_tab_DOMAINS_configuration_add_success'),
        PARTIAL: $translate.instant(
          'hosting_tab_DOMAINS_configuration_add_partial',
        ),
        ERROR: $translate.instant(
          'hosting_tab_DOMAINS_configuration_add_failure',
        ),
      };

      $scope.submit = () => {
        $scope.loading = true;
        $scope.resetAction();
        HostingDomain.addDomain(
          $scope.selected.mode === $scope.model.mode.OVH
            ? $scope.selected.baseDomain.name
            : $scope.selected.domain,
          $scope.selected.mode === $scope.model.mode.OVH
            ? $scope.selected.domain
            : null,
          $scope.selected.pathFinal,
          $scope.needWwwDomain(),
          $scope.selected.autoconfigure &&
            $scope.selected.mode === $scope.model.mode.OVH,
          $scope.selected.activeCDN,
          $scope.selected.countryIp ? $scope.selected.countryIp : null,
          $scope.selected.firewall,
          $scope.selected.ownLog === 'ACTIVE'
            ? $scope.selected.ownLogDomain.name
            : null,
          $scope.selected.ssl,
          get($scope.selected, 'runtime.id', null),
          $scope.selected.hosting || $stateParams.productId,
        )
          .then((data) => {
            Alerter.alertFromSWSBatchResult(
              resultMessages,
              data,
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DOMAINS_configuration_add_failure',
              ),
              { message: get(err, 'data', err), type: 'ERROR' },
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.loading = false;
          });
      };

      $scope.$watch('selected.mode', () => {
        if (
          !$scope.currentActionData ||
          $scope.currentActionData.subdomain !== $scope.selected.domain
        ) {
          $scope.selected.domain = '';
        }
      });

      $scope.loadStep2 = () => {
        const tokenNeeded = $scope.selected.mode === $scope.model.mode.EXTERNAL;
        HostingDomain.getExistingDomains(
          $scope.selected.hosting || $stateParams.productId,
          tokenNeeded,
        )
          .then((data) => {
            $scope.model.domains = data.existingDomains;
            $scope.model.token = data.token;
            $scope.model.tokenSubdomain = data.tokenSubdomain;
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
          });

        Hosting.getSelected($stateParams.productId)
          .then((hosting) => {
            $scope.hosting = hosting;

            if (hosting.isCloudWeb) {
              // Load runtimes configuration
              HostingRuntimes.list($scope.hosting.serviceName)
                .then((runtimes) => {
                  $scope.loaders.runtimes = true;

                  const promises = [];
                  forEach(runtimes, (runtimeId) => {
                    promises.push(
                      HostingRuntimes.get(
                        $scope.hosting.serviceName,
                        runtimeId,
                      ).then((runtime) => {
                        $scope.model.runtimes.push(runtime);
                        if (runtime.isDefault) {
                          $scope.selected.runtime = runtime;
                        }

                        return runtime;
                      }),
                    );
                  });

                  $q.all(promises).then(() => {
                    $scope.loaders.runtimes = false;
                  });
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
      };

      $scope.isStartingOffer = () => {
        return $scope.model.hosting.offer === HOSTING_OFFER.STARTER_OVH;
      };

      $scope.domainsAlreadyExists = (wwwNeeded) => {
        if (
          $scope.model.domains &&
          $scope.model.domains.indexOf($scope.getSelectedDomain(wwwNeeded)) !==
            -1
        ) {
          return true;
        }
        return false;
      };

      $scope.domainIsNotValid = () => {
        if ($scope.selected.ssl) {
          return $scope.getSelectedDomain()
            ? !WucValidator.isValidDomain($scope.getSelectedDomain(), {
                canBeginWithWildcard: true,
              })
            : false;
        }
        return false;
      };

      $scope.domainContainsWildcard = () =>
        $scope.getSelectedDomain()
          ? $scope.getSelectedDomain().indexOf('*') !== -1
          : false;

      $scope.getSelectedPath = () => {
        let home;
        if ($scope.selected.path !== null) {
          if (
            /^\/.*/.test($scope.selected.path) ||
            /^\.\/.*/.test($scope.selected.path)
          ) {
            home = $scope.selected.path;
          } else {
            home = `./${$scope.selected.path}`;
          }
        }
        return home;
      };

      $scope.loadStep3 = () => {
        $scope.model.conflicts = null;
        $scope.selected.pathFinal = $scope.getSelectedPath();
        if ($scope.selected.mode === $scope.model.mode.OVH) {
          $scope.loadingConflicts = true;
          HostingDomain.getExistingConfiguration(
            $stateParams.productId,
            $scope.selected.baseDomain.name,
            $scope.selected.domain,
            $scope.needWwwDomain(),
          )
            .then((data) => {
              if (data.length > 0) {
                $scope.model.conflicts = data;
              }
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
              $scope.loadingConflicts = false;
            });
        }
      };

      $scope.getSelectedDomainToDisplay = (wwwNeeded) => {
        let result = '';
        if (wwwNeeded) {
          result = $scope.selected.domainWww;
        } else {
          result = $scope.selected.domain;
        }

        if (
          $scope.selected.mode === $scope.model.mode.OVH &&
          $scope.selected.baseDomain
        ) {
          if ($scope.selected.domain && $scope.selected.domain.length > 0) {
            result += '.';
          }
          result += $scope.selected.baseDomain.displayName;
        }
        return result && result.toLowerCase();
      };

      $scope.getSelectedDomain = (wwwNeeded) => {
        let result = '';
        if (wwwNeeded) {
          result = $scope.selected.domainWww;
        } else {
          result = $scope.selected.domain;
        }

        if (
          $scope.selected.mode === $scope.model.mode.OVH &&
          $scope.selected.baseDomain
        ) {
          if ($scope.selected.domain && $scope.selected.domain.length > 0) {
            result += '.';
          }
          result += $scope.selected.baseDomain.name;
        }
        return result && result.toLowerCase();
      };

      $scope.needWwwDomain = () =>
        !$scope.domainContainsWildcard() &&
        $scope.selected.domainWwwNeeded &&
        $scope.selected.domain !== $scope.selected.domainWww &&
        !$scope.domainsAlreadyExists(true);

      $scope.hasConflicts = () =>
        $scope.model.conflicts && $scope.model.conflicts.length;

      $scope.previousButtonHidden = () => {
        if (
          $scope.currentActionData &&
          $scope.currentActionData.hosting &&
          $scope.currentStep === 2
        ) {
          return true;
        }

        return false;
      };
    },
  );
