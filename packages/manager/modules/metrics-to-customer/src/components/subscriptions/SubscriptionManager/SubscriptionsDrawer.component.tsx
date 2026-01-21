import { Outlet } from 'react-router-dom';

import { Drawer } from '@ovh-ux/muk';

import { SubscriptionsDrawerProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionsDrawer.props';
import SubscriptionManager from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.component';

const SubscriptionsDrawer = ({
  title,
  onDismiss,
  isLoading = false,
  children,
}: SubscriptionsDrawerProps) => {

  return (
    <>
      <Drawer.RootCollapsible
        onDismiss={onDismiss}
        isLoading={isLoading}
        createPortal={false}
      >
        <Drawer.Header title={title} />
        <Drawer.Content>
          <SubscriptionManager>
            {children}
          </SubscriptionManager>
        </Drawer.Content>
      </Drawer.RootCollapsible>
      <Outlet />
    </>
  );
};

export default SubscriptionsDrawer;
