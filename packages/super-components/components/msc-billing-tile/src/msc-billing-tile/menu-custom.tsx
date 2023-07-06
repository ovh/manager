import { Component, h, State, Host } from '@stencil/core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { OdsButtonVariant, OdsButtonType } from '@ovhcloud/ods-core';

export interface IMenuCustom {
  showTooltip: boolean;
}

@Component({
  tag: 'menu-custom',
  styleUrl: 'menu-custom.scss',
  shadow: true,
})
export class MenuCustom implements IMenuCustom {
  @State() showTooltip = false;

  private toggleTooltip(event: Event) {
    event.stopPropagation();
    this.showTooltip = !this.showTooltip;
  }

  render() {
    return (
      <Host>
        <div class="menu-button">
          <osds-button
            onClick={(event: Event) => this.toggleTooltip(event)}
            type={OdsButtonType.button}
            variant={OdsButtonVariant.stroked}
            color={OdsThemeColorIntent.primary}
            circle
          >
            <osds-icon
              name="ellipsis-vertical"
              size="xs"
              color={OdsThemeColorIntent.primary}
            />
          </osds-button>
          {this.showTooltip && (
            <div class="tooltip">
              <div class="tooltiptext">
                <slot />
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
