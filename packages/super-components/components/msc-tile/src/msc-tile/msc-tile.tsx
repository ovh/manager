import {
  Component,
  Prop,
  h,
  Element,
  Host,
  Listen,
  State,
} from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { HTMLStencilElement, Watch } from '@stencil/core/internal';
import { Locale, defaultLocale } from '@ovhcloud/msc-utils';
import { getTranslations, Translations } from './translations';

export interface IMscTile {
  href?: string;
  isExternalHref?: boolean;
  imgSrc?: string;
  imgAlt?: string;
  category: string;
  tileTitle: string;
  tileDescription: string;
  dataTracking?: string;
  locale?: Locale;
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

  /** Label of the tile category */
  @Prop() public category: string;

  /** Tile title */
  @Prop() public tileTitle = '';

  /** Tile description */
  @Prop() public tileDescription = '';

  /** Optional header image URL */
  @Prop() public imgSrc?: string = '';

  /** Optional image alt text */
  @Prop() public imgAlt?: string = '';

  /** Label sent to the tracking service */
  @Prop() public dataTracking?: string = '';

  @Prop() public locale = defaultLocale;

  @State() private localeStrings?: Translations;

  @State() private tabIndex = 0;

  @State() private hasFooterContent = false;

  @Watch('locale')
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }

  async componentWillLoad() {
    this.updateTranslations();
  }

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
    if (!this.localeStrings) {
      return (
        <osds-tile rounded>
          <osds-skeleton />
        </osds-tile>
      );
    }

    const content = (
      <osds-tile
        class="msc-ods-tile"
        color={ODS_THEME_COLOR_INTENT.primary}
        rounded
      >
        <div class="tile-content">
          {this.imgSrc && (
            <img class="tile-img" src={this.imgSrc} alt={this.imgAlt} />
          )}
          <osds-text
            class="tile-type"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {this.category}
            <span class="tile-badge-list">
              <slot name="badges"></slot>
            </span>
          </osds-text>

          <osds-text
            class="tile-title"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {this.tileTitle}
          </osds-text>
          <osds-text
            class="tile-description"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {this.tileDescription}
          </osds-text>
          <osds-link
            tabIndex={this.hasFooterContent ? 0 : -1}
            data-tracking={this.dataTracking}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={this.href}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {this.localeStrings?.see_more_label}
            <osds-icon
              slot="end"
              class="link-icon"
              aria-hidden="true"
              size={ODS_ICON_SIZE.xxs}
              name={
                this.isExternalHref
                  ? ODS_ICON_NAME.EXTERNAL_LINK
                  : ODS_ICON_NAME.ARROW_RIGHT
              }
              color={ODS_THEME_COLOR_INTENT.primary}
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
            target={OdsHTMLAnchorElementTarget._blank}
            rel={OdsHTMLAnchorElementRel.noopener}
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
