angular.module("ovh-angular-responsive-tabs").controller("responsiveTabsCtrl", function ($scope) {
    "use strict";

    var ctrl = this;
    var tabs = ctrl.tabs = $scope.tabs = [];
    var tabMore = ctrl.tabMore = $scope.tabMore = {};

    ctrl.select = function (selectedTab) {
        // reset active state of old active tab
        angular.forEach(tabs, function (tab) {
            if (tab.active && tab !== selectedTab) {
                tab.active = false;
            }
        });
        selectedTab.active = true;

        selectedTab.onSelect();
    };

    ctrl.addTab = function (_tab) {
        tabs.push(_tab);
    };

    // Special add for the "more" tab
    ctrl.addTabMore = function (_tabMore) {
        tabMore.$tab = _tabMore.$tab;
        tabMore.tabs = _tabMore.tabs;
    };

    ctrl.removeTab = function (_tab) {
        var index = tabs.indexOf(_tab);

        // Select a new tab if the tab to be removed is selected and not destroyed
        if (_tab.active && tabs.length > 1 && !destroyed) {
            // If this is the last tab, select the previous tab. else, the next tab.
            var newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
            ctrl.select(tabs[newActiveIndex]);
        }
        tabs.splice(index, 1);
    };

    var destroyed;
    $scope.$on("$destroy", function () {
        destroyed = true;
    });

});
