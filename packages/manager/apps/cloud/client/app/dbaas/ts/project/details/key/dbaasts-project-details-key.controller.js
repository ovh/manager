import find from 'lodash/find';
import reject from 'lodash/reject';

angular
  .module('managerApp')
  .controller(
    'DBaasTsProjectDetailsKeyCtrl',
    function DBaasTsProjectDetailsKeyCtrl(
      $q,
      $state,
      $stateParams,
      $translate,
      $uibModal,
      $scope,
      Toast,
      OvhApiMe,
      OvhApiDBaasTsProject,
      DBaasTsProjectKey,
      OvhApiDBaasTsRegion,
      DBaasTsConstants,
    ) {
      // -- Vairables declaration --
      const self = this;

      const { serviceName } = $stateParams;

      self.loaders = {};
      self.errors = {};

      self.data = {};

      // -- Edit key --

      self.edit = function edit(key) {
        return $state.go('^.dbaasts-project-details-key-edit', {
          keyId: key.id,
        });
      };

      // -- Delete key --

      self.delete = function deleteFn(key) {
        $uibModal.open({
          templateUrl: 'app/dbaas/ts/project/details/key/delete/modal.html',
          controllerAs: 'ctrl',
          controller($uibModalInstance) {
            const modalSelf = this;
            modalSelf.loaders = { deleting: false };

            modalSelf.confirm = function confirm() {
              modalSelf.loaders.deleting = true;

              DBaasTsProjectKey.v6()
                .remove({
                  serviceName,
                  keyId: key.id,
                })
                .$promise.then(() => {
                  // Remove deleted key
                  self.data.keys = reject(self.data.keys, { id: key.id });

                  // and clode modal
                  $uibModalInstance.close();
                  Toast.info(
                    $translate.instant('dtpdt_key_deletion_successful'),
                  );
                })
                .catch((err) => {
                  Toast.error(
                    [
                      $translate.instant('dtpdt_key_deletion_error'),
                      (err.data && err.data.message) || '',
                    ].join(' '),
                  );
                })
                .finally(() => {
                  modalSelf.loaders.deleting = false;
                });
            };
          },
        });
      };

      // -- Example of using a key --

      self.showExample = function showExample(key) {
        $uibModal.open({
          templateUrl: 'app/dbaas/ts/project/details/key/example/modal.html',
          controller: 'DBaasTsProjectDetailsKeyCtrl.exampleUseToken',
          controllerAs: 'ctrl',
          resolve: {
            params() {
              return {
                key,
                apiURL: self.region.url,
              };
            },
          },
        });
      };

      self.showRegionInfo = function showRegionInfo() {
        $uibModal.open({
          templateUrl:
            'app/dbaas/ts/project/details/key/region-help/modal.html',
          controllerAs: 'ctrl',
          controller: function Ctrl() {
            this.region = self.region;
            this.guideURL = self.data.guideDBaasTsConceptsURL;
          },
        });
      };

      self.refresh = function refresh() {
        DBaasTsProjectKey.v6().resetQueryCache();
        self.init();
      };

      this.resetCache = function resetCache() {
        self.loaders.init = true;
        window.location.reload();
      };

      // ---------INITIALIZATION---------

      self.init = function init() {
        self.loaders.init = true;

        const futureProject = OvhApiDBaasTsProject.v6().get({
          serviceName,
        }).$promise;

        // Load regions to display the project's region name and URL
        const futureRegions = OvhApiDBaasTsRegion.v6().query().$promise;

        // Load keys
        const futureKeys = DBaasTsProjectKey.v6().queryDetails(serviceName);

        futureProject
          .then((project) => {
            futureKeys.then((keys) => {
              self.data.keys = keys;
            });

            futureRegions.then((regions) => {
              // Find the region for the project
              self.region = find(regions, { id: project.regionId });
            });

            return $q.all(futureRegions, futureKeys);
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant('dtpdt_key_loading_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            self.data.keys = null;
            self.errors.init = true;
          })
          .finally(() => {
            self.loaders.init = false;
          });
      };

      function initGuideURL() {
        self.loaders.guide = true;
        OvhApiMe.v6()
          .get()
          .$promise.then((me) => {
            const lang = me.ovhSubsidiary;
            self.data.guideDBaasTsConceptsURL =
              DBaasTsConstants.guides.concepts[lang] ||
              DBaasTsConstants.guides.concepts.FR;
          })
          .finally(() => {
            self.loaders.guide = false;
          });
      }

      self.init();
      initGuideURL();
    },
  );
