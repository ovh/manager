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

  return function htmlStringLinky(text, target, attributes) {
    const formattedText = unescape(text); // CHANGES unescape input text
    if (formattedText == null || formattedText === '') return formattedText;
    if (!isString(formattedText))
      throw linkyMinErr(
        'notstring',
        'Expected string but received: {0}',
        formattedText,
      );

    // eslint-disable-next-line no-nested-ternary
    const attributesFn = isFunction(attributes)
      ? attributes
      : isObject(attributes)
      ? function getAttributesObject() {
          return attributes;
        }
      : function getEmptyAttributesObject() {
          return {};
        };

    let match;
    let raw = formattedText;
    const html = [];
    let url;
    let i;
    // eslint-disable-next-line no-cond-assign
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      // eslint-disable-next-line prefer-destructuring
      url = match[0];
      // if we did not match ftp/http/www/mailto then assume mailto
      if (!match[2] && !match[4]) {
        url = (match[3] ? 'http://' : 'mailto:') + url;
      }
      i = match.index;
      // eslint-disable-next-line no-use-before-define
      addText(raw.substr(0, i));
      // eslint-disable-next-line no-use-before-define
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    // eslint-disable-next-line no-use-before-define
    addText(raw);
    return $sanitize(html.join(''));

    // eslint-disable-next-line no-shadow
    function addText(text) {
      if (!text) {
        return;
      }

      // CHANGES use $sanitize instead of sanitizeText
      try {
        html.push($sanitize(text));
      } catch (error) {
        html.push(escape(text));
      }
    }

    // eslint-disable-next-line no-shadow
    function addLink(url, text) {
      let key;
      const linkAttributes = attributesFn(url);
      html.push('<a ');

      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (key in linkAttributes) {
        html.push(`${key}="${linkAttributes[key]}" `);
      }

      if (isDefined(target) && !('target' in linkAttributes)) {
        html.push('target="', target, '" ');
      }
      html.push('href="', url.replace(/"/g, '&quot;'), '">');
      addText(text);
      html.push('</a>');
    }
  };
};
