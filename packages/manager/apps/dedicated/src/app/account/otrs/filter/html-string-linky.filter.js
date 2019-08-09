// linky returns escaped HTML which isn't good if a text already contains HTML.  We don't want that.  Issue => https://github.com/angular/angular.js/issues/9586
// In addition, we wan't to show unsafe HTML as escaped HTML.
// This file is a copy of https://github.com/angular/angular.js/blob/master/src/ngSanitize/filter/linky.js with some changes to make it works.
angular.module('Module.otrs.filters').filter('htmlStringLinky', [
  '$sanitize',
  function ($sanitize) {
    const LINKY_URL_REGEXP = /((s?ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i;
    const MAILTO_REGEXP = /^mailto:/i;

    const linkyMinErr = angular.$$minErr('linky');
    const isDefined = angular.isDefined;
    const isFunction = angular.isFunction;
    const isObject = angular.isObject;
    const isString = angular.isString;

    return function (textParam, target, attributes) {
      let text = textParam;
      text = _.unescape(text);
      if (text == null || text === '') {
        return text;
      }

      if (!isString(text)) {
        throw linkyMinErr('notstring', 'Expected string but received: {0}', text);
      }

      const attributesFn = isFunction(attributes)
        ? attributes
        : isObject(attributes)
          ? function getAttributesObject() {
            return attributes;
          }
          : function getEmptyAttributesObject() {
            return {};
          };

      let raw = text;
      const html = [];
      let url;
      let i;
      let match = raw.match(LINKY_URL_REGEXP);
      while (match) {
        // We can not end in these as they are sometimes found at the end of the sentence
        url = match[0];

        // if we did not match ftp/http/www/mailto then assume mailto
        if (!match[2] && !match[4]) {
          url = (match[3] ? 'http://' : 'mailto:') + url;
        }
        i = match.index;
        addText(raw.substr(0, i));
        addLink(url, match[0].replace(MAILTO_REGEXP, ''));
        raw = raw.substring(i + match[0].length);
        match = raw.match(LINKY_URL_REGEXP);
      }
      addText(raw);
      return $sanitize(html.join(''));

      function addText(_text) {
        if (!_text) {
          return;
        }
        try {
          html.push($sanitize(_text));
        } catch (error) { // eslint-disable-line no-unused-vars
          html.push(_.escape(_text));
        }
      }

      function addLink(_url, _text) {
        let key;
        const linkAttributes = attributesFn(_url);
        html.push('<a ');

        _.forEach(linkAttributes, (attribute) => {
          key = attribute;
          html.push(`${key}="${linkAttributes[key]}" `);
        });

        if (isDefined(target) && !('target' in linkAttributes)) {
          html.push('target="', target, '" ');
        }
        html.push('href="', _url.replace(/"/g, '&quot;'), '">');
        addText(_text);
        html.push('</a>');
      }
    };
  },
]);
