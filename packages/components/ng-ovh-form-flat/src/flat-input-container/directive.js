/**
 * @ngdoc directive
 * @name ngOvhFormFlat.directive:flat-input-container
 * @restrict EA
 *
 * @description
 * <p>Container for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <div flat-input-container>
                <div class="row">
                    <div class="col-xs-12">
                        <label class="control-label" for="myInputId">
                            My Input Label Example
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <input
                            id="myInputId"
                            name="myInputName"
                            class="form-control"
                            placeholder="My Input Label Example"
                            >
                    </div>
                </div>
            </div>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ngOvhFormFlat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
import angular from 'angular';
import $ from 'jquery';

export default function () {
  const CSS_VALID = 'flat-valid';
  const CSS_INVALID = 'flat-invalid';
  const CSS_DIRTY = 'flat-dirty';
  const CSS_HIDE = 'flat-hide';
  const CSS_SHOW = 'flat-show';
  const CSS_FOCUS = 'flat-focus';
  const CSS_EMPTY = 'flat-empty';

  return {
    restrict: 'EA',
    scope: {},
    priority: 10,
    controller() {
      let elem;
      let inputs;
      let label;
      const items = {};

      this.setElem = function (_elem) {
        elem = _elem;
      };

      this.setLabel = function (_label) {
        label = _label;
      };

      this.setInputs = function (_inputs) {
        inputs = _inputs;
      };

      this.setItemValidity = function (_item, _isValid) {
        items[_item] = _isValid; // eslint-disable-line no-underscore-dangle
        this.checkValidity();
      };

      this.checkValidity = function () {
        let isValid = true;

        /* eslint-disable-next-line no-restricted-syntax */
        for (const key in items) {
          if (!items[key]) {
            isValid = false;
            break;
          }
        }

        if (elem) {
          if (isValid) {
            elem.removeClass(CSS_INVALID).addClass(CSS_VALID);
          } else {
            elem.removeClass(CSS_VALID).addClass(CSS_INVALID);
          }
        }
      };

      this.setDirty = function (isDirty) {
        if (isDirty) {
          elem.addClass(CSS_DIRTY);
        } else {
          elem.removeClass(CSS_DIRTY);
        }
      };

      this.setEmpty = function (isEmpty) {
        if (isEmpty) {
          elem.addClass(CSS_EMPTY);
        } else {
          elem.removeClass(CSS_EMPTY);
        }
      };

      this.checkLabelVisibility = function (alwaysShow) {
        if (angular.isUndefined(alwaysShow)) {
          alwaysShow = false; // eslint-disable-line no-param-reassign
        }

        if (label) {
          if (inputs.val() === '' && alwaysShow === false) {
            label.removeClass(CSS_SHOW).addClass(CSS_HIDE);
          } else {
            label.removeClass(CSS_HIDE).addClass(CSS_SHOW);
          }
        }
      };
    },
    compile: function compile(element) {
      element.find('input, textarea').each(function () {
        if ($(this).parents('.input-group-btn').size() === 0) {
          $(this).addClass('flat-item');
        }
      });

      element.find('select').each(function () {
        $(this).addClass('flat-select');
      });

      return {
        post: function postLink(scope, elem, iAttrs, ctrl) {
          let label;

          elem.find('label').each(function () {
            if ($(this).parents('.input-group-btn').size() === 0) {
              label = $(this);
            }
          });

          const inputs = elem.find('.flat-item, .flat-select');

          ctrl.setElem(elem);
          ctrl.setInputs(inputs);

          if (label) {
            ctrl.setLabel(label);
            label.addClass('flat-hide');
          }

          inputs.on({
            focus() {
              elem.addClass(CSS_FOCUS);
            },
            blur() {
              elem.removeClass(CSS_FOCUS);
            },
          });
        },
      };
    },
  };
}
