# @ovhcloud/msc-utils

> Some helper functions for manager super-components

[![npm version](https://badgen.net/npm/v/@ovhcloud/msc-utils)](https://www.npmjs.com/package/@ovhcloud/msc-utils) [![Downloads](https://badgen.net/npm/dt/@ovhcloud/msc-utils)](https://npmjs.com/package/@ovhcloud/msc-utils) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/super-components/utils)](https://npmjs.com/package/@ovhcloud/msc-utils) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/super-components/utils)](https://npmjs.com/package/@ovhcloud/msc-utils?activeTab=dependencies)

## Install

```sh
yarn add @ovhcloud/msc-utils
```

## Usage

```ts
import { formatDate } from '@ovhcloud/msc-utils';

const date = formatDate(new Date(), 'en-GB');
console.log(date);
```

## Test

```sh
yarn msc:test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
