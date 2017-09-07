/**
 * @type service
 * @name ovhServices:translator
 * @see [url=#/module=ovhDirectives&directive=i18n]i18n[/url] directive
 * @version 3.0.0
 * @description
 * Manage translations.
 * # Require
 * - AngularJS [url=http://docs.angularjs.org/api/ngCookies]ngCookies[/url]
 * # Translation files
 * Translations are stored in json files and are splitted in separate modules files.
 * [b]"core"[/b] module is the main interface translation json file. Use it to store interface and common use modules translations.
 * # Path
 * resources/i18n/<module>/Messages_<language>.json
 * # Basic syntaxe
 * a_key = A value.
 * # Syntaxe with variables
 * another_key = A text with 2 vars : {0} and {1}.
 * another_key[b]_default[/b] = A default text if no vars given or null, ...
 * # Pluralize syntaxe
 * a_key[b]_0[/b] : (optional) if not specified, 0 would be matched to the "_other" category
 * a_key[b]_one[/b] : match count equal to 1
 * a_key[b]_other[/b] : match any count that is not 1
 * You can use a set of closed braces([b]{}[/b]) as a placeholder in the text value for the counter. (see example below)
 * # Usage
 * Add service `translator` to controller view and call `load` method to load desired modules translations.
 * [b][u]HTML view:[/b][/u][br]This will add a map `i18n` directly on the [url=http://docs.angularjs.org/api/ng.$rootScope]`$rootScope`[/url] with all translations as "key:value", a `tr` method to transform text with given variables and a `trpl` method to transform and pluralize text with given variables.
 * @example
 * Properties file :
 *<code>
 *translation_key_in_properties_file = Text here.
 *text_with_var = Hello {0} !
 *text_world = world
 *
 *# pluralize keys
 *test_person_count_0 = Nobody is viewing.
 *test_person_count_one = 1 person is viewing.
 *test_person_count_500 = Wow !!! 500 persons are watching me !
 *test_person_count_other = {} people are viewing.
 *</code>
 * Javascript view controller :
 *<code:js>
 *var MyController = function(scope, translator) {
 *   translator.load(['core', 'module_x', 'module_xx']);
 *   ...
 *   var value = translator.tr('translation_key_in_properties_file');
 *};
 *MyController.$inject = ['$scope', 'translator'];
 *</code>
 * Html view :
 *<code:html>
 *Test translation with variables :
 *<ul>
 *   <li>translation_key_in_properties_file : {{i18n.translation_key_in_properties_file}}</li>
 *   <li>{{i18n.text_with_var}}</li>
 *   <li>{{tr('text_with_var')}}</li>
 *   <li>{{tr('text_with_var', ['John'])}}</li>
 *   <li>{{tr('text_with_var', [i18n.text_world])}}</li>
 *   <li>{{i18n.unknown_text}}</li>
 *   <li>{{tr('unknown_text')}}</li>
 *</ul>
 *Test pluralize translation :
 *<ul>
 *   <li>{{i18n.test_person_count}}</li>
 *   <li>{{i18n.test_person_count_0}}</li>
 *   <li>{{i18n.test_person_count_one}}</li>
 *   <li>{{i18n.test_person_count_other}}</li>
 *   <li>{{tr('test_person_count')}}</li>
 *   <li>{{trpl('test_person_count')}}</li>
 *   <li>{{trpl('test_person_count', 0)}}</li>
 *   <li>{{trpl('test_person_count', 1)}}</li>
 *   <li>{{trpl('test_person_count', 10)}}</li>
 *   <li>{{trpl('test_person_count', 499)}}</li>
 *   <li>{{trpl('test_person_count', 500)}}</li>
 *</ul>
 *</code>
 * Result :
 *<result>
 *Test translation with variables :
 *<ul>
 *   <li>translation_key_in_properties_file : Text here.</li>
 *   <li>Hello {0} !</li>
 *   <li>Hello {0} !</li>
 *   <li>Hello John !</li>
 *   <li>Hello world !</li>
 *   <li></li>
 *   <li>/!\ unknown_text</li>
 *</ul>
 *Test pluralize translation :
 *<ul>
 *   <li></li>
 *   <li>Nobody is viewing.</li>
 *   <li>1 person is viewing.</li>
 *   <li>{} people are viewing.</li>
 *   <li>/!\ test_person_count</li>
 *   <li>/!\ test_person_count</li>
 *   <li>Nobody is viewing.</li>
 *   <li>1 person is viewing.</li>
 *   <li>10 people are viewing.</li>
 *   <li>499 people are viewing</li>
 *   <li>Wow !!! 500 persons are watching me !</li>
 *</ul>
 *</result>
 */
