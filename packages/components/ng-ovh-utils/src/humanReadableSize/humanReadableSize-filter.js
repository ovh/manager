angular.module("ua.humanReadableSize").filter("humanReadableSize", [
    "translator",
    function (translator) {
        "use strict";

        return function (size, options) {

            if (isNaN(size)) {
                return "";
            }

            var opts = options || {};
            opts.suffixes = {
                B: translator.tr("unit_size_B"),
                KB: translator.tr("unit_size_KB"),
                MB: translator.tr("unit_size_MB"),
                GB: translator.tr("unit_size_GB"),
                TB: translator.tr("unit_size_TB"),
                PB: translator.tr("unit_size_PB"),
                EB: translator.tr("unit_size_EB"),
                ZB: translator.tr("unit_size_ZB"),
                YB: translator.tr("unit_size_YB")
            };

            return filesize(size, opts);
        };
    }
]);
