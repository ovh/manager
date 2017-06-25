/**
 * @ngdoc service
 * @name ovh-angular-simple-country-list.OvhSimpleCountryList
 * @description
 *
 * Provide information about all countries
 */
angular.module("ovh-angular-simple-country-list").service("OvhSimpleCountryList", function (OVH_SIMPLE_COUNTRY_LIST) {
    "use strict";

    /* This Object have some lazy builded properties. So we have to keep all of them in a cache,
    another comportment can introduce strange behavior with some framework using double binding
    like Angular. */

    var List = function () {
        // do nothing.
    };

    List.prototype.initArray = function () {
        if (this._data.asArray) {
            return;
        }

        this._data.asArray = [];

        for (var key in this._data.list) {
            if (this._data.list[key].lang[this._data.selectedLanguage]) {
                this._data.asArray.push(this._data.list[key].lang[this._data.selectedLanguage]);
            } else {
                this._data.asArray.push(this._data.list[key].lang.iso);
            }
        }
    };

    Object.defineProperties(List.prototype, {
        _data: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: {
                list: OVH_SIMPLE_COUNTRY_LIST,
                supportedLanguage: ["iso", "en_GB", "en_US"],
                selectedLanguage: "iso",
                asArray: null,
                asObject: null,
                asDataForSelect: null
            }
        },
        value: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function () {
                return this._data.list;
            }
        },
        length: {
            enumerable: false,
            configurable: false,
            set: function () {
                throw new Error('"length" is a read only property.');
            },
            get: function () {
                return Object.keys(this._data.list).length;
            }
        },
        asArray: {
            enumerable: false,
            configurable: false,
            set: function () {
                throw new Error('"asArray" is a read only property.');
            },
            get: function () {
                if (this._data.asArray) {
                    return this._data.asArray;
                }

                this.initArray();

                return this._data.asArray;
            }
        },
        asObject: {
            enumerable: false,
            configurable: false,
            set: function () {
                throw new Error('"asObject" is a read only property.');
            },
            get: function () {
                if (this._data.asObject) {
                    return this._data.asObject;
                }

                for (var key in this._data.list) {
                    if (this._data.list[key].lang[this._data.selectedLanguage]) {
                        this._data.asObject[key] = this._data.list[key].lang[this._data.selectedLanguage];
                    } else {
                        this._data.asObject[key] = this._data.list[key].lang.iso;
                    }
                }

                return this._data.asObject;
            }
        },
        asDataForSelect: {
            enumerable: false,
            configurable: false,
            set: function () {
                throw new Error('"asDataForSelect" is a read only property.');
            },
            get: function () {
                if (this._data.asDataForSelect) {
                    return this._data.asDataForSelect;
                }

                this._data.asDataForSelect = [];

                for (var key in this._data.list) {
                    if (this._data.list[key].lang[this._data.selectedLanguage]) {
                        this._data.asDataForSelect.push({
                            value: key,
                            label: this._data.list[key].lang[this._data.selectedLanguage]
                        });
                    } else {
                        this._data.asDataForSelect.push({
                            value: key,
                            label: this._data.list[key].lang.iso
                        });
                    }
                }

                return this._data.asDataForSelect;
            }
        },
        setLanguage: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (lang) {

                if (!lang) {
                    console.error("language is missing as first argument."); // eslint-disable-line no-console
                    console.info('supported languages: "' + // eslint-disable-line no-console
                        this._data.supportedLanguage.join('","') + '"');
                    return;
                }

                if (!~this._data.supportedLanguage.indexOf(lang)) {
                    console.error('"' + lang + '" is not a supported language.'); // eslint-disable-line no-console
                    console.info('supported languages: "' + // eslint-disable-line no-console
                        this._data.supportedLanguage.join('","') + '"');
                    return;
                }

                if (this._data.selectedLanguage !== lang) {
                    this._data.selectedLanguage = lang;

                    if (this._data.asArray) {
                        this._data.asArray = null;
                        this.initArray(); // force update
                    }

                    if (this._data.asObject) {
                        this._data.asObject = null;
                        this.initArray(); // force update
                    }

                    if (this._data.asDataForSelect) {
                        this._data.asDataForSelect = null;
                        this.initArray(); // force update
                    }
                }
            }
        }
    });

    return new List();
});

