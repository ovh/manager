import capitalize from 'lodash/capitalize';

import { ENGINE_LOGOS } from '../../databases.constants';

export default class {
  constructor() {
    this.capitalize = capitalize;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
  }

  handleVersionChange(engine, modelValue) {
    this.selectedEngine = engine;
    this.onChange({ selectedEngine: modelValue });
  }

  isDisabledVersion($item) {
    return (
      this.currentEngine &&
      this.currentEngine.selectedVersion.version > $item.version
    );
  }
}
