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

  @State() requestDate: string;

  @State() whoisOwnerDomain: string;

  @State() showTooltip = false; // will be removed with ODS-MENU

  @State() showTooltipContact = false; // will be removed with ODS-MENU

  handleTooltipToggle(event: Event) {
    // will be removed with ODS-MENU
    event.stopPropagation();
    this.showTooltip = !this.showTooltip;
  }

  handleTooltipToggleContact(event: Event) {
    // will be removed with ODS-MENU
    event.stopPropagation();
    this.showTooltipContact = !this.showTooltipContact;
  }

  private i18nInstance: i18n;

  componentWillLoad() {
    this.i18nInstance = createInstance();

    return new Promise<void>((resolve) => {
      this.i18nInstance.use(Backend).init(
        {
          lng: ovhLocaleToI18next(this.language),
          fallbackLng: this.language,
          debug: true,
          backend: {
            loadPath: (lngs: string) => {
              const [lng] = lngs;
              if (lng.length < 3) return ``;
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
      if (this.getServiceType() === 'DOMAIN')
        this.fetchDomainOwner(this.getServiceName());
    });
  }

  getTranslation(key: string, options?: Record<string, any>): string {
    if (!this.i18nLoaded) return key;
    const translation = this.i18nInstance.t(key, {
      ...options,
      lng: this.language,
    });
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
        this.creationDate = new Intl.DateTimeFormat(this.language, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(data.creation));
        // we check if the service status is ok
        if (data.status === 'ok') {
          if (data.renew.deleteAtExpiration === true) {
            // Red chip 'Cancellation requested', link in menu 'Stop cancellation of service'
            this.renewStatus = 'deleteAtExpiration';
          } else {
            // service still active
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
        }
        if (data.status === 'expired') {
          // Red chip 'expired', link in menu 'Renew service'
          this.renewStatus = 'expired';
        }
        this.fetchServiceDetails(this.serviceId);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  fetchServiceDetails(serviceId: string) {
    apiClient.v6
      .get(`/services/${serviceId}`)
      .then((response) => {
        const { data } = response;
        this.nextBillingDate = new Intl.DateTimeFormat(this.language, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(data.billing?.nextBillingDate));
        if (
          data.billing.engagement === null &&
          !data.billing.engagementRequest
        ) {
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
          this.requestDate = data.billing.engagementRequest.requestDate;
        } else if (data.billing.expirationDate) {
          // No chip 'Ends DATE'
          this.commitmentStatus = 'ends';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  fetchDomainOwner(domain: string) {
    apiClient.v6
      .get(`/domain/${domain}`)
      .then((response) => {
        const { data } = response;
        console.log('response:', response);
        this.whoisOwnerDomain = data.whoisOwner;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  getServiceName() {
    const parts = this.servicePath.split('/');
    return parts[parts.length - 1]; // get the last part
  }

  getServiceType() {
    const parts = this.servicePath.split('/');
    parts.pop(); // Remove the service name
    return parts.join('_').toUpperCase(); // Join remaining parts with '_', and convert to upper case
  }

  render() {
    const RenewalContent = () => {
      const status = this.renewStatus;
      const getColor = () => {
        switch (status) {
          case 'deleteAtExpiration':
            return OdsThemeColorIntent.error;
          case 'automatic':
            return OdsThemeColorIntent.success;
          case 'manualPayment':
            return OdsThemeColorIntent.warning;
          case 'expired':
            return OdsThemeColorIntent.error;
          default:
            return OdsThemeColorIntent.default;
        }
      };

      const getText = () => {
        switch (status) {
          case 'deleteAtExpiration':
            return this.getTranslation(
              'manager_billing_service_status_delete_at_expiration',
            );
          case 'automatic':
            return this.getTranslation(
              'manager_billing_service_status_automatic',
            );
          case 'manualPayment':
            return this.getTranslation(
              'manager_billing_service_status_manualPayment',
            );
          case 'expired':
            return this.getTranslation(
              'manager_billing_service_status_expired',
            );
          default:
            return this.getTranslation(
              `manager_billing_service_status_${status}`,
            );
        }
      };

      const getMenuLink = () => {
        switch (status) {
          case 'expired':
            return (
              <osds-link
                color={OdsThemeColorIntent.primary}
                href={`https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=${this.getServiceName()}`}
                target="blank"
              >
                {this.getTranslation('billing_services_actions_menu_renew')}
                <osds-icon
                  class="link-icon"
                  size={OdsIconSize.xxs}
                  name={OdsIconName.EXTERNAL_LINK}
                  color={OdsThemeColorIntent.primary}
                />
              </osds-link>
            );
          case 'deleteAtExpiration':
            return (
              <osds-link
                color={OdsThemeColorIntent.primary}
                href={`https://www.ovh.com/manager/dedicated/#/${this.servicePath}/dashboard/cancel-resiliation`}
              >
                {this.getTranslation(
                  'billing_services_actions_menu_resiliate_cancel',
                )}
              </osds-link>
            );
          case 'manualPayment':
            return (
              <div class="tooltiplinks">
                <osds-link
                  href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${this.getServiceName()}&serviceType=${this.getServiceType()}`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_manage_renew',
                  )}
                </osds-link>
                <osds-link
                  href={`https://www.ovh.com/manager/#/dedicated/${this.servicePath}/commitment`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_anticipate_renew',
                  )}
                </osds-link>
                <osds-link
                  href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${this.getServiceName()}&serviceType=${this.getServiceType()}`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_resiliate',
                  )}
                </osds-link>
              </div>
            );
          default:
            // automatic and others
            return (
              <div class="tooltiplinks">
                <osds-link
                  href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${this.getServiceName()}&serviceType=${this.getServiceType()}`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_manage_renew',
                  )}
                </osds-link>
                <osds-link
                  href={`https://www.ovh.com/manager/#/${this.servicePath}/commitment`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_anticipate_renew',
                  )}
                </osds-link>
                <osds-link
                  href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${this.getServiceName()}&serviceType=${this.getServiceType()}`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_resiliate',
                  )}
                </osds-link>
              </div>
            );
        }
      };

      return (
        <>
          <div>
            <div class="menu-button menu-button-renew">
              <osds-button
                onClick={(event: Event) => this.handleTooltipToggle(event)}
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
              {this.showTooltip && (
                <div class="tooltip">
                  <div class="tooltiptext">{getMenuLink()}</div>
                  <slot />
                </div>
              )}
            </div>
          </div>
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.default}
          >
            <div>{this.nextBillingDate}</div>
            <osds-chip
              color={getColor()}
              size={OdsChipSize.sm}
              variant={OdsChipVariant.flat}
            >
              {getText()}
            </osds-chip>
          </osds-text>
        </>
      );
    };

    const ChipCommitment = () => {
      const status = this.commitmentStatus;
      switch (status) {
        case 'ended':
          return (
            <osds-text
              class="tile-description"
              level={OdsThemeTypographyLevel.body}
              size={OdsThemeTypographySize._200}
              color={OdsThemeColorIntent.default}
            >
              {this.getTranslation(
                'manager_billing_subscription_engagement_status_engaged_expired',
                {
                  endDate: new Intl.DateTimeFormat(this.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(this.nextBillingDate)),
                },
              )}
            </osds-text>
          );
        case 'renews':
          return (
            <osds-text
              class="tile-description"
              level={OdsThemeTypographyLevel.body}
              size={OdsThemeTypographySize._200}
              color={OdsThemeColorIntent.default}
            >
              {this.getTranslation(
                'manager_billing_subscription_engagement_status_engaged_renew',
                {
                  endDate: new Intl.DateTimeFormat(this.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(this.nextBillingDate)),
                },
              )}
            </osds-text>
          );
        case 'requested':
          return (
            <osds-text
              class="tile-description"
              level={OdsThemeTypographyLevel.body}
              size={OdsThemeTypographySize._200}
              color={OdsThemeColorIntent.default}
            >
              {this.getTranslation(
                'manager_billing_subscription_engagement_status_commitement_pending',
                {
                  nextBillingDate: new Intl.DateTimeFormat(this.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(this.requestDate)),
                },
              )}
            </osds-text>
          );
        case 'ends':
          return (
            <osds-chip
              color={OdsThemeColorIntent.error}
              size={OdsChipSize.sm}
              variant={OdsChipVariant.flat}
            >
              {this.getTranslation(
                'manager_billing_subscription_engagement_status_engaged',
                {
                  endDate: new Intl.DateTimeFormat(this.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(this.nextBillingDate)),
                },
              )}
            </osds-chip>
          );
        default:
          return (
            <>
              <osds-chip
                color={OdsThemeColorIntent.error}
                size={OdsChipSize.sm}
                variant={OdsChipVariant.flat}
              >
                {this.getTranslation(
                  'manager_billing_subscription_engagement_status_none',
                )}
              </osds-chip>
              <div>
                <osds-link
                  data-tracking={this.dataTracking}
                  color={OdsThemeColorIntent.primary}
                  href={`https://www.ovh.com/manager/dedicated/#/${this.servicePath}/dashboard/commitment`}
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
              </div>
            </>
          );
      }
    };

    const ContactContent = () => {
      const getMenuLink = () => {
        return (
          <div class="tooltiplinks">
            <osds-link
              href={`https://www.ovh.com/manager/#/dedicated/contacts/services?serviceName=${this.getServiceName()}`}
              color={OdsThemeColorIntent.primary}
            >
              {this.getTranslation(
                'manager_billing_subscription_contacts_management',
              )}
            </osds-link>
            {this.getServiceType() === 'DOMAIN' && (
              <>
                <osds-link
                  href={`https://www.ovh.com/fr/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'${this.getServiceName()})`}
                  target="blank"
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_change_owner',
                  )}
                  <osds-icon
                    class="link-icon"
                    size={OdsIconSize.xxs}
                    name={OdsIconName.EXTERNAL_LINK}
                    color={OdsThemeColorIntent.primary}
                  />
                </osds-link>
                <osds-link
                  href={`https://www.ovh.com/manager/#/dedicated/contact/${this.getServiceName()}/${
                    this.whoisOwnerDomain
                  }`}
                  color={OdsThemeColorIntent.primary}
                >
                  {this.getTranslation(
                    'billing_services_actions_menu_configuration_update_owner',
                  )}
                </osds-link>
              </>
            )}
            {this.getServiceType() !== 'DOMAIN' && (
              <osds-link
                href={`https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi`}
                target="blank"
                color={OdsThemeColorIntent.primary}
              >
                {this.getTranslation(
                  'billing_services_actions_menu_change_owner',
                )}
                <osds-icon
                  class="link-icon"
                  size={OdsIconSize.xxs}
                  name={OdsIconName.EXTERNAL_LINK}
                  color={OdsThemeColorIntent.primary}
                />
              </osds-link>
            )}
          </div>
        );
      };

      return (
        <>
          <div class="menu-button menu-button-contact">
            <osds-button
              onClick={(event: Event) => this.handleTooltipToggleContact(event)}
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
            {this.showTooltipContact && (
              <div class="tooltip">
                <div class="tooltiptext">{getMenuLink()}</div>
                <slot />
              </div>
            )}
          </div>
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
        </>
      );
    };

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
          {RenewalContent()}
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
            {ChipCommitment()}
          </osds-text>
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
          <div>{ContactContent()}</div>
          {/* removed link using menu
          <osds-link
            data-tracking={this.dataTracking}
            color={OdsThemeColorIntent.primary}
            href={`https://www.ovh.com/manager/#/dedicated/contacts/services?serviceName=${this.getServiceName()}`}
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
            */}
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
