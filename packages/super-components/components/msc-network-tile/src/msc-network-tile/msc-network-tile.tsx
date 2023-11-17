import { Component, Prop, h, Element, Host, State, Watch } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import {
  Locale,
  defaultLocale,
  Region,
  Subsidiary,
  defaultRegion,
  defaultSubsidiary,
} from '@ovhcloud/msc-utils';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { apiClient } from '@ovh-ux/manager-core-api';
import { getTranslations } from './translations';
import {
  Translations,
  ServerDetails,
  NetworkInfos,
  NetworkingInfos,
} from './msc-network-types';

import { NetworkTileURLs, getNetworkTileURLs } from './urls';

export interface IMscNetworkTile {
  servicePath: string;
  appPublicUrl: string;
  locale?: Locale;
  region?: Region;
  subsidiary?: Subsidiary;
  serviceName: string;
  secondaryDomainInfos?: string[];
}

@Component({
  tag: 'msc-network-tile',
  styleUrl: 'msc-network-tile.scss',
  shadow: true,
})
export class MscNetworkTile implements IMscNetworkTile {
  @Element() host!: HTMLStencilElement;

  @Prop() servicePath: string;

  @Prop() content = '';

  @Prop() serviceName = '';

  @Prop() public region = defaultRegion;

  @Prop() public subsidiary = defaultSubsidiary;

  @Prop() public appPublicUrl: string;

  @Prop() locale: Locale = defaultLocale;

  @Prop() secondaryDomainInfos?: string[];

  @State() private localeStrings?: Translations;

  @State() private serverDetails?: ServerDetails;

  @State() private networkInfos?: NetworkInfos;

  @State() private networkingInfos: NetworkingInfos;

  @State() urls?: NetworkTileURLs;

  @Watch('appPublicUrl')
  @Watch('serviceName')
  setURLs() {
    this.urls = getNetworkTileURLs({
      appPublicURL: this.appPublicUrl,
      serviceName: this.serviceName,
    });
  }

  @Watch('locale')
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }

  async componentWillLoad() {
    this.setURLs();
    this.updateTranslations();
    await this.fetchServerData();
  }

  async fetchServerData() {
    try {
      const [
        serverResponse,
        networkResponse,
        networkingResponse,
        secondaryDnsDomainsResponse,
      ] = await Promise.all([
        apiClient.aapi.get(`/sws/dedicated/server/${this.serviceName}`),
        apiClient.v6.get(
          `/dedicated/server/${this.serviceName}/specifications/network`,
        ),
        apiClient.v6.get(`/dedicated/server/${this.serviceName}/networking`),
        apiClient.v6.get(
          `/dedicated/server/${this.serviceName}/secondaryDnsDomains`,
        ),
      ]);

      this.serverDetails = serverResponse.data;
      this.networkInfos = networkResponse.data;
      this.networkingInfos = networkingResponse.data;
      this.secondaryDomainInfos = secondaryDnsDomainsResponse.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  render() {
    if (!this.localeStrings || !this.urls) {
      return (
        <osds-tile rounded inline>
          <osds-skeleton />
        </osds-tile>
      );
    }

    const clipBoardTextValues = [
      {
        key: 'server_configuration_ipv4',
        label: this.localeStrings.server_configuration_ipv4,
        value: this.networkInfos?.routing.ipv4.ip?.toString() ?? '',
      },
      {
        key: 'server_configuration_gateway_ipv4',
        label: this.localeStrings.server_configuration_gateway_ipv4,
        value: this.networkInfos?.routing.ipv4.gateway?.toString() ?? '',
      },
      {
        key: 'server_configuration_ipv6',
        label: this.localeStrings.server_configuration_ipv6,
        value: this.networkInfos?.routing.ipv6.ip?.toString() ?? '',
      },
      {
        key: 'server_configuration_gateway_ipv6',
        label: this.localeStrings.server_configuration_gateway_ipv6,
        value: this.networkInfos?.routing.ipv6.gateway?.toString() ?? '',
      },
      {
        key: 'server_configuration_reverse',
        label: this.localeStrings.server_configuration_reverse || '',
        value:
          this.serverDetails?.reverse ??
          this.localeStrings.server_configuration_reverse_not_configured,
      },
    ];

    const filteredClipBoardTextValues = clipBoardTextValues.filter(
      ({ value }) => value !== null && value !== '',
    );

    return (
      <Host>
        <div class="msc-network-tile-wrapper">
          <osds-tile rounded>
            <div class="network-tile-content">
              <osds-text
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._300}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {this.localeStrings.server_tab_stats_network}
              </osds-text>
              <osds-divider separator />
              {filteredClipBoardTextValues.map((clipboard) => (
                <msc-network-clipboard
                  key={clipboard.key}
                  clipBoardText={clipboard.label || clipboard.key}
                  clipBoardValue={clipboard.value}
                  localeStrings={this.localeStrings}
                  urls={this.urls}
                />
              ))}
              <msc-public-bandwith
                localeStrings={this.localeStrings}
                serverDetails={this.serverDetails}
                networkInfos={this.networkInfos}
              />
              <msc-private-bandwith
                localeStrings={this.localeStrings}
                serverDetails={this.serverDetails}
                networkInfos={this.networkInfos}
              />
              {this.networkInfos?.ola.available && (
                <msc-network-ola
                  networkingInfos={this.networkingInfos}
                  localeStrings={this.localeStrings}
                />
              )}

              <msc-network-vrack
                serviceName={this.serviceName}
                localeStrings={this.localeStrings}
              />
              <msc-network-dns-secondary
                localeStrings={this.localeStrings}
                secondaryDomainInfos={this.secondaryDomainInfos}
              />
            </div>
          </osds-tile>
        </div>
      </Host>
    );
  }
}
