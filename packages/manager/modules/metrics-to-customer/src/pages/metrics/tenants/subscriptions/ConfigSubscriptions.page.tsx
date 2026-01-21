import { useMetricsToCustomerContext } from '@/contexts';
import TenantsSubscriptionsDrawer from '@/components/subscriptions/TenantsSubscriptionsDrawer.component';

const ManageConfigurationPage = () => {
    const { state: { subscriptionUrls, regions } } = useMetricsToCustomerContext();

    return (
        <TenantsSubscriptionsDrawer
            subscriptionUrls={subscriptionUrls}
            regions={regions}
        />
    );
};

export default ManageConfigurationPage;
