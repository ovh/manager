import { set } from 'lodash';
import {
  PROCESS_STEP,
  CONTEXT,
  CUSTOM_FIELD_FORM,
  CUSTOM_SORT_FIELD_FORM,
  CUSTOM_FIELD_FORM_RULES,
} from '../pack-migration.constant';

export default class PackMigrationOntShippingCtrl {
  /* @ngInject */
  constructor(
    $translate,
    TucPackMigrationProcess,
    OvhContact,
    PackMigrationOntShippingService,
    TucToast,
  ) {
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.OvhContact = OvhContact;
    this.PackMigrationOntShippingService = PackMigrationOntShippingService;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.process = null;
    this.loading = {
      init: true,
    };

    this.process = this.TucPackMigrationProcess.getMigrationProcess();

    this.process.ontShipping = {
      address: null,
    };

    this.ovhContactOptions = {
      options: {
        allowCreation: true,
        allowEdition: false,
        customFieldForm: CUSTOM_FIELD_FORM,
        customSortFieldForm: CUSTOM_SORT_FIELD_FORM,
        customFieldRules: CUSTOM_FIELD_FORM_RULES,
        customContactObject: {
          firstName: '',
          lastName: '',
          address: '',
          cityName: '',
          zipCode: '',
          // custom attributes
          inEdition: false,
          saveForEdition: {},
          packName: this.process.pack.packName,
          startEdition() {
            this.inEdition = true;
            return this;
          },
          stopEdition(cancel) {
            this.inEdition = false;
            if (this.saveForEdition && cancel) {
              CUSTOM_FIELD_FORM.forEach((objectPath) => {
                set(
                  this,
                  objectPath,
                  angular.copy(this.saveForEdition?.objectPath),
                );
              });
            }

            this.saveForEdition = null;
            return this;
          },
          create($http, OvhContact, contactList, contact) {
            const body = CUSTOM_FIELD_FORM.reduce(
              (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue]: contact[currentValue],
              }),
              {},
            );
            return $http
              .post(
                `/pack/xdsl/${this.packName}/voipLine/options/customShippingAddress`,
                body,
              )
              .then(({ data }) => {
                const {
                  address,
                  cityName,
                  countryCode,
                  zipCode,
                  firstName,
                  lastName,
                } = contact;
                contactList.push(
                  new OvhContact({
                    address: {
                      line1: address,
                      city: cityName,
                      country: countryCode,
                      zip: zipCode,
                    },
                    firstName,
                    lastName,
                    id: data,
                  }),
                );
                return this;
              });
          },
          hasChange(path) {
            if (!this.saveForEdition) {
              return false;
            }
            if (path) {
              return this.path !== this.saveForEdition.path;
            }
            return !!CUSTOM_FIELD_FORM.find((objPath) =>
              this.hasChange(objPath),
            );
          },
        },
      },
    };

    // Initialize ONT address shipping
    return this.PackMigrationOntShippingService.getShippingAddresses(
      this.process.pack.packName,
      CONTEXT.voipline,
    )
      .then(({ data }) => {
        this.ovhContactOptions.customList = data.map(
          ({
            address,
            cityName,
            countryCode,
            zipCode,
            firstName,
            lastName,
            shippingId,
          }) =>
            new this.OvhContact({
              address: {
                line1: address,
                city: cityName,
                country: countryCode,
                zip: zipCode,
              },
              firstName,
              lastName,
              id: shippingId,
            }),
        );
        this.process.ontShipping.address = this.ovhContactOptions.customList.at(
          0,
        );
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant(
            'telecom_pack_migration_ont_shipping_addresses_error',
            { error: error.data?.message },
          ),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* =============================
     =        ACTIONS            =
     ============================= */
  nextStep() {
    this.process.currentStep = PROCESS_STEP.confirm;
    if (this.process.selectedOffer.needNewModem) {
      this.process.currentStep = PROCESS_STEP.shipping;
    } else if (this.process.selectedOffer.needMeeting) {
      this.process.currentStep = PROCESS_STEP.meeting;
    }
  }
}
