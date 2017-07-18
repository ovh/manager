angular.module("ovh-angular-doc-url", []);

angular.module("ovh-angular-doc-url").controller("OvhDocUrlCtrl", ["ovhDocUrl", function (ovhDocUrl) {
    "use strict";

    this.$onInit = function () {
        this.url = ovhDocUrl.getDocUrl(this.docId);
    };
}]);

angular.module("ovh-angular-doc-url")
    .component("ovhDocUrl", {
        template: "<a data-ng-href='{{::$ctrl.url}}' target='_blank'><span data-ng-transclude></span><i class='fa fa-external-link' aria-hidden='true'></i></a>",
        bindings: {
            docId: "@"
        },
        transclude: true,
        controller: "OvhDocUrlCtrl"
    });

angular.module("ovh-angular-doc-url").provider("ovhDocUrl", function () {
    "use strict";

    var isValidLocaleFormat = new RegExp("^[A-Za-z]{2}_[A-Za-z]{2}");

    var config = {
        locale: null,
        urlPrefix: "/engine/2api"
    };

    this.setUserLocale = function (locale) {
        if (!isValidLocaleFormat.test(locale)) {
            throw new Error("Bad locale format [" + locale + "]. It should be xx_xx");
        }
        config.locale = locale;
    };

    this.setUrlPrefix = function (prefix) {
        config.urlPrefix = prefix;
    };

    this.$get = function () {
        return {
            getDocUrl: function (id) {
                return (config.urlPrefix + "/doc-resolver?id=" + id + "&locale=" + config.locale);
            }
        };
    };
});
