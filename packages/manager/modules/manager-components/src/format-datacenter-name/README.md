# ovh-manager-format-fatacenter-name

The `ovh-manager-format-fatacenter-name` component formats and displays human redable DC name.

## Installation

```js
import 'angular';
import {
  managerFormatDatacenterName,
 } from '@ovh-ux/manager-components';

angular.module('myModule', [managerFormatDatacenterName]);
```

## Attributes

| Attribute         | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----              | ----            | ----    | ----             | ----                      | ----       | ----
| `name`            | string          | @       | no              | n/a                       | n/a        | DC name

## Basic Usage

```html

 <manager-format-fatacenter-name
    name="GRA1">
 </manager-format-fatacenter-name>
 <!-- formats to 'Gravelines (GRA1) - France' -->
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
