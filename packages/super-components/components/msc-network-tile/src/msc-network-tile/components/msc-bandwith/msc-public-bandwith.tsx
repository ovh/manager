import { Component, h, Host, Prop } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components/button';
import {
  Translations,
  ServerDetails,
  NetworkInfos,
} from '../../msc-network-types';

import { convertMbpsToGbps } from './msc-bandwith-utils';

export interface IMscPublicBandwith {
  localeStrings: Translations;
}

@Component({
  tag: 'msc-public-bandwith',
  styleUrl: '../msc-network-components.scss',
  shadow: true,
})
export class MscPublicBandwith implements IMscPublicBandwith {
  @Prop() localeStrings: Translations;

  @Prop() serverDetails: ServerDetails;

  @Prop() networkInfos: NetworkInfos;

  public render() {
    return (
      <Host>
        <div class="msc-public-bandwith">
          <osds-text
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {this.localeStrings?.server_bandwidth}
          </osds-text>
          <div class="row">
            <span class="column">
              <osds-icon
                name={ODS_ICON_NAME.ARROW_UP}
                size={ODS_ICON_SIZE.xs}
              ></osds-icon>
              <osds-text
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                {convertMbpsToGbps(
                  this.networkInfos.bandwidth.OvhToInternet.value,
                )}
                {this.localeStrings?.unit_size_Gbps}{' '}
                {this.localeStrings?.server_bandwidth_outgoing}
              </osds-text>
            </span>
            <span class="column">
              <osds-icon
                name={ODS_ICON_NAME.ARROW_DOWN}
                size={ODS_ICON_SIZE.xs}
              ></osds-icon>
              <osds-text
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                {convertMbpsToGbps(
                  this.networkInfos.bandwidth.InternetToOvh.value,
                )}
                {this.localeStrings?.unit_size_Gbps}{' '}
                {this.localeStrings?.server_bandwidth_incoming}
              </osds-text>
            </span>
          </div>
          {this.serverDetails?.canOrderBandwith && (
            <osds-button
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <span slot="start">
                {this.localeStrings?.dedicated_server_bandwidth_order_button}
              </span>
              <span slot="end">
                <osds-icon
                  name={ODS_ICON_NAME.CHEVRON_RIGHT}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                ></osds-icon>
              </span>
            </osds-button>
          )}
          <osds-divider separator />
        </div>
      </Host>
    );
  }
}
