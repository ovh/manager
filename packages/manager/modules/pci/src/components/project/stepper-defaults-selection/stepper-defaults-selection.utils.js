import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import set from 'lodash/set';

const getDefaultValue = (field, thisObj) => {
  let defaultValue;
  if (thisObj.defaults[field.name] !== undefined) {
    defaultValue =
      isFunction(field.getDefault) &&
      field.getDefault(
        thisObj.defaults[field.name],
        thisObj[field.availableOptions],
      );
  }
  return defaultValue;
};

const onChangeAfterDefaultValueSet = (methodToCall, params, thisObj) => {
  if (thisObj[methodToCall] && isFunction(thisObj[methodToCall])) {
    return thisObj[methodToCall].call(
      thisObj,
      ...params.map((prop) => get(thisObj, prop)),
    );
  }
  return null;
};

export const setDefaultSelections = (
  configObj,
  DEFAULTS_MODEL,
  currentStep,
) => {
  return new Promise((resolve) => {
    (async () => {
      const thisObj = configObj;
      for (let i = 0; i < DEFAULTS_MODEL.length; i += 1) {
        const step = DEFAULTS_MODEL[i];
        for (let j = 0; j < step.fields.length; j += 1) {
          const defaultvalue = getDefaultValue(step.fields[j], thisObj);
          if (defaultvalue !== undefined) {
            set(thisObj, step.fields[j].model, defaultvalue);
            // eslint-disable-next-line no-await-in-loop
            await onChangeAfterDefaultValueSet(
              step.fields[j].onChange,
              step.fields[j].onChangeParams,
              thisObj,
            );
          } else {
            thisObj[currentStep] = i;
            resolve();
          }
        }
        thisObj[currentStep] = i;
      }
      resolve();
    })();
  });
};

export default {
  setDefaultSelections,
};
