import { useTranslation } from 'react-i18next';

import {
    Text,
    TEXT_PRESET,
} from '@ovhcloud/ods-react';

import { useDateFnsLocale } from '@ovh-ux/muk';

import { NAMESPACES } from '@/MetricsToCustomer.translations';
import { formatObservabilityDuration } from '@/utils/duration.utils';

import { NoTenantsMessageProps } from '@/components/subscriptions/NoTenantsMessage.props';

const NoTenantsMessage = ({ regions, defaultRetention }: NoTenantsMessageProps) => {
    const { t } = useTranslation(NAMESPACES.SUBSCRIPTIONS);
    const dateFnsLocale = useDateFnsLocale();

    const regionCount = regions.length;
    const regionText = regions.join(', ');

    const formattedRetention = formatObservabilityDuration(defaultRetention, dateFnsLocale);

    return (<div data-testid="no-tenants-message">
        <Text preset={TEXT_PRESET.label}>
            {t('no_tenants_message.title')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
            {t('no_tenants_message.description')}
        </Text>
        {regionCount > 0 && (
            <Text preset={TEXT_PRESET.paragraph}>
                {t('tenants_regions.region', { count: regionCount, region: regionText })}
            </Text>
        )}
        <Text preset={TEXT_PRESET.paragraph}>
            {t('no_tenants_message.retention', { retention: formattedRetention })}
        </Text>
    </div>
    );
};
export default NoTenantsMessage;
