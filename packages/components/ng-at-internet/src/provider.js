import OvhAtInternet from '@ovh-ux/ovh-at-internet';

/**
 * @ngdoc service
 * @require ATInternet smarttag.js library
 * @name atInternet
 * @description
 * Angular service wrapping the AtInternet tracking Javascript library.
 *
 * More informations : http://developers.atinternet-solutions.com/javascript-fr/bien-commencer-fr-javascript-fr/initialisation-du-tracker-javascript/
 */
/**
 * @ngdoc service
 * @require ATInternet smarttag.js library
 * @name atInternetProvider
 * @description
 * Provider allowing configuration for atInternet service.
 */
export default class NgAtInternet extends OvhAtInternet {
  $get() {
    return this;
  }
}

// export default /* @ngInject */ function() {
//   const ovhAtInternetInstance = new OvhAtInternet();
//
//   /**
//    * @ngdoc function
//    * @name atInternet.isDefaultSet
//    * @methodOf atInternetProvider
//    * @description
//    * Check if default data has been set.
//    */
//   this.isDefaultSet = function isDefaultSet() {
//     return ovhAtInternetInstance.config.isDefaultSet();
//   };
//
//   /**
//    * @ngdoc function
//    * @name atInternet.setDefaults
//    * @methodOf atInternetProvider
//    * @param {Object} def Default values to be sent.
//    * @description
//    * Configure default data to be sent with each tracking data.
//    */
//   this.setDefaults = function setDefaults(def) {
//     ovhAtInternetInstance.config.setDefaults(def);
//   };
//
//   /**
//    * @ngdoc function
//    * @name atInternet.getDefaults
//    * @methodOf atInternetProvider
//    * @description
//    * Retrieve default data to be sent with each tracking data.
//    */
//   this.getDefaults = function getDefaults() {
//     return angular.copy(ovhAtInternetInstance.config.getDefaults);
//   };
//
//   /**
//    * @ngdoc function
//    * @name atInternet.getDefaultsPromise
//    * @methodOf atInternetProvider
//    * @description
//    * Retrieve the default promise setted by atInternet.setDefaultsPromise method.
//    */
//   this.getDefaultsPromise = function getDefaultsPromise() {
//     return ovhAtInternetInstance.config.getDefaultsPromise();
//   };
//
//   /**
//    * @ngdoc function
//    * @name atInternet.setEnabled
//    * @methodOf atInternetProvider
//    * @param {Boolean} state True to enable tracking, false otherwise.
//    * @description
//    * Enable or disable tracking.
//    */
//   this.setEnabled = function setEnabled(state) {
//     ovhAtInternetInstance.config.setEnabled(state);
//   };
//
//   /**
//    * @ngdoc function
//    * @name atInternet.setDebug
//    * @methodOf atInternetProvider
//    * @param {Boolean} state True to enable console logs, false otherwise.
//    * @description
//    * Enable or disable logging of tracking data in the Javascript console.
//    */
//   this.setDebug = function setDebug(state) {
//     ovhAtInternetInstance.config.setDebug(state);
//   };
//
//   /**
//    * @ngdoc function
//    * @name atInternet.setRegion
//    * @methodOf atInternetProvider
//    * @param {String} region Region where to get custom vars
//    * @description
//    * Set the region in order to get right default custom vars.
//    */
//   this.setRegion = function setRegion(region) {
//     ovhAtInternetInstance.config.setRegion(region);
//   };
//
//   this.$get = /* @ngInject */ function $get() {
//     ovhAtInternetInstance.init();
//
//     console.log('oui ?');
//
//     return {
//       ...ovhAtInternetInstance,
//
//       /**
//        * @ngdoc function
//        * @name atInternet.setDefaults
//        * @methodOf atInternet
//        * @param {Object} def Default values to be sent.
//        * @description
//        * Configure default data to be sent with each tracking data.
//        */
//       setDefaults(def) {
//         ovhAtInternetInstance.config.setDefaults(def);
//       },
//
//       /**
//        * @ngdoc function
//        * @name atInternet.setDefaultsPromise
//        * @methodOf atInternet
//        * @param {Promise} promise A promise that needs to be resolved before sending hits.
//        * @description
//        * Configure the defaults promise that needs to be resolved before sending hits (to be sure
//        * that defaults are setted).
//        */
//       setDefaultsPromise(promise) {
//         ovhAtInternetInstance.config.setDefaultsPromise(promise);
//       },
//
//       /**
//        * @ngdoc function
//        * @name atInternet.setEnabled
//        * @methodOf atInternet
//        * @param {Boolean} state True to enable tracking, false otherwise.
//        * @description
//        * Enable or disable tracking.
//        */
//       setEnabled(state) {
//         ovhAtInternetInstance.config.setEnabled(state);
//       },
//
//       /**
//        * @ngdoc function
//        * @name getConfig
//        * @methodOf atInternet
//        * @description
//        *
//        * Returns current atInternet's provider configuration.
//        */
//       getConfig() {
//         return angular.copy(ovhAtInternetInstance.config);
//       },
//     };
//   };
// }
