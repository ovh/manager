/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, h, Host, Prop, State } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { apiClient } from '@ovh-ux/manager-core-api';

import { Translations } from '../msc-network-types';

export interface IMscNetworkVrack {
  localeStrings: Translations;
  ipName: string;
  serviceName: string;
}

@Component({
  tag: 'msc-network-vrack',
  styleUrl: 'msc-network-components.scss',
  shadow: true,
})
export class MscNetworkVrack implements IMscNetworkVrack {
  @Prop() localeStrings: Translations;

  @Prop() public serviceName = '';

  @Prop() ipName = '';

  @State() private vrackInfos: string[];

  @State() private ipLoadbalancingList: string[];

  @State() private ipsList: string[];

  @State() private ipFOState: string = '';

  async componentWillLoad() {
    try {
      await this.fetchVrackAndIps();
      await this.fetchIpLoadbalancing();
      await this.fetchIpDetails();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private async fetchVrackAndIps() {
    const [vrackResponse, ipsListResponse] = await Promise.all([
      apiClient.v6.get(`/dedicated/server/${this.serviceName}/vrack`),
      apiClient.v6.get(`/dedicated/server/${this.serviceName}/ips`),
    ]);

    this.vrackInfos = vrackResponse.data;
    this.ipsList = ipsListResponse.data;

    if (!this.ipsList) {
      console.error('this.ipsList is null or undefined');
    }
  }

  private async fetchIpLoadbalancing() {
    if (this.vrackInfos) {
      const ipLoadbalancingResponse = await apiClient.v6.get(
        `/vrack/${this.vrackInfos}/ipLoadbalancing`,
      );
      this.ipLoadbalancingList = ipLoadbalancingResponse.data;
    }
  }

  private async fetchIpDetails() {
    for (const ipName of this.ipsList || []) {
      try {
        const response = await apiClient.v6.get(`/ip/${ipName}`);
        const ipFOValue = response.data.ip;

        if (
          response.data.isAdditionalIp === true ||
          response.data.type === 'failover'
        ) {
          this.ipFOState = ipFOValue;
        }
      } catch (error) {
        console.error('Error fetching IP details:', error);
      }
    }
  }

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
                {this.localeStrings?.server_vrack}
              </osds-text>
            </div>
            <div>
              <osds-text
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                {this.vrackInfos && this.vrackInfos.length > 0
                  ? this.vrackInfos.map((info) => <div key={info}>{info}</div>)
                  : this.localeStrings?.server_vrack_none}
              </osds-text>
            </div>
          </span>
        </div>
        <osds-divider separator />
        {this.ipFOState && (
          <msc-network-clipboard
            clipBoardText="IPFO"
            clipBoardValue={this.ipFOState}
            localeStrings={this.localeStrings}
          />
        )}

        <div>
          <msc-network-loadbalancer
            ipLoadbalancingList={this.ipLoadbalancingList}
            localeStrings={this.localeStrings}
            serviceName={this.serviceName}
          />
        </div>
      </Host>
    );
  }
}
