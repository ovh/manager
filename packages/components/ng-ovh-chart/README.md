# ng-ovh-chart

> ChartJS library wrapper for AngularJS.

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-chart
```

## Usage

```js
import angular from 'angular';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';

angular.module('myApp', [ngOvhChart]);
```

### Directive

_Example simple configuration_

```html
<div
  data-chart
  data-chartjs="$ctrl.chartJsConfig"
  data-auto-reload="true"
></div>
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
