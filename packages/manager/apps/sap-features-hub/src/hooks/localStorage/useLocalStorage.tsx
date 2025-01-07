export const useLocalStorage = () => {
  const setStorageItem = (key: string, value: Record<string, unknown>) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      throw new Error('Cannot access localStorage');
    }
  };

  const getStorageItem = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (err) {
      throw new Error('Cannot access localStorage');
    }
  };

  const removeStorageItem = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      throw new Error('Cannot access localStorage');
    }
  };

  return { setStorageItem, getStorageItem, removeStorageItem };
};
