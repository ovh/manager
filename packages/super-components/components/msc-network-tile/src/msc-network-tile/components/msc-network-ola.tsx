import { Component, h, Host, Prop } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components/button';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';

import {
  Translations,
  NetworkInfos,
  NetworkingInfos,
} from '../msc-network-types';

export interface IMscOla {
  localeStrings: Translations;
}
@Component({
  tag: 'msc-network-ola',
  styleUrl: 'msc-network-components.scss',
  shadow: true,
})
export class MscNetworkOla implements IMscOla {
  @Prop() localeStrings: Translations;

  @Prop() networkInfos?: NetworkInfos;

  @Prop() networkingInfos?: NetworkingInfos;

  public render() {
    return (
      <Host>
        <div class="container">
          <span>
            <div>
              <osds-text
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {this.localeStrings.server_ola}
              </osds-text>
            </div>
            {this.networkingInfos?.interfaces.length === 1 ? (
              <div>
                <osds-text
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.default}
                >
                  {this.localeStrings?.server_ola_mode_vrack_aggregation}
                </osds-text>
              </div>
            ) : (
              <div>
                <osds-text
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.default}
                >
                  {this.localeStrings?.server_ola_active}
                </osds-text>
              </div>
            )}
          </span>
          <div>
            <osds-button
              slot="menu-title"
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
              circle
            >
              <osds-icon
                name={ODS_ICON_NAME.ELLIPSIS}
                size={ODS_ICON_SIZE.xs}
              ></osds-icon>
            </osds-button>
          </div>
        </div>
        <osds-divider separator />
      </Host>
    );
  }
}
