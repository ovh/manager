# ng-ovh-checkbox-table

> Multi checkbox management for table

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-checkbox-table)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-checkbox-table) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-checkbox-table)](https://npmjs.com/package/@ovh-ux/ng-ovh-checkbox-table) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-checkbox-table)](https://npmjs.com/package/@ovh-ux/ng-ovh-checkbox-table?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-checkbox-table)](https://npmjs.com/package/@ovh-ux/ng-ovh-checkbox-table?activeTab=dependencies)

## Install

```sh
$ pnpm add @ovh-ux/ng-ovh-checkbox-table
```

## Usage

```js
import angular from 'angular';
import ngOvhCheckboxTable from '@ovh-ux/ng-ovh-checkbox-table';

angular.module('myApp', [ngOvhCheckboxTable]);
```

```html
<table class="table table-pretty table-hover table-striped">
  <thead>
    <tr>
      <th class="text-center" style="width: 35px;">
        <input
          type="checkbox"
          data-ovh-checkbox-table
          data-ovh-checkbox-table-ids-all="table.myAllIds_canBeFiltered"
          data-ovh-checkbox-table-ids-page="table.myIdsOnCurrentPage"
          data-ovh-checkbox-table-ids-selected="table.myIdsSelectedByCheckbox"
          data-ovh-checkbox-table-id="id"
        />
      </th>
      <th>name</th>
    </tr>
  </thead>
  <tbody data-ng-hide="table.myAllIds_CAN_NOT_BE_Filtered">
    <tr data-ng-repeat="myData in table.myIdsOnCurrentPage">
      <td>
        <input
          type="checkbox"
          data-ng-model="table.myIdsSelectedByCheckbox[myData.id]"
          name="{{::'prefix_' + myData.id}}"
          id="{{::'prefix_' + myData.id}}"
        />
      </td>
      <td data-title="name" class="word-break">
        <label for="{{::'prefix_' + myData.id}}" data-ng-bind="::myData.name">
        </label>
      </td>
    </tr>
  </tbody>
</table>
```

## Test

```sh
$ pnpm test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
