import assign from 'lodash/assign';
import find from 'lodash/find';
import get from 'lodash/get';
import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';
import words from 'lodash/words';
import head from 'lodash/head';

import {
  DIRECTORY_INFO_STATUS,
  DIRECTORY_WAY_NUMBER_EXTRA_ENUM,
  LEGAL_FORM_ENUM,
  AVAILABLE_FIELDS,
  REGEX,
} from './contact.constants';

export default class TelecomTelephonyServiceContactCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $q,
    $timeout,
    $translate,
    OvhApiTelephony,
    goToContactDirectory,
    TucToast,
    TucToastError,
    tucTelephonyBulk,
    TelecomTelephonyServiceContactService,
  ) {
    this.billingAccount = $stateParams.billingAccount;
    this.serviceName = $stateParams.serviceName;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.goToContactDirectory = goToContactDirectory;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.tucTelephonyBulk = tucTelephonyBulk;
    this.TelecomTelephonyServiceContactService = TelecomTelephonyServiceContactService;
    this.DIRECTORY_INFO_STATUS = DIRECTORY_INFO_STATUS;
    this.DIRECTORY_WAY_NUMBER_EXTRA_ENUM = DIRECTORY_WAY_NUMBER_EXTRA_ENUM;
    this.LEGAL_FORM_ENUM = LEGAL_FORM_ENUM;
    this.AVAILABLE_FIELDS = AVAILABLE_FIELDS;
    this.REGEX = REGEX;
  }

  $onInit() {
    this.isLoading = true;

    this.directoryCodes = null;
    this.autoCompletePostCode = null;
    this.autoCompleteCity = null;
    this.autoCompleteStreetName = null;

    return this.$q
      .all({
        infos: this.OvhApiTelephony.v6().schema().$promise,
        directory: this.TelecomTelephonyServiceContactService.getDirectory(
          this.billingAccount,
          this.serviceName,
        ),
      })
      .then(({ infos, directory }) => {
        return this.$q.all({
          infos,
          directory,
          autoCompletePostCode: this.postCodeAvailable(directory),
        });
      })
      .then(({ infos, directory, autoCompletePostCode }) => {
        this.autoCompletePostCode =
          autoCompletePostCode?.length > 0 ? autoCompletePostCode.sort() : [];

        this.directory = this.buildWayInfo(directory);

        this.directoryForm = angular.copy(this.directory);

        this.generateAvailableField();

        this.legal_form_enum =
          this.LEGAL_FORM_ENUM[this.directory.country.toUpperCase()] || [];

        this.wayNumberExtraEnum =
          this.DIRECTORY_WAY_NUMBER_EXTRA_ENUM[
            this.directory.country.toUpperCase()
          ] || this.DIRECTORY_WAY_NUMBER_EXTRA_ENUM.OTHER;

        this.regex = this.REGEX;

        if (this.directory.ape && this.directory.directoryServiceCode) {
          return this.TelecomTelephonyServiceContactService.fetchDirectoryServiceCode(
            this.directory.ape,
          ).then((result) => {
            this.directoryCodes = result;
          });
        }

        this.directoryProperties = get(
          infos,
          "models['telephony.DirectoryInfo'].properties",
        );

        this.bulkDatas = {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
          infos: {
            name: 'contact',
            actions: [
              {
                name: 'directory',
                route:
                  '/telephony/{billingAccount}/service/{serviceName}/directory',
                method: 'PUT',
                params: null,
              },
            ],
          },
        };

        return null;
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Checks the fields that must be available depending on the country and the legal form
  generateAvailableField() {
    this.availableField = AVAILABLE_FIELDS[this.directory.country.toUpperCase()]
      ? AVAILABLE_FIELDS[this.directory.country.toUpperCase()][
          this.directoryForm.legalForm
        ]
      : AVAILABLE_FIELDS.OTHER;
    return this.availableField;
  }

  buildWayInfo(directory) {
    const newDirectory = directory;
    if (!directory.wayNumber.length) {
      newDirectory.wayNumber = directory.address.replace(/\D/g, '');
    }

    if (!directory.wayNumberExtra.length) {
      newDirectory.wayNumberExtra = find(this.wayNumberExtraEnum, (extra) =>
        some(words(directory.address), (word) => word === extra),
      );
    }

    if (!directory.wayName.length) {
      newDirectory.wayName = directory.address
        .replace(/\d+/g, '')
        .replace(directory.wayNumberExtra, '');
    }

    return newDirectory;
  }

  /**
   * Some attributes are not shared between different legal form so we have to reset
   * them when user choose another legal form.
   */
  onChangeLegalForm() {
    this.generateAvailableField();
    this.directoryForm = assign(
      this.directoryForm,
      omit(this.directory, 'legalForm'),
    );
    switch (this.directoryForm.legalForm) {
      case 'individual':
        this.directoryForm.siret = '';
        this.directoryForm.ape = '';
        this.directoryForm.socialNomination = '';
        this.directoryForm.socialNominationExtra = '';
        this.directoryForm.directoryServiceCode = '';
        this.directoryForm.PJSocialNomination = '';
        this.directoryForm.occupation = '';
        break;
      case 'professional':
        this.directoryForm.name = '';
        this.directoryForm.firstName = '';
        break;
      case 'corporation':
        this.directoryForm.name = '';
        this.directoryForm.firstName = '';
        this.directoryForm.occupation = '';
        break;
      default:
        break;
    }
  }

  onSiretChange() {
    if (this.directoryForm.siret?.match(this.REGEX.siret)) {
      // we have to poll because api call is not synchronous :(
      this.fetchEntrepriseInformations(
        this.billingAccount,
        this.serviceName,
        this.directoryForm.siret,
      )
        .then((infos) => {
          if (infos.informations.isValid) {
            this.directoryForm.ape = infos.informations.ape;
            this.directoryForm.socialNomination = infos.informations.name;
            this.directoryCodes = null;

            // fetch directory codes for given APE
            if (this.directoryForm.ape) {
              this.TelecomTelephonyServiceContactService.fetchDirectoryServiceCode(
                this.billingAccount,
                this.serviceName,
                this.directoryForm.ape,
              ).then((result) => {
                this.directoryCodes = result;
              });
            }
          } else {
            this.directoryForm.ape = null;
            this.directoryForm.socialNomination = null;
            this.directoryCodes = null;
          }
        })
        .catch((err) => new this.TucToastError(err));
    }
  }

  fetchEntrepriseInformations() {
    return this.TelecomTelephonyServiceContactService.fetchEntrepriseInformations(
      this.billingAccount,
      this.serviceName,
      this.directoryForm.siret,
    ).then((infos) => {
      if (infos.status === 'todo') {
        return this.$timeout(
          () =>
            this.fetchEntrepriseInformations(
              this.billingAccount,
              this.serviceName,
              this.directoryForm.siret,
            ),
          500,
        );
      }
      return infos;
    });
  }

  postCodeAvailable(directory) {
    return this.TelecomTelephonyServiceContactService.getPostCodeAvailable(
      this.serviceName,
      directory.country,
    );
  }

  onPostCodeChange() {
    this.directoryForm.city = '';
    this.directoryForm.cedex = '';
    this.directoryForm.wayNumber = '';
    this.directoryForm.wayNumberExtra = '';
    this.directoryForm.wayName = '';
    this.directoryForm.addressExtra = '';

    if (this.directoryForm.postCode !== this.directory.postCode) {
      this.directoryForm.urbanDistrict =
        this.isUrbanDistrictRequired() &&
        this.directoryForm.postCode.length === 5
          ? this.directoryForm.postCode.substring(3, 5)
          : '';
    }

    // Fetch cities for given post code
    if (this.directoryForm.postCode?.length >= 3) {
      this.$q
        .resolve(
          this.TelecomTelephonyServiceContactService.getCityAvailable(
            this.directoryForm.postCode,
            this.directory.country,
          ),
        )
        .then((cities) => {
          // automatically select city if there is only one
          if (cities?.length === 1) {
            this.directoryForm.city = head(cities).name;
            this.getStreetNameList(head(cities).administrationCode);
          }

          this.autoCompleteCity =
            cities?.length > 1
              ? cities.sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  }
                  if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                })
              : [];

          // parse urban district
          if (this.isUrbanDistrictRequired()) {
            this.directoryForm.urbanDistrict = this.directoryForm.postCode.slice(
              -2,
            );
          }
        });
    }
  }

  onCityChange(modelValue) {
    this.directoryForm.city = modelValue.name;
    this.directoryForm.cedex = '';
    this.directoryForm.wayNumber = '';
    this.directoryForm.wayNumberExtra = '';
    this.directoryForm.wayName = '';
    this.directoryForm.addressExtra = '';
    this.getStreetNameList(modelValue.administrationCode);
  }

  // districts for Paris (75xxx), Marseille (130xx) and Lyon (6900x)
  isUrbanDistrictRequired() {
    const p = this.directoryForm.postCode;
    return (
      (startsWith(p, '75') || startsWith(p, '130') || startsWith(p, '6900')) &&
      this.directoryForm.country === 'fr'
    );
  }

  getStreetNameList(inseeCode) {
    // Available only if it is a FR service (based on xdsl eligibility api)
    if (this.directory.country === 'fr') {
      // we have to poll because api call is not synchronous :(
      this.getStreetNameListFunction(inseeCode)
        .then((streets) => {
          this.autoCompleteStreetName =
            streets?.result?.length > 0 ? streets.result : [];
        })
        .catch((err) => new this.TucToastError(err));
    }
  }

  getStreetNameListFunction(inseeCode) {
    return this.TelecomTelephonyServiceContactService.getStreetsAvailable(
      inseeCode,
    ).then((streets) => {
      if (streets.status === 'pending') {
        return this.$timeout(
          () => this.getStreetNameListFunction(inseeCode),
          500,
        );
      }
      return streets;
    });
  }

  onWayChange(modelValue) {
    this.directoryForm.wayName = modelValue.streetName;
  }

  getDisplayFirstNameOptions(displayFirstName) {
    if (displayFirstName) {
      return `${this.directoryForm.firstName} ${this.directoryForm.name}`;
    }
    return `${this.directoryForm.firstName.substring(0, 1)}. ${
      this.directoryForm.name
    }`;
  }

  findDirectoryService() {
    return find(
      this.directoryCodes,
      (info) =>
        `${info.directoryServiceCode}` ===
        `${this.directory.directoryServiceCode}`,
    );
  }

  applyChanges() {
    if (this.directoryForm.legalForm !== 'individual') {
      this.directoryForm.PJSocialNomination = this.directoryForm.socialNomination;
    }

    if (this.directoryForm.wayNumberExtra) {
      this.directoryForm.wayNumberExtra = this.directoryForm.wayNumberExtra.replace(
        /&nbsp;/g,
        '',
      );
    }

    const modified = assign(this.directory, this.directoryForm);
    this.isUpdating = true;

    return this.TelecomTelephonyServiceContactService.putDirectory(
      this.billingAccount,
      this.serviceName,
      omit(modified, 'inseeCode'),
    )
      .then(() => {
        this.directory = angular.copy(this.directoryForm);
        this.goToContactDirectory(
          this.$translate.instant('telephony_service_contact_success'),
        );
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isUpdating = false;
      });
  }

  filterServices() {
    return (services) =>
      services.filter(({ country }) =>
        this.directory.country.includes(country),
      );
  }

  getBulkParams() {
    return () => {
      return pickBy(
        this.directoryForm,
        (value, key) => !get(this.directoryProperties, [key, 'readOnly']),
      );
    };
  }

  onBulkSuccess() {
    // display message of success or error
    return (bulkResult) => {
      this.tucTelephonyBulk
        .getTucToastInfos(bulkResult, {
          fullSuccess: this.$translate.instant(
            'telephony_service_contact_bulk_all_success',
          ),
          partialSuccess: this.$translate.instant(
            'telephony_service_contact_bulk_some_success',
            {
              count: bulkResult.success.length,
            },
          ),
          error: this.$translate.instant(
            'telephony_service_contact_bulk_error',
          ),
        })
        .forEach(({ message, type }) => {
          this.TucToast[type](message, {
            hideAfter: null,
          });
        });
    };
  }

  onBulkError() {
    return (error) => {
      this.TucToast.error(
        `${this.$translate.instant(
          'telephony_service_contact_bulk_on_error',
        )}, ${get(error, 'msg.data', '')}`,
      );
    };
  }

  getStatusLabel() {
    switch (this.directoryForm.status) {
      case DIRECTORY_INFO_STATUS.todo:
      case DIRECTORY_INFO_STATUS.doing:
        return this.$translate.instant(
          'telephony_service_contact_sync_pending',
        );
      case DIRECTORY_INFO_STATUS.error:
      case DIRECTORY_INFO_STATUS.problem:
        return this.$translate.instant('telephony_service_contact_sync_error');
      case DIRECTORY_INFO_STATUS.done:
        return this.$translate.instant('telephony_service_contact_sync');
      default:
        return this.$translate.instant('telephony_service_contact_sync_na');
    }
  }
}
