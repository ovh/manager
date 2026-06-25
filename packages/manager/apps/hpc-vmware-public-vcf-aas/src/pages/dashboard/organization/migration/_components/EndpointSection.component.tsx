import { useTranslation } from 'react-i18next';
import { Clipboard } from '@ovh-ux/manager-react-components';
import {
  OdsMessage,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useMigrationContext } from '../Migration.context';

export default function EndpointSection() {
  const { t } = useTranslation('migration');
  const { endpointUrl, isPending, isError } = useMigrationContext();

  return (
    <section
      aria-labelledby="vcda-endpoint-heading"
      aria-busy={isPending}
      className="px-10 mt-4"
    >
      <OdsText id="vcda-endpoint-heading" preset="heading-2">
        {t('migration.endpoint.section.title')}
      </OdsText>
      <div className="mt-4 max-w-[640px]">
        {isPending && <OdsSkeleton />}
        {!isPending && isError && (
          <OdsMessage color="critical" isDismissible={false}>
            {t('migration.endpoint.error.fetch')}
          </OdsMessage>
        )}
        {!isPending && !isError && (
          <Clipboard
            value={endpointUrl ?? ''}
            className="w-full"
            data-testid="migration-endpoint-value"
          />
        )}
      </div>
      <OdsText preset="caption" className="block mt-2 text-neutral-600">
        {t('migration.endpoint.description')}
      </OdsText>
    </section>
  );
}
