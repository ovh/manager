angular.module('managerApp').directive('ngPluralizeHtml', ($locale, $interpolate, $log) => {
  const BRACE = /{}/g;
  const IS_WHEN = /^when(Minus)?(.+)$/;

  return {
    restrict: 'EA',
    link(scope, element, attr) {
      const numberExp = attr.count;
      const whenExp = attr.$attr.when && element.attr(attr.$attr.when); // we have {{}} in attrs
      const offset = attr.offset || 0;
      const whens = scope.$eval(whenExp) || {};
      const whensExpFns = {};
      const startSymbol = $interpolate.startSymbol();
      const endSymbol = $interpolate.endSymbol();
      const braceReplacement = `${startSymbol + numberExp}-${offset}${endSymbol}`;
      let watchRemover = angular.noop;
      let lastCount;

      function updateElementText(newText) {
        element.html(newText || '');
      }

      angular.forEach(attr, (expression, attributeName) => {
        const tmpMatch = IS_WHEN.exec(attributeName);
        if (tmpMatch) {
          const whenKey = (tmpMatch[1] ? '-' : '') + tmpMatch[2];
          whens[whenKey] = element.attr(attr.$attr[attributeName]);
        }
      });

      angular.forEach(whens, (expression, key) => {
        whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
      });

      scope.$watch(numberExp, (newVal) => {
        let count = parseFloat(newVal);
        const countIsNaN = _.isNaN(count);

        if (!countIsNaN && !(count in whens)) {
          // If an explicit number rule such as 1, 2, 3... is defined, just use it.
          // Otherwise, check it against pluralization rules in $locale service.
          count = $locale.pluralCat(count - offset);
        }

        // If both `count` and `lastCount` are NaN, we don't need to re-register a watch.
        // In JS `NaN !== NaN`, so we have to exlicitly check.
        if ((count !== lastCount) && !(countIsNaN && _.isNaN(lastCount))) {
          watchRemover();
          const whenExpFn = whensExpFns[count];
          if (whenExpFn === undefined) {
            $log.debug(`ngPluralize: no rule defined for '${count}' in ${whenExp}`);
            watchRemover = angular.noop;
            updateElementText();
          } else {
            watchRemover = scope.$watch(whenExpFn, updateElementText);
          }
          lastCount = count;
        }
      });
    },
  };
});
