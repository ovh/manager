/**
 * @type filter
 * @name ovhFilters:substring
 * @description
 * Extracts the characters from a string, between two specified indices, and returns the new sub string.
 * # Usage
 *<code:html>
 *{{text | substring:from:to}}
 *</code>
 * # Parameters
 * - {string} `text` - Source text
 * - {integer} `from` - The index where to start the extraction. First character is at index 0
 * - {integer} `to` - The index where to stop the extraction.
 * # Return
 * {string} - A new sub-string of `text`.
 * @example
 * Html view :
 *<code:html>
 *<p data-ng-init="name='Philippe'">Hello {{name | substring:0:4}}!</p>
 *</code>
 * Result :
 *<result>
 *<p>Hello Phil!</p>
 *</result>
 */
angular.module('ua.substring').filter('substring', function () {
    "use strict";
    return function (text, from, to) {
        if (text !== undefined) {

            if (!angular.isNumber(from)) {
                from = 0;
            }

            if (!angular.isNumber(to)) {
                to = text.length;
            }

            return text.substring(from, to);
        }

        return "! TEXT IS UNDEFINED !";
    };
});
