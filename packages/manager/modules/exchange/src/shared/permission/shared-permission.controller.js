import has from 'lodash/has';

export default class ExchangeTabPublicFolderPermissionsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    Exchange,
    ExchangePublicFolders,
    goToShared,
    messaging,
    navigation,
    $translate,
  ) {
    this.services = {
      $scope,
      Exchange,
      ExchangePublicFolders,
      messaging,
      navigation,
      $translate,
    };

    this.$routerParams = Exchange.getParams();
    this.search = {
      value: null,
    };
    this.selectedFolder = $scope.selectedFolder;
    this.permissionsLoading = false;
    this.goToShared = goToShared;

    $scope.$on(Exchange.events.publicFoldersChanged, () => {
      $scope.$broadcast('paginationServerSide.reload', 'permissionsTable');
    });

    $scope.retrievingPermissions = (count, offset) =>
      this.retrievingPermissions(count, offset);
    $scope.getPermissionsList = () => this.permissionsList;
    $scope.getPermissionsLoading = () => this.permissionsLoading;
  }

  retrievingPermissions(count, offset) {
    if (!has(this.selectedFolder, 'path') || this.selectedFolder.path == null) {
      throw new Error('This screen needs a folder before working');
    }

    this.services.messaging.resetMessages();
    this.permissionsLoading = true;
    this.permissionsError = false;

    const encodedPath = window.encodeURIComponent(this.selectedFolder.path);

    return this.services.ExchangePublicFolders.retrievingPublicFoldersPermissions(
      this.$routerParams.organization,
      this.$routerParams.productId,
      encodedPath,
      count,
      offset,
      this.search.value,
    )
      .then((accounts) => {
        this.permissionsList = accounts;
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ACCOUNTS_error_message',
          ),
          failure,
        );
        this.permissionsError = true;
      })
      .finally(() => {
        this.permissionsLoading = false;
      });
  }

  removePermission(permission) {
    this.services.navigation.setAction(
      'exchange/shared/permission/remove/shared-permission-remove',
      {
        folder: this.selectedFolder,
        permission,
      },
    );
  }
}
