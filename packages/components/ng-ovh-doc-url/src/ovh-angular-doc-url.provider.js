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
