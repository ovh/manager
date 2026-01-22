import { useMetricsToCustomerContext } from '@/contexts';
import TenantsSubscriptionsDrawer from '@/components/subscriptions/TenantsSubscriptionsDrawer.component';

const ManageConfigurationPage = () => {
    const { state: { subscriptionUrls, regions, defaultRetention } } = useMetricsToCustomerContext();

    return (
        <TenantsSubscriptionsDrawer
            subscriptionUrls={subscriptionUrls}
            regions={regions}
            defaultRetention={defaultRetention}
        />
    );
};

export default ManageConfigurationPage;
