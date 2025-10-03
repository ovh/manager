export type TOrderContext = {
  setIsOrderInitialized: (isOrderInitialized: boolean) => void;
  isOrderInitialized: boolean;
  error?: boolean;
};
