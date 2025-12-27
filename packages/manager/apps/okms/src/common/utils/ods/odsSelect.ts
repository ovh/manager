// This 2 functions are used to set string values to the ODS 18 Select component
// This is the only way to prevent the select component from automatically sorting the values
// THIS SHOULD BE REMOVED WITH ODS 19

// Convert days to select value
export const valueToOdsSelectValue = (days: number): string => {
  return `v-${days}`;
};

// Convert select value to days
export const odsSelectValueToValue = (selectValue: string): number => {
  return parseInt(selectValue.replace('v-', ''));
};
