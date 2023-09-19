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
import { HTMLStencilElement } from '@stencil/core/internal';
import { apiClient } from '@ovh-ux/manager-core-api';
import {
  ServiceProperties,
  ServiceInfos,
  Translations,
  ServiceDetails,
} from './msc-billing.types';
import { getChangeOfferUrl } from './urls';

export interface IMscBillingOffer {
  serviceType: string;
  servicePath: string;
  serviceInfos?: ServiceInfos;
  serviceDetails?: ServiceDetails;
  changeOfferDataTracking?: string;
  localeStrings: Translations;
}

@Component({
  tag: 'msc-billing-offer',
  styleUrl: 'msc-billing-offer.scss',
  shadow: true,
})
export class MscBillingOffer implements IMscBillingOffer {
  @Element() host!: HTMLStencilElement;

  @Prop() serviceType: string;

  @Prop() servicePath: string;

  @Prop() serviceInfos: ServiceInfos;

  @Prop() serviceDetails?: ServiceDetails;

  @Prop() changeOfferDataTracking?: string;

  @Prop() localeStrings: Translations;

  @State() serviceProperties: ServiceProperties;

  async componentWillLoad() {
    this.serviceProperties = await apiClient.v6
      .get(this.servicePath)
      .then((response) => response.data);
  }

  private isUpgradableOffer() {
    return (
      this.serviceType !== 'DOMAIN' && !this.serviceDetails?.parentServiceId
    );
  }

  private getMenu() {
    return this.serviceProperties.offer && !this.isUpgradableOffer() ? (
      <></>
    ) : (
      <menu-custom>
        <osds-link
          data-tracking={this.changeOfferDataTracking}
          href={getChangeOfferUrl(this.serviceType)}
          color={OdsThemeColorIntent.primary}
        >
          {this.localeStrings.billing_services_actions_menu_change_offer}
        </osds-link>
      </menu-custom>
    );
  }

  render() {
    if (this.serviceProperties && !this.serviceProperties.offer) {
      return <></>;
    }

    return (
      <Host>
        <osds-divider separator />
        <osds-text
          class="tile-title"
          level={OdsThemeTypographyLevel.heading}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.text}
        >
          {this.localeStrings?.manager_billing_subscription_offer}
        </osds-text>
        <div>
          {this.getMenu()}
          {!this.serviceInfos ||
          !this.serviceProperties ||
          !this.serviceDetails ? (
            <osds-skeleton />
          ) : (
            <osds-text
              class="tile-description"
              level={OdsThemeTypographyLevel.body}
              size={OdsThemeTypographySize._200}
              color={OdsThemeColorIntent.default}
            >
              {this.serviceProperties.offer}
            </osds-text>
          )}
        </div>
      </Host>
    );
  }
}
