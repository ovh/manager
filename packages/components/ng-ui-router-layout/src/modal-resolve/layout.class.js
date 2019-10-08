import get from 'lodash/get';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

export default class ModalResolveLayout {
  /**
   *  Check if state applies the modalResolve layout.
   *  @param  {Object}  state A ui-router state declaration.
   *  @return {Boolean}
   */
  static isLayoutAppliedToState(state) {
    const layout = get(state, 'self.layout');

    return (isString(layout) && layout === 'modalResolve')
      || (isObject(layout) && get(layout, 'name') === 'modalResolve');
  }

  /**
   *  Get the layout options for modalResolve type.
   *  @param  {Object} state A ui-router state declaration.
   *  @return {Object}       An object representing options used for modal opening.
   */
  static getLayoutOptions(state) {
    return {
      name: 'modalResolve',
      modalOptions: {
        template: get(state, 'template'),
        templateUrl: get(state, 'templateUrl'),
        controller: get(state, 'controller'),
        controllerAs: get(state, 'controllerAs'),
        component: get(state, 'component'),
        componentProvider: get(state, 'componentProvider'),
      },
    };
  }
}
