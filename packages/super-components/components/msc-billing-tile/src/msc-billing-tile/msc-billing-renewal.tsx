import { h, Fragment, Component, Prop } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_CHIP_SIZE, ODS_CHIP_VARIANT } from '@ovhcloud/ods-components/chip';
import {
  RenewalStatus,
  ServiceDetails,
  ServiceInfos,
  Translations,
} from './msc-billing.types';
import { BillingTileURLs } from './urls';

export interface IMSCBillingRenewal {
  serviceName: string;
  serviceType: string;
  servicePath: string;
  serviceInfos?: ServiceInfos;
  serviceDetails?: ServiceDetails;
  nextBillingDate?: string;
  renewLinkDataTracking?: string;
  cancelResiliationDataTracking?: string;
  manageRenewDataTracking?: string;
  resiliateDataTracking?: string;
  anticipateRenewDataTracking?: string;
  localeStrings: Translations;
  urls?: BillingTileURLs;
}

const chipColorMap = {
  [RenewalStatus.AUTOMATIC]: ODS_THEME_COLOR_INTENT.success,
  [RenewalStatus.AUTO]: ODS_THEME_COLOR_INTENT.success,
  [RenewalStatus.MANUAL]: ODS_THEME_COLOR_INTENT.warning,
  [RenewalStatus.BILLING_SUSPENDED]: ODS_THEME_COLOR_INTENT.info,
  [RenewalStatus.MANUAL_FORCED]: ODS_THEME_COLOR_INTENT.info,
  [RenewalStatus.DELETE_AT_EXPIRATION]: ODS_THEME_COLOR_INTENT.error,
  [RenewalStatus.EXPIRED]: ODS_THEME_COLOR_INTENT.error,
  [RenewalStatus.UNKNOWN]: ODS_THEME_COLOR_INTENT.error,
};

@Component({
  tag: 'msc-billing-renewal',
  styleUrl: 'msc-billing-renewal.scss',
  shadow: true,
})
export class MscBillingRenewal implements IMSCBillingRenewal {
  @Prop() public renewLinkDataTracking?: string;

  @Prop() public cancelResiliationDataTracking?: string;

  @Prop() public manageRenewDataTracking?: string;

  @Prop() public resiliateDataTracking?: string;

  @Prop() public anticipateRenewDataTracking?: string;

  @Prop() urls?: BillingTileURLs;

  @Prop() serviceName: string;

  @Prop() serviceType: string;

  @Prop() servicePath: string;

  @Prop() nextBillingDate?: string;

  @Prop() serviceInfos?: ServiceInfos;

  @Prop() serviceDetails?: ServiceDetails;

  @Prop() localeStrings: Translations;

  private getRenewStatus() {
    if (this.serviceInfos?.status === 'ok') {
      if (this.serviceInfos.renew.deleteAtExpiration) {
        // Red chip 'Cancellation requested', link in menu 'Stop cancellation of service'
        return RenewalStatus.DELETE_AT_EXPIRATION;
      }
      // service still active
      if (this.serviceInfos.renew.automatic) {
        // Green chip 'Automatic renewal', link in menu 'Manage my commitment' and 'Cancel subscription'
        return RenewalStatus.AUTOMATIC;
      }
      if (this.serviceInfos.renew.manualPayment) {
        // Yellow chip 'Manual renewal'
        return RenewalStatus.MANUAL;
      }
      if (this.serviceInfos.renew.forced) {
        return RenewalStatus.MANUAL_FORCED;
      }
    }
    if (this.serviceInfos?.status === 'expired') {
      // Red chip 'expired', link in menu 'Renew service'
      return RenewalStatus.EXPIRED;
    }
    if (this.serviceDetails?.ressource?.state === 'suspended') {
      return RenewalStatus.BILLING_SUSPENDED;
    }
    return RenewalStatus.UNKNOWN;
  }

  private getMenuLink() {
    switch (this.getRenewStatus()) {
      case RenewalStatus.EXPIRED:
        return (
          <osds-link
            data-tracking={this.renewLinkDataTracking}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={this.urls?.renewUrl}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {this.localeStrings.billing_services_actions_menu_renew}
            <osds-icon
              class="new-link-icon"
              size={ODS_ICON_SIZE.xxs}
              name={ODS_ICON_NAME.EXTERNAL_LINK}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </osds-link>
        );
      case RenewalStatus.DELETE_AT_EXPIRATION:
        return (
          <osds-link
            data-tracking={this.cancelResiliationDataTracking}
            target={OdsHTMLAnchorElementTarget._blank}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={this.urls?.cancelResiliationUrl}
          >
            {this.localeStrings.billing_services_actions_menu_resiliate_cancel}
          </osds-link>
        );
      default:
        return (
          <>
            <osds-link
              data-tracking={this.manageRenewDataTracking}
              target={OdsHTMLAnchorElementTarget._blank}
              href={this.urls?.manageRenewUrl}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {this.localeStrings.billing_services_actions_menu_manage_renew}
            </osds-link>
            <osds-link
              data-tracking={this.anticipateRenewDataTracking}
              target={OdsHTMLAnchorElementTarget._blank}
              href={this.urls?.anticipateRenew}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {
                this.localeStrings
                  .billing_services_actions_menu_anticipate_renew
              }
            </osds-link>
            <osds-link
              data-tracking={this.resiliateDataTracking}
              target={OdsHTMLAnchorElementTarget._blank}
              href={this.urls?.resiliateUrl}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {this.localeStrings.billing_services_actions_menu_resiliate}
            </osds-link>
          </>
        );
    }
  }

  render() {
    const renewStatus = this.getRenewStatus();
    const chipColor =
      chipColorMap[renewStatus] || ODS_THEME_COLOR_INTENT.default;

    const chipTextMap: { [key in RenewalStatus]: string } = {
      [RenewalStatus.DELETE_AT_EXPIRATION]: this.localeStrings
        .manager_billing_service_status_delete_at_expiration,
      [RenewalStatus.AUTO]: this.localeStrings
        .manager_billing_service_status_auto,
      [RenewalStatus.AUTOMATIC]: this.localeStrings
        .manager_billing_service_status_automatic,
      [RenewalStatus.MANUAL]: this.localeStrings
        .manager_billing_service_status_manualPayment,
      [RenewalStatus.EXPIRED]: this.localeStrings
        .manager_billing_service_status_expired,
      [RenewalStatus.MANUAL_FORCED]: this.localeStrings
        .manager_billing_service_status_forced_manual,
      [RenewalStatus.BILLING_SUSPENDED]: this.localeStrings
        .manager_billing_service_status_billing_suspended,
      [RenewalStatus.UNKNOWN]: '',
    };

    const chipText =
      chipTextMap[renewStatus] ||
      this.localeStrings[
        `manager_billing_service_status_${renewStatus}` as keyof Translations
      ];

    return (
      <>
        <osds-divider separator />
        <osds-text
          class="tile-title"
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {this.localeStrings.manager_billing_subscription_next_due_date}
        </osds-text>
        {!this.serviceInfos ? (
          <osds-skeleton />
        ) : (
          <>
            <div>
              <menu-custom>{this.getMenuLink()}</menu-custom>
            </div>
            <osds-text
              class="next-billing-date-label"
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.default}
            >
              {this.nextBillingDate}
            </osds-text>
            <osds-chip
              color={chipColor}
              size={ODS_CHIP_SIZE.sm}
              variant={ODS_CHIP_VARIANT.flat}
              inline
            >
              {chipText}
            </osds-chip>
          </>
        )}
      </>
    );
  }
}
