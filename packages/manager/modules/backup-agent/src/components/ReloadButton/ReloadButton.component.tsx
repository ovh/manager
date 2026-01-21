import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const dataTestId = 'reload-button-test-id';

export const ReloadButton = ({
  isLoading,
  queryKeys,
}: {
  isLoading: boolean;
  queryKeys: QueryKey[];
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const queryClient = useQueryClient();
  const reload = () =>
    queryKeys.forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));

  return (
    <OdsButton
      data-testid={dataTestId}
      icon="refresh"
      color="primary"
      onClick={reload}
      isLoading={isLoading}
      variant="outline"
      data-arialabel={t(`${NAMESPACES.ACTIONS}:refresh`)}
      label=""
    />
  );
};
