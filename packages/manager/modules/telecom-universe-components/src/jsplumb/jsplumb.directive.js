import angular from 'angular';
import $ from 'jquery';
import debounce from 'lodash/debounce';
import set from 'lodash/set';

export default /* @ngInject */ (TUC_JS_PLUMB) => ({
  restrict: 'A',
  controller: 'TucJsplumbCtrl',
  scope: {
    options: '=tucJsplumb',
    instance: '=tucJsplumbInstance',
  },
  bindToController: true,
  link: {
    pre(iScope, iElement, iAttrs, $ctrl) {
      // create a jsplumb instance with given options and with directive element as container

      set($ctrl, 'instance', TUC_JS_PLUMB.getInstance(angular.extend($ctrl.options || {}, {
        Container: iElement,
      })));

      // avoid jsplumb to draw something when endpoints or connections are added to instance
      $ctrl.instance.setSuspendDrawing(true);

      // set a custom redraw method for jsplumb instance
      set($ctrl, 'instance.customRepaint', $ctrl.askForRepaint);

      // handle window resize
      const onResizePage = debounce(() => {
        if ($ctrl.instance) {
          $ctrl.instance.customRepaint();
        }
      }, 33);
      const windowElt = $(window);

      windowElt.on('resize', onResizePage);

      /**
       * window.on("resize") is not triggered when scrollbar appears and might cause a display bug.
       * We need to watch the window element to handle the scrollbar display. We also need to keep
       * the window.on("resize") binding because it will be triggered as soon as window is resized.
       */
      iScope.$watch(() => ({
        h: windowElt.height(),
        w: windowElt.width(),
      }), onResizePage, true);

      iScope.$on('$destroy', () => {
        if ($ctrl.instance) {
          windowElt.off('resize', onResizePage);
          $ctrl.instance.reset();
        }
        set($ctrl, 'instance', null);
      });
    },
  },
});
