/**
 * @type directive
 * @name ovhDirectives:i18n
 * @see [url=http://docs.angularjs.org/guide/ie]Internet Explorer Compatibility[/url]
 * @version 1.2.0
 * @description
 * Provide translation with bbcode support, pluralization and co.
 * # Require
 * [url=#/module=ovhServices&service=translator]`translator`[/url] service on controller view.
 * # Usage
 * Has element name (not recommended for IE compatibity):
 *<code:html>
 *<i18n key="propertie_file_key" count="pluralize_value" vars="value1 | value2 | value3" bbcode="true"/>
 *</code>
 * Has attribute (highly recommended syntax):
 *<code:html>
 *<div data-i18n="propertie_file_key"></div>
 *<div data-i18n="propertie_file_key" data-bbcode="true"></div>
 *<div data-i18n data-key="propertie_file_key" data-count="pluralize_value" data-vars="value1 | value2 | value3" data-bbcode="true"></div>
 *</code>
 * - [b]i18n[/b]: {string} (as attribute only) properties file translation key (key attribute not needed. If both are used, key ovverride i18n property)
 * - [b]key[/b]: {string} properties file translation key
 * - [b]count[/b]: {integer} pluralize translation (optional)
 * - [b]vars[/b]: {pipe-separated string} variables (optional)
 * - [b]bbcode[/b]: {boolean} use bbcode (optional)
 * # Supported bbcode
 *<html>
 * <b>[b]</b>a text<b>[/b]</b> : bold<br/>
 * <b>[i]</b>a text<b>[/i]</b> : italic<br/>
 * <b>[u]</b>a text<b>[/u]</b> : underline<br/>
 * <b>[class=css_class_name]</b>a text<b>[/class]</b> : css class<br/>
 * <b>[color=a_color]</b>a text<b>[/color]</b> : text color<br/>
 * <b>[size=a_size_with_unit]</b>a text<b>[/size]</b> : font size<br/>
 * <b>[url]</b>an url<b>[/url]</b> : add clickable url<br/>
 * <b>[url=an_url]</b>a text<b>[/url]</b> : add clickable url with a specified text<br/>
 * <b>[email]</b>a mail address<b>[/email]</b> : add clickable email (mailto:)<br/>
 * <b>[email=a_mail_address]</b>a text<b>[/email]</b> : add clickable email (mailto:) with a specified text<br/>
 * <b>[br]</b> : new line
 *</html>
 * @example
 * Properties file :
 *<code>
 *text1 = Line 1.[br]Line 2.
 *text2 = Simple [b][i]example[/i][/b] text.
 *text3 = My value [b]{0}[/b]. Mon text en dur : [i]{1}[/i]
 *text_pl_3 = Ma pluzalization
 *</code>
 * Html view :
 *<code:html>
 *<div data-ng-controller="MyController">
 *   <div data-i18n="text1"></div>
 *   <div data-i18n="text1" data-bbcode="true"></div>
 *   <div data-i18n="text3" vars="{{value}} | mon text en dur" data-bbcode="true"></div>
 *   <div data-i18n="text_pl_3" data-count="{{1+2}}"></div>
 *   <p><i18n data-key="text1"/></p>
 *   <p><i18n data-key="text1" data-bbcode="true"/></p>
 *   <p><i18n data-key="text2"/></p>
 *   <p><i18n data-key="text2" data-bbcode="true"/></p>
 *   <p><i18n data-key="text3"/></p>
 *   <p><i18n data-key="text3" data-vars="{{value}} | mon text en dur" data-bbcode="true"/></p>
 *   <p><i18n data-key="text_pl_3" data-count="{{1+2}}"/></p>
 *   <div data-i18n data-key="text1"></div>
 *   <div data-i18n data-key="text1" data-bbcode="true"></div>
 *   <div data-i18n data-key="text3" vars="{{value}} | mon text en dur" data-bbcode="true"></div>
 *   <div data-i18n data-key="text_pl_3" data-count="{{1+2}}"></div>
 *</div>
 *</code>
 * Javascript controller :
 *<code:js>
 *var MyController = function (scope, translator) {
 *   translator.load(['myModule']);
 *   scope.value = "a";
 *};
 *MyController.$inject = ['$scope', 'translator'];
 *</code>
 * Result :
 *<result>
 *<div data-i18n="text1">Line 1.[br]Line 2.</div>
 *<div data-i18n="text1" data-bbcode="true">Line 1.<br/>Line 2.</div>
 *<div data-i18n="text3" vars="a | mon text en dur" bbcode="true">My value <b>a</b>. Mon text en dur : <i>mon text en dur</i></div>
 *<div data-i18n="text_pl_3" data-count="3">Ma pluzalization</div>
 *<p><span data-key="text1">Line 1.[br]Line 2.</span></p>
 *<p><span data-key="text1" data-bbcode="true">Line 1.<br/>Line 2.</span></p>
 *<p><span data-key="text2">Simple [b][i]example[/i][/b] text.</span></p>
 *<p><span data-key="text2" data-bbcode="true">Simple <b><i>example</i></b> text.</span></p>
 *<p><span data-key="text3">My value [b]{0}[/b]. Mon text en dur : [i]{1}[/i]</span></p>
 *<p><span data-key="text3" vars="a | mon text en dur" bbcode="true">My value <b>a</b>. Mon text en dur : <i>mon text en dur</i></span></p>
 *<p><span data-key="text_pl_3" data-count="3">Ma pluzalization</span></p>
 *<div data-i18n data-key="text1">Line 1.[br]Line 2.</div>
 *<div data-i18n data-key="text1" data-bbcode="true">Line 1.<br/>Line 2.</div>
 *<div data-i18n data-key="text3" vars="a | mon text en dur" bbcode="true">My value <b>a</b>. Mon text en dur : <i>mon text en dur</i></div>
 *<div data-i18n data-key="text_pl_3" data-count="3">Ma pluzalization</div>
 *</result>
 */
