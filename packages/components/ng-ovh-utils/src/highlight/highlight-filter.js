/**
 * @type filter
 * @name ovhFilters:highlighter
 * @description
 * highlight a search word into paragraphe
 * # Usage
 *<code:html>
 *{{text |highlighter:searchText}}
 *</code>
 * # Parameters
 * - {string} `searchText` - Search text
 * # Return
 * {string} - text with search text wrapped into span with classe 'ui-match'.
 * @example
 * Html view :
 *<code:html>
 *
 *<style>
 * my-class {
 *      background-color: yellow;
 * }
 *</style>
 *
 *<p>{{'0328044856'|highlighter:'2804':'my-classe'}}</p>
 *</code>
 * Result :
 *<result>
 *<p>03<span class="ui-match my-class" style="background-color:yellow;">2804</span>4856</p>
 *</result>
 */
angular.module('ua.highlight').filter('highlighter', function () {
    "use strict";

    return function (text, search) {
        var tempArray = [],
            i = 0, v = '',
            searchRegex = null, customClass = '';

        if ((search || angular.isNumber(search)) && (text || angular.isNumber(text))) {

            for (i ; i < search.length ; i++) {

                v = search[i];

                if (['\\', '(', ')', '[', ']', '^', '$', '?', '.', '+', '*'].indexOf(v) > -1) {
                    tempArray.push(['\\', v].join(''));
                } else {
                    tempArray.push(v);
                }
            }
            searchRegex = tempArray.join("\\s?");

            return text.replace(new RegExp("(" + searchRegex + ")", "gi"), "<span class='ui-match" + (customClass ? (' ' + customClass) : '') + "'>$1</span>");

        } else {
            return text;
        }
    };

});
