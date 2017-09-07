angular.module('ua.flexTable').directive('flextable', function () {
        'use strict';
        return {
            'restrict': 'AE',
            'transclude': true,
            'scope': false,
            'link': function (scope, iElement, iAttrs) {
                var sortableHeaders = [],
                    list = false,
                    elem = null,
                    checkbox = null;

                // sortable
                if (scope.table) {

                    $.each(iElement.find('div.fix-header > div > div'), function (index1, header) {

                        var sortOn = $(header).attr("sort-on") || $(header).attr("data-sort-on") || $(header).attr("x-sort-on"),
                            s1 = null;

                        if (sortOn) {
                            s1 = sortOn.split(":");

                            if (s1.length === 2) {
                                sortableHeaders.push(header);

                                $(header).append("<i class=\"\"></i>");
                                $(header).click(function () {

                                    if (!list) {
                                        list = scope;

                                        $.each(s1[0].split("."), function (index2, key) {
                                            list = list[key];
                                        });
                                    }

                                    scope.table.sort(list, s1[1]);

                                    // clear icons
                                    $.each(sortableHeaders, function (index3, sortableHeader) {
                                        $(sortableHeader).find("i").removeClass();
                                    });

                                    // update clicked header icon
                                    $(header).find("i").addClass(scope.table.sortIcon(s1[1]));

                                    if (!scope.$$phase) {
                                        scope.$apply();
                                    }
                                });
                            }
                        }
                    });
                }

                // scrollable
                if (iAttrs.scrollable && iAttrs.scrollable === 'true') {
                    iElement.find('div.table-div-striped').addClass('scrollable');
                }

                // selectable
                if (scope.selectionMap) {
                    //line clickable
                    iElement.click(function (evt) {
                        var target = $(evt.target);
                        if (!target.is('input')) {
                            evt.stopPropagation();

                            if (!target.is('div.row-fluid.table-row')) {
                                target = target.parents('div.row-fluid.table-row');
                            }

                            if (target.parents('div.fix-header').length === 0) {

                                target = target.find('input');

                                if (target && target[0]) {
                                    $(target[0]).click();
                                }
                            }
                        }
                    });

                    if (scope.isMultiSelect()) {
                        // header global selection
                        elem = iElement.find('div.fix-header > div > div:first-child');
                        checkbox = null;

                        if (elem) {
                            checkbox = $(document.createElement("input")).attr({
                                'value': '',
                                'type': 'checkbox',
                                'checked': false
                            });

                            checkbox.change(function () {
                                scope.setAllChecked(checkbox.is(':checked'));
                            });

                            elem.html(checkbox);
                        }
                    }
                }

                if (scope.responsive) {
                    iElement.find('div.fix-header').addClass('hidden-phone');
                }
            },
            'controller': 'flexTableCtrl',
            'template': '<div class="table-div" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('headers', function () {
        'use strict';
        return {
            'restrict': 'AE',
            'require' : 'flextable',
            'transclude': true,
            'scope': false,
            'template': '<div class="fix-header"><div class="row-fluid table-row" ng-transclude></div></div>',
            'replace': true
        };
    })
    .directive('header', function () {
        'use strict';
        return {
            'restrict': 'E',
            'transclude': true,
            'scope': {
                'size' : '@'
            },
            'template': '<div class="span{{size}}" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('header', function () {
        'use strict';
        return {
            'restrict': 'A',
            'scope': false,
            link: function (scope, iElement, iAttrs) {
                if (iAttrs && iAttrs.size) {
                    iElement.addClass('span' + iAttrs.size);
                }
            }
        };
    })
    .directive('rows', function () {
        'use strict';
        return {
            'restrict': 'E',
            'transclude': true,
            'scope': false,
            'template': '<div class="table-div-striped" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('rows', function () {
        'use strict';
        return {
            'restrict': 'A',
            'scope': false,
            link: function (scope, iElement) {
                var parent = iElement.parent();
                if (parent && parent.hasClass('table-div')) {
                    iElement.addClass('table-div-striped');
                }
            }
        };
    })
    .directive('row', function () {
        "use strict";
        return {
            'restrict': 'AE',
            'transclude': true,
            'scope': false,
            'link': function (scope, iElement) {

                // selectable
                if (scope.selectionMap) {
                    var ngRepeat = iElement.attr('ng-repeat') || iElement.attr('data-ng-repeat'),
                        item = ngRepeat.split(' ')[0],
                        cell = iElement.find('> div:first-child'), cellElem;

                    if (cell) {
                        if ($.isFunction(scope.flextableInputRowGenerator)) {
                            cellElem = scope.flextableInputRowGenerator(scope[item]);
                        }

                        if ($.isEmpty(cellElem)) {
                            cellElem = $(document.createElement("input")).attr({
                                'value': scope.$id,
                                'type': scope.isMultiSelect() ? 'checkbox' : 'radio',
                                'name': scope.isMultiSelect() ? ('cb_'  + scope.tableId + '_' + scope.$id) : ('radio_' + scope.tableId),
                                'checked': false
                            });

                            cellElem.change(function () {
                                var parentRow = $(this).parents('div.row-fluid.table-row'),
                                    parentRows = null, i = 0;

                                if (cellElem.is(':checked')) {
                                    scope.addSelection(cellElem.val(), scope[item]);
                                    if (!scope.isMultiSelect()) {
                                        parentRows = $(this).parents('div.table-div-striped').find('div.row-fluid.table-row');
                                        if (parentRows && parentRows.length) {
                                            for (i = 0 ; i < parentRows.length ; i++) {
                                                $(parentRows[i]).removeClass('table-row-selected');
                                            }
                                        }
                                    }
                                    parentRow.addClass('table-row-selected');
                                } else {
                                    scope.removeSelection(cellElem.val());
                                    parentRow.removeClass('table-row-selected');
                                }
                            });
                        }
                        cell.html(cellElem);
                    }
                }
            },
            'template': '<div class="row-fluid table-row" ng-transclude></div>',
            'replace': true
        };
    })
    .directive('cell', function () {
        'use strict';
        return {
            'restrict': 'AE',
            'transclude': true,
            'scope': {
                'size'       : '@',
                'datatitle' : '@'
            },
            'template': '<div class="span{{size}}" ng-transclude></div>',
            'replace': true
        };
    });
