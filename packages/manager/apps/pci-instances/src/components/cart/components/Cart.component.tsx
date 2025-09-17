import { PropsWithChildren } from 'react';

export const Cart = ({ children }: PropsWithChildren) => (
  <div
    className="rounded-md border border-solid border-gray-400 shadow-lg p-6"
    data-testid="cart"
  >
    {children}
  </div>
);
