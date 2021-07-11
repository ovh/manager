# ovh-manager-resource-selector

The `ovh-manager-resource-selector` component provides a quick way to create a horizontal tile, with the price and additional controls included. This is usually used, but not limited to, for resource selection and hence the name.

## Installation

```js
import 'angular';
import {
  managerResourceSelector,
} from '@ovh-ux/manager-components';

angular.module('myModule', [resourceSelector]);
```

## Attributes

| Attribute         | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----              | ----            | ----    | ----             | ----                      | ----       | ----
| `price`            | string          | @       | no              | n/a                       | n/a        | The price to be shown
| `price-suffix`      | string          | @?      | no              | n/a                       | n/a        | This is a suffix that gets added to the price (in the next line)
| `title`       | string          | @?      | no              | n/a  | n/a  | The title for the resource selector tile

## Basic Usage
Below is the simplest form of using this component, where all the attributes are supplied

```html
<ovh-manager-resource-selector
    price="100 €"
    price-suffix="/month"
    title="My title"
>
</ovh-manager-resource-selector>
```

## Transclude price
Sometimes, you might need to format the price differently, or might need to customise it further. In this case, the `ovh-manager-resource-selector` component supports a named transclude `resourceSelectorPrice`. When this named transclude is used, it overrides the `price` and the `price-suffix` attributes, which are no longer required. Below is an example usage

```html
<ovh-manager-resource-selector
    title="My title"
>
    <resource-selector-price>
        <p>$100/Month/Resource</p>
        <p>Only</p>
    </resource-selector-price>
</ovh-manager-resource-selector>
```

## Default Transclude
The component also supports a default transclude. This content gets transcluded to the right of the price slot.

```html
<ovh-manager-resource-selector
    title="My title"
>
    <resource-selector-price>
        <p>$100/Month/Resource</p>
        <p>Only</p>
    </resource-selector-price>
    <div>
        <p>Default transclude content here</p>
    </div>
</ovh-manager-resource-selector>
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
