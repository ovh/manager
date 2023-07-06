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
// import { useTranslation } from 'react-i18next';

export interface IMscBillingTile {
  offer?: string;
  dataTracking?: string;
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

  /** Label of the tile type displayed above the title (usually FAQ, Category...) */
  @Prop() public offer?: string = '';

  /** Label sent to the tracking service */
  @Prop() public dataTracking?: string = '';

  @State() private tabIndex = 0;

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
            Subscription
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
                Offer
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
            Creation date
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
            Next payment date
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
            Commitment
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
            Commit
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
            Contact
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
            Manage contacts
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
