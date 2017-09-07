angular.module('ua.ignoreSpaces').filter('ignorespaces', function () {
    "use strict";

    var reg = new RegExp('\\s', 'gi');


    return function (array, expression, comp) {

        if (!angular.isArray(array) || (!angular.isString(expression) && !angular.isNumber(expression))) {
            return array;
        } else {

            comp = function (obj, text) {

                obj = '' + obj;
                text = '' + text;

                return obj.toLowerCase().replace(reg, '').indexOf(text.toLowerCase().replace(reg, '')) > -1;
            };

            var filtered = [], j, value,
                search = function (obj, text) {
                    var objKey, i;

                    if (typeof text === 'string' && text.charAt(0) === '!') {
                        return !search(obj, text.substr(1));
                    }

                    switch (typeof obj) {
                    case "boolean":
                    case "number":
                    case "string":
                        return comp(obj, text);
                    case "object":
                        for (objKey in obj) {
                            if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                                return true;
                            }
                        }
                        return false;
                    case "array":
                        for (i = 0; i < obj.length; i++) {
                            if (search(obj[i], text)) {
                                return true;
                            }
                        }
                        return false;
                    default:
                        return false;
                    }
                };

            for (j = 0; j < array.length; j++) {
                value = array[j];
                if (search(value, expression)) {
                    filtered.push(value);
                }
            }

            return filtered;
        }
    };
});
