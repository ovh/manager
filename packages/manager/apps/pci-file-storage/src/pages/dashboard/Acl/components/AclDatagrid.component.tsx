import { type FC, useCallback, useMemo, useState } from 'react';

import { FormProvider } from 'react-hook-form';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid } from '@ovh-ux/muk';

import { useAcls } from '@/data/hooks/acl/useAcls';
import { useShareParams } from '@/hooks/useShareParams';
import {
  TAclData,
  TAclDraftData,
  createAclDraft,
  selectAcls,
} from '@/pages/dashboard/Acl/acl.view-model';
import { AclDatagridTopbar } from '@/pages/dashboard/Acl/components/AclDatagridTopbar.component';
import { useAclActions } from '@/pages/dashboard/Acl/hooks/useAclActions';
import { useAclColumn } from '@/pages/dashboard/Acl/hooks/useAclColumn';
import { useCreateAclForm } from '@/pages/dashboard/Acl/hooks/useCreateAclForm';
import { type CreateAclFormValues } from '@/pages/dashboard/Acl/schema/Acl.schema';

const getContainerHeight = (dataSize: number) => (dataSize + 1) * 50 + 10;

export const AclDatagrid: FC = () => {
  const { region, shareId } = useShareParams();
  const [hasDraft, setHasDraft] = useState(false);
  const formMethods = useCreateAclForm();

  const { data: acls = [], isLoading: isLoadingAcls } = useAcls<TAclData[]>(region, shareId, {
    select: selectAcls,
  });

  const { createAcl, isCreatePending } = useAclActions({
    onCreateSuccess: () => {
      setHasDraft(false);
      formMethods.reset();
    },
  });

  const data: Array<TAclData | TAclDraftData> = useMemo(
    () => [...(hasDraft ? [createAclDraft()] : []), ...acls],
    [acls, hasDraft],
  );

  const handleAddClick = useCallback(() => {
    setHasDraft(true);
  }, []);

  const handleCancelDraft = useCallback(() => {
    setHasDraft(false);
    formMethods.reset();
  }, [formMethods]);

  const handleCreate = useCallback(
    (values: CreateAclFormValues) => {
      createAcl({
        sourceIpOrCidr: values.accessTo,
        accessPermission: values.permission,
      });
    },
    [createAcl],
  );

  const columns = useAclColumn({ formMethods, onCancelDraft: handleCancelDraft, isCreatePending });

  return (
    <FormProvider {...formMethods}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={formMethods.handleSubmit(handleCreate)} className="[&_th]:!break-normal">
        <Datagrid
          columns={columns}
          data={data}
          totalCount={data.length}
          isLoading={isLoadingAcls}
          containerHeight={getContainerHeight(data.length)}
          maxRowHeight={50}
          size={TABLE_SIZE.sm}
          topbar={<AclDatagridTopbar onAddClick={handleAddClick} isButtonDisabled={hasDraft} />}
        />
      </form>
    </FormProvider>
  );
};
