import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import {
  DatagridColumn,
  DataGridTextCell,
  ActionMenu,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { useQueries } from '@tanstack/react-query';
import { useGetTokens } from '@/hooks/api/database/token/useToken.hook';
import { getToken } from '@/data/api/database/token.api';
import { TokenData } from '@/types/cloud/project/database/token';

export type UseDatagridColumnsProps = {
  projectId: string;
  noLimitation: Date;
  onUpdate: (token: TokenData) => void;
  onDelete: (token: TokenData) => void;
};

export const useDatagridColumns = ({
  projectId,
  noLimitation,
  onUpdate,
  onDelete,
}: UseDatagridColumnsProps) => {
  const { t } = useTranslation('token');

  const { data: tokenNames, isLoading: isNamesLoading } = useGetTokens({
    projectId,
  });

  const tokenNamesArray: string[] = tokenNames || [];

  const tokenDetailsQueries = useQueries({
    queries: tokenNamesArray.map((name) => ({
      queryKey: ['tokens', projectId, name],
      queryFn: () => getToken({ projectId, name }),
      enabled: !!projectId,
    })),
  });

  const tokenItems: TokenData[] = tokenDetailsQueries
    .map((query) => query.data)
    .filter((token): token is TokenData => token !== undefined);

  const isLoading =
    isNamesLoading || tokenDetailsQueries.some((query) => query.isLoading);

  const columns: DatagridColumn<TokenData>[] = [
    {
      id: 'name',
      label: t('ai_endpoints_token_name'),
      cell: (token: TokenData) => (
        <DataGridTextCell>{token.name}</DataGridTextCell>
      ),
    },
    {
      id: 'description',
      label: t('ai_endpoints_token_description'),
      cell: (token: TokenData) => (
        <DataGridTextCell>
          {token.description === '' ? '' : token.description || 'N/A'}
        </DataGridTextCell>
      ),
    },
    {
      id: 'expiresAt',
      label: t('ai_endpoints_token_expires'),
      cell: (token: TokenData) => {
        let displayValue = 'N/A';
        if (token.expiresAt) {
          const tokenDate = new Date(token.expiresAt);
          if (tokenDate.getTime() === noLimitation.getTime()) {
            displayValue = t('ai_endpoints_token_expiration');
          } else {
            displayValue = tokenDate.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
          }
        }
        return (
          <DataGridTextCell>
            <OsdsChip
              className="inline-flex"
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_CHIP_SIZE.sm}
            >
              {displayValue}
            </OsdsChip>
          </DataGridTextCell>
        );
      },
    },
    {
      id: 'actions',
      label: '',
      cell: (token: TokenData) => (
        <div className="min-w-16">
          <ActionMenu
            items={[
              {
                id: 0,
                label: t('ai_endpoints_token_put'),
                onClick: () => onUpdate(token),
                disabled: false,
              },
              {
                id: 1,
                label: t('ai_endpoints_token_delete'),
                onClick: () => onDelete(token),
                disabled: false,
              },
            ]}
            isCompact
          />
        </div>
      ),
    },
  ];

  return {
    columns,
    tokenItems,
    isLoading,
  };
};
