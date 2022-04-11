import { createContext } from 'react';

export type ProductNavReshuffleContextType = {
  askBeta: boolean;
  createBetaChoice(accept: boolean): Promise<unknown>;
  isBeta: boolean;
  updateBetaChoice(accept: boolean): Promise<unknown>;
};

const ProductNavReshuffleContext = createContext<ProductNavReshuffleContextType | null>();

export default ProductNavReshuffleContext;
