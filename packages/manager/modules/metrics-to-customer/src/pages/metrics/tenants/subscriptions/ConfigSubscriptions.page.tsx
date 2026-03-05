import { useMetricsToCustomerContext } from '@/contexts';
import TenantsSubscriptionsDrawer from '@/components/subscriptions/TenantsSubscriptionsDrawer.component';

const ManageConfigurationPage = () => {
    const { state: {
        resourceName: serviceName,
        subscriptionUrls,
        regions,
        defaultRetention,
        enableConfigurationManagement
    } } = useMetricsToCustomerContext();

    if (!enableConfigurationManagement || !subscriptionUrls || !defaultRetention) {
        return null;
    }

    return (
        <TenantsSubscriptionsDrawer
            serviceName={serviceName}
            subscriptionUrls={subscriptionUrls}
            regions={regions}
            defaultRetention={defaultRetention}
        />
    );
};

export default ManageConfigurationPage;
