import get from 'lodash/get';
import head from 'lodash/head';
import set from 'lodash/set';

import addTemplate from './add/add.html';
import addController from './add/add.controller';

export default class TelecomTelephonyAliasConfigurationSoundsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    $timeout,
    $document,
    $uibModal,
    featureTypeLabel,
    OvhApiTelephony,
    TucToast,
    tucVoipServiceAlias,
    tucTelecomVoip,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$document = $document;
    this.$uibModal = $uibModal;
    this.featureTypeLabel = featureTypeLabel;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.tucTelecomVoip = tucTelecomVoip;
  }

  $onInit() {
    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };
    this.loading = true;
    this.playing = null;
    this.pendingListen = null;

    [this.audioElement] = this.$document.find('#soundAudio');
    this.audioElement.addEventListener('ended', () => {
      this.$timeout(() => {
        this.playing = null;
        this.pendingListen = null;
      });
    });

    return this.$q
      .all({
        options: this.tucVoipServiceAlias.fetchContactCenterSolutionNumber(
          this.serviceInfos,
        ),
        queueOptions: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberQueues(
          this.serviceInfos,
        ),
        sounds: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberSounds(
          this.serviceInfos,
        ),
      })
      .then(({ options, queueOptions, sounds }) => {
        this.options = options;
        // on options.toneOnOpening and options.toneOnHold change, stop playing the sound
        this.$scope.$watch(
          () => this.options.toneOnOpening,
          () => {
            if (this.playing !== this.options.toneOnOpening) {
              this.playing = null;
              this.audioElement.pause();
            }
          },
        );
        this.$scope.$watch(
          () => this.options.toneOnHold,
          () => {
            if (this.playing !== this.options.toneOnHold) {
              this.playing = null;
              this.audioElement.pause();
            }
          },
        );
        [this.queueOptions] = queueOptions;
        this.sounds = sounds
          .concat({ soundId: null, name: this.$translate.instant('none') })
          .reverse();

        this.copyOptions = angular.copy(this.options);
        this.copyQueueOptions = angular.copy(this.queueOptions);

        this.toneOnOpening = this.sounds.find(
          (sound) => sound.soundId === this.options.toneOnOpening,
        );
        this.toneOnHold = this.sounds.find(
          (sound) => sound.soundId === this.options.toneOnHold,
        );

        const overflowPlayback = this.sounds.find(
          (sound) =>
            sound.soundId ===
            parseInt(this.queueOptions.actionOnOverflowParam, 10),
        );
        this.overflowPlayback = overflowPlayback || head(this.sounds);

        const closurePlayback = this.sounds.find(
          (sound) =>
            sound.soundId ===
            parseInt(this.queueOptions.actionOnClosureParam, 10),
        );
        this.closurePlayback = closurePlayback || head(this.sounds);
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_sounds_get_options_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onChooseServicePopover() {
    return ({ serviceName }, optionToSet) => {
      set(this.queueOptions, optionToSet, serviceName);
    };
  }

  openManageSoundsHelper(modelToUpdate) {
    this.$uibModal
      .open({
        animation: true,
        template: addTemplate,
        controller: addController,
        controllerAs: '$ctrl',
        resolve: {
          sounds: () => this.sounds.filter(({ soundId }) => soundId),
        },
      })
      .result.then((sound) => {
        set(this, modelToUpdate, sound);
        this.sounds.push(sound);

        switch (modelToUpdate) {
          case 'toneOnOpening':
          case 'toneOnHold':
            set(
              this.options,
              modelToUpdate,
              get(this, `${modelToUpdate}.soundId`, null),
            );
            break;
          case 'actionOnClosureParam':
            this.closurePlayback = get(this, `${modelToUpdate}.soundId`, null);
            set(this.queueOptions, modelToUpdate, this.closurePlayback);
            break;
          case 'actionOnOverflowParam':
            this.overflowPlayback = get(this, `${modelToUpdate}.soundId`, null);
            set(this.queueOptions, modelToUpdate, this.overflowPlayback);
            break;
          default:
            break;
        }
      });
  }

  fetchSound(soundId) {
    return this.tucTelecomVoip.fetchSound(soundId);
  }

  listenSound(sound) {
    if (!sound) {
      return this.$q.when(null);
    }
    if (this.playing === sound) {
      this.playing = null;
      this.audioElement.pause();
    } else {
      this.audioElement.pause();
      this.playing = sound;
      this.pendingListen = true;
      return this.fetchSound(sound)
        .then((info) => {
          this.playing = sound;
          this.audioElement.src = info.getUrl;
          this.audioElement.play().catch((err) => {
            this.playing = null;
            this.pendingListen = false;
            this.TucToast.error(
              `${this.$translate.instant(
                'telephony_alias_config_contactCenterSolution_sounds_listen_error',
              )} ${err.message || err}`,
            );
            this.$scope.$apply(); // force scope update because of audioElement event
          });
        })
        .catch((err) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_sounds_listen_error',
            )} ${err.data.message || err.message || err}`,
          );
        })
        .finally(() => {
          this.pendingListen = false;
        });
    }
    return this.$q.when(null);
  }

  fetchSounds() {
    return this.tucVoipServiceAlias.fetchContactCenterSolutionNumberSounds(
      this.serviceInfos,
    );
  }

  hasOptionsChanged() {
    return !angular.equals(this.options, this.copyOptions);
  }

  hasQueueOptionsChanged() {
    return !angular.equals(this.queueOptions, this.copyQueueOptions);
  }

  hasChanged() {
    return this.hasOptionsChanged() || this.hasQueueOptionsChanged();
  }

  updateContactCenterSolution() {
    this.loading = true;

    if (
      this.queueOptions.actionOnClosure &&
      !this.queueOptions.actionOnClosureParam
    ) {
      this.queueOptions.actionOnClosure = null;
    }

    if (
      this.queueOptions.actionOnOverflow &&
      !this.queueOptions.actionOnOverflowParam
    ) {
      this.queueOptions.actionOnOverflow = null;
    }

    return this.$q
      .all({
        ccsOptions: this.hasOptionsChanged()
          ? this.tucVoipServiceAlias.updateContactCenterSolutionNumber(
              this.serviceInfos,
              this.options,
            )
          : this.$q.when(),
        ccsQueueOptions: this.hasQueueOptionsChanged()
          ? this.tucVoipServiceAlias.updateContactCenterSolutionNumberQueue(
              this.serviceInfos,
              this.queueOptions,
            )
          : this.$q.when(),
      })
      .then(() =>
        this.$state.go('^').then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_sounds_update_success',
            ),
          );
        }),
      )
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_sounds_update_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
