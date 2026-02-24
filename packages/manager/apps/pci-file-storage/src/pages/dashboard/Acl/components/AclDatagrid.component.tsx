import { type FC, useEffect, useMemo, useState } from 'react';

import { FormProvider } from 'react-hook-form';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid } from '@ovh-ux/muk';

import { useAcls } from '@/data/hooks/acl/useAcls';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import {
  TAclData,
  TAclDraftData,
  createAclDraft,
  selectAcls,
  selectCanManageAcl,
} from '@/pages/dashboard/Acl/acl.view-model';
import { AclDatagridTopbar } from '@/pages/dashboard/Acl/components/AclDatagridTopbar.component';
import { AclDeleteModal } from '@/pages/dashboard/Acl/components/AclDeleteModal.component';
import { useAclActions } from '@/pages/dashboard/Acl/hooks/useAclActions';
import { useAclColumn } from '@/pages/dashboard/Acl/hooks/useAclColumn';
import { useAclDatagridFiltering } from '@/pages/dashboard/Acl/hooks/useAclDatagridFiltering';
import { useCreateAclForm } from '@/pages/dashboard/Acl/hooks/useCreateAclForm';
import { type CreateAclFormValues } from '@/pages/dashboard/Acl/schema/Acl.schema';

{
  /* eslint-disable @typescript-eslint/no-misused-promises */
  /* eslint-disable @typescript-eslint/no-unused-expressions */
}

/*
 This INCREDIBLE method is used to make the reload button be next to the search field.
 */
const moveReloadButton = () => {
  const right = document.querySelector('#right-side');
  const reloadButton = document.querySelector('#reload-button');

  reloadButton?.classList?.add('mr-6');
  reloadButton && right?.firstElementChild?.prepend(reloadButton);

  const topContainer = document.querySelector('#container');
  topContainer?.classList?.add('gap-4');
};

const getContainerHeight = (dataSize: number) => (dataSize + 1) * 50 + 10;

export const AclDatagrid: FC = () => {
  const { region, shareId } = useShareParams();
  const [aclToDelete, setAclToDelete] = useState<string>();
  const [hasDraft, setHasDraft] = useState(false);
  const formMethods = useCreateAclForm();

  const { data: canManageAcl = false } = useShare(region, shareId, {
    select: selectCanManageAcl,
  });

  const { data: acls = [], isLoading: isLoadingAcls } = useAcls<TAclData[]>(region, shareId, {
    select: selectAcls,
  });

  const { filteredAcls, filterProps, searchProps } = useAclDatagridFiltering(acls);

  const { createAcl, deleteAcl, isDeletePending, isCreatePending } = useAclActions({
    onCreateSuccess: () => {
      setHasDraft(false);
      formMethods.reset();
    },
    onDeleteSuccess: () => {
      setAclToDelete(undefined);
    },
    onDeleteError: () => {
      setAclToDelete(undefined);
    },
  });

  const data: Array<TAclData | TAclDraftData> = useMemo(
    () => [...(hasDraft ? [createAclDraft()] : []), ...filteredAcls],
    [filteredAcls, hasDraft],
  );

  const aclToDeleteData = useMemo(() => {
    return aclToDelete ? (acls.find((acl) => acl.id === aclToDelete) ?? null) : null;
  }, [aclToDelete, acls]);

  const handleDelete = useMemo(
    () => ({
      openModal: (aclId: string) => setAclToDelete(aclId),
      cancel: () => setAclToDelete(undefined),
      confirm: () => {
        if (aclToDelete) deleteAcl(aclToDelete);
      },
    }),
    [aclToDelete, deleteAcl],
  );

  const handleCreate = useMemo(
    () => ({
      onNew: () => setHasDraft(true),
      onCancel: () => {
        setHasDraft(false);
        formMethods.reset();
      },
      onConfirm: (values: CreateAclFormValues) => {
        createAcl({
          sourceIpOrCidr: values.accessTo,
          accessPermission: values.permission,
          status: 'draft',
        });
      },
    }),
    [formMethods, createAcl],
  );

  const columns = useAclColumn({
    formMethods,
    hasDraft,
    onCancelDraft: handleCreate.onCancel,
    onDelete: handleDelete.openModal,
    deletingAclId: aclToDelete,
    isCreatePending,
    canManageAcl,
  });

  useEffect(() => {
    moveReloadButton();
  }, []);

  return (
    <>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(handleCreate.onConfirm)}
          className="[&_#left-side]:!w-auto [&_#left-side]:!flex-[unset] [&_#right-side]:w-auto [&_th]:!break-normal"
        >
          <Datagrid
            columns={columns}
            data={data}
            totalCount={data.length}
            isLoading={isLoadingAcls}
            containerHeight={getContainerHeight(data.length)}
            maxRowHeight={50}
            size={TABLE_SIZE.sm}
            filters={filterProps}
            search={searchProps}
            topbar={
              <AclDatagridTopbar
                onAddClick={handleCreate.onNew}
                isButtonDisabled={hasDraft || !canManageAcl}
              />
            }
          />
        </form>
      </FormProvider>
      <AclDeleteModal
        open={!!aclToDelete}
        aclData={aclToDeleteData}
        onConfirm={handleDelete.confirm}
        onCancel={handleDelete.cancel}
        isDeleting={isDeletePending}
      />
    </>
  );
};
