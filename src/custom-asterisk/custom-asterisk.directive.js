

/**
 *  Awesome directive that display an asterisk (*).
 *  Due to translation process &#42; codes are transformed to *.
 *  But this is not allowed for grunt translation task...
 *  So for using this awesome directive follow these steps :
 *  - in your translations add a html tag with class="tuc-custom-asterisk":
 *    <translation id="foo">I have an asterisk <span class="tuc-custom-asterisk"></span>
 *    inside my translation and I don't want to split my translation.</translation>
 *  - then in your html don't forget to add data-translate-compile attribute
 *    to allow ngTranslate to compile the directive added into translation :
 *      <p data-translate="foo"
 *         data-translate-compile>
 *      </p>
 */
export default () => ({
  restrict: 'C',
  template: '*',
});
