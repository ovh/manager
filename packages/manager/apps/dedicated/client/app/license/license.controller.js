import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import remove from 'lodash/remove';
import startCase from 'lodash/startCase';
import config from '../config/config';

export default /* @ngInject */ (
  $scope,
  $state,
  License,
  $timeout,
  $translate,
  constants,
  ovhFeatureFlipping,
  LICENCE_TYPES,
  atInternet,
  iceberg,
) => {
  $scope.licencesTableLoading = false;
  $scope.licenses = null;
  $scope.licenseTypes = {
    CPANEL: 'CPANEL',
    PLESK: 'PLESK',
    SPLA: 'SPLA',
    SQLSERVER: 'SQLSERVER',
    WINDOWS: 'WINDOWS',
  };
  $scope.filterType = null;
  $scope.$state = $state;
  $scope.iceberg = iceberg;
  $scope.constants = constants;

  /**
   * Search
   * @param  {String} type
   * @return {Void}
   */
  $scope.search = (type) => {
    $scope.filterType = type;
    $scope.$broadcast('paginationServerSide.loadPage', 1, 'licensesPagination');
  };

  $scope.resetAction = () => $scope.setAction(false);

  $scope.$on('$locationChangeStart', () => $scope.resetAction());

  $scope.setAction = (action, data) => {
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
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };

  $scope.loadDatagridLicences = ({ offset, pageSize }) =>
    $scope.loadLicenses(pageSize, offset - 1).then((licenses) => ({
      data: get(licenses, 'list.results'),
      meta: {
        totalCount: licenses.count,
      },
    }));

  /**
   * Load licenses.
   * @param  {Number} count
   * @param  {Number} offset
   * @return {Promise}
   */
  $scope.loadLicenses = (count, offset) => {
    $scope.licencesTableLoading = true;
    return License.get('', {
      params: {
        filterType:
          $scope.filterType === 'ALL_TYPE' ? undefined : $scope.filterType,
        count,
        offset,
      },
    })
      .then((licenses) => {
        const results = remove(licenses.list.results, null);
        if (isArray(get(licenses, 'availableTypes'))) {
          licenses.availableTypes.push('ALL_TYPE');
        }
        angular.forEach(results, (value, idx) => {
          if (value.expiration !== null) {
            results[idx].isExpired = moment().isAfter(
              moment(value.expiration, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            );
            results[idx].expireSoon = moment()
              .add(1, 'months')
              .isAfter(moment(value.expiration, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'));
          }
        });
        $scope.licenses = licenses;

        return {
          ...licenses,
          list: {
            ...licenses.list,
            results,
          },
        };
      })
      .finally(() => {
        $scope.licencesTableLoading = false;
      });
  };

  /**
   * Get license Id.
   * @param  {Object} license
   * @return {Number}
   */
  $scope.getLicenseId = (license) => {
    if (license.type === $scope.licenseTypes.SPLA) {
      return `SPLA-${license.id}@${license.serverServiceName}`;
    }
    return license.id;
  };

  /**
   * Get renew URL.
   * @return {String}
   */
  $scope.getRenewUrl = () => {
    if (!$scope.user) {
      return constants.renew.replace('{serviceName}', '');
    }
    const renewUrl = config.constants.billingRenew[$scope.user.ovhSubsidiary];
    if (!renewUrl) {
      return constants.renew.replace('{serviceName}', '');
    }
    return renewUrl.replace('{serviceName}', '');
  };

  $scope.resetAction();

  $scope.capitalize = capitalize;

  $scope.formatName = (license) => {
    const formattedVersion = startCase(license.version.replace(/-|_/g, ' '));
    return `${$translate.instant(
      `license_designation_${license.type}`,
    )} ${formattedVersion}`;
  };

  $scope.canRenewLicense = (licenseType) => {
    return LICENCE_TYPES.indexOf(licenseType) > -1;
  };

  $scope.onGoToLicenseSpla = () => {
    atInternet.trackClick({
      name: 'dedicated::license::dashboard::order-spla',
      type: 'action',
    });
    $state.go('app.license.dashboard.spla-add');
  };

  $scope.onGoToLicenseOrder = () => {
    atInternet.trackClick({
      name: 'dedicated::license::dashboard::order',
      type: 'action',
    });
    $state.go('app.license.order');
  };

  const checkCpanel = () => {
    ovhFeatureFlipping
      .checkFeatureAvailability(['license:cpanel-eol-banner'])
      .then((availability) => {
        if (!availability.isFeatureAvailable('license:cpanel-eol-banner'))
          return;
        $scope
          .iceberg(`/license/cpanel`)
          .query()
          .execute()
          .$promise.then(({ data }) => {
            $scope.hasCpanel = data.length > 0;
          });
      })
      .catch(() => {
        $scope.hasCpanel = false;
      });
  };

  const init = () => {
    checkCpanel();
    $scope.loadingLicensesInformations = true;
    return ovhFeatureFlipping
      .checkFeatureAvailability(['license:upgrade'])
      .then((commitmentAvailability) => {
        $scope.canUpgrade = commitmentAvailability.isFeatureAvailable(
          'license:upgrade',
        );
      })
      .catch(() => {
        $scope.canUpgrade = false;
      })
      .finally(() => {
        $scope.loadingLicensesInformations = false;
      });
  };

  init();
};