angular.module('ua.translator').provider('translator', function() {
    'use strict';
    var availableLanguages;

    this.setAvailableLanguages = function (langs) {
        availableLanguages = langs;
    };

    this.$get = ['$rootScope', '$http', 'AVAILABLE_LANGUAGE', 'storage', '$q', 'tmhDynamicLocale', function ($rootScope, $http, AVAILABLE_LANGUAGE, localStorage, $q, tmhDynamicLocale) {
        var csidRegExp = new RegExp(/(.+\.html).*(\?|&)csid=([A-Za-z0-9]*).*/),
            langRegExp = /lang=([a-z]{2}_[A-Z]{2})/,
            safeApply = function (fn) {
                var phase = $rootScope.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    if (fn && typeof fn === 'function') {
                        fn();
                    }
                } else {
                    $rootScope.$apply(fn);
                }
            },
            _availableLanguages = availableLanguages || AVAILABLE_LANGUAGE,
            _basePath = '',
            _resourcesPath = 'resources/i18n/',
            _browserLanguage = navigator.language || navigator.userLanguage,
            _defaultLanguage = "en_GB",
            _cache = {},
            _currentLanguage = false,
            _allModules = [],
            _translator = {
                /**
                 * @type function
                 * @name ovhServices:translator.setBasePath
                 * @description
                 * Change ressource path - must end with '/'
                 * @param {string} the base Path
                 **/
                'setBasePath': function (basePath) {
                    if (!!basePath) {
                        _basePath = basePath;
                    } else {
                        _basePath = '';
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.setResourcesPath
                 * @description
                 * Change ressource path - must end with '/'
                 * @param {string} the base Path
                 **/
                'setResourcesPath' : function (rp) {
                    if (!!rp) {
                        _resourcesPath = rp;
                    } else {
                        _resourcesPath = 'resources/i18n/';
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.setTitle
                 * @description
                 * Change document title
                 * @param {string} the new title
                 */
                'setTitle': function (title) {

                    document.title = title;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getDefaultLanguage
                 * @description
                 * Default application language code
                 * @return {string} language code value
                 */
                'getDefaultLanguage': function () {

                    return _defaultLanguage;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getBrowserLanguage
                 * @description
                 * Current browser language code
                 * @return {string} language code value
                 */
                'getBrowserLanguage': function () {

                    var formattedLanguage = _browserLanguage.replace('-', '_'),
                        country = formattedLanguage.split('_')[0],
                        local;

                    if (formattedLanguage.indexOf('_') === -1 && country) {
                        angular.forEach(_availableLanguages, function (v) {
                            if ([country.toLowerCase(),country.toUpperCase()].join('_') === v.value) {
                                local = v.value;
                            }
                        });
                    } else {
                        angular.forEach(_availableLanguages, function (v) {
                            if (/^(.*)_.*$/.test(v.value) && country === v.value.match(/^(.*)_.*$/)[1]) {
                                local = v.value;
                            }
                        });
                    }

                    return local;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getAvailableLanguages
                 * @description
                 * Available languages list
                 * @return {array} object list
                 */
                'getAvailableLanguages': function () {

                    return _availableLanguages;
                },

                'setAvailableLanguages': function (langs) {

                    _availableLanguages = langs;
                    _translator.setLanguage(_translator.getLanguage());
                },

                /**
                 * @type function
                 * @name ovhServices:translator.isAvailableLanguage
                 * @description
                 * Check language code value availability
                 * @param {string} lang language code value
                 * @return {boolean} true if given language is an available languages
                 */
                'isAvailableLanguage': function (lang) {

                    var found = false;
                    if (lang && lang.match(/^[a-z]{2}[\-_]{1}[A-Z]{2}$/)) {
                        angular.forEach(_availableLanguages, function (v) {
                            if (v.value === lang) {
                                found = true;
                            }
                        });
                    }
                    return found;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getLanguage
                 * @description
                 * Current use language
                 * @return {string} language code value
                 */
                'getLanguage': function () {
                    if (_currentLanguage === false) {

                        var csid = window.location.href.match(csidRegExp) ? window.location.href.replace(csidRegExp, '$3') : null,
                            langUrl = window.location.search.match(langRegExp);

                        if (langUrl && _translator.isAvailableLanguage(langUrl[1])) {
                            return langUrl[1];
                        }
                        else if (csid !== null && localStorage.get('univers-selected-language-' + csid, true) && _translator.isAvailableLanguage(localStorage.get('univers-selected-language-' + csid))) {
                            return localStorage.get('univers-selected-language-' + csid, true);
                        } else if (localStorage.get('univers-selected-language') && _translator.isAvailableLanguage(localStorage.get('univers-selected-language'))) {
                            return localStorage.get('univers-selected-language');
                        } else if (_translator.isAvailableLanguage(_translator.getBrowserLanguage())) {
                            return _translator.getBrowserLanguage();
                        } else {
                            return _defaultLanguage;
                        }
                    }
                    return _currentLanguage;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.getSelectedAvailableLanguage
                 * @description
                 * Current available language object
                 * @return {object} available object language
                 */
                'getSelectedAvailableLanguage': function () {


                    var local = null;
                    angular.forEach(_availableLanguages, function (v) {
                        if (v.value === _translator.getLanguage()) {
                            local = v;
                        }
                    });
                    return local;
                },
                /**
                 * @type function
                 * @name ovhServices:translator.setLanguage
                 * @description
                 * Set application language
                 * @param {string} lang language code value
                 * @param {array|string} module module name or modules name list
                 */
                'setLanguage': function (lang) {


                    if ((_currentLanguage === false || _currentLanguage !== lang) && _translator.isAvailableLanguage(lang)) {

                        _currentLanguage = lang;

                        var csid = window.location.href.match(csidRegExp) ? window.location.href.replace(csidRegExp, '$3') : null, htmlLang;

                        // update html lang
                        angular.forEach(_availableLanguages, function (v) {
                            if (v.value === lang && /^(.*)_.*$/.test(v.value)) {
                                htmlLang = v.value.match(/^(.*)_.*$/)[1];
                            }
                        });

                        if (htmlLang) {
                            angular.element('html').attr('lang', htmlLang);
                        }

                        angular.forEach(_allModules, function (module) {
                            _translator.load(module);
                        });

                        // cookies language
                        localStorage.add('univers-selected-language', lang);

                        // Syncing $translator and $local languages
                        tmhDynamicLocale.set(lang.replace('_', '-').toLowerCase());

                        if (csid !== null) {
                            localStorage.add('univers-selected-language-' + csid, lang, true);
                        }
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.tr
                 * @description
                 * Scope translation method
                 * @param {string} key properties file key
                 * @param {array} vars variables string array
                 * @param {boolean|string} bbcode boolean or string true|false to enable bbcode support
                 */
                'tr': function (key, vars, bbcode) {


                    if ($rootScope.i18n[key]) {
                        var txt = $rootScope.i18n[key];

                        if (angular.isArray(vars)) {
                            if (vars.length > 0) {
                                angular.forEach(vars, function (value, index) {
                                    txt = txt.replace(new RegExp('\\{' + index + '\\}', "g"), (value === undefined || value === null ? '' : value));
                                });
                            } else if ($rootScope.i18n[key + '_default']) {
                                txt = $rootScope.i18n[key + '_default'];
                            }
                        } else if (angular.isString(vars)) {
                            txt = txt.replace(new RegExp('\\{0\\}', "g"), vars);
                        }

                        if (bbcode && (bbcode === true || bbcode === 'true')) {
                            txt = txt.replace(/\[b\](.*?)\[\/b\]/g, "<strong>$1</strong>");
                            txt = txt.replace(/\[i\](.*?)\[\/i\]/g, "<em>$1</em>");
                            txt = txt.replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>");
                            txt = txt.replace(/\[class=(.*?)\](.*?)\[\/class\]/g, "<span class=\"$1\">$2</span>");
                            txt = txt.replace(/\[color=(.*?)\](.*?)\[\/color\]/g, "<span style=\"color:$1;\">$2</span>");
                            txt = txt.replace(/\[size=(.*?)\](.*?)\[\/size\]/g, "<span style=\"font-size:$1;\">$2</span>");
                            txt = txt.replace(/\[url\](.*?)\[\/url\]/g, "<a href=\"$1\">$1</a>");
                            txt = txt.replace(/\[url=(.*?)\](.*?)\[\/url\]/g, "<a href=\"$1\">$2</a>");
                            txt = txt.replace(/\[email\](.*?)\[\/email\]/g, "<a href=\"mailto:$1\">$1</a>");
                            txt = txt.replace(/\[email=(.*?)\](.*?)\[\/email\]/g, "<a href=\"mailto:$1\">$2</a>");
                            txt = txt.replace(/(\\n|\[br\])/g, "<br/>");
                        }
                        return txt;
                    }

                    if (key !== null && key !== undefined && key !== '') {
                        return $rootScope.i18n[key + '_default'] || '/!\\ ' + key;
                    } else {
                        return '';
                    }
                },
                /**
                 * @type function
                 * @name ovhServices:translator.trpl
                 * @description
                 * Scope pluralize translation method
                 * @param {string} key properties file key
                 * @param {integer} count number use to pluralize text
                 * @param {array} vars variables string array
                 * @param {boolean|string} bbcode boolean or string true|false to enable bbcode support
                 */
                'trpl': function (key, count, vars, bbcode) {


                    if (count && !isNaN(count)) {
                        count = parseInt(count, 10);
                        if (count === 0 && $rootScope.i18n[key + '_0']) {
                            return _translator.tr((key + '_0'), vars, bbcode);
                        } else if (count === 1 && $rootScope.i18n[key + '_one']) {
                            return _translator.tr((key + '_one'), vars, bbcode);
                        } else if ($rootScope.i18n[key + '_' + count]) {
                            return _translator.tr(key + '_' + count, vars, bbcode);
                        } else if ($rootScope.i18n[key + '_other']) {
                            return _translator.tr((key + '_other'), vars, bbcode).replace('{}', count);
                        }
                    }
                    return _translator.tr(key, vars, bbcode);
                },
                /**
                 * @type function
                 * @name ovhServices:translator.load
                 * @description
                 * Load desired modules translations (if needed)
                 * @param {array|string} module name or modules name list
                 * @param {string} baseUrl for thoses modules
                 */
                'load': function (modules, basePath, resourcesPath) {

                    var _modules, requestsTab = [],
                        newBP = basePath || _basePath,
                        newRP = resourcesPath || _resourcesPath;


                    if (angular.isArray(modules)) {
                        _modules = modules;
                    } else if (angular.isString(modules)) {
                        _modules = modules.split(/[\s,;|]/g);
                    } else {
                        throw '[translator][load] modules parameter must be an array or a string !';
                    }

                    if (!_cache[_currentLanguage]) {
                        _cache[_currentLanguage] = {};
                    }

                    angular.forEach(_modules, function (module) {
                        if (_allModules.indexOf(module) === -1) {
                            _allModules.push(module);
                        }

                        if (!_cache[_currentLanguage][module]) {
                            _cache[_currentLanguage][module] = {};
                            requestsTab.push($http.get([newBP, newRP, module, '/Messages_',  _currentLanguage,'.json'].join('')).then(function (json) {
                                _cache[_currentLanguage][module] = json.data;
                                safeApply(function () {
                                    angular.extend($rootScope.i18n, json.data);
                                });
                                return $rootScope.i18n;
                            }, function () {
                                return $http.get([newBP, newRP, module, '/Messages_en_GB.json'].join('')).then(function (json) {
                                    _cache[_currentLanguage][module] = json.data;
                                    safeApply(function () {
                                        angular.extend($rootScope.i18n, json.data);
                                    });
                                    return $rootScope.i18n;
                                }, function () {
                                    return $http.get([newBP, newRP, module, '/Messages_fr_FR.json'].join('')).then(function (json) {
                                        _cache[_currentLanguage][module] = json.data;
                                        safeApply(function () {
                                            angular.extend($rootScope.i18n, json.data);
                                        });
                                        return $rootScope.i18n;
                                    });
                                });
                            }));
                        } else {
                            requestsTab.push($q.when('start').then(function () {
                                safeApply(function () {
                                    angular.extend($rootScope.i18n, _cache[_currentLanguage][module]);
                                });
                                return $rootScope.i18n;
                            }));
                        }
                    });

                    return $q.all(requestsTab).then(function () {
                        return $rootScope.i18n;
                    });
                }
            };

        // Check if rootScope has i18n
        if ($rootScope.i18n === undefined) {
            $rootScope.i18n = {};
        }

        $rootScope.tr = _translator.tr;
        $rootScope.trpl = _translator.trpl;

        _translator.setLanguage(_translator.getLanguage());

        return _translator;
    }];
});
