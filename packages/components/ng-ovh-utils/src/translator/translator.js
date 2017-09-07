angular.module('ua.translator', []).run(function () {
    "use strict";
    $.ajaxPrefilter(function (options, originalOptions) {
        if (options.dataType === 'script' || originalOptions.dataType === 'script') {
            options.cache = true;
        }
    });
}).constant('AVAILABLE_LANGUAGE', [
    { value: "de_DE", name: "Deutsch" },
    { value: "en_GB", name: "English" },
    { value: "es_ES", name: "Español" },
    { value: "fr_FR", name: "Français" },
    { value: "it_IT", name: "Italiano" },
    { value: "lt_LT", name: "Lietuviškai" },
    { value: "nl_NL", name: "Nederlands" },
    { value: "pl_PL", name: "Polski" },
    { value: "pt_PT", name: "Português" },
    { value: "sk_SK", name: "Slovakian" },
    { value: "fi_FI", name: "Suomi" },
    { value: "cs_CZ", name: "Česky" }
]);
