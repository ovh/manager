import {
  FORM_PART_PREFIX,
  OVH_FIELD_PREFIX,
  FIELD_NAME_LIST,
  GENERAL_KEY,
  PROFILE_KEY,
  CONTACT_KEY,
  SECTIONS,
  POINT_SEPARATOR,
  OTHER_KEY,
  CONTACT_MANAGEMENT_EDIT_TRACKING,
} from './edit.constants';

export default class DomainContactEditCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    atInternet,
    ContactService,
    Alerter,
    $translate,
    RedirectionService,
  ) {
    this.$stateParams = $stateParams;
    this.atInternet = atInternet;
    this.contactId = $stateParams.contactId;
    this.domainName = $stateParams.productId;
    this.contactInformations = $stateParams.contactInformations;

    this.SECTIONS = SECTIONS;
    this.OVH_FIELD_PREFIX = OVH_FIELD_PREFIX;
    this.POINT_SEPARATOR = POINT_SEPARATOR;
    this.FORM_PART_PREFIX = FORM_PART_PREFIX;
    this.FIELD_NAME_LIST = FIELD_NAME_LIST;
    this.CONTACT_KEY = CONTACT_KEY;
    this.GENERAL_KEY = GENERAL_KEY;
    this.PROFILE_KEY = PROFILE_KEY;
    this.OTHER_KEY = OTHER_KEY;

    this.rules = null;
    this.ContactService = ContactService;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.orderUrlPrefix = RedirectionService.getURL('order');
  }

  $onInit() {
    this.loading = true;

    return this.ContactService.getDomainConfigurationRule(
      'update',
      this.domainName,
    )
      .then((rules) => {
        let r = rules;
        if (rules.and) {
          r = rules.and.find((rule) => rule.label === 'OWNER_CONTACT');
        }

        r.fields.and.sort((a, b) => {
          if (
            Object.values(FIELD_NAME_LIST).indexOf(a.label) >
            Object.values(FIELD_NAME_LIST).indexOf(b.label)
          ) {
            return 1;
          }
          return -1;
        });

        this.rules = r;
      })
      .catch((err) => {
        this.initError = err.data?.message || err.message || err;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  goToTunnelOrder() {
    this.trackClick(CONTACT_MANAGEMENT_EDIT_TRACKING.LINK);
    window.open(
      `${
        this.orderUrlPrefix
      }domain/#/legacy/domain/trade/list?options/trade/list?options=${JSURL.stringify(
        [this.domainName],
      )}`,
      '_blank',
    );
  }

  getRulesBySection(section) {
    if (!this.rules) {
      return null;
    }
    if (section !== OTHER_KEY) {
      const fields = this.SECTIONS[section];
      return this.rules.fields.and.filter((rule) =>
        fields.includes(rule.label),
      );
    }
    const fields = [
      ...this.SECTIONS[GENERAL_KEY],
      ...this.SECTIONS[PROFILE_KEY],
      ...this.SECTIONS[CONTACT_KEY],
    ];
    return this.rules.fields.and.filter((rule) => !fields.includes(rule.label));
  }

  getSections(side = 'left') {
    return side === 'left'
      ? [this.GENERAL_KEY, this.PROFILE_KEY]
      : [this.CONTACT_KEY, this.OTHER_KEY];
  }

  getFormFields() {
    const form = this.ovhEditContactForm || {};
    return {
      ...(form[`${FORM_PART_PREFIX}${GENERAL_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${GENERAL_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
      ...(form[`${FORM_PART_PREFIX}${PROFILE_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${PROFILE_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
      ...(form[`${FORM_PART_PREFIX}${CONTACT_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${CONTACT_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
      ...(form[`${FORM_PART_PREFIX}${OTHER_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${OTHER_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
    };
  }

  getChangedValue() {
    return Object.values(this.getFormFields()).reduce(
      (accumulator, currentValue) => {
        const key = currentValue.$name.replace(OVH_FIELD_PREFIX, '');
        const modelValue = currentValue.$modelValue;
        const value =
          typeof modelValue === 'object' ? modelValue.key : modelValue;
        if (key.includes('.')) {
          const subKeys = key.split('.')[1];
          const subObject = accumulator[key.split('.')[0]];
          return {
            ...accumulator,
            [key.split('.')[0]]: { ...subObject, [subKeys]: value },
          };
        }
        return { ...accumulator, [key]: value };
      },
      Object.fromEntries(
        Object.entries(this.contactInformations).filter(
          ([key]) => key !== 'id',
        ),
      ),
    );
  }

  hasReadOnlyField() {
    return Object.values(this.getFormFields()).some(
      (field) => field.$$attr.disabled,
    );
  }

  submit() {
    this.trackClick(CONTACT_MANAGEMENT_EDIT_TRACKING.SUBMIT);
    this.isSubmitting = true;
    const body = this.getChangedValue();
    this.ovhEditContactForm.$setPristine();
    this.ContactService.postDomainConfigurationRuleCheck(
      'update',
      this.$stateParams.productId,
      { owner: body },
    )
      .then(() =>
        this.ContactService.putDomainContact(this.contactId, body)
          .then(() =>
            this.goBack(
              this.$translate.instant(
                'domain_tab_CONTACT_edit_form_success_msg',
              ),
            ),
          )
          .catch((error) => {
            this.Alerter.error(
              this.$translate.instant(
                'domain_tab_CONTACT_edit_form_error_msg',
                { errorMsg: error?.data?.message },
              ),
              'InfoErrors',
            );
            this.trackErrorBanner();
          }),
      )
      .catch((error) => {
        const detailsKeys = Object.keys(error.data.details).filter((item) =>
          item.includes('owner'),
        );
        this.Alerter.error(
          `${this.$translate.instant(
            'domain_tab_CONTACT_edit_form_error_msg',
          )} ${
            error.data.message + error.data.details
              ? detailsKeys
                  .map((detailKey) => error.data.details[detailKey])
                  .join(', ')
              : ''
          }`,
          'InfoErrors',
        );
        this.trackErrorBanner();
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onCancel() {
    this.trackClick(CONTACT_MANAGEMENT_EDIT_TRACKING.CANCEL);
    this.goBack();
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      ...hit,
      type: 'action',
    });
  }

  trackErrorBanner() {
    this.atInternet.trackPage({
      ...CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER,
      name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.name.replace(
        /{{bannerType}}|{{returnType}}/g,
        'error',
      ),
      page: {
        name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.page.name.replace(
          /{{bannerType}}|{{returnType}}/g,
          'error',
        ),
      },
    });
  }
}
