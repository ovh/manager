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
import { HTMLStencilElement } from '@stencil/core/internal';
import { fetchLocaleStringsForComponent } from '../../../../utils/translation.utils';
import formatDate from '../../../../utils/date.utils';
import { fetchServiceId, fetchServiceDetails, fetchDomainOwner } from './Api';
import ContactContent from './Contact';
import RenewalContent from './Renewal';
import CommitmentContent from './Commitment';

export interface IMscBillingTile {
  offer?: string;
  dataTracking?: string;
  language: string;
  servicePath: string;
}

@Component({
  tag: 'msc-billing-tile',
  styleUrl: 'msc-billing-tile.scss',
  shadow: true,
})
export class MscBillingTile implements IMscBillingTile {
  @Element() host!: HTMLStencilElement;

  /** Name of the offer */
  @Prop() public offer?: string = '';

  /** label sent to the tracking service */
  @Prop() public dataTracking?: string = '';

  /** language of the billing-tile, french default */
  @Prop() public language = 'fr-FR';

  /** service path for the API */
  @Prop() public servicePath = '';

  @State() localStrings: { [key: string]: string };

  @State() private tabIndex = 0;

  @State() serviceId: string;

  @State() creationDate: string;

  @State() nextBillingDate: string;

  @State() contactAdmin: string;

  @State() contactBilling: string;

  @State() contactTech: string;

  @State() contactProperty: string;

  @State() renewStatus: string;

  @State() commitmentStatus: string;

  @State() requestDate: string;

  @State() whoisOwnerDomain: string;

  async componentWillLoad() {
    this.localStrings = await fetchLocaleStringsForComponent(this.language);
    await fetchServiceId(this.servicePath).then((serviceData) => {
      this.contactAdmin = serviceData.contactAdmin;
      this.contactBilling = serviceData.contactBilling;
      this.contactTech = serviceData.contactTech;
      this.serviceId = serviceData.serviceId;
      this.creationDate = formatDate(serviceData.creation, this.language);
      if (serviceData.status === 'ok') {
        if (serviceData.renew.deleteAtExpiration === true) {
          // Red chip 'Cancellation requested', link in menu 'Stop cancellation of service'
          this.renewStatus = 'deleteAtExpiration';
        } else {
          // service still active
          if (
            serviceData.renew.automatic === true &&
            serviceData.renew.manualPayment === false
          )
            // Green chip 'Automatic renewal', link in menu 'Manage my commitment' and 'Cancel subscription'
            this.renewStatus = 'automatic';
          if (
            serviceData.renew.automatic === false &&
            serviceData.renew.manualPayment === true
          )
            // Yellow chip 'Manual renewal'
            this.renewStatus = 'manualPayment';
        }
      }
      if (serviceData.status === 'expired') {
        // Red chip 'expired', link in menu 'Renew service'
        this.renewStatus = 'expired';
      }
    });
    await fetchServiceDetails(this.serviceId).then((serviceData) => {
      this.nextBillingDate = formatDate(
        serviceData.billing?.nextBillingDate,
        this.language,
      );
      if (
        serviceData.billing.engagement === null &&
        !serviceData.billing.engagementRequest
      ) {
        // should be null if no commitment
        // Red chip 'None', no link or link 'Commit'
        this.commitmentStatus = 'none';
      } else if (serviceData.billing.engagement?.endDate < new Date()) {
        // Red chip 'Ended DATE', no link
        this.commitmentStatus = 'ended';
      } else if (serviceData.billing.engagement?.endDate >= new Date()) {
        // No chip 'Renews on DATE', link 'Re-commit and get a discount'
        this.commitmentStatus = 'renews';
      } else if (serviceData.billing.engagementRequest) {
        // No chip 'Your service commitment will begin from DATE'
        this.commitmentStatus = 'requested';
        this.requestDate = serviceData.billing.engagementRequest.requestDate;
      } else if (serviceData.billing.expirationDate) {
        // No chip 'Ends DATE'
        this.commitmentStatus = 'ends';
      }
    });
    if (this.getServiceType() === 'DOMAIN')
      await fetchDomainOwner(this.getServiceName()).then((serviceData) => {
        this.whoisOwnerDomain = serviceData.whoisOwner;
      });
  }

  getServiceName() {
    const parts = this.servicePath.split('/');
    return parts[parts.length - 1];
  }

  getServiceType() {
    const parts = this.servicePath.split('/');
    parts.pop(); // Remove the service name
    return parts.join('_').toUpperCase();
  }

  render() {
    const content = (
      <osds-tile
        class="msc-ods-tile"
        color={OdsThemeColorIntent.default}
        rounded
      >
        <div class="billing-tile-content">
          <osds-text
            class="tile-type"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._300}
            color={OdsThemeColorIntent.text}
          >
            {this.localStrings.manager_billing_subscription}
          </osds-text>
          {/* OFFER */}
          {this.offer && (
            <>
              <osds-divider separator={true} />
              <osds-text
                class="tile-title"
                level={OdsThemeTypographyLevel.heading}
                size={OdsThemeTypographySize._200}
                color={OdsThemeColorIntent.text}
              >
                {this.localStrings.manager_billing_subscription_offer}
              </osds-text>
              <osds-text
                class="tile-description"
                level={OdsThemeTypographyLevel.body}
                size={OdsThemeTypographySize._200}
                color={OdsThemeColorIntent.default}
              >
                {this.offer}
              </osds-text>
            </>
          )}
          {/* CREATION DATE */}
          <osds-divider separator={true} />
          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.text}
          >
            {this.localStrings.manager_billing_subscription_creation}
          </osds-text>
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.default}
          >
            {this.creationDate}
          </osds-text>
          {/* NEXT PAYMENT DATE */}
          <osds-divider separator={true} />
          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.text}
          >
            {this.localStrings.manager_billing_subscription_next_due_date}
          </osds-text>
          {RenewalContent(
            this.getServiceName(),
            this.getServiceType(),
            this.servicePath,
            this.renewStatus,
            this.localStrings,
            this.nextBillingDate,
            this.dataTracking,
          )}
          {/* COMMITMENT */}
          <osds-divider separator={true} />
          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.text}
          >
            {this.localStrings.manager_billing_subscription_engagement}
          </osds-text>
          {CommitmentContent(
            this.servicePath,
            this.commitmentStatus,
            this.localStrings,
            this.language,
            this.nextBillingDate,
            this.requestDate,
            this.dataTracking,
          )}
          {/* CONTACT */}
          <osds-divider separator={true} />
          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.text}
          >
            {this.localStrings.manager_billing_subscription_contacts}
          </osds-text>
          <div>
            {ContactContent(
              this.getServiceName(),
              this.getServiceType(),
              this.localStrings,
              this.contactAdmin,
              this.contactBilling,
              this.contactTech,
              this.contactProperty,
              this.whoisOwnerDomain,
            )}
          </div>
        </div>
      </osds-tile>
    );

    return (
      <Host tabIndex={this.tabIndex}>
        <div class="msc-billing-tile-wrapper">{content}</div>
      </Host>
    );
  }
}
