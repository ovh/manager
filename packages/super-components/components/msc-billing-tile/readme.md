# @ovhcloud/msc-billing-tile

> Component that displays the billing informations of a service

[![npm version](https://badgen.net/npm/v/@ovhcloud/msc-billing-tile)](https://www.npmjs.com/package/@ovhcloud/msc-billing-tile) [![Downloads](https://badgen.net/npm/dt/@ovhcloud/msc-billing-tile)](https://npmjs.com/package/@ovhcloud/msc-billing-tile) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/super-components/components/msc-billing-tile)](https://npmjs.com/package/@ovhcloud/msc-billing-tile) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/super-components/components/msc-billing-tile)](https://npmjs.com/package/@ovhcloud/msc-billing-tile?activeTab=dependencies)

## Install

```sh
yarn add @ovhcloud/msc-billing-tile
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
        <msc-billing-tile
          service-path="vps/vps-33333333.vps.ovh.net"
          language="en-GB">
        </msc-billing-tile>
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
