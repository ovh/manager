# ovh-manager-edit-name

The `ovh-manager-edit-name` component provides a reusable interface to update service name.

## Installation

```js
import 'angular';
import {
  managerEditName,
 } from '@ovh-ux/manager-components';

angular.module('myModule', [managerEditName]);
```

## Attributes

| Attribute         | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----              | ----            | ----    | ----             | ----                      | ----       | ----
| `name`            | string          | @       | no              | n/a                       | n/a        | current name
| `serviceId`      | string          | @?      | no              | n/a                       | n/a        | serviceId of the current service, obtained from serviceInfo API)
| `serviceInfoApiUrl`       | string          | @?      | no              | n/a  | n/a  | url to fetch serviceId if not provided
| `urlParams`       | Object          | <?      | no              | n/a  | n/a  | parameters for the url provided
| `onSuccess`       | function          | &?      | no              | n/a  | n/a  | on success handler
| `onError`       | function          | &?      | no              | n/a  | n/a  | on error handler
| `onCancel`       | function          | &?      | no              | n/a  | n/a  | on cancel handler

## Basic Usage
Below is the simplest form of using this component,

```html

 <manager-edit-name
  service-info-api-url="/dedicated/server/:serviceName/serviceInfos"
  url-params="{ serviceName: 'service-name' }"
  on-success="$ctrl.handleSuccess(res)"
  on-error="$ctrl.handleError(error)"
  on-cancel="$ctrl.handleCancel()">
 </manager-edit-name>
  or
 <manager-edit-name
  service-id="service-id"
  on-success="$ctrl.handleSuccess(res)"
  on-error="$ctrl.handleError(error)"
  on-cancel="$ctrl.handleCancel()">
 </manager-edit-name>
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
