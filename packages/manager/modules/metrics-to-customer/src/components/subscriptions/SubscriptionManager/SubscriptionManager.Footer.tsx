import React, { ReactNode } from 'react';
import { useSubscriptionManagerContext } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.context';

export interface SubscriptionManagerFooterProps {
  children?: ReactNode;
}

export function SubscriptionManagerFooter({ children }: SubscriptionManagerFooterProps) {
  const { shouldShowData, hasApiData } = useSubscriptionManagerContext();

  if (!shouldShowData || !hasApiData || !children) {
    return null;
  }

  return <>{children}</>;
}

export const Footer = SubscriptionManagerFooter;

