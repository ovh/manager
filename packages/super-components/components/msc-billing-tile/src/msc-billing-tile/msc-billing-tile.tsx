import {
  Component,
  Prop,
  h,
  Element,
  Host,
  State,
  Fragment,
} from '@stencil/core';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import { HTMLStencilElement, Watch } from '@stencil/core/internal';
import { Language, formatDate } from '@ovhcloud/msc-utils';
import { apiClient } from '@ovh-ux/manager-core-api';
import { getTranslations } from './translations';
import {
  ServiceDetails,
  ServiceInfos,
  Translations,
} from './msc-billing.types';

export interface IMscBillingTile {
  servicePath: string;
  language?: Language;
  commitmentDataTracking?: string;
  changeOwnerDataTracking?: string;
  updateOwnerDataTracking?: string;
  subscriptionManagementDataTracking?: string;
  renewLinkDataTracking?: string;
  cancelResiliationDataTracking?: string;
  manageRenewDataTracking?: string;
  resiliateDataTracking?: string;
  anticipateRenewDataTracking?: string;
}

@Component({
  tag: 'msc-billing-tile',
  styleUrl: 'msc-billing-tile.scss',
  shadow: true,
})
export class MscBillingTile implements IMscBillingTile {
  @Element() host!: HTMLStencilElement;

  @Prop() public language = 'fr-FR' as Language;

  @Prop() public servicePath: string;

  @Prop() public commitmentDataTracking?: string = '';

  @Prop() public changeOwnerDataTracking?: string;

  @Prop() public updateOwnerDataTracking?: string;

  @Prop() public subscriptionManagementDataTracking?: string;

  @Prop() public renewLinkDataTracking?: string;

  @Prop() public cancelResiliationDataTracking?: string;

  @Prop() public manageRenewDataTracking?: string;

  @Prop() public resiliateDataTracking?: string;

  @Prop() public anticipateRenewDataTracking?: string;

  @Prop() public changeOfferDataTracking?: string;

  @State() localeStrings?: Translations;

  @State() serviceInfos?: ServiceInfos;

  @State() serviceDetails?: ServiceDetails;

  @Watch('language')
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.language);
  }

  async componentWillLoad() {
    this.updateTranslations();

    apiClient.v6.get(`${this.servicePath}/serviceInfos`).then((response) => {
      this.serviceInfos = response.data;
      apiClient.v6
        .get(`/services/${this.serviceInfos?.serviceId}`)
        .then((responseDetails) => {
          this.serviceDetails = responseDetails.data;
        });
    });
  }

  private getServiceName() {
    return this.servicePath.substring(this.servicePath.lastIndexOf('/') + 1);
  }

  private getServiceType() {
    return this.servicePath
      .substring(
        this.servicePath.startsWith('/') ? 1 : 0,
        this.servicePath.lastIndexOf('/'),
      )
      .split('/')
      .join('_')
      .toUpperCase();
  }

  private getFormattedNextBillingDate() {
    return this.serviceDetails
      ? formatDate(this.serviceDetails.billing?.nextBillingDate, this.language)
      : '';
  }

  private getCreationDateBlock() {
    return (
      <>
        <osds-divider separator />
        <osds-text
          class="tile-title"
          level={OdsThemeTypographyLevel.heading}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.text}
        >
          {this.localeStrings?.manager_billing_subscription_creation}
        </osds-text>
        {this.serviceInfos ? (
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.default}
          >
            {formatDate(this.serviceInfos.creation, this.language)}
          </osds-text>
        ) : (
          <osds-skeleton />
        )}
      </>
    );
  }

  public render() {
    if (!this.localeStrings) {
      return (
        <osds-tile rounded>
          <osds-skeleton />
        </osds-tile>
      );
    }

    return (
      <Host>
        <div class="msc-billing-tile-wrapper">
          <osds-tile rounded>
            <div class="billing-tile-content">
              <osds-text
                level={OdsThemeTypographyLevel.heading}
                size={OdsThemeTypographySize._300}
                color={OdsThemeColorIntent.text}
              >
                {this.localeStrings.manager_billing_subscription}
              </osds-text>
              {this.getCreationDateBlock()}
              <msc-billing-offer
                class="block"
                serviceType={this.getServiceType()}
                servicePath={this.servicePath}
                serviceInfos={this.serviceInfos}
                serviceDetails={this.serviceDetails}
                localeStrings={this.localeStrings}
                changeOfferDataTracking={this.changeOfferDataTracking}
              />
              <msc-billing-renewal
                class="block"
                serviceInfos={this.serviceInfos}
                serviceDetails={this.serviceDetails}
                localeStrings={this.localeStrings}
                serviceName={this.getServiceName()}
                serviceType={this.getServiceType()}
                servicePath={this.servicePath}
                nextBillingDate={this.getFormattedNextBillingDate()}
                renewLinkDataTracking={this.renewLinkDataTracking}
                cancelResiliationDataTracking={
                  this.cancelResiliationDataTracking
                }
                manageRenewDataTracking={this.manageRenewDataTracking}
                resiliateDataTracking={this.resiliateDataTracking}
                anticipateRenewDataTracking={this.anticipateRenewDataTracking}
              />
              <msc-billing-commitment
                class="block"
                servicePath={this.servicePath}
                serviceDetails={this.serviceDetails}
                nextBillingDate={this.getFormattedNextBillingDate()}
                language={this.language}
                localeStrings={this.localeStrings}
                commitmentDataTracking={this.commitmentDataTracking}
              />
              <msc-billing-contact
                class="block"
                serviceInfos={this.serviceInfos}
                localeStrings={this.localeStrings}
                serviceName={this.getServiceName()}
                serviceType={this.getServiceType()}
                changeOwnerDataTracking={this.changeOwnerDataTracking}
                updateOwnerDataTracking={this.updateOwnerDataTracking}
                subscriptionManagementDataTracking={
                  this.subscriptionManagementDataTracking
                }
              />
            </div>
          </osds-tile>
        </div>
      </Host>
    );
  }
}
