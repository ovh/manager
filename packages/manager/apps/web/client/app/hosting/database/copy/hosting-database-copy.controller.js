import {
  COPY_TYPE_MAIN_DATABASE,
  COPY_TYPE_WEBCLOUD_DATABASE,
} from './hosting-database-copy.constants';

angular.module('App').controller(
  'HostingDatabaseCopyCtrl',
  class HostingDatabaseCopyCtrl {
    constructor(
      $q,
      $translate,
      $scope,
      $state,
      $window,
      Alerter,
      coreURLBuilder,
      HostingDatabase,
    ) {
      this.$q = $q;
      this.$translate = $translate;
      this.$scope = $scope;
      this.$state = $state;
      this.$window = $window;
      this.Alerter = Alerter;
      this.coreURLBuilder = coreURLBuilder;
      this.HostingDatabase = HostingDatabase;
      this.COPY_TYPE_MAIN_DATABASE = COPY_TYPE_MAIN_DATABASE;
      this.COPY_TYPE_WEBCLOUD_DATABASE = COPY_TYPE_WEBCLOUD_DATABASE;
      this.selectedType = COPY_TYPE_MAIN_DATABASE;
      this.selectedMain = null;
      this.selectedDatabase = null;
      this.selectedWebCloud = null;
      this.selectedWebCloudDatabase = null;
      this.targetWebCouldDatabases = null;
      this.targetDatabases = null;
      this.webCloudDatabases = null;
    }

    $onInit() {
      this.currentDatabase = this.$scope.currentActionData.currentDatabase;
    }

    load() {
      this.$q
        .all({
          mainDatabases: this.HostingDatabase.getWebServices(),
          webCloudInfo: this.HostingDatabase.getPrivateServices(),
        })
        .then(({ mainDatabases, webCloudInfo }) => {
          this.mainDatabases = mainDatabases?.data;
          this.webCloudDatabases = webCloudInfo?.data;
        });
    }

    loadAvailableDatabase() {
      this.targetDatabases = null;
      this.selectedDatabase = null;
      this.HostingDatabase.databaseList(this.selectedMain).then((data) => {
        this.targetDatabases = data?.filter(
          (entry) =>
            entry !== this.$scope.currentActionData.currentDatabase.name,
        );
      });
    }

    loadAvailableWebCloudDatabases() {
      this.targetWebCouldDatabases = null;
      this.selectedWebCloudDatabase = null;
      this.HostingDatabase.getPrivateDatabases(this.selectedWebCloud).then(
        ({ data }) => {
          this.targetWebCouldDatabases = data;
        },
      );
    }

    onChangeCopyType() {
      this.selectedMain = null;
      this.selectedDatabase = null;
      this.selectedWebCloud = null;
      this.selectedWebCloudDatabase = null;
    }

    isStep1Valid() {
      return (
        (this.selectedMain && this.selectedDatabase) ||
        (this.selectedWebCloud && this.selectedWebCloudDatabase)
      );
    }

    copyDatabase() {
      this.HostingDatabase.copyDatabase(
        this.$scope.currentActionData.serviceName,
        this.currentDatabase.name,
        this.selectedType === COPY_TYPE_WEBCLOUD_DATABASE,
      )
        .then(({ data }) => {
          this.HostingDatabase.copyRestoreDatabase(
            this.selectedMain,
            this.selectedDatabase,
            this.selectedType === COPY_TYPE_WEBCLOUD_DATABASE,
            data?.id,
          )
            .then(() => {
              this.Alerter.success(
                this.$translate.instant(
                  'hosting_tab_DATABASES_configuration_copy_success',
                ),
                this.$scope.alerts.main,
              );
            })
            .catch(({ data: error }) => {
              this.showCopyError(error);
            });
        })
        .catch(({ data: error }) => {
          this.showCopyError(error);
        })
        .finally(() => this.$scope.setAction(false));
    }

    showCopyError({ message }) {
      this.Alerter.error(
        this.$translate.instant(
          'hosting_tab_DATABASES_configuration_copy_error',
          {
            error: message,
          },
        ),
        this.$scope.alerts.main,
      );
    }
  },
);
