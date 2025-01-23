import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { Button } from '@/components/ui/button';
import { useGetTokens } from '@/hooks/api/ai/token/useGetTokens.hook';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './_components/TokensTableColumns.component';
import DataTable from '@/components/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-dashboard/tokens"
    />
  );
}

const Tokens = () => {
  const { t } = useTranslation('pci-ai-dashboard/tokens');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isUserActive } = useUserActivityContext();
  const tokenQuery = useGetTokens(projectId, {
    refetchInterval: isUserActive && POLLING.TOKEN,
  });
  const columns: ColumnDef<ai.token.Token>[] = getColumns({
    onRegenerateClick: (token: ai.token.Token) =>
      navigate(`./renew/${token.id}`),
    onDeleteClick: (token: ai.token.Token) => navigate(`./delete/${token.id}`),
  });

  return (
    <>
      <div className="float-right">
        <Guides />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('tokenParagraphe1')}</p>
      <p>{t('tokenParagraphe2')}</p>
      <p>{t('tokenParagraphe3')}</p>
      <Button
        data-testid="create-token-button"
        onClick={() => navigate('./add')}
        className="font-semibold"
        variant="outline"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>
      {tokenQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={tokenQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="tokens-table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Tokens;
