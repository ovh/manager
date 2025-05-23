import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import {
  DatagridColumn,
  DataGridTextCell,
  ActionMenu,
  DateFormat,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { useQueries } from '@tanstack/react-query';
import { isBefore, isSameDay, startOfDay } from 'date-fns';
import { useGetTokens } from '@/hooks/api/database/token/useToken.hook';
import { getTokenQueryOptions } from '@/components/utils/getTokenQueries';
import { TokenData } from '@/types/cloud/project/database/token';
import useUserInfos from '@/hooks/token/useUserInfos';

export type UseDatagridColumnsProps = {
  projectId: string;
  noLimitation: Date;
  onUpdate: (token: TokenData) => void;
  onDelete: (token: TokenData) => void;
};

export const FormattedDate = ({ date }: { date: Date }) => {
  const formattedDate = useFormattedDate({
    dateString: date.toISOString(),
    format: DateFormat.display,
  });
  return <>{formattedDate}</>;
};

export const useDatagridColumns = ({
  projectId,
  noLimitation,
  onUpdate,
  onDelete,
}: UseDatagridColumnsProps) => {
  const { t } = useTranslation('token');

  const { isAdmin } = useUserInfos();

  const { data: tokenNames, isLoading: isNamesLoading } = useGetTokens({
    projectId,
  });

  const tokenNamesArray: string[] = tokenNames || [];

  const tokenDetailsQueries = useQueries({
    queries: tokenNamesArray.map((name) =>
      getTokenQueryOptions(projectId, name),
    ),
  });

  const tokenItems: TokenData[] = useMemo(
    () =>
      tokenDetailsQueries
        .map((query) => query.data)
        .filter((token): token is TokenData => token !== undefined),
    [tokenDetailsQueries],
  );

  const isLoading = useMemo(
    () =>
      isNamesLoading || tokenDetailsQueries.some((query) => query.isLoading),
    [isNamesLoading, tokenDetailsQueries],
  );

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
        <DataGridTextCell>{token.description}</DataGridTextCell>
      ),
    },
    {
      id: 'expiresAt',
      label: t('ai_endpoints_token_expires'),
      cell: (token: TokenData) => {
        let displayValue: React.ReactNode = 'N/A';
        let chipColor = ODS_THEME_COLOR_INTENT.primary;

        if (token.expiresAt) {
          const tokenDate = new Date(token.expiresAt);

          if (tokenDate.getTime() === noLimitation.getTime()) {
            displayValue = t('ai_endpoints_token_expiration');
          } else {
            displayValue = <FormattedDate date={tokenDate} />;
          }

          if (
            isBefore(tokenDate, startOfDay(new Date())) ||
            isSameDay(tokenDate, new Date())
          ) {
            chipColor = ODS_THEME_COLOR_INTENT.error;
          }
        }

        return (
          <DataGridTextCell>
            <OsdsChip
              className="inline-flex"
              color={chipColor}
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
                onClick: () => isAdmin && onUpdate(token),
                disabled: !isAdmin || undefined,
              },
              {
                id: 1,
                label: t('ai_endpoints_token_delete'),
                onClick: () => isAdmin && onDelete(token),
                disabled: !isAdmin || undefined,
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
