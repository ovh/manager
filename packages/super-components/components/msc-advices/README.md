# @ovhcloud/msc-advices

> The Manager Advices Tile is a generic super component designed to recommend cross-sell offers to the user, aiming to enhance their product experience.

[![npm version](https://badgen.net/npm/v/@ovhcloud/msc-advices)](https://www.npmjs.com/package/@ovhcloud/msc-advices) [![Downloads](https://badgen.net/npm/dt/@ovhcloud/msc-advices)](https://npmjs.com/package/@ovhcloud/msc-advices) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/super-components/component/msc-advices)](https://npmjs.com/package/@ovhcloud/msc-advices) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/super-components/component/)](https://npmjs.com/package/@ovhcloud/msc-advices?activeTab=dependencies)

## Install

```sh
yarn add @ovhcloud/msc-advices
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

  @Prop() public content = '';

  render() {
    return (
      <Host>
        <msc-advices service-type="domain-web" service-name="abcd1234.fr">
        </msc-advices>
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
