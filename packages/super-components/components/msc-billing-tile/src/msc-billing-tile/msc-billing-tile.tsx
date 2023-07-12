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
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

const ovhLocaleToI18next = (ovhLocale = '') => ovhLocale.replace('_', '-');
const i18nextLocaleToOvh = (i18nextLocale = '') =>
  i18nextLocale.replace('-', '_');

export interface IMscBillingTile {
  offer?: string;
  dataTracking?: string;
  language?: string;
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

  @Prop() public offer?: string = '';

  /** Label sent to the tracking service */
  @Prop() public dataTracking?: string = '';

  @State() private tabIndex = 0;

  @Prop() public language?: string = 'fr-FR';

  @State() i18nLoaded = false;

  componentWillLoad() {
    i18n.use(Backend).init({
      lng: ovhLocaleToI18next(this.language),
      fallbackLng: 'en-GB',
      debug: true,
      backend: {
        loadPath: (lngs) => {
          const [lng] = lngs;
          return `translations/Messages_${i18nextLocaleToOvh(lng)}.json`;
        },
        // allowMultiLoading: true,
      },
    });

    i18n.on('initialized', () => {
      this.i18nLoaded = true;
    });
  }

  getTranslation(key: string): string {
    if (!this.i18nLoaded || !i18n.t(key)) return key;
    return i18n.t(key, { lng: this.language });
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
            1 February 2023
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
            1 February 2023
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
            ls148374-ovh Administrator
            <br />
            ls148374-ovh Technical
            <br />
            ls148374-ovh Billing
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
