/**
 * @ngdoc service
 * @name ng-ovh-toaster.ToastProvider
 * @description
 *
 * Toaster is a component to show an in-app notification, like a toast for android applications
 */
import angular from 'angular';

export default function() {
  let hideAfter = 7;

  function show(type, msg, opts) {
    return new Messenger().post(
      angular.extend(
        {
          type,
          message: msg,
          hideAfter,
          showCloseButton: true,
        },
        opts,
      ),
    );
  }

  Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air',
  };

  return {
    /**
     * @ngdoc function
     * @name setExtraClasses
     * @methodOf ng-ovh-toaster.ToastProvider
     * @description
     * Append extra classes to the object
     *
     * @param {string} extraClasses Extra classes
     *                 default: 'messenger-fixed messenger-on-bottom messenger-on-right'
     */
    setExtraClasses(extraClasses) {
      Messenger.options.extraClasses = extraClasses;
    },

    /**
     * @ngdoc function
     * @name setTheme
     * @methodOf ng-ovh-toaster.ToastProvider
     * @description
     * Change the them of the notifications
     *
     * @param {string} theme Theme refer to <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
     *                       (default: air)
     */
    setTheme(theme) {
      Messenger.options.theme = theme;
    },

    /**
     * @ngdoc function
     * @name setHideAfter
     * @methodOf ng-ovh-toaster.ToastProvider
     * @description
     * Change the number of seconds before hiding the notification
     *
     * @param {int} _hideAfter Hide the message after the provided number of seconds (default: 7)
     */
    setHideAfter(_hideAfter) {
      hideAfter = _hideAfter;
    },

    $get: /* @ngInject */ function $get($sanitize) {
      /**
       * @ngdoc object
       * @name ng-ovh-toaster.Toast
       *
       *
       * @description
       * Toaster is a component to show an in-app notification,
       * like a toast for android applications
       *
       * To add a notification, you had to inject Toast as dependency
       * and use it like this example inside a controller
       * <pre>
       *  angular.module('myApp').controller('iLikeLicorn',[ 'Toast', function (Toast) {
       *       'use strict';
       *
       *       Toast.success('Licorns eat toast?');
       *
       *   }]);
       * </pre>
       *
       * Toast can by targetted with an ID. So, you can update a toast on-the-fly, like this:
       * <pre>
       *   Toast.info('Loading...', {
       *        id: 42,
       *        hideAfter: false
       *   });
       *
       *   $timeout(function () {
       *       Toast.success('Done!', {
       *           id: 42
       *       });
       *   }, 2000);
       * </pre>
       *
       * Also, a main Toast fct returns the instance of the Toast created.
       * Then you can play with it!
       * <pre>
       *        var msg = Toast.info('Hello!', {
       *       hideAfter: false
       *   });
       *
       *        $timeout(function () {
       *       Toast.hide(msg);
       *       $timeout(function () {
       *           Toast.show(msg);
       *       }, 2000);
       *   }, 2000);
       * </pre>
       *
       * The full list of <b>opts</b> in functions :
       * <ul>
       *     <li><b>message</b>: The text of the message</li>
       *     <li><b>type</b>: info, error or success are understood by the provided themes.
       *      You can also pass your own string, and that class will be added</li>
       *     <li><b>theme</b>: What theme class should be applied to the message?
       *      Defaults to the theme set for Messenger in general</li>
       *     <li><b>id</b>: A unique id. If supplied, only one message with that ID will be shown
       *      at a time</li>
       *     <li><b>singleton</b>: Hide the newer message if there is an id collision,
       *      as opposed to the older message</li>
       *     <li><b>actions</b>: Action links to put in the message,
       *      see the 'Actions' section on this page</li>
       *     <li><b>hideAfter</b>: Hide the message after the provided number of seconds</li>
       *     <li><b>showCloseButton</b>: Should a close button be added to the message?</li>
       *     <li><b>closeButtonText</b>: Specify the text the close button should use
       *      (default ×)</li>
       * </ul>
       */
      return {
        /**
         * @ngdoc function
         * @name success
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display a success message
         *
         * @param {string} msg Message to show
         * @param {object=} opts  Object to configure lib use to show notification.
         *                        Please report to <a href="https://github.com/HubSpot/messenger">Messenger repo</a>
         *                        documentation. Inside parameters, you can add all parameters
         *                        from Messenger library:
         *                        <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
         * @returns {object} Notification instance
         */
        success(msg, opts) {
          return show('success', $sanitize(msg), opts);
        },

        /**
         * @ngdoc function
         * @name info
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display an information message
         *
         * @param {string} msg Message to show
         * @param {object=} opts  Object to configure lib use to show notification.
         *                        Please report to <a href="https://github.com/HubSpot/messenger">Messenger repo</a>
         *                        documentation. Inside parameters, you can add all parameters
         *                        from Messenger library:
         *                        <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
         * @returns {object} Notification instance
         */
        info(msg, opts) {
          return show('info', $sanitize(msg), opts);
        },

        /**
         * @ngdoc function
         * @name error
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display a error message
         *
         * @param {string} msg Message to show
         * @param {object=} opts  Object to configure lib use to show notification.
         *                        Please report to <a href="https://github.com/HubSpot/messenger">Messenger repo</a>
         *                        documentation. Inside parameters, you can add all parameters
         *                        from Messenger library:
         *                        <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
         * @returns {object} Notification instance
         */
        error(msg, opts) {
          return show('error', $sanitize(msg), opts);
        },

        /**
         * @ngdoc function
         * @name light
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display a light message
         *
         * @param {string} msg Message to show
         * @param {object=} opts  Object to configure lib use to show notification.
         *                        Please report to <a href="https://github.com/HubSpot/messenger">Messenger repo</a>
         *                        documentation. Inside parameters, you can add all parameters
         *                        from Messenger library:
         *                        <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
         * @returns {object} Notification instance
         */
        light(msg, opts) {
          return show('light', $sanitize(msg), opts);
        },

        /**
         * @ngdoc function
         * @name infoWithInProgress
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display an information message with progress
         *
         * @param {string} progressMsg Progress message
         * @param {string} msg         Message to show
         * @param {object=} opts       Object to configure lib use to show notification.
         *                             Please report to <a href="https://github.com/HubSpot/messenger">Messenger repo</a>
         *                             documentation. Inside parameters, you can add all parameters
         *                             from Messenger library:
         *                             <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
         * @returns {object} Notification instance
         */
        infoWithInProgress(progressMsg, msg, opts) {
          return show(
            'info',
            `${$sanitize(msg)}<br/>` +
              `<span class="text-muted">${$sanitize(progressMsg)}</span>`,
            opts,
          );
        },

        /**
         * @ngdoc function
         * @name update
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Update a specific notification
         *
         * @param {object} notification instance
         * @param {string} msg Message to show
         * @param {object=} opts  Object to configure lib use to show notification.
         *                        Please report to <a href="https://github.com/HubSpot/messenger">Messenger repo</a>
         *                        documentation. Inside parameters, you can add all parameters
         *                        from Messenger library:
         *                        <a href="https://github.com/HubSpot/messenger/blob/master/docs/intro.md">Messenger documentation</a>
         * @returns {object} Notification instance
         */
        update(instance, msg, opts) {
          return instance.update($sanitize(msg), opts);
        },

        /**
         * @ngdoc function
         * @name show
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display a specific notification
         *
         * @param {object} notification instance
         * @returns {object} Notification instance
         */
        show(instance) {
          return instance.show();
        },

        /**
         * @ngdoc function
         * @name hide
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Hide a specific notification
         *
         * @param {object} notification instance
         * @returns {object} Notification instance
         */
        hide(instance) {
          return instance.hide();
        },

        /**
         * @ngdoc function
         * @name hideAll
         * @methodOf ng-ovh-toaster.Toast
         *
         * @description
         * Display all notifications
         */
        hideAll() {
          return new Messenger().hideAll();
        },
      };
    },
  };
}
