import filter from 'lodash/filter';
import keyBy from 'lodash/keyBy';

angular
  .module('managerApp')
  .controller(
    'DBaasTsProjectDetailsKeyAddOrEditCtrl',
    function DBaasTsProjectDetailsKeyAddOrEditCtrl(
      $q,
      $state,
      $stateParams,
      $translate,
      OvhApiDBaasTsProjectKey,
      Toast,
    ) {
      // -- Variable declaration --

      const self = this;
      const { serviceName, keyId } = $stateParams;

      self.loaders = {
        init: false,
        addOrEdit: false,
      };

      self.data = {
        permissions: keyBy(['READ', 'WRITE']),
        // Detect edition if a key id is present
        edition: !!keyId,
      };

      self.model = {
        permissions: [self.data.permissions.READ],
        tags: [{}], // Initialize tags with an empty object
      };

      // -- Initialization

      function init() {
        // Retrieve the key in edition
        if (self.data.edition) {
          self.loaders.init = true;
          OvhApiDBaasTsProjectKey.v6()
            .get({
              serviceName,
              keyId,
            })
            .$promise.then((key) => {
              self.loaders.init = false;
              self.model = key;
              // If no tags initialize tags with an empty array
              if (!key.tags) {
                self.model.tags = [];
              }
            })
            .catch((err) => {
              Toast.error(
                [
                  $translate.instant('dtpdt_init_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            })
            .finally(() => {
              self.loaders.init = false;
            });
        }
      }

      init();

      // -- Create or update the key

      self.saveKey = function saveKey() {
        self.loaders.addOrEdit = true;

        let successMsg;
        let errorMsg;
        let req;

        // Filter empty keys in the tags
        self.model.tags = filter(self.model.tags, (tag) => tag.key);

        self.model.serviceName = serviceName;

        if (self.data.edition) {
          successMsg = 'dtpdt_edit_successful';
          errorMsg = 'dtpdt_edit_error';
          req = OvhApiDBaasTsProjectKey.v6().update(
            {
              serviceName,
              keyId,
            },
            self.model,
          );
        } else {
          successMsg = 'dtpdt_creation_successful';
          errorMsg = 'dtpdt_creation_error';
          req = OvhApiDBaasTsProjectKey.v6().create(
            {
              serviceName,
            },
            self.model,
          );
        }

        req.$promise
          .then(() => {
            $state.go('^.dbaasts-project-details-key');
            Toast.info($translate.instant(successMsg));
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant(errorMsg),
                (err.data && err.data.message) || '',
              ].join(' : '),
            );
            self.loaders.addOrEdit = false;
          });
      };

      // -- Add / Remove a tag

      self.addTag = function addTag() {
        self.model.tags.push({});
      };

      self.removeTag = function removeTag(index) {
        self.model.tags.splice(index, 1);
      };
    },
  );
