import angular from 'angular';

// linky returns escaped HTML which isn't good if a text already contains HTML.  We don't want that.  Issue => https://github.com/angular/angular.js/issues/9586
// In addition, we wan't to show unsafe HTML as escaped HTML.
// This file is a copy of https://github.com/angular/angular.js/blob/master/src/ngSanitize/filter/linky.js with some changes to make it works.
export default /* @ngInject */ ($sanitize) => {
  const LINKY_URL_REGEXP = /((s?ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i;
  const MAILTO_REGEXP = /^mailto:/i;

  const linkyMinErr = angular.$$minErr('linky');
  const { isDefined } = angular;
  const { isFunction } = angular;
  const { isObject } = angular;
  const { isString } = angular;

  return function (text, target, attributes) { // eslint-disable-line func-names
    const formattedText = unescape(text); // CHANGES unescape input text
    if (formattedText == null || formattedText === '') return formattedText;
    if (!isString(formattedText)) throw linkyMinErr('notstring', 'Expected string but received: {0}', formattedText);

    const attributesFn = isFunction(attributes) // eslint-disable-line no-nested-ternary
      ? attributes
      : isObject(attributes)
        ? function getAttributesObject() { return attributes; }
        : function getEmptyAttributesObject() { return {}; };

    let match;
    let raw = formattedText;
    const html = [];
    let url;
    let i;
    while ((match = raw.match(LINKY_URL_REGEXP))) { // eslint-disable-line no-cond-assign
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0]; // eslint-disable-line prefer-destructuring
      // if we did not match ftp/http/www/mailto then assume mailto
      if (!match[2] && !match[4]) {
        url = (match[3] ? 'http://' : 'mailto:') + url;
      }
      i = match.index;
      addText(raw.substr(0, i)); // eslint-disable-line no-use-before-define
      addLink(url, match[0].replace(MAILTO_REGEXP, '')); // eslint-disable-line no-use-before-define
      raw = raw.substring(i + match[0].length);
    }
    addText(raw); // eslint-disable-line no-use-before-define
    return $sanitize(html.join(''));

    function addText(text) { // eslint-disable-line no-shadow
      if (!text) {
        return;
      }

      // CHANGES use $sanitize instead of sanitizeText
      try {
        html.push($sanitize(text));
      } catch (error) { // eslint-disable-line no-unused-vars
        html.push(escape(text));
      }
    }

    function addLink(url, text) { // eslint-disable-line no-shadow
      let key;
      const linkAttributes = attributesFn(url);
      html.push('<a ');

      for (key in linkAttributes) { // eslint-disable-line guard-for-in,no-restricted-syntax
        html.push(`${key}="${linkAttributes[key]}" `);
      }

      if (isDefined(target) && !('target' in linkAttributes)) {
        html.push(
          'target="',
          target,
          '" ',
        );
      }
      html.push(
        'href="',
        url.replace(/"/g, '&quot;'),
        '">',
      );
      addText(text);
      html.push('</a>');
    }
  };
};
