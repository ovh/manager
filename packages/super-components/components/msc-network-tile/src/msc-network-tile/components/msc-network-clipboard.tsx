import { Component, h, Prop, Host } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components/button';
import { Translations } from '../msc-network-types';

import { NetworkTileURLs } from '../urls';

export interface IMscClipBoard {
  localeStrings: Translations;
  urls?: NetworkTileURLs;
  clipBoardText: string;
  clipBoardValue: string;
}

@Component({
  tag: 'msc-network-clipboard',
  styleUrl: 'msc-network-components.scss',
  shadow: true,
})
export class MscNetworkClipboard implements IMscClipBoard {
  @Prop() localeStrings: Translations;

  @Prop() clipBoardText = '';

  @Prop() clipBoardValue = '';

  @Prop() urls?: NetworkTileURLs;

  private generateContent() {
    const isIpv4 =
      this.clipBoardText === this.localeStrings.server_configuration_ipv4;
    const isReverse =
      this.clipBoardText === this.localeStrings.server_configuration_reverse;

    let content = null;

    if (isIpv4) {
      content = (
        <osds-menu class="button-clipboard">
          <osds-button
            circle
            slot="menu-title"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
          >
            <osds-icon
              name={ODS_ICON_NAME.ELLIPSIS}
              size={ODS_ICON_SIZE.xs}
            ></osds-icon>
          </osds-button>
          <osds-menu-item>
            <osds-button
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              text-align={ODS_BUTTON_TEXT_ALIGN.start}
              flex=""
              href={this.urls?.ipUrl}
            >
              {this.localeStrings?.server_configuration_ipv4_manage}
            </osds-button>
          </osds-menu-item>
        </osds-menu>
      );
    } else if (isReverse) {
      content = (
        <osds-menu class="button-clipboard">
          <osds-button
            circle
            slot="menu-title"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
          >
            <osds-icon
              name={ODS_ICON_NAME.ELLIPSIS}
              size={ODS_ICON_SIZE.xs}
            ></osds-icon>
          </osds-button>
          <osds-menu-item>
            <osds-button
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              text-align={ODS_BUTTON_TEXT_ALIGN.start}
              flex
              href={this.urls?.updateReverseDns}
            >
              {this.localeStrings?.server_configuration_reverse_edit_button}
            </osds-button>
          </osds-menu-item>
          <osds-menu-item>
            <osds-button
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              text-align={ODS_BUTTON_TEXT_ALIGN.start}
              flex
              href={this.urls?.deleteReverseDns}
            >
              {this.localeStrings?.common_delete}
            </osds-button>
          </osds-menu-item>
        </osds-menu>
      );
    }

    return content;
  }

  public render() {
    const content = this.generateContent();

    return (
      <Host>
        <div>
          <osds-text
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {this.clipBoardText}
          </osds-text>
          <div class="contentClipboard">
            <osds-clipboard
              class="clipboard"
              value={this.clipBoardValue}
            ></osds-clipboard>
            {content}
          </div>
          <osds-divider separator />
        </div>
      </Host>
    );
  }
}
