# @ovhcloud/msc-tile

> ODS Tile with custom content

[![npm version](https://badgen.net/npm/v/@ovhcloud/msc-tile)](https://www.npmjs.com/package/@ovhcloud/msc-tile) [![Downloads](https://badgen.net/npm/dt/@ovhcloud/msc-tile)](https://npmjs.com/package/@ovhcloud/msc-tile) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/super-components/components/msc-tile)](https://npmjs.com/package/@ovhcloud/msc-tile) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/super-components/components/msc-tile)](https://npmjs.com/package/@ovhcloud/msc-tile?activeTab=dependencies)

## Install

```sh
yarn add @ovhcloud/msc-tile
```

## Usage

```tsx
import { Component, Prop, h, Element, Host } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';

@Component({
  tag: 'example',
  styleUrl: 'example.scss',
  shadow: true,
})
export class Example {
  @Element() host!: HTMLStencilElement;

  render() {
    return (
      <Host>
        <msc-tile
          tile-type="Catégorie"
          tile-title="Titre du produit"
          tile-description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
          href="https://ovh.com"
          img-src="https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png"
          img-alt=""
          see-more-label="En savoir plus"
          data-tracking="home:dashboard:product"
        >
          <span slot="badges">
            <osds-chip color="primary" size="sm" inline>OVHcloud</osds-chip>
            <osds-chip color="success" size="sm" inline>Beta</osds-chip>
          </span>
          <div slot="footer">
            <osds-button color="primary" style="margin-top: 1.5rem" tabindex="0">
              Commander
            </osds-button>
          </div>
        </msc-tile>
      </Host>
    );
  }
}
```

## Test

```sh
yarn msc:test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
