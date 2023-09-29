import {
  Component,
  Prop,
  h,
  Element,
  Host,
  State,
  Fragment,
} from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { HTMLStencilElement, Watch } from '@stencil/core/internal';
import {
  Locale,
  defaultLocale,
  formatDate,
  Region,
  Subsidiary,
  defaultRegion,
  defaultSubsidiary,
} from '@ovhcloud/msc-utils';
import { apiClient } from '@ovh-ux/manager-core-api';
import { getTranslations } from './translations';
import {
  ServiceDetails,
  ServiceInfos,
  Translations,
} from './msc-billing.types';
import { getBillingTileURLs, BillingTileURLs } from './urls';

export interface IMscBillingTile {
  servicePath: string;
  appPublicUrl: string;
  locale?: Locale;
  region?: Region;
  subsidiary?: Subsidiary;
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

  @Prop() public locale = defaultLocale;

  @Prop() public servicePath: string;

  @Prop() public appPublicUrl: string;

  @Prop() public region = defaultRegion;

  @Prop() public subsidiary = defaultSubsidiary;

  @Prop() public commitmentDataTracking?: string;

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

  @State() urls?: BillingTileURLs;

  @Watch('appPublicUrl')
  @Watch('region')
  @Watch('subsidiary')
  @Watch('servicePath')
  setURLs() {
    this.urls = getBillingTileURLs({
      appPublicURL: this.appPublicUrl,
      region: this.region,
      subsidiary: this.subsidiary,
      serviceName: this.getServiceName(),
      servicePath: this.servicePath,
      serviceType: this.getServiceType(),
    });
  }

  @Watch('locale')
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }

  async componentWillLoad() {
    this.setURLs();
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
      ? formatDate(this.serviceDetails.billing?.nextBillingDate, this.locale)
      : '';
  }

  private getCreationDateBlock() {
    return (
      <>
        <osds-divider separator />
        <osds-text
          class="tile-title"
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {this.localeStrings?.manager_billing_subscription_creation}
        </osds-text>
        {this.serviceInfos ? (
          <osds-text
            class="tile-description"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {formatDate(this.serviceInfos.creation, this.locale)}
          </osds-text>
        ) : (
          <osds-skeleton />
        )}
      </>
    );
  }

  public render() {
    if (!this.localeStrings || !this.urls) {
      return (
        <osds-tile rounded inline>
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
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._300}
                color={ODS_THEME_COLOR_INTENT.text}
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
                urls={this.urls}
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
                urls={this.urls}
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
                locale={this.locale}
                localeStrings={this.localeStrings}
                urls={this.urls}
                commitmentDataTracking={this.commitmentDataTracking}
              />
              <msc-billing-contact
                class="block"
                serviceInfos={this.serviceInfos}
                localeStrings={this.localeStrings}
                serviceName={this.getServiceName()}
                serviceType={this.getServiceType()}
                urls={this.urls}
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
