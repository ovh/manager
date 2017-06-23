# ovh-angular-pagination-front

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-pagination-front.svg)](https://travis-ci.org/ovh-ux/ovh-angular-pagination-front)

[![NPM](https://nodei.co/npm/ovh-angular-pagination-front.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-pagination-front/)

> Angular directive to paginate in front end

* data-ovh-angular-pagination-front
the directive tag

* data-items="tasksId" required
all item to paginate

* data-paginated-items="tasksDetails" required readonly
item show in the current page

* data-current-page="currentPage" optional
the current page to show / shown

* data-nb-pages="nbPages" optional readonly
total pages

* data-items-per-page="itemsPerPage" required
defines items per page

* data-transform-item="transformItem(item)" optional
function to transform showed item

* data-on-transform-item-get-promise="getPromise(promise)" optional, arguments must be named "promise"
to get the promise

* data-on-transform-item-notify="onTransformItemNotify(item)" optional, argument must be named item
to do job on modification

* data-on-transform-item-done="onTransformItemDone(items)" optional, argument must be name items
to do jop after all transformation

* data-page-placeholder="{{tr('pagination_page', [currentPage, nbPages])}}" required
label for select page

* data-item-per-page-placeholder="{{tr('pagination_display')}}" required
label for item per page

* data-refresh="launchRefresh" optional
if launchRefresh change, table reload details

* data-go-to-page="false" optional
if set, input field to change page will not be displayed

# Dependances

* ui.bootstrap : use for pagination. [Visit angular-ui bootstrap](http://angular-ui.github.io/bootstrap/)

# example


## app module

```javascript
angular.module("app", [...,'ovh-angular-pagination-front',....];
```


## js controller

```javascript
angular.module('controllers').controller('controllers.Domain.Tasks',
['$scope', 'Domain', '$filter',

function ($scope, Domain) {
    "use strict";

    // Set items count by page
    $scope.itemsPerPage = 10;

    $scope.tasksId = [];

    $scope.tasksDetails = [];

    // To load a specifique page
    $scope.currentPage = 5;

    $scope.loaders = {
        tasks : true
    };

    /*
     * First get all id
     */

    Domain.getTasks().then(function (tasks) {
        $scope.tasksId = tasks;
    });


    /*
     * if you want transform item must return transformated item
     * item is the current item to transform
     */
    $scope.transformItem = function (item) {
        console.log('transform item', item);
        return Domain.getTask(item); //please do not forget .$promise if you use $Ressource
    };

    /*
     * call when a item of current page is transformed
     * taskDetails contains the transformated items
     */
    $scope.onTransformItemNotify = function (taskDetails) {
        console.log('onTransformItemNotify', taskDetails);
        $scope.tasksDetails.push(taskDetails);
    };

    /*
     * call when all item of current page are transformed
     * tasksDetails contains transformated item
     */
    $scope.onTransformItemDone = function (tasksDetails) {
        console.log('onTransformItemDone', tasksDetails);
        $scope.loaders.tasks = false;
    };

    /*
     * if you want use the promise create by the directive
     */
    $scope.getPromise= function (promise) {
        console.log('getPromise', promise);
        promise.then(
            function () {
                console.log('success', arguments);
            },
            function () {
                console.log('error', arguments);
            },
            function () {
                console.log('notify',arguments);
            }
        );
    };
}

]);
```

## html view

```html
<table class="table pretty">
    <thead>
        <tr>
            <th class="center">
                <span data-i18n-static="domain_tab_TASKS_function"></span>
            </th>
            <th class="center">
                <span data-i18n-static="domain_tab_TASKS_todoDate"></span>
            </th>
            <th class="center">
                <span data-i18n-static="domain_tab_TASKS_state"></span>
            </th>
        </tr>
    </thead>
    <tbody>
        <!--loader-->
        <tr data-ng-show="loaders.tasks">
            <td colspan="3" class="center">
                <div class="loader"></div>
            </td>
        </tr>
        <!-- no tasks -->
        <tr data-ng-show="!tasks.length && !loaders.tasks">
            <td colspan="3" class="center">
                <span data-i18n-static="domain_tab_TASKS_no_tasks"></span>
            </td>
        </tr>
        <!--tasks-->
        <tr data-ng-repeat="task in tasksDetails">
            <td>
                {{task.function}}
            </td>
            <td>
                {{task.todoDate | date:'longDate'}}
            </td>
            <td>
                <i data-ng-class="{
                    'state-pending' : 'DOING',
                    'state-error'   : 'ERROR',
                    'state-done'    : 'DONE',
                    'state-cancel'  : 'CANCELLED',
                    'state-pending' : 'TODO',
                    'state-pending' : 'INIT'
                }"></i>
            </td>

        </tr>
    </tbody>
</table>

<div class="table table-pretty"
     data-ovh-angular-pagination-front
     data-items="tasksId"
     data-paginated-items="tasksDetails"
     data-current-page="currentPage"
     data-nb-pages="nbPages"
     data-items-per-page="itemsPerPage"
     data-transform-item="transformItem(item)"
     data-on-transform-item-get-promise="getPromise(promise)"
     data-on-transform-item-notify="onTransformItemNotify(item)"
     data-on-transform-item-done="onTransformItemDone(items)"
     data-page-placeholder="{{tr('pagination_page', [currentPage, nbPages])}}"
     data-item-per-page-placeholder="{{tr('pagination_display')}}"></div>

```

## Style

```css
.pagination-container {
	ul {
		&.pagination {
			.box-shadow(none);
			li {
				a {
					.color-fn(@defaultPaginationFont);
					font-size: @fontSizeMini;
				}
				&:hover a {
					.background-color-fn(@defaultPaginationHoverBackground);
					.color-fn(@defaultPaginationHoverFont);
				}
				&.active a {
					.background-color-fn(@defaultPaginationActiveBackground);
					.color-fn(@defaultPaginationActiveFont);
					font-size: @fontSizeDefault;
				}
			}
		}
	}

	.pagination-page-goto {
		.background-color-fn(@defaultPaginationGoToBackground);
		.color-fn(@defaultPaginationGoToFont);
		&:hover {
			.background-color-fn(@defaultPaginationGoToHoverBackground);
			.color-fn(@defaultPaginationGoToHoverFont);
		}
	}

	.pagination-page-input {
		.rounded(0px);
		.border-color-fn(@defaultPaginationGoToPageBorder);
		.background-color-fn(@defaultPaginationGoToPageBackground);
		.color-fn(@defaultPaginationGoToPageFont);
	}

	.pagination-page-size {
		font-size: @fontSizeMini;
		.rounded(0px);
	}
}

```
# Related links
 
 * Contribute: https://github.com/ovh-ux/ovh-angular-pagination-front/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-pagination-front/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-pagination-front
 
# License
 
See https://github.com/ovh-ux/ovh-angular-pagination-front/blob/master/LICENSE
