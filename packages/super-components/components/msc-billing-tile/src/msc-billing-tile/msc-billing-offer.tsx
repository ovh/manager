import {
  Component,
  h,
  Prop,
  State,
  Host,
  Element,
  Fragment,
} from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
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
    return this.serviceProperties?.offer && !this.isUpgradableOffer() ? (
      <></>
    ) : (
      <menu-custom>
        <osds-link
          data-tracking={this.changeOfferDataTracking}
          href={getChangeOfferUrl(this.serviceType)}
          color={ODS_THEME_COLOR_INTENT.primary}
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
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
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
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.default}
            >
              {this.serviceProperties.offer}
            </osds-text>
          )}
        </div>
      </Host>
    );
  }
}
