/* eslint-disable import/prefer-default-export */
import { Component, h, State, Host, Element } from '@stencil/core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { OdsButtonVariant, OdsButtonType } from '@ovhcloud/ods-core';
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
            type={OdsButtonType.button}
            variant={OdsButtonVariant.stroked}
            color={OdsThemeColorIntent.primary}
            circle
          >
            <osds-icon
              name="ellipsis"
              size="xs"
              color={OdsThemeColorIntent.primary}
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
