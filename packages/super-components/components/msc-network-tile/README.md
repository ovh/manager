# @ovhcloud/msc-network-tile

> Component for network services

[![npm version](https://badgen.net/npm/v/@ovhcloud/msc-network-tile)](https://www.npmjs.com/package/@ovhcloud/msc-network-tile) [![Downloads](https://badgen.net/npm/dt/@ovhcloud/msc-network-tile)](https://npmjs.com/package/@ovhcloud/msc-network-tile) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/super-components/component/msc-network-tile)](https://npmjs.com/package/@ovhcloud/msc-network-tile) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/super-components/component/)](https://npmjs.com/package/@ovhcloud/msc-network-tile?activeTab=dependencies)

## Install

```sh
yarn add @ovhcloud/msc-network-tile
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
        <msc-network-tile
          locale="fr-FR"
          service-name="ns111111.ovh.net"
        ></msc-network-tile>
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
