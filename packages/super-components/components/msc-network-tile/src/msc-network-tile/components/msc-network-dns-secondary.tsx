import { Component, h, Host, Prop } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';

import { Translations } from '../msc-network-types';

export interface IMscDbsSecondary {
  localeStrings: Translations;
  secondaryDomainInfos?: string[];
}

@Component({
  tag: 'msc-network-dns-secondary',
  styleUrl: 'msc-network-components.scss',
  shadow: true,
})
export class MscNetworkDnsSecondary implements IMscDbsSecondary {
  @Prop() localeStrings: Translations;

  @Prop() secondaryDomainInfos?: string[];

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
                {this.localeStrings?.server_tab_dns}
              </osds-text>
            </div>
            <div>
              {this.secondaryDomainInfos && this.secondaryDomainInfos.length > 0
                ? this.renderDomains()
                : this.renderEmptyMessage()}
            </div>
          </span>
        </div>
        <osds-divider separator />
      </Host>
    );
  }

  private renderDomains() {
    return (
      <osds-text
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.default}
      >
        {this.secondaryDomainInfos?.map((domain) => (
          <div key={domain}>{domain}</div>
        ))}
      </osds-text>
    );
  }

  private renderEmptyMessage() {
    return (
      <osds-text
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.default}
      >
        {this.localeStrings.server_configuration_secondary_dns_empty}
      </osds-text>
    );
  }
}
