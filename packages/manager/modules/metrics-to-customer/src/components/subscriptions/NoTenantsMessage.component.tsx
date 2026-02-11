import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

import {
    Icon,
    ICON_NAME,
    Link,
    Text,
    TEXT_PRESET,
} from '@ovhcloud/ods-react';

import { useDateFnsLocale } from '@ovh-ux/muk';

import { NAMESPACES } from '@/MetricsToCustomer.translations';
import { formatObservabilityDuration } from '@/utils/duration.utils';

import { NoTenantsMessageProps } from '@/components/subscriptions/NoTenantsMessage.props';

import { subroutes } from '@/routes/Routes.constants';

const NoTenantsMessage = ({ regions, defaultRetention }: NoTenantsMessageProps) => {
    const { t } = useTranslation(NAMESPACES.SUBSCRIPTIONS);
    const dateFnsLocale = useDateFnsLocale();

    const formattedRetention = formatObservabilityDuration(defaultRetention, dateFnsLocale);

    const href = useHref(subroutes.create);

    return (<div data-testid="no-tenants-message">
        <Text preset={TEXT_PRESET.label}>
            {t('no_tenants_message.title')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
            {t('no_tenants_message.description')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
            {t('tenants_regions.region', { count: regions?.length, })} : {regions?.map(({ label }) => label).join(', ')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
            {t('no_tenants_message.retention', { retention: formattedRetention })}
        </Text>

        <Link data-testid={`create-and-subscribe-tenant-link`} className="mt-3" href={href} target="_blank">
            {t('no_tenants_message.create-and-subscribe-tenant')}
            <Icon name={ICON_NAME.externalLink} />
        </Link>
    </div>
    );
};
export default NoTenantsMessage;
