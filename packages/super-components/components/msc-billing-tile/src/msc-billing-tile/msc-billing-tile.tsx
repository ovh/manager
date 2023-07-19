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
import {
  OdsChipSize,
  OdsChipVariant,
  OdsHTMLAnchorElementTarget,
  OdsIconName,
  OdsIconSize,
  OdsButtonType,
  OdsButtonVariant,
} from '@ovhcloud/ods-core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { i18n, createInstance } from 'i18next';
import Backend from 'i18next-http-backend';
import apiClient from '@ovh-ux/manager-core-api';

const ovhLocaleToI18next = (ovhLocale = '') => ovhLocale.replace('_', '-');
const i18nextLocaleToOvh = (i18nextLocale = '') =>
  i18nextLocale.replace('-', '_');

export interface IMscBillingTile {
  offer?: string;
  dataTracking?: string;
  language?: string;
  servicePath: string;
}

/**
 * @slot footer - Footer content
 */
@Component({
  tag: 'msc-billing-tile',
  styleUrl: 'msc-billing-tile.scss',
  shadow: true,
})
export class MscBillingTile implements IMscBillingTile {
  @Element() host!: HTMLStencilElement;

  /** Name of the offer */
  @Prop() public offer?: string = '';

  /** Label sent to the tracking service */
  @Prop() public dataTracking?: string = '';

  /** change the language of the billing-tile */
  @Prop() public language?: string = 'fr-FR';

  /** service path for the API */
  @Prop() public servicePath = '';

  @State() private tabIndex = 0;

  @State() i18nLoaded = false;

  @State() serviceId: string;

  @State() creationDate: string;

  @State() nextBillingDate: string;

  @State() contactAdmin: string;

  @State() contactBilling: string;

  @State() contactTech: string;

  @State() renewStatus: string;

  @State() commitmentStatus: string;

  private i18nInstance: i18n;

  componentWillLoad() {
    this.i18nInstance = createInstance();

    return new Promise<void>((resolve) => {
      this.i18nInstance.use(Backend).init(
        {
          lng: ovhLocaleToI18next(this.language),
          fallbackLng: 'fr-FR',
          debug: true,
          backend: {
            loadPath: (lngs: string) => {
              const [lng] = lngs;
              return `translations/Messages_${i18nextLocaleToOvh(lng)}.json`;
            },
            allowMultiLoading: true,
          },
        },
        (err, t) => {
          console.log('err translation', err, t);
          // After initialization completed, set loaded flag to true
          this.i18nLoaded = true;
          resolve();
        },
      );

      this.fetchServiceId();
    });
  }

  getTranslation(key: string): string {
    if (!this.i18nLoaded) return key;
    const translation = this.i18nInstance.t(key, { lng: this.language });
    if (!translation) return key;
    return translation;
  }

  fetchServiceId() {
    apiClient.v6
      .get(`${this.servicePath}/serviceInfos`)
      .then((response) => {
        const { data } = response;
        this.contactAdmin = data.contactAdmin;
        this.contactBilling = data.contactBilling;
        this.contactTech = data.contactTech;
        this.serviceId = data.serviceId;
        // we check if the service status is ok
        if (data.status === 'ok') {
          if (data.renew.deleteAtExpiration === true)
            // Red chip 'Cancellation requested', link in menu 'Stop cancellation of service'
            this.renewStatus = 'deleteAtExpiration';
          if (
            data.renew.automatic === true &&
            data.renew.manualPayment === false
          )
            // Green chip 'Automatic renewal', link in menu 'Manage my commitment' and 'Cancel subscription'
            this.renewStatus = 'automatic';
          if (
            data.renew.automatic === false &&
            data.renew.manualPayment === true
          )
            // Yellow chip 'Manual renewal'
            this.renewStatus = 'manualPayment';
        }
        if (data.status === 'expired') {
          // Red chip 'Cancelled'
          this.renewStatus = 'cancelled';
        }

        this.fetchServiceDetails(this.serviceId);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  fetchServiceDetails(serviceId: string) {
    apiClient.v6
      .get(`/service/${serviceId}`)
      .then((response) => {
        const { data } = response;
        this.creationDate = new Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(data.creationDate);
        this.nextBillingDate = new Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(data.nextBillingDate);
        if (data.billing.engagement === null) {
          // should be null if no commitment
          // Red chip 'None', no link or link 'Commit'
          this.commitmentStatus = 'none';
        } else if (data.billing.engagement?.endDate < new Date()) {
          // Red chip 'Ended DATE', no link
          this.commitmentStatus = 'ended';
        } else if (data.billing.engagement?.endDate > new Date()) {
          // No chip 'Renews on DATE', link 'Re-commit and get a discount'
          this.commitmentStatus = 'renews';
        } else if (data.billing.engagementRequest) {
          // No chip 'Your service commitment will begin from DATE'
          this.commitmentStatus = 'requested';
        } else if (data.billing.expirationDate) {
          // No chip 'Ends DATE'
          this.commitmentStatus = 'ends';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  render() {
    const ButtonTooltip = (
      <div class="menu-button">
        <osds-button
          type={OdsButtonType.button}
          variant={OdsButtonVariant.stroked}
          color={OdsThemeColorIntent.primary}
          circle
        >
          <osds-icon
            name="ellipsis-vertical"
            size="xs"
            color={OdsThemeColorIntent.primary}
          />
        </osds-button>
      </div>
    );

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
            {this.getTranslation('manager_billing_subscription')}
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
                {this.getTranslation('manager_billing_subscription_offer')}
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
            {this.getTranslation('manager_billing_subscription_creation')}
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
            {this.getTranslation('manager_billing_subscription_next_due_date')}
          </osds-text>
          {ButtonTooltip}
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.default}
          >
            {this.nextBillingDate}
          </osds-text>
          {/* COMMITMENT */}
          <osds-divider separator={true} />
          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.text}
          >
            {this.getTranslation('manager_billing_subscription_engagement')}
          </osds-text>
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.default}
          >
            <osds-chip
              color={OdsThemeColorIntent.error}
              size={OdsChipSize.sm}
              variant={OdsChipVariant.flat}
            >
              None
            </osds-chip>
          </osds-text>
          <osds-link
            data-tracking={this.dataTracking}
            color={OdsThemeColorIntent.primary}
            href={'#'}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {this.getTranslation(
              'manager_billing_subscription_engagement_commit',
            )}
            <osds-icon
              class="link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.ARROW_RIGHT}
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
          {/* CONTACT */}
          <osds-divider separator={true} />
          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.text}
          >
            {this.getTranslation('manager_billing_subscription_contacts')}
          </osds-text>
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.default}
          >
            <div>
              {this.contactAdmin}{' '}
              {this.getTranslation(
                'manager_billing_subscription_contacts_admin',
              )}
            </div>
            <div>
              {this.contactTech}{' '}
              {this.getTranslation(
                'manager_billing_subscription_contacts_tech',
              )}
            </div>
            <div>
              {this.contactBilling}{' '}
              {this.getTranslation(
                'manager_billing_subscription_contacts_billing',
              )}
            </div>
          </osds-text>
          <osds-link
            data-tracking={this.dataTracking}
            color={OdsThemeColorIntent.primary}
            href={'#'}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {this.getTranslation(
              'manager_billing_subscription_contacts_management',
            )}
            <osds-icon
              class="link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.ARROW_RIGHT}
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
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
