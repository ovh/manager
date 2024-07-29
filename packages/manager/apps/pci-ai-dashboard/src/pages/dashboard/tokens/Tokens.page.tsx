import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useGetTokens } from '@/hooks/api/ai/token/useGetTokens.hook';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './_components/TokensTableColumns.component';
import AddToken from './_components/AddToken.component';
import { useModale } from '@/hooks/useModale.hook';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import DeleteToken from './_components/DeleteToken.component';
import RenewToken from './_components/RenewToken.component';
import { POLLING } from '@/configuration/polling';
import { GuideSections } from '@/configuration/guide';

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
  const addModale = useModale('add');
  const deleteModale = useModale('delete');
  const renewModale = useModale('renew');
  const tokenQuery = useGetTokens(projectId, {
    refetchInterval: POLLING.TOKEN,
  });
  const regionsQuery = useGetRegions(projectId);
  const columns: ColumnDef<ai.token.Token>[] = getColumns({
    onRegenerateClick: (token: ai.token.Token) => renewModale.open(token.id),
    onDeleteClick: (token: ai.token.Token) => deleteModale.open(token.id),
  });

  const tokenToDelete = tokenQuery.data?.find(
    (tk) => tk.id === deleteModale.value,
  );

  const tokenToRenew = tokenQuery.data?.find(
    (tk) => tk.id === renewModale.value,
  );

  return (
    <>
      <div className="float-right">
        <Guides section={GuideSections.tokens} />
      </div>

      <h3>{t('title')}</h3>

      <p>{t('tokenParagraphe1')}</p>
      <p>{t('tokenParagraphe2')}</p>
      <p>{t('tokenParagraphe3')}</p>

      <Button
        data-testid="create-token-button"
        onClick={() => addModale.open()}
        className="font-semibold"
        variant="outline"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>
      {tokenQuery.isSuccess ? (
        <DataTable columns={columns} data={tokenQuery.data} pageSize={25} />
      ) : (
        <div data-testid="tokens-table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      {regionsQuery.isSuccess && (
        <AddToken
          regions={regionsQuery.data}
          controller={addModale.controller}
          onSuccess={() => {
            tokenQuery.refetch();
          }}
          onClose={() => addModale.close()}
        />
      )}
      {tokenToDelete && (
        <DeleteToken
          token={tokenToDelete}
          controller={deleteModale.controller}
          onSuccess={() => {
            deleteModale.close();
            tokenQuery.refetch();
          }}
        />
      )}
      {tokenToRenew && (
        <RenewToken
          token={tokenToRenew}
          controller={renewModale.controller}
          onClose={() => renewModale.close()}
        />
      )}
    </>
  );
};

export default Tokens;
