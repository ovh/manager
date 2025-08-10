import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { HeadersProps } from '@ovh-ux/manager-react-components';

/**
 * Returns translated header props for the dashboard page.
 *
 * Behavior:
 * - Uses the `dashboard` i18n namespace.
 * - Reads the `:id` route param (if present) and injects it into the
 *   `dashboardPageTitle` translation key via `id`.
 *
 * @returns A link HeadersProps object containing the localized `title`.
 */
export function useDashboardHeader(): HeadersProps {
  const { t } = useTranslation(['dashboard']);
  const { id } = useParams();

  return {
    title: t('dashboardPageTitle', { id }),
  };
}
