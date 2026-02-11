import { useMetricsToCustomerContext } from '@/contexts';
import TenantsSubscriptionsDrawer from '@/components/subscriptions/TenantsSubscriptionsDrawer.component';

const ManageConfigurationPage = () => {
    const { state: { subscriptionUrls, regions, defaultRetention, enableConfigurationManagement } } = useMetricsToCustomerContext();

    if (!enableConfigurationManagement || !subscriptionUrls || !defaultRetention) {
        return null;
    }

    return (
        <TenantsSubscriptionsDrawer
            subscriptionUrls={subscriptionUrls}
            regions={regions}
            defaultRetention={defaultRetention}
        />
    );
};

export default ManageConfigurationPage;
