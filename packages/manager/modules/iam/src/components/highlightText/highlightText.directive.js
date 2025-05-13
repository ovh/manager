import { debounce as lodashDebounce } from 'lodash-es';

/**
 * @description
 * This directive highlights text inside the element on witch it is set
 * by modifying its innerHTML
 *
 * <div
 *   data-iam-highlight-text="super"
 *   data-iam-highlight-text-change="doSomethingWith(text)"
 *   data-iam-highlight-text-options="{ background: 'p-200', debounce: 400, minLength: 2 }"
 * >
 *   My super text
 * </div>
 *
 * Will result in
 *
 * <div>My <span class="oui-background-p-200">super</span> text</div>
 */

const defaultOptions = {
  background: 'p-200',
  debounce: 400,
  minLength: 2,
};

export default () => ({
  scope: {
    iamHighlightTextChange: '&?',
    iamHighlightTextOptions: '<?',
  },
  link(scope, angularElement, attributes) {
    const {
      iamHighlightTextChange: onChange,
      iamHighlightTextOptions: options,
    } = scope;
    const { background, debounce, minLength } = {
      ...defaultOptions,
      ...options,
    };
    const element = angularElement[0];

    scope.$watch(
      () => attributes.iamHighlightText,
      lodashDebounce((text) => {
        const { innerText } = element;
        const regExp = new RegExp(`(${text})`, 'gi');

        element.innerHTML = innerText;

        if (!text || text.length < minLength) {
          return;
        }

        if (regExp.test(innerText)) {
          element.innerHTML = innerText.replace(
            regExp,
            `<span class="oui-background-${background}">$1</span>`,
          );
          if (onChange) {
            onChange({ text });
          }
        }
      }, debounce),
    );
  },
});
