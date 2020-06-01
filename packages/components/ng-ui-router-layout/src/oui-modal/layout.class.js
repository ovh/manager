import { get, isObject, isString, merge } from 'lodash-es';

import { LAYOUT_NAME } from './constants';

export default class OuiModalLayout {
  /**
   *  Check if state applies the ouiModal layout.
   *  @param  {Object}  state A ui-router state declaration.
   *  @return {Boolean}
   */
  static isLayoutAppliedToState(state) {
    const layout = get(state, 'self.layout');

    return (
      (isString(layout) && layout === LAYOUT_NAME) ||
      (isObject(layout) && get(layout, 'name') === LAYOUT_NAME)
    );
  }

  /**
   *  Get the layout options for ouiModal type.
   *  @param  {Object} state A ui-router state declaration.
   *  @return {Object}       An object representing options used for modal opening.
   */
  static getLayoutOptions(state) {
    return {
      name: LAYOUT_NAME,
      modalOptions: merge(get(state, 'layout.options', {}), {
        template: get(state, 'template'),
        templateUrl: get(state, 'templateUrl'),
        controller: get(state, 'controller'),
        controllerAs: get(state, 'controllerAs'),
        component: get(state, 'component'),
        componentProvider: get(state, 'componentProvider'),
      }),
    };
  }
}
