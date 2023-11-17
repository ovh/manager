/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Component, h, Prop, State, Host } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import apiClient from '@ovh-ux/manager-core-api';

import { Translations, NatIpInfos } from '../msc-network-types';

export interface IMscNetworkLoadbalancer {
  localeStrings: Translations;
  ipLoadbalancingList: string[];
  ipName: string;
  serviceName: string;
}

@Component({
  tag: 'msc-network-loadbalancer',
  styleUrl: 'msc-network-components.scss',
  shadow: true,
})
export class MscNetworkLoadbalancer implements IMscNetworkLoadbalancer {
  @Prop() localeStrings: Translations;

  @Prop() public serviceName = '';

  @Prop() public ipLoadbalancingList: string[] = [];

  @Prop() ipName = '';

  @State() private natIpInfos?: NatIpInfos;

  async componentWillLoad() {
    try {
      await this.fetchNatIpInfos();
    } catch (error) {
      this.handleError(error, 'Error fetching data:');
    }
  }

  private async fetchNatIpInfos() {
    for (const ipLoadBalancingName of this.ipLoadbalancingList || []) {
      try {
        const response = await apiClient.v6.get(
          `/ipLoadBalancing/${ipLoadBalancingName}`,
        );
        this.natIpInfos = response.data;
      } catch (error) {
        this.handleError(error, 'Error fetching iploadbalanclist');
      }
    }
  }

  private handleError(error: any, message: string) {
    console.error(message, error);
  }

  private renderIpLoadbalancingList() {
    return (
      <div>
        {this.ipLoadbalancingList.map((ip) => (
          <div key={ip}>
            <osds-link color={ODS_THEME_COLOR_INTENT.primary}>{ip}</osds-link>
          </div>
        ))}
      </div>
    );
  }

  private renderNatIpInfos() {
    return (
      <div>
        <div>
          <osds-text
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {this.localeStrings?.iplb_home_tile_infos_ip_outbound}
          </osds-text>
        </div>
        <div>
          <osds-text
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {this.natIpInfos?.ip[0]}
          </osds-text>
        </div>
      </div>
    );
  }

  public render() {
    return (
      <Host>
        {this.ipLoadbalancingList && this.ipLoadbalancingList.length > 0 && (
          <div class="iploadbalancerBlock">
            <div>
              <div>
                <osds-text
                  level={ODS_TEXT_LEVEL.heading}
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {this.localeStrings?.iplb_title}
                </osds-text>
              </div>
              {this.renderIpLoadbalancingList()}
            </div>
            <osds-divider separator />
            <div>
              <span>{this.natIpInfos?.ip[0] && this.renderNatIpInfos()}</span>
            </div>
          </div>
        )}
        <osds-divider separator />
      </Host>
    );
  }
}
