import get from 'lodash/get';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasConfigurationContactCenterSolutionSoundsAddCtrl',
  class TelecomTelephonyAliasConfigurationContactCenterSolutionSoundsAddCtrl {
    constructor(
      $stateParams,
      $translate,
      $uibModalInstance,
      sounds,
      TucToast,
      tucVoipServiceAlias,
      TELEPHONY_SERVICE,
    ) {
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$uibModalInstance = $uibModalInstance;
      this.sounds = sounds;
      this.TucToast = TucToast;
      this.tucVoipServiceAlias = tucVoipServiceAlias;
      this.TELEPHONY_SERVICE = TELEPHONY_SERVICE;
    }

    $onInit() {
      this.serviceInfos = {
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
      };
    }

    checkValidAudioExtention({ name }) {
      const [fileExtension] = name.split('.').reverse();
      const found = this.TELEPHONY_SERVICE.validSoundExtensions.includes(
        fileExtension,
      );
      if (!found) {
        this.TucToast.error(
          this.$translate.instant(
            'telephony_alias_config_conference_invalid_file_format',
          ),
        );
      }
      return found;
    }

    uploadFile() {
      this.uploading = true;

      return this.tucVoipServiceAlias
        .uploadContactCenterSolutionNumberSoundFile(
          this.serviceInfos,
          this.toUpload,
        )
        .then(() =>
          this.tucVoipServiceAlias.fetchContactCenterSolutionNumberSounds(
            this.serviceInfos,
          ),
        )
        .then((sounds) => {
          this.sounds = sounds;
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_sounds_upload_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.uploading = false;
        });
    }
  },
);
