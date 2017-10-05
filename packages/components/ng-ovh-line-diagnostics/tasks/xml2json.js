module.exports = function(grunt) {
    'use strict';

    var _ = require('lodash');

    grunt.registerMultiTask('xml2json', 'Transform XML to JSON', function() {

        function formatTranslation(object) {
            var result = {};
            object.forEach(function(elem) {
                if (elem.hasOwnProperty('id') && elem.hasOwnProperty('text') && !~elem.id.indexOf('>')) {
                    result[elem.id] = elem.text;
                }
                else {
                    grunt.fail.fatal('Error: xml: format is incorrect');
                }
            });
            return result;
        }

        function toJson(filePath) {
            var data = grunt.file.read(filePath),
                reg = /<translation\s+id="([\w-]+?)"\s*(qtlid="([0-9]+)")?\s*(?:translate="none")?\s*?>((?:.|\n|\r)*?)<\/translation>/gi,
                obj = [], match;

            while ((match = reg.exec(data))) {
                var elem = {
                    id: match[1],
                    text: match[4].replace(/&#13;\n/g, " ")
                };
                obj.push(elem);
            }
            return JSON.stringify(formatTranslation(obj));
        }

        var files = grunt.file.expand(this.data);
        files.forEach(function(file) {
            var newFilePath = file.replace(/\.xml/, '.json');
            var json = toJson(file);
            grunt.file.write(newFilePath, json);
        });


        // Extend missing key
        var regExpFrFR = new RegExp(/Messages_fr_FR\.json$/g);
        var regExpOther = new RegExp(/Messages_fr_FR\.json$/g);
        var memoize = {};

        this.data.forEach(function (d) {

            var path = d.replace(/\.xml/g, '.json');
            var jsonFiles = grunt.file.expand(path);
            var jsonFrFR = jsonFiles.filter(function (src) {
                return src.match(regExpFrFR);
            });


            grunt.log.subhead('Extending translation');

            var jsonOther = jsonFiles.filter(function (src) {
                return !src.match(regExpOther);
            }).map(function (filePath) {

                var formattedPath = filePath.replace(/_.._..\.json$/g, ''),
                    memoizePathFr = 'frFR' + formattedPath;

                //Memorize data fr
                if (!memoize[memoizePathFr]) {
                    jsonFrFR.filter(function (src) {
                        return formattedPath === src.replace(/_.._..\.json$/g, '');
                    }).map(function (p) {
                        memoize[memoizePathFr] = grunt.file.readJSON(p);
                    })[0];
                }

                var data = grunt.file.readJSON(filePath),
                    miss = false;
                if (~filePath.indexOf('_en_GB')) {
                    grunt.log.subhead('Checking missing translation in ' + filePath);
                    _.forEach(memoize[memoizePathFr], function (v, k) {
                        if (!data[k]) {
                            miss = true;
                            grunt.log.warn(k + ' >>> Replace by "' + v + '"');
                        }
                    });

                    if (!miss) {
                        grunt.log.ok('All translation done');
                    }
                }
                grunt.file.write(filePath, JSON.stringify(_.merge( _.cloneDeep(memoize[memoizePathFr]), data)));
            });
        });

    });
};
