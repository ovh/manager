# ng-ovh-timeline

> An Angular.js directive that generates a responsive, data-driven vertical timeline to tell a story, show history or describe a sequence of events.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-timeline)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-timeline) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-timeline)](https://npmjs.com/package/@ovh-ux/ng-ovh-timeline) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-timeline)](https://npmjs.com/package/@ovh-ux/ng-ovh-timeline?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-timeline)](https://npmjs.com/package/@ovh-ux/ng-ovh-timeline?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-timeline
```

## Usage

```js
import angular from 'angular';
import ngOvhTimeline from '@ovh-ux/ng-ovh-timeline';

angular.module('myApp', [ngOvhTimeline]);
```

To define a timeline, do the following (either manually or using ng-repeat on a dataset.

```javascript
// in controller
$scope.events = [
  {
    badgeClass: 'info',
    badgeIconClass: 'glyphicon-check',
    title: 'First heading',
    content: 'Some awesome content.,',
  },
  {
    badgeClass: 'warning',
    badgeIconClass: 'glyphicon-credit-card',
    title: 'Second heading',
    content: 'More awesome content.,',
  },
];
```

```html
  <!-- view -->
  <timeline-event ng-repeat="event in events">
    <timeline-badge class="{{event.badgeClass}}">
      <i class="glyphicon {{event.badgeIconClass}}"></i>
    </timeline-badge>
    <timeline-panel class="{{event.badgeClass}}">
      <timeline-heading>
        <h4>{{event.title}}</h4>
      </timeline-heading>
      <p>{{event.content}}</p>
    </timeline-panel>
  </timeline-event>
```
There is a bit of markup here but `<timeline-heading>` is optional.
`<timeline-badge>` is for the centre line between the two sides, and should represent the event type that occured.

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
