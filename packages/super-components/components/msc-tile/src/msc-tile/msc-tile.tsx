import {
  Component,
  Prop,
  h,
  Element,
  Host,
  Listen,
  State,
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

export interface IMscTile {
  href?: string;
  isExternalHref?: boolean;
  imgSrc?: string;
  imgAlt?: string;
  tileType: string;
  tileTitle: string;
  tileDescription: string;
  seeMoreLabel: string;
  dataTracking?: string;
}

/**
 * @slot badges - Badge list
 * @slot footer - Footer content
 */
@Component({
  tag: 'msc-tile',
  styleUrl: 'msc-tile.scss',
  shadow: true,
})
export class MscTile implements IMscTile {
  @Element() host!: HTMLStencilElement;

  /** URL of the link that will be opened when clicking on the Tile or on the "see more" link */
  @Prop() public href?: string = '';

  /** True if the link point to an external ressource */
  @Prop() public isExternalHref?: boolean;

  /** Label of the tile type displayed above the title (usually FAQ, Category...) */
  @Prop() public tileType = '';

  /** Tile title */
  @Prop() public tileTitle = '';

  /** Tile description */
  @Prop() public tileDescription = '';

  /** See more link label */
  @Prop() public seeMoreLabel = '';

  /** Optional header image URL */
  @Prop() public imgSrc?: string = '';

  /** Optional image alt text */
  @Prop() public imgAlt?: string = '';

  /** Label sent to the tracking service */
  @Prop() public dataTracking?: string = '';

  @State() private tabIndex = 0;

  @State() private hasFooterContent = false;

  @Listen('focus')
  onFocus(event: FocusEvent) {
    event.preventDefault();
    if (this.hasFooterContent) {
      this.host.shadowRoot?.querySelector<HTMLElement>('osds-link')?.focus();
      this.tabIndex = -1;
    } else {
      this.host.shadowRoot?.querySelector<HTMLElement>('a')?.focus();
    }
  }

  @Listen('blur')
  onBlur() {
    this.tabIndex = 0;
  }

  handleFooterSlotChange = (event: Event) => {
    this.hasFooterContent =
      (event.currentTarget as HTMLSlotElement)?.assignedElements().length > 0;
  };

  render() {
    const content = (
      <osds-tile
        class="msc-ods-tile"
        color={OdsThemeColorIntent.primary}
        rounded
      >
        <div class="tile-content">
          {this.imgSrc && (
            <img class="tile-img" src={this.imgSrc} alt={this.imgAlt} />
          )}
          <osds-text
            class="tile-type"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._200}
            color={OdsThemeColorIntent.primary}
          >
            {this.tileType}
            <span class="tile-badge-list">
              <slot name="badges"></slot>
            </span>
          </osds-text>

          <osds-text
            class="tile-title"
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._400}
            color={OdsThemeColorIntent.text}
          >
            {this.tileTitle}
          </osds-text>
          <osds-text
            class="tile-description"
            level={OdsThemeTypographyLevel.body}
            size={OdsThemeTypographySize._400}
            color={OdsThemeColorIntent.default}
          >
            {this.tileDescription}
          </osds-text>
          <osds-link
            tabIndex={this.hasFooterContent ? 0 : -1}
            data-tracking={this.dataTracking}
            color={OdsThemeColorIntent.primary}
            href={this.href}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {this.seeMoreLabel}
            <osds-icon
              slot="end"
              class="link-icon"
              aria-hidden="true"
              size={OdsIconSize.xxs}
              name={
                this.isExternalHref
                  ? OdsIconName.EXTERNAL_LINK
                  : OdsIconName.ARROW_RIGHT
              }
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
          <slot name="footer" onSlotchange={this.handleFooterSlotChange}></slot>
        </div>
      </osds-tile>
    );

    return (
      <Host tabIndex={this.tabIndex}>
        {this.hasFooterContent ? (
          <div class="msc-tile-wrapper">{content}</div>
        ) : (
          <a
            class="msc-tile-wrapper"
            target="_blank"
            rel="noopener"
            href={this.href}
            onFocus={() => {
              this.tabIndex = -1;
            }}
            onBlur={() => {
              this.tabIndex = 0;
            }}
          >
            {content}
          </a>
        )}
      </Host>
    );
  }
}
