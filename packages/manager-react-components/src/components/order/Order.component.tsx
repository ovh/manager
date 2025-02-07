import React, { PropsWithChildren } from 'react';
import { OrderContextProvider } from './Order.context';
import { OrderConfiguration } from './OrderConfiguration.component';
import { OrderSummary } from './OrderSummary.component';
import './translations';

export const Order = ({ children }: PropsWithChildren) => {
  return <OrderContextProvider>{children}</OrderContextProvider>;
};

Order.Configuration = OrderConfiguration;
Order.Summary = OrderSummary;
