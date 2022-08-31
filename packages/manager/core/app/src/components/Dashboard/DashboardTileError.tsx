import React from 'react';
import { Center, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Tile } from '@ovh-ux/manager-themes';
import { FallbackProps } from 'react-error-boundary';

export default function DashboardTileError({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <Tile>
      <Center>
        <p>{error.message || t('dashboard_tile_load_error')}</p>
      </Center>
      <Center>
        <Button onClick={resetErrorBoundary}>
          {t('dashboard_tile_load_error_retry')}
        </Button>
      </Center>
    </Tile>
  );
}
