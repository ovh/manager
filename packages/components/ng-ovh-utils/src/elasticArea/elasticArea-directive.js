/**
 * @type directive
 * @name ovhDirectives:elasticArea
 * @version 0.0.1
 * @description
 * autoresize text area
 * @example
 * # Usage
 * <code: html>
 * <textarea data-elastic-area></textarea>
 * </code>
 */
angular.module('ua.elasticArea').directive('elasticArea', function () {
    "use strict";

    function resize (t, offset) {
        t.height('auto');
        t.height(t[0].scrollHeight + offset);
    }

    return {
        replace: false,
        restrict: 'A',
        link : function ($scope, $elm) {
            if ($elm) {
                var t, offset;

                t = $elm;

                // add aria attr
                t.height('auto');
                t.attr('contenteditable', "true");
                t.attr('tabindex', "0");
                t.attr('role', 'textbox');
                t.attr('aria-multiline', "true");

                if (!window.opera) {
                    offset = t[0].offsetHeight - t[0].clientHeight;
                } else {
                    offset = t[0].offsetHeight + parseInt(window.getComputedStyle(t[0], null).getPropertyValue('border-top-width'), 10);
                }

                t.bind('input', function() {
                    resize(t, offset);
                });

                t.bind('keyup', function () {
                    resize(t, offset);
                });
            }
        }
    };

});
