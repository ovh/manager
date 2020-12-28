# ng-ovh-toaster

> A factory to create toast

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-toaster)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-toaster) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-toaster)](https://npmjs.com/package/@ovh-ux/ng-ovh-toaster) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-toaster)](https://npmjs.com/package/@ovh-ux/ng-ovh-toaster?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-toaster)](https://npmjs.com/package/@ovh-ux/ng-ovh-toaster?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

---

<div align="center">
:bookmark: `ovh-angular-toaster` is now deprecated. Please take a look at our <a href="https://github.com/ovh/ovh-ui-kit" target="_blank">OVH UI Kit - Master UI Framework</a>. You can find more details <a href="https://ovh.github.io/ovh-ui-kit/?path=/story/design-system-components-message-webcomponent--default" target="_blank">here</a>.
</div>

---

Toaster is a component to show an in-app notification, like a [toast](http://developer.android.com/guide/topics/ui/notifiers/toasts.html) for android applications.

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-toaster
```

## Usage

```js
import angular from 'angular';
import ngOvhToaster from '@ovh-ux/ng-ovh-toaster';

angular
  .module('myApp', [ngOvhToaster])
  .config(
    /* @ngInject */ (ToastProvider) => {
      // CSS classes
      ToastProvider.setExtraClasses(
        'messenger-fixed messenger-on-bottom messenger-on-right',
      );

      // Graphic theme
      ToastProvider.setTheme('air');

      // Set duration
      ToastProvider.setHideAfter(42);
    },
  )
  .controller(
    'MyController',
    class {
      /* @ngInject */
      constructor($timeout, Toast) {
        this.$timeout = $timeout;
        this.Toast = Toast;
      }

      $onInit() {
        // To add a notification, you had to inject Toast as dependency
        // and use it like this example inside a controller
        this.Toast.success('My Toast message');

        // Toast can by targetted with an ID. So, you can update a toast on-the-fly, like this:
        this.Toast.info('Loading...', {
          id: 42,
          hideAfter: false,
        });

        this.$timeout(function() {
          this.Toast.success('Done!', {
            id: 42,
          });
        }, 2000);

        // Also, a main Toast fct returns the instance of the Toast created.
        // Then you can play with it!
        const msg = this.Toast.info('Hello!', {
          hideAfter: false,
        });

        this.$timeout(function() {
          this.Toast.hide(msg);
          this.$timeout(function() {
            this.Toast.show(msg);
          }, 2000);
        }, 2000);
      }
    },
  );
```

## Related

- [Messenger](https://github.com/HubSpot/messenger)
- ngSanitize

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
