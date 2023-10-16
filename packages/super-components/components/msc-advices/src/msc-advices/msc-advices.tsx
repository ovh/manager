import {
  Component,
  Prop,
  h,
  Element,
  Host,
  State,
  Watch,
  Fragment,
} from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { apiClient } from '@ovh-ux/manager-core-api';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components/button';
import { ODS_TILE_VARIANT } from '@ovhcloud/ods-components/tile';
import { HTMLStencilElement } from '@stencil/core/internal';
import { Locale, defaultLocale } from '@ovhcloud/msc-utils';
import { getTranslations } from './translations';
import { AdviceGroups, Translations } from './msc-advices.types';

export interface IMscAdvices {
  serviceType: string;
  serviceName: string;
  dataTracking: string;
  locale?: Locale;
}

@Component({
  tag: 'msc-advices',
  styleUrl: 'msc-advices.scss',
  shadow: true,
})
export class MscAdvices implements IMscAdvices {
  @Element() host!: HTMLStencilElement;

  @Prop() public locale = defaultLocale;

  @Prop() public serviceType: string;

  @Prop() public serviceName: string;

  @Prop() public dataTracking: string;

  @State() private adviceGroups?: AdviceGroups;

  @State() private localeStrings?: Translations;

  @Watch('locale')
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }

  async componentWillLoad() {
    this.updateTranslations();

    apiClient.aapi
      .get(`/advices/${this.serviceType}/${this.serviceName}`)
      .then((response) => {
        this.adviceGroups = response.data;
      });
  }

  private getRecommandationBlock() {
    return (
      <>
        <osds-divider separator />
        {this.adviceGroups ? (
          this.adviceGroups.adviceGroups.map((adviceGroup, index) => (
            <div key={adviceGroup.localizedDescription}>
              <osds-text
                class="tile-title"
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {adviceGroup.localizedDescription}
              </osds-text>
              {adviceGroup.advices &&
                adviceGroup.advices.length > 0 &&
                adviceGroup.advices.map((advice) => (
                  <osds-button
                    key={advice.name}
                    data-tracking={this.dataTracking}
                    href={advice.href}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    variant={ODS_BUTTON_VARIANT.ghost}
                  >
                    <span slot="start">
                      {advice.localizedName}
                      {advice.external && (
                        <osds-icon
                          class="link-icon"
                          size={ODS_ICON_SIZE.xxs}
                          name={ODS_ICON_NAME.EXTERNAL_LINK}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      )}
                    </span>
                    <span slot="end">
                      <osds-icon
                        class="link-icon"
                        size={ODS_ICON_SIZE.xxs}
                        name={ODS_ICON_NAME.CHEVRON_RIGHT}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </osds-button>
                ))}
              {index < this.adviceGroups!.adviceGroups.length - 1 && (
                <osds-divider separator />
              )}
            </div>
          ))
        ) : (
          <osds-skeleton />
        )}
      </>
    );
  }

  public render() {
    if (!this.localeStrings || !this.adviceGroups) {
      return (
        <osds-tile rounded inline>
          <osds-skeleton />
        </osds-tile>
      );
    }

    return (
      <Host>
        <div class="msc-advices-wrapper">
          <osds-tile
            class="msc-advices-tile"
            color={ODS_THEME_COLOR_INTENT.info}
            variant={ODS_TILE_VARIANT.stroked}
            rounded
          >
            <div class="msc-advices-content">
              <osds-text
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._500}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {this.localeStrings.advices_heading}
              </osds-text>
              {this.getRecommandationBlock()}
            </div>
          </osds-tile>
        </div>
      </Host>
    );
  }
}
