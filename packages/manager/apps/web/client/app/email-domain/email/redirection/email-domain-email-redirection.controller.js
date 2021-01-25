import map from 'lodash/map';

angular
  .module('App')
  .constant('PAGE_SIZE_STORAGE_KEY', 'REDIRECTION_EMAILS_PAGINATION')
  .controller(
    'EmailDomainEmailRedirectionCtrl',
    class EmailDomainEmailRedirectionCtrl {
      /**
       * Constructor
       * @param $scope
       * @param $stateParams
       * @param $q
       * @param $translate
       * @param $window
       * @param Alerter
       * @param WucEmails
       * @param PAGE_SIZE_STORAGE_KEY
       */
      constructor(
        $scope,
        $stateParams,
        $q,
        $translate,
        $window,
        Alerter,
        WucEmails,
        PAGE_SIZE_STORAGE_KEY,
      ) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$q = $q;
        this.$translate = $translate;
        this.$window = $window;
        this.Alerter = Alerter;
        this.WucEmails = WucEmails;
        this.PAGE_SIZE_STORAGE_KEY = PAGE_SIZE_STORAGE_KEY;
      }

      $onInit() {
        this.loading = {
          exportCSV: false,
          redirections: false,
        };
        this.redirectionsDetails = [];
        this.pageSize = this.fetchPageSizePreference();

        this.$scope.$on('hosting.tabs.emails.redirections.refresh', () =>
          this.refreshTableRedirections(),
        );

        this.refreshTableRedirections();
      }

      getDatasToExport() {
        this.loading.exportCSV = true;

        const dataToExport = [
          [
            this.$translate.instant('emails_common_from'),
            this.$translate.instant('emails_common_to'),
          ],
        ];

        return this.$q
          .all(
            map(this.redirections, ({ id }) =>
              this.WucEmails.getRedirection(this.$stateParams.productId, id),
            ),
          )
          .then((data) => dataToExport.concat(map(data, (d) => [d.from, d.to])))
          .finally(() => {
            this.loading.exportCSV = false;
          });
      }

      refreshTableRedirections() {
        this.loading.redirections = true;
        this.redirections = null;

        return this.WucEmails.getRedirections(this.$stateParams.productId)
          .then((data) => {
            this.redirections = data.map((id) => ({ id }));
          })
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant('email_tab_table_redirections_error'),
              err,
              this.$scope.alerts.main,
            ),
          )
          .finally(() => {
            this.loading.redirections = false;
          });
      }

      transformItem({ id }) {
        return this.WucEmails.getRedirection(this.$stateParams.productId, id);
      }

      fetchPageSizePreference() {
        return this.$window.localStorage.getItem(this.PAGE_SIZE_STORAGE_KEY);
      }

      savePageSizePreference(newPageSize) {
        if (!localStorage) return;

        this.$window.localStorage.setItem(
          this.PAGE_SIZE_STORAGE_KEY,
          newPageSize.pageSize,
        );
      }
    },
  );
