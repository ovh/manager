import { CONTROL_CATEGORY } from '../constants/controls';

const orderedControlCategories = [
  CONTROL_CATEGORY.design,
  CONTROL_CATEGORY.slot,
  CONTROL_CATEGORY.general,
  CONTROL_CATEGORY.accessibility,
  CONTROL_CATEGORY.validation,
];

function excludeFromDemoControls(props: string[]) {
  return props.reduce((res, prop) => {
    res[prop] = {
      table: {
        disable: true,
      },
    };
    return res;
  }, {} as Record<string, any>);
}

function orderControls(control: Record<string, any>) {
  try {
    return Object.entries(control)
      .sort((a, b) => {
        return orderedControlCategories.indexOf(a[1].table.category) - orderedControlCategories.indexOf(b[1].table.category);
      })
      .reduce((res, entry) => {
        res[entry[0]] = entry[1];
        return res;
      }, {} as Record<string, any>);
  } catch {
    console.error('Error while ordering controls');
    return {};
  }
}

export {
  excludeFromDemoControls,
  orderControls,
};
