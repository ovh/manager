import { h, Fragment, Component, Prop } from '@stencil/core';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import {
  OdsIconName,
  OdsIconSize,
  OdsChipSize,
  OdsChipVariant,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-core';
import {
  RenewalStatus,
  ServiceDetails,
  ServiceInfos,
  Translations,
} from './msc-billing.types';
import {
  getAnticipateRenew,
  getCancelResiliationUrl,
  getManageRenewUrl,
  getRenewUrl,
  getResiliateUrl,
} from './urls';

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
}

const chipColorMap = {
  [RenewalStatus.AUTOMATIC]: OdsThemeColorIntent.success,
  [RenewalStatus.AUTO]: OdsThemeColorIntent.success,
  [RenewalStatus.MANUAL]: OdsThemeColorIntent.warning,
  [RenewalStatus.BILLING_SUSPENDED]: OdsThemeColorIntent.info,
  [RenewalStatus.MANUAL_FORCED]: OdsThemeColorIntent.info,
  [RenewalStatus.DELETE_AT_EXPIRATION]: OdsThemeColorIntent.error,
  [RenewalStatus.EXPIRED]: OdsThemeColorIntent.error,
  [RenewalStatus.UNKNOWN]: OdsThemeColorIntent.error,
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
            color={OdsThemeColorIntent.primary}
            href={getRenewUrl(this.serviceName)}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {this.localeStrings.billing_services_actions_menu_renew}
            <osds-icon
              class="new-link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.EXTERNAL_LINK}
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
        );
      case RenewalStatus.DELETE_AT_EXPIRATION:
        return (
          <osds-link
            data-tracking={this.cancelResiliationDataTracking}
            target={OdsHTMLAnchorElementTarget._blank}
            color={OdsThemeColorIntent.primary}
            href={getCancelResiliationUrl(this.servicePath)}
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
              href={getManageRenewUrl({
                serviceName: this.serviceName,
                serviceType: this.serviceType,
              })}
              color={OdsThemeColorIntent.primary}
            >
              {this.localeStrings.billing_services_actions_menu_manage_renew}
            </osds-link>
            <osds-link
              data-tracking={this.anticipateRenewDataTracking}
              target={OdsHTMLAnchorElementTarget._blank}
              href={getAnticipateRenew(this.servicePath)}
              color={OdsThemeColorIntent.primary}
            >
              {
                this.localeStrings
                  .billing_services_actions_menu_anticipate_renew
              }
            </osds-link>
            <osds-link
              data-tracking={this.resiliateDataTracking}
              target={OdsHTMLAnchorElementTarget._blank}
              href={getResiliateUrl({
                serviceName: this.serviceName,
                serviceType: this.serviceType,
              })}
              color={OdsThemeColorIntent.primary}
            >
              {this.localeStrings.billing_services_actions_menu_resiliate}
            </osds-link>
          </>
        );
    }
  }

  render() {
    const renewStatus = this.getRenewStatus();
    const chipColor = chipColorMap[renewStatus] || OdsThemeColorIntent.default;

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
          level={OdsThemeTypographyLevel.heading}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.text}
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
              level={OdsThemeTypographyLevel.body}
              size={OdsThemeTypographySize._200}
              color={OdsThemeColorIntent.default}
            >
              {this.nextBillingDate}
            </osds-text>
            <osds-chip
              color={chipColor}
              size={OdsChipSize.sm}
              variant={OdsChipVariant.flat}
            >
              {chipText}
            </osds-chip>
          </>
        )}
      </>
    );
  }
}
