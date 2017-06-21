# OVH checkbox table

![OVH components](githubBanner.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

[![NPM](https://nodei.co/npm/ovh-angular-checkbox-table.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-checkbox-table/)

## Example

```javascript
angular.module("app", ["ovh-checkbox-table"]);
```

```html
<table class="table table-pretty table-hover table-striped">
    <thead>
        <tr>
            <th class="text-center" style="width: 35px;">
                <input type="checkbox"
                    ovh-checkbox-table
                    ovh-checkbox-table-ids-all="table.myAllIds_canBeFiltered"
                    ovh-checkbox-table-ids-page="table.myIdsOnCurrentPage"
                    ovh-checkbox-table-ids-selected="table.myIdsSelectedByCheckbox"
                    ovh-checkbox-table-id="id" />
            </th>
            <th>
                name
            </th>
        </tr>
    </thead>
    <tbody data-ng-hide="table.myAllIds_CAN_NOT_BE_Filtered">
        <tr data-ng-repeat="myData in table.myIdsOnCurrentPage">
            <td>
                <input type="checkbox" data-ng-model="table.myIdsSelectedByCheckbox[myData.id]"
                    name="{{::'prefix_' + myData.id}}" id="{{::'prefix_' + myData.id}}">
            </td>
            <td data-title="name" class="word-break">
                <label for="{{::'prefix_' + myData.id}}"
                    data-ng-bind="::myData.name">
                </label>
            </td>
        </tr>
    </tbody>
</table>
```

## Installation

### Bower
```
bower install --save ovh-angular-checkbox-table
```

### NPM
```
npm install --save ovh-angular-checkbox-table
```

### Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-checkbox-table.git
    cd ovh-angular-checkbox-table
    npm install && bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-checkbox-table/blob/master/CONTRIBUTING.md)

## Run the tests

```bash
npm test
```

## Please note :

* **ovh-checkbox-table** : directive
* **ovh-checkbox-table-ids-all="table.myAllIds_canBeFiltered"** : array (string, int UNIQUE) of ids. Can be filtred
* **ovh-checkbox-table-ids-page="table.myIdsOnCurrentPage"** : array (object) ids detail
* **ovh-checkbox-table-ids-selected="table.myIdsSelectedByCheckbox"** : array (object<id, true>) of selected line by checkbox
* **ovh-checkbox-table-id="id"** : (string) unique key of ids detail

* **data-ng-model="table.myIdsSelectedByCheckbox[myData.id]"**

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-checkbox-table
 * Report bugs: https://github.com/ovh-ux/ovh-angular-checkbox-table/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-checkbox-table

# License

See https://github.com/ovh-ux/ovh-angular-q-allSettled/blob/master/LICENSE
