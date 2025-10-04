import { PropsWithChildren } from 'react';
import { OrderContextProvider } from './Order.context';
import { OrderConfiguration } from './order-configuration/OrderConfiguration.component';
import { OrderSummary } from './order-summary/OrderSummary.component';
import './translations';

export const Order = ({ children }: PropsWithChildren) => {
  return <OrderContextProvider>{children}</OrderContextProvider>;
};

Order.Configuration = OrderConfiguration;
Order.Summary = OrderSummary;
