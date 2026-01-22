export const calculateQuantityValue = (
  quota: number,
  inputValue: number,
): number => {
  if (Number.isNaN(inputValue)) {
    return inputValue;
  }

  if (quota === 0) {
    return 0;
  }

  return Math.min(quota, inputValue);
};

export const normalizeQuantity = (
  quota: number,
  quantity: number,
  min: number,
): number => {
  const maxValue = Math.max(0, quota);
  const minValue = Math.max(0, min);
  return Math.min(Math.max(minValue, quantity), maxValue);
};
