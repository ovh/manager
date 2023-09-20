# @ovhcloud/msc-tail-logs

> Display server or database logs

[![npm version](https://badgen.net/npm/v/@ovhcloud/msc-tail-logs)](https://www.npmjs.com/package/@ovhcloud/msc-tail-logs) [![Downloads](https://badgen.net/npm/dt/@ovhcloud/msc-tail-logs)](https://npmjs.com/package/@ovhcloud/msc-tail-logs) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/super-components/component/msc-tail-logs)](https://npmjs.com/package/@ovhcloud/msc-tail-logs) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/super-components/component/)](https://npmjs.com/package/@ovhcloud/msc-tail-logs?activeTab=dependencies)

## Install

```sh
yarn add @ovhcloud/msc-tail-logs
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
        <msc-tail-logs
          apiVersion="v6"
          source="some/server/url"
          limit="200"
          sort="desc"
          refresh-interval="30000"
          locale="fr-FR"
          auto-refresh
        ></msc-tail-logs>
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
