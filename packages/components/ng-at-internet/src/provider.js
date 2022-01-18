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
