# ovh-manager-billing-resiliate-modal

The `ovh-manager-billing-resiliate-modal` component provides a modal to handle service resiliation with different options (immediate or delayed resiliation)

## Installation

```js
import 'angular';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

angular.module('myModule', [ovhManagerBillingComponents]);
```

## Attributes

| Attribute                  | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----                       | ----            | ----    | ----             | ----                      | ----       | ----
| `capabilities`             | string[]        | <       | no               | services.expanded.Lifecycle.Capacities ('deleteAtExpiration', 'terminate', 'terminateAtEngagementDate', 'terminateAtExpirationDate')                       | n/a        | The possible ways to resiliate the service (should be coming from /services/{serviceId})
| `go-back`                  | string          | <       | no              | n/a                        | n/a        | A function to close the modal (being able to use it as a route component or a component in a page you can switch a boolean to hide the modal or navigate to a parent state)
| `on-success`               | string          | <       | no              | n/a                        | n/a        | A function to execute when the resiliation is successful, it takes a string parameter (success message) 
| `on-error`                 | string          | <       | no              | n/a                        | n/a        | A function to execute when the resiliation failed, it takes a string parameter (error message)
| `service`                  | string          | <       | no              | n/a                        | n/a        | A billing service (from @ovh-ux/manager-models) representing the service to be resiliated
| `service-type-label`       | string          | <       | no              | n/a                        | n/a        | The type of service used to display the modal title ("Cancel <service-type-label>")

## Usage (as a component in a page)
Below is an example of how to use this component from a page template

```html
<ovh-manager-billing-resiliate-modal
    capabilities="$ctrl.capabilities"
    go-back="$ctrl.goBack"
    on-success="$ctrl.onResiliateSuccess"
    on-error="$ctrl.onResiliateError"
    service="$ctrl.myService"
    service-type-label="my dedicated server"
>
</ovh-manager-billing-resiliate-modal>
```

## Usage (as a route component)
Below is an example of how to use this component directly from a state

```javascript
$stateProvider.state('resiliationState', {
  url: '/resiliate',
  views: {
    modal: {
      component: 'ovhManagerBillingResiliateModal',
    },
  },
  layout: 'modal',
  resolve: {
    capabilities: () => ['terminate', 'terminateAtExpirationDate'],
    goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    onSuccess: /* @ngInject */ (Alerter, goBack) => (message) =>
      goBack().then(() => {
        Alerter.success(message);
      }),
    onError: /* @ngInject */ (Alerter, goBack) => (message) =>
      goBack().then(() => {
        Alerter.error(message);
      }),
    service: /* @ngInject */ ($http, serviceId) =>
      $http
        .get(`/services/${serviceId}`)
        .then((service) => new BillingService(service)),
    serviceTypeLabel: /* @ngInject */ ($translate, service) =>
      $translate.instant(service.serviceType),
  },
});
```

## Transclude "additional description"
In case you want to add specific text after the standard explanation, you can use the <modal-additional-description> transclude element to display anything.

```html
<ovh-manager-billing-resiliate-modal
    capabilities="$ctrl.capabilities"
    go-back="$ctrl.goBack"
    on-success="$ctrl.onResiliateSuccess"
    on-error="$ctrl.onResiliateError"
    service="$ctrl.myService"
    service-type-label="my dedicated server"
>
    <modal-additional-description>
        <p>My awesome additional information</p>
        <strong>with custom elements if needed</strong>
    </modal-additional-description>
</ovh-manager-resource-selector>
```

## Transclude "option fallback"
If you are using the `/services/{serviceId}` to retrieve the capabilities for the service resiliation, you may end up without capabilities, if you want to handle such case you can use the `<modal-option-fallback>` transclude element to display anything. 

```html
<ovh-manager-billing-resiliate-modal
    capabilities="$ctrl.capabilities"
    go-back="$ctrl.goBack"
    on-success="$ctrl.onResiliateSuccess"
    on-error="$ctrl.onResiliateError"
    service="$ctrl.myService"
    service-type-label="my dedicated server"
>
    <modal-option-fallback>
        <p>This service can not be resiliated currently</p>
    </modal-option-fallback>
</ovh-manager-resource-selector>
```

## Transclude "message"
If you want to display even more additional information (specially a banner, like we have for VPS outperform) you can use `<modal-message>` to add custom content between the options and the buttons

```html
<ovh-manager-billing-resiliate-modal
    capabilities="$ctrl.capabilities"
    go-back="$ctrl.goBack"
    on-success="$ctrl.onResiliateSuccess"
    on-error="$ctrl.onResiliateError"
    service="$ctrl.myService"
    service-type-label="my dedicated server"
>
    <modal-message>
        <oui-message>Instead of resiliating your service, here's a promotion</p>
    </modal-message>
</ovh-manager-resource-selector>
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
