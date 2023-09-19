import {
  Component,
  h,
  Prop,
  State,
  Host,
  Element,
  Fragment,
} from '@stencil/core';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import {
  OdsHTMLAnchorElementTarget,
  OdsIconName,
  OdsIconSize,
} from '@ovhcloud/ods-core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { apiClient } from '@ovh-ux/manager-core-api';
import {
  ContactInfos,
  DomainProperties,
  ServiceInfos,
  Translations,
} from './msc-billing.types';
import {
  getChangeOwnerUrl,
  getContactManagementUrl,
  getUpdateOwnerUrl,
} from './urls';

export interface IMscBillingContact {
  serviceName: string;
  serviceType: string;
  serviceInfos: ServiceInfos;
  changeOwnerDataTracking?: string;
  updateOwnerDataTracking?: string;
  subscriptionManagementDataTracking?: string;
  localeStrings: Translations;
}

@Component({
  tag: 'msc-billing-contact',
  styleUrl: 'msc-billing-contact.scss',
  shadow: true,
})
export class MscBillingContact implements IMscBillingContact {
  @Element() host!: HTMLStencilElement;

  @Prop() serviceName: string;

  @Prop() serviceType: string;

  @Prop() serviceInfos: ServiceInfos;

  @Prop() changeOwnerDataTracking?: string;

  @Prop() updateOwnerDataTracking?: string;

  @Prop() subscriptionManagementDataTracking?: string;

  @Prop() localeStrings: Translations;

  @State() domainProperties?: DomainProperties;

  @State() ownerInfos?: ContactInfos;

  async componentWillLoad() {
    if (this.isDomainServiceType()) {
      this.domainProperties = await apiClient.v6
        .get(`/domain/${this.serviceName}`)
        .then((response) => response.data);

      this.ownerInfos = await apiClient.v6
        .get(`/domain/contact/${this.domainProperties?.whoisOwner}`)
        .then((response) => response.data);
    }
  }

  private isDomainServiceType() {
    return this.serviceType === 'DOMAIN';
  }

  private isOwnerChangeableServiceType() {
    return [
      'DOMAIN',
      'HOSTING_WEB',
      'HOSTING_PRIVATEDATABASE',
      'DEDICATED_SERVER',
      'DEDICATED_HOUSING',
      'VPS',
      'EMAIL_DOMAIN',
      'VRACK',
      'DEDICATEDCLOUD', // VMWare
    ].includes(this.serviceType);
  }

  private getDomainOwnerFullname() {
    return `${this.ownerInfos?.firstName} ${this.ownerInfos?.lastName}`;
  }

  private getMenuLinks() {
    return (
      <>
        <osds-link
          data-tracking={this.subscriptionManagementDataTracking}
          href={getContactManagementUrl(this.serviceName)}
          color={OdsThemeColorIntent.primary}
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {this.localeStrings.manager_billing_subscription_contacts_management}
          <osds-icon
            slot="end"
            class="new-link-icon"
            size={OdsIconSize.xxs}
            name={OdsIconName.ARROW_RIGHT}
            color={OdsThemeColorIntent.primary}
          />
        </osds-link>
        {this.isOwnerChangeableServiceType() && (
          <osds-link
            data-tracking={this.changeOwnerDataTracking}
            href={getChangeOwnerUrl({
              isDomainService: this.isDomainServiceType(),
              serviceName: this.serviceName,
            })}
            target={OdsHTMLAnchorElementTarget._blank}
            color={OdsThemeColorIntent.primary}
          >
            <span class="link-text">
              {this.localeStrings.billing_services_actions_menu_change_owner}
            </span>
            <osds-icon
              slot="end"
              class="new-link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.EXTERNAL_LINK}
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
        )}
        {this.isDomainServiceType() && this.domainProperties?.whoisOwner && (
          <osds-link
            data-tracking={this.updateOwnerDataTracking}
            href={getUpdateOwnerUrl({
              serviceName: this.serviceName,
              ownerId: this.domainProperties?.whoisOwner,
            })}
            color={OdsThemeColorIntent.primary}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {
              this.localeStrings
                .billing_services_actions_menu_configuration_update_owner
            }
          </osds-link>
        )}
      </>
    );
  }

  render() {
    return (
      <Host>
        <osds-divider separator />
        <osds-text
          class="tile-title"
          level={OdsThemeTypographyLevel.heading}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.text}
        >
          {this.localeStrings.manager_billing_subscription_contacts}
        </osds-text>
        <div>
          <menu-custom>{this.getMenuLinks()}</menu-custom>
          {!this.serviceInfos ? (
            <osds-skeleton />
          ) : (
            <osds-text
              level={OdsThemeTypographyLevel.body}
              size={OdsThemeTypographySize._200}
            >
              {[
                `${this.serviceInfos.contactAdmin} ${this.localeStrings.manager_billing_subscription_contacts_admin}`,
                `${this.serviceInfos.contactBilling} ${this.localeStrings.manager_billing_subscription_contacts_billing}`,
                `${this.serviceInfos.contactTech} ${this.localeStrings.manager_billing_subscription_contacts_tech}`,
                this.isDomainServiceType() &&
                  `${this.getDomainOwnerFullname()}: ${
                    this.localeStrings.billing_services_domain_contact_owner
                  }`,
              ]
                .filter(Boolean)
                .map((contact: string) => (
                  <div key={contact}>{contact}</div>
                ))}
            </osds-text>
          )}
        </div>
      </Host>
    );
  }
}
