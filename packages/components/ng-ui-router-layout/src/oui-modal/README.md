# `ouiModal` layout

> Allow to open a Ui-Router route directly in a `oui-modal`.

## Usage

After having installed the package and having injected the dependency in your AngularJS application (described in the main [README.md](../../README.md) file of the repository), you can use the `ouiModal` layout in 3 differents ways:

### With controller and template

```js
// routing.js
import controller from './controller';
import template from './template.html';

$stateProvider.state('state.name', {
  url: '/my-url',
  controller,
  template,
  layout: 'ouiModal',
  resolve: {
    redirectTo: () => 'an.other.state',
    heading: () => 'My state heading!',
    primaryLabel: () => 'Add',
    secondaryLabel: () => 'Cancel',
    // ...
  },
});
```

**`Note`**: You will have to inject the resolves into your controller to be abble to use them. e.g.:

```js
// controller.js
export default class Ctrl {
  /* @ngInject */
  constructor(heading, primaryLabel, secondaryLabel) {
    this.primaryLabel = primaryLabel;
    this.secondaryLabel = secondaryLabel;
  }
}
```

With that example, the state `state.name` will open a `ouiModal` with `My state heading!` as heading, `Add` as primary label and `Cancel` as secondary label.
Without the injections of the resolve, no modal options will be taken into account.

### With component

```js
// routing.js
$stateProvider.state('state.name', {
  url: '/my-url',
  layout: 'ouiModal',
  component: 'myAwesomeComponent',
  resolve: {
    redirectTo: () => 'an.other.state',
    heading: () => 'My state heading!',
    primaryLabel: () => 'Add',
    secondaryLabel: () => 'Cancel',
    // ...
    resolveData: () => 'I can be used in controller too!',
    model: () => ({
      addName: null,
    }),
  },
});
```

### With a componentProvider

```js
// routing.js
$stateProvider.state('state.name', {
  url: '/my-url',
  layout: 'ouiModal',
  componentProvider: (predicate) =>
    predicate
      ? 'awesomeModalForTruePredicate'
      : 'awesomeModalForFalsePredicate',
  resolve: {
    redirectTo: () => 'an.other.state',
    heading: () => 'My state heading!',
    primaryLabel: () => 'Add',
    secondaryLabel: () => 'Cancel',
    // ...
    resolveData: () => 'I can be used in controller too!',
    model: () => ({
      addName: 'A beautiful name',
    }),
  },
});
```

**`Note` for component and componentProvider**: `ouiModal` layout make bindings and resolve compatible with version >= 2.1.0 of angular-ui-bootstrap (see [angular-ui-bootstrap documentation](https://angular-ui.github.io/bootstrap/versioned-docs/2.1.0/#/modal)). So if you want to use any resolve defined in your state declaration, you will be able to access them through `resolve` object of your controller. This will be accessible from `$onInit` hook (not in controller constructor).

```js
// component.js
import template from './template.html';
import controller from './controller';

export default {
  name: 'myAwesomeComponent',
  template,
  controller,
  bindings: {
    resolve: '<',
  },
};
```

```js
// controller.js
export default class MyAwesomeComponentCtrl {
  $onInit() {
    console.log(this.resolve.resolveData);
    /**
     *  will output: I can be used in controller too!
     */
  }
}
```

```html
<!-- template.html -->
<div class="oui-modal-layout-route-content">
    <form name="my-form">
        <input name="addName" id="addName"
               data-ng-model="$ctrl.resolve.model.addName" />
    </form>
</div>
```

This will display `I can be used in controller too!` in the console and set `A beautiful name` as input value.

## Available options

### uibModal options

You can provide options to the uibModal opened at uiRoute's onEnter. For this you can provide, an object as layout options like:

```js
$stateProvider.state('state.name', {
  url: '/my-url',
  layout: {
    name: 'ouiModal',
    options: {
      backdrop: false,
      keyboard: false,
    },
  },
  component: 'myAwesomeComponent',
});
````

This will open a ouiModal without backdrop and with `ESC` key disabled. For available options, see the [uibModal options](https://angular-ui.github.io/bootstrap/versioned-docs/1.3.3/#/modal). Note that uiState's options like controller, controllerAs, etc... won't be taken in consideration in that object.

### ouiModal options

*For ouiModal options (all options except `redirectTo`), see the [oui-modal documentation](https://ovh.github.io/ovh-ui-kit/?path=/story/components-modal--simple) for more informations.*

All options can be provided through ui-state resolves.

| Name              | Type           | Description
| -----             |-----:          | ----
| redirectTo        | string         | The state name to be redirect in case of backdrop click or escape press. By default redirect to `^`
| heading           | string         | The modal title
| type              | string         | The modal type
| loading           | function       | Display a loader when evaluated to `true`
| primaryLabel      | string         | The modal's primary label
| primaryAction     | function       | The action to call when primary button is clicked
| primaryDisabled   | function       | Disable the primary button when evaluated to `true`
| secondaryLabel    | string         | The modal's secondary label
| secondaryAction   | function       | The action to call when secondary button is clicked
| secondaryDisabled | function       | Disable the secondary button when evaluated to `true`
| onDismiss         | function       | What to do when dismiss button is clicked - by default close the ouiModal and redirect to `redirectTo` provided options (`^` by default)
