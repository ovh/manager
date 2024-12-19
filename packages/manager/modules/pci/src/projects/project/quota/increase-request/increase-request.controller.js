import {
  ISSUE_TYPE_IDS,
  TRACK,
  SUPPORT_TICKET_ID_URL,
} from './increase.constants';

export default class PciProjectQuotaIncreaseController {
  /* @ngInject */
  constructor(
    $translate,
    coreURLBuilder,
    coreConfig,
    pciProjectQuotaIncrease,
    OvhApiSupport,
    PciProjectQuota,
    PciProject,
  ) {
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
    this.pciProjectQuotaIncrease = pciProjectQuotaIncrease;
    this.OvhApiSupport = OvhApiSupport;
    this.PciProjectQuota = PciProjectQuota;
    this.PciProject = PciProject;
  }

  $onInit() {
    this.isLoading = false;
    this.issueType = this.issueTypes.find(({ id }) =>
      ISSUE_TYPE_IDS.includes(id),
    );

    this.issueFields = this.issueType?.fields.map((issueType) => ({
      label: issueType?.label,
      mandatory: issueType?.mandatory,
    }));

    this.fieldsValue = Object.fromEntries(
      Object.entries(this.issueFields).map(([key]) => [key, '']),
    );

    this.isTicketCreated = false;

    this.serviceOptions = this.PciProjectQuota.getServiceOptions().map(
      (serviceOption) => ({
        ...serviceOption,
        formattedName: `${this.$translate.instant(
          `pci_projects_project_quota_increase_select_volume_${serviceOption.planCode}`,
        )} - ${serviceOption.prices[0]?.price.text}`,
      }),
    );
    this.projectDescription = this.PciProject.getProjectInfo().description;
    this.trackQuotaIncreasePopupDisplay();
    this.user = this.coreConfig.getUser();
  }

  isQuotaIncreaseConfirmButtonDisabled() {
    const mandatoryFields = Object.keys(this.fieldsValue)
      .filter((key) => this.issueFields[key]?.mandatory)
      .map((key) => this.fieldsValue[key]);
    if (mandatoryFields) {
      return !Object.keys(mandatoryFields)?.every(
        (key) => mandatoryFields[key]?.length > 0,
      );
    }
    return true;
  }

  trackQuotaIncreasePopupDisplay() {
    return this.trackPage(`${TRACK.BASE}::${TRACK.CONTACT_SUPPORT}`);
  }

  trackPopupCancel() {
    return this.trackClick(
      `${TRACK.BASE}::${TRACK.CONTACT_SUPPORT}::${TRACK.CANCEL}`,
    );
  }

  increaseQuotaBySupport() {
    if (!this.issueType) {
      this.trackPage(`${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`);
      return this.goBack(
        this.$translate.instant(
          'pci_projects_project_quota_increase_error_message',
        ),
        'error',
      );
    }

    this.isLoading = true;
    this.trackClick(
      `${TRACK.BASE}::${TRACK.CONTACT_SUPPORT}::${TRACK.CONFIRM}`,
    );

    const body = `
    ${this.issueType?.subject}
    
    ${this.issueFields
      .map(
        (field, index) => `
    ${field.label}
    ${this.fieldsValue[index]}
    `,
      )
      .join(' ')}
  `;

    return this.OvhApiSupport.v6()
      .createTickets({
        issueTypeId: this.issueType.id,
        serviceName: this.projectId,
        subject: this.issueType?.label,
        body,
        urgency: 'medium',
      })
      .$promise.then(({ ticketId }) => {
        this.trackPage(
          `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.SUCCESS}`,
        );

        this.isTicketCreated = true;

        this.ticketUrl =
          SUPPORT_TICKET_ID_URL.replace('{ticketId}', ticketId) +
          this.user.ovhSubsidiary;
      }, 'success')
      .catch((err) => {
        this.trackPage(`${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`);
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_error_message',
            {
              message: err?.data?.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackPopupCancel();
    this.goBack();
  }
}
