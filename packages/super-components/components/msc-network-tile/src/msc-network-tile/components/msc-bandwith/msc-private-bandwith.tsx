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

export interface IMscPrivateBandwith {
  localeStrings: Translations;
  serverDetails: ServerDetails;
  networkInfos: NetworkInfos;
}
@Component({
  tag: 'msc-private-bandwith',
  styleUrl: '../msc-network-components.scss',
  shadow: true,
})
export class MscPrivateBandwith implements IMscPrivateBandwith {
  @Prop() localeStrings: Translations;

  @Prop() serverDetails: ServerDetails;

  @Prop() networkInfos: NetworkInfos;

  public render() {
    return (
      <Host>
        <div>
          <osds-text
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {this.localeStrings?.server_bandwidth_vrack}
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
                {convertMbpsToGbps(this.networkInfos.bandwidth.OvhToOvh.value)}{' '}
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
                {convertMbpsToGbps(this.networkInfos.bandwidth.OvhToOvh.value)}{' '}
                {this.localeStrings?.unit_size_Gbps}{' '}
                {this.localeStrings?.server_bandwidth_incoming}
              </osds-text>
            </span>
          </div>
          {this.serverDetails?.canOrderVrackBandwith && (
            <osds-button
              flex
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <span slot="start">
                {
                  this.localeStrings
                    ?.dedicated_server_bandwidth_vrack_order_button
                }
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
