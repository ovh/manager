import { VALID_SOUND_EXTENSIONS } from '../../../feature.constants';

export default class TelecomTelephonyAliasConfigurationContactCenterSolutionSoundsAddCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $uibModalInstance,
    sounds,
    tucVoipServiceAlias,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.sounds = sounds;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.error = null;
  }

  $onInit() {
    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };
  }

  checkValidAudioExtention({ name }) {
    const [fileExtension] = name.split('.').reverse();
    const found = VALID_SOUND_EXTENSIONS.includes(fileExtension);
    if (!found) {
      this.error = {
        data: {
          message: this.$translate.instant(
            'telephony_alias_config_conference_invalid_file_format',
          ),
        },
      };
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
        this.error = error;
      })
      .finally(() => {
        this.uploading = false;
      });
  }
}
