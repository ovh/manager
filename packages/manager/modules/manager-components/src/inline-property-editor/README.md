# ovh-manager-inline-property-editor
The `ovh-manager-inline-property-editor` component provides a quick way to create an inline editor for a given property.

## Installation

```js
import 'angular';
import { inlinePropertyEditor } from '@ovh-ux/manager-components';

angular.module('myModule', [inlinePropertyEditor]);
```

## Attributes

| Attribute         | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----              | ----            | ----    | ----             | ----                      | ----       | ----
| `property`        | string          | @       | yes              | n/a                       | n/a        | Name of the property
| `model`           | any             | =       | no               | n/a                       | n/a        | Property value to edit
| `on-submit`       | callback        | &       | no               | n/a                       | n/a        | Action triggered when editing is submitted 

## Basic Usage
Below is the simplest form of using this component, where all the attributes are supplied

```html
<ovh-manager-inline-property-editor
    property="name"
    model="$ctrl.myName"
    on-submit="$ctrl.updateName()"
>
</ovh-manager-inline-property-editor>
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
