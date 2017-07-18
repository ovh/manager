angular.module("ovh-angular-doc-url").controller("OvhDocUrlCtrl", function (ovhDocUrl) {
    "use strict";

    this.$onInit = function () {
        this.url = ovhDocUrl.getDocUrl(this.docId);
    };
});
