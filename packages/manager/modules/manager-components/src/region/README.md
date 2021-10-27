# ovh-manager-region-selector

The `ovh-manager-region-selector` component provides a quick way to create a region selector according to OVHcloud regions

## Installation

```js
import 'angular';
import { region } from '@ovh-ux/manager-components';

angular.module('myModule', [region]);
```

## Attributes

| Attribute         | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----              | ----            | ----    | ----             | ----                      | ----       | ----
| `regions`         | array           | <       | yes              | n/a                        | n/a       | The list of available regions
| `model`           | string          | =       | no               | n/a                        | n/a       | Model region


## Basic Usage
Below is the simplest form of using this component, where all the attributes are supplied

```html
<ovh-manager-region-selector
    regions="['RBX', 'LIM']"
    model="$ctrl.selectedRegion"
>
</ovh-manager-region-selector>
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
