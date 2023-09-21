/* eslint-disable import/prefer-default-export */
import { Component, h, State, Host, Element } from '@stencil/core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
} from '@ovhcloud/ods-components/button';
import { HTMLStencilElement } from '@stencil/core/internal';

/**
 * TODO: To replace with osds-menu when available
 */
@Component({
  tag: 'menu-custom',
  styleUrl: 'menu-custom.scss',
  shadow: true,
})
export class MenuCustom {
  @Element() host!: HTMLStencilElement;

  @State() showTooltip = false;

  openMenu = (event: MouseEvent) => {
    if (!this.showTooltip) {
      this.showTooltip = true;
      setTimeout(() => document.addEventListener('click', this.closeMenu));
    } else {
      this.closeMenu(event);
    }
  };

  closeMenu = (event: MouseEvent) => {
    if (
      !this.host.shadowRoot
        ?.querySelector('.tooltip')
        ?.contains(event.target as Node)
    ) {
      this.showTooltip = false;
      document.removeEventListener('click', this.closeMenu);
    }
  };

  render() {
    return (
      <Host>
        <div class="menu">
          <osds-button
            onClick={this.openMenu}
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            circle
          >
            <osds-icon
              name="ellipsis"
              size="xs"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </osds-button>
          <div class={`tooltip${this.showTooltip ? ' visible' : ''}`}>
            <div class="triangle" />
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
