import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

import {
  REPORT_STATUS,
  LANGUAGES,
  WEB_ACCESS_TYPE,
} from './conference.constants';
import { VALID_SOUND_EXTENSIONS } from '../feature.constants';

export default class TelecomTelephonyAliasConfigurationContactCenterSolutionCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $timeout,
    $translate,
    coreConfig,
    TucToast,
    tucVoipServiceAlias,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.TucToast = TucToast;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
  }

  $onInit() {
    this.currentLanguage = this.coreConfig.getUserLanguage();
    this.conferenceCopy = null;
    this.generatingUrls = false;
    this.hasWebAccessUrls = false;
    this.newFile = null;
    this.availableLanguages = LANGUAGES.sort(({ value }) =>
      value !== this.currentLanguage ? 1 : -1,
    ).map(({ label, value }) => ({
      label: this.$translate.instant(`language_${label}`),
      value,
    }));
    this.availableReportStatus = REPORT_STATUS.map((status) => ({
      label: this.$translate.instant(
        `telephony_alias_config_conference_report_status_${status}`,
      ),
      value: status,
    }));

    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };

    this.loading = true;
    return this.tucVoipServiceAlias
      .fetchConferenceNumber(this.serviceInfos)
      .then((conference) => {
        this.conference = angular.copy(conference);
        this.conferenceCopy = angular.copy(this.conference);
        this.conferenceLanguage = this.availableLanguages.find(
          ({ value }) => value === conference.language,
        );
        this.reportStatus = this.availableReportStatus.find(
          ({ value }) => value === conference.reportStatus,
        );

        return this.tucVoipServiceAlias.fetchConferenceNumberWebAccess(
          this.serviceInfos,
        );
      })
      .then((webAccess) => {
        this.webAccess = TelecomTelephonyAliasConfigurationContactCenterSolutionCtrl.formatWebAccess(
          webAccess,
        );
        this.hasWebAccessUrls = !isEmpty(webAccess);
        return webAccess;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_conference_get_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkValidAudioExtention({ name }) {
    const [fileExtension] = name.split('.').reverse();
    const found = VALID_SOUND_EXTENSIONS.includes(fileExtension);
    if (!found) {
      this.TucToast.error(
        this.$translate.instant(
          'telephony_alias_config_conference_invalid_file_format',
        ),
      );
    }
    return found;
  }

  generateWebAccess() {
    this.generatingUrls = true;

    return this.$q
      .all({
        followUp: this.tucVoipServiceAlias.createConferenceNumberWebAccess(
          this.serviceInfos,
          WEB_ACCESS_TYPE.followUp,
        ),
        control: this.tucVoipServiceAlias.createConferenceNumberWebAccess(
          this.serviceInfos,
          WEB_ACCESS_TYPE.control,
        ),
      })
      .then(() =>
        this.tucVoipServiceAlias.fetchConferenceNumberWebAccess(
          this.serviceInfos,
        ),
      )
      .then((webAccess) => {
        this.webAccess = TelecomTelephonyAliasConfigurationContactCenterSolutionCtrl.formatWebAccess(
          webAccess,
        );
        this.hasWebAccessUrls = !isEmpty(webAccess);

        return webAccess;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_conference_generate_web_access_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.generatingUrls = false;
      });
  }

  deleteWebAccess() {
    this.generatingUrls = true;

    return this.$q
      .all(
        this.webAccess.followUp
          ? this.tucVoipServiceAlias.deleteConferenceNumberWebAccess(
              this.serviceInfos,
              {
                id: this.webAccess.followUp.id,
              },
            )
          : angular.noop(),

        this.webAccess.control
          ? this.tucVoipServiceAlias.deleteConferenceNumberWebAccess(
              this.serviceInfos,
              {
                id: this.webAccess.control.id,
              },
            )
          : angular.noop(),
      )
      .then(() => {
        this.hasWebAccessUrls = false;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_conference_delete_web_access_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.generatingUrls = false;
      });
  }

  regenerateWebAccess() {
    return (
      this.deleteWebAccess()
        // We need to delay to handle API refresh data
        .then(() => this.$timeout(() => {}, 500))
        .then(() => this.generateWebAccess())
    );
  }

  static formatWebAccess(webAccess) {
    return {
      followUp: webAccess.find(({ type }) => type === WEB_ACCESS_TYPE.followUp),
      control: webAccess.find(({ type }) => type === WEB_ACCESS_TYPE.control),
    };
  }

  canUpdateConference() {
    const hasChanged = !angular.equals(this.conference, this.conferenceCopy);
    return hasChanged || this.newFile;
  }

  updateConference() {
    this.loading = true;
    const uploadFilePromise = this.newFile
      ? this.tucVoipServiceAlias.uploadConferenceNumberAnnounce(
          this.serviceInfos,
          this.newFile,
        )
      : this.$q.when(false);

    return uploadFilePromise
      .then((fileUploaded) => {
        if (fileUploaded) {
          this.conference.announceFile = true;
        }

        const newSettings = omit(this.conference, [
          'announceFilename',
          'announceSoundId',
        ]);

        return this.tucVoipServiceAlias.updateConferenceNumberSettings(
          this.serviceInfos,
          newSettings,
        );
      })
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_config_conference_update_success',
          ),
        );
        this.$onInit();
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_conference_update_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
