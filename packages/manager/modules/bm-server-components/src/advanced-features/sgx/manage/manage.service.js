import indexOf from 'lodash/indexOf';
import snakeCase from 'lodash/snakeCase';

import { DISPLAYING_ORDER } from './manage.constants';

export default class {
  static buildActivationMode(schema) {
    return (
      schema.models['dedicated.server.BiosSettingsSgxStatusEnum'].enum
        // Sort by displaying order
        .sort(
          (a, b) => indexOf(DISPLAYING_ORDER, a) - indexOf(DISPLAYING_ORDER, b),
        )
        .map((value) => ({
          textId: snakeCase(value),
          values: [`${value}`],
        }))
    );
  }

  static buildPrmrr(prmrrValues) {
    return prmrrValues.sort(
      (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10),
    );
  }
}
