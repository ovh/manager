import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';

import { ai } from '@/models/types';
import { getTokensColumns } from './tokensListColumn';
import DeleteTokenModal, { DeleteTokenSubmitData } from './deleteTokenModal';

export interface RegenerateTokenSubmitData {
  tokenId: string;
}

interface TokensListProps {
  tokens: ai.token.Token[];
  onDeleteSubmit: (data: DeleteTokenSubmitData) => void;
  onRegenerateSubmit: (data: RegenerateTokenSubmitData) => void;
}

export default function TokensList({
  tokens,
  onDeleteSubmit,
  onRegenerateSubmit,
}: TokensListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [deletingToken, setDeletingToken] = useState<ai.token.Token>();

  const columns: ColumnDef<ai.token.Token>[] = getTokensColumns({
    onDeleteClicked: (token: ai.token.Token) => {
      setDeletingToken(token);
      setOpenModal(true);
    },
    onRegenerateClicked: (token: ai.token.Token) => {
      onRegenerateSubmit({ tokenId: token.id });
    },
  });

  const onDeleteTokenSubmit = (data: DeleteTokenSubmitData) => {
    onDeleteSubmit(data);
    setOpenModal(false);
  };

  const handleCloseDeleteTokenModal = () => {
    setOpenModal(false);
    setDeletingToken(undefined);
  };

  return (
    <>
      <div>
        <DataTable columns={columns} data={tokens} pageSize={5} />
      </div>
      {deletingToken && (
        <DeleteTokenModal
          token={deletingToken}
          open={isOpenModal}
          onClose={handleCloseDeleteTokenModal}
          onSubmit={onDeleteTokenSubmit}
        />
      )}
    </>
  );
}

TokensList.Skeleton = function TokensListSkeleton() {
  return (
    <>
      <div className="flex justify-between w-100 mb-2 items-end">
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
