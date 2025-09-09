import { ReactNode } from 'react';

export type TCartProps = {
  children: ReactNode;
};

export const Cart = ({ children }: TCartProps) => (
  <div className="rounded-md border border-solid border-gray-400 shadow-lg p-6">
    {children}
  </div>
);