angular.module('ua.i18n').directive('i18n', ['translator', function (translator) {
        'use strict';
        return {
            'restrict': 'E',
            'replace': true,
            'transclude': true,
            'template': '<span data-ng-transclude></span>',
            'scope': {
                'key': '@',
                'vars': '@',
                'bbcode': '@',
                'count': '@'
            },
            'compile': function () {
                return {
                    pre: function (scope, elts) {
                        angular.element(elts).css({'display': 'none'});
                    },
                    post: function (scope, elts) {
                        var compile = function (newValue, oldValue, scope) {
                            if (newValue !== null && newValue !== undefined) {

                                var key = scope.key || '',
                                        count = (scope.count && !isNaN(scope.count)) ? parseInt(scope.count, 10) : null,
                                        vars = scope.vars ? scope.vars.split('|') : (scope.vars === undefined ? null : []),
                                        bbcode = scope.bbcode ? scope.bbcode : false,
                                        html;

                                if (count !== null) {
                                    html = translator.trpl(key, count, vars, bbcode);
                                } else {
                                    html = translator.tr(key, vars, bbcode);
                                }
                                angular.element(elts).html(html);
                                angular.element(elts).css({'display': ''});
                            }
                        };

                        scope.$watch('vars', compile);
                        scope.$watch('count', compile);
                        scope.$watch('key', compile);

                        if (angular.isObject(scope.$parent.i18n)) {
                            scope.$watch('$parent.i18n', compile, true);
                        } else if (angular.isObject(angular.isObject(scope.$root.i18n))) {
                            scope.$watch('$root.i18n', compile, true);
                        }
                    }
                };
            }
        };
    }])
    .directive('i18n', ['translator', function (translator) {
        'use strict';
        return {
            'restrict': 'A',
            'scope': {
                'i18n': '@',
                'key': '@',
                'vars': '@',
                'bbcode': '@',
                'count': '@'
            },
            'compile': function () {
                return {
                    pre: function (scope, elts) {
                        angular.element(elts).css('display', 'none');
                    },
                    post: function (scope, elts) {
                        var compile = function (newValue, oldValue, scope) {
                            if (newValue !== null && newValue !== undefined) {
                                var key = scope.key || scope.i18n || '',
                                        count = scope.count && !isNaN(scope.count) ? parseInt(scope.count, 10) : null,
                                        vars = scope.vars ? scope.vars.split('|') : (scope.vars === undefined ? null : []),
                                        bbcode = scope.bbcode ? scope.bbcode : false,
                                        html;

                                if (count !== null) {
                                    html = translator.trpl(key, count, vars, bbcode);
                                } else {
                                    html = translator.tr(key, vars, bbcode);
                                }

                                angular.element(elts).html(html);
                                angular.element(elts).css('display', '');
                            }
                        };

                        scope.$watch('vars', compile);
                        scope.$watch('count', compile);
                        scope.$watch('i18n', compile);
                        scope.$watch('key', compile);

                        if (angular.isObject(scope.$parent.i18n)) {
                            scope.$watch('$parent.i18n', compile, true);
                        } else if (angular.isObject(angular.isObject(scope.$root.i18n))) {
                            scope.$watch('$root.i18n', compile, true);
                        }

                    }
                };
            }
        };
    }]).directive('i18nStatic', function () {
        'use strict';
        return {
            'restrict'  : 'A',
            'controller': ['$scope', function ($scope){

                this.removeWatcher = function () {
                    var self = this;

                    if (self.unregistrer !== undefined) {
                        self.unregistrer();

                        delete self.unregistrer;
                    }
                };

                this.setWatcher = function (key, callback) {
                    var self = this;

                    self.unregistrer = $scope.$watch(key, function (newValue) {

                        var func = callback,
                            me = self;
                        if (newValue !== undefined) {
                            me.removeWatcher();
                            if (!!func && angular.isFunction(func)) {
                                func(newValue);
                            }
                        }
                    });
                };

            }],
            'link'      : function ($scope, $elm, $attrs, ctrl) {

                var key = ['i18n', $attrs.i18nStatic].join('.'),
                    translatorValue = $scope[key];

                if (translatorValue !== undefined) {
                    angular.element($elm).text(translatorValue);
                } else {

                    ctrl.setWatcher(key, function (newValue) {
                        angular.element($elm).text(newValue);
                    });

                    $elm.bind("$destroy", ctrl.removeWatcher);
                }
            }
        };
    });
