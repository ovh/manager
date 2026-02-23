import { useMemo } from 'react';

import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormField,
  FormFieldError,
  ICON_NAME,
  Icon,
  Input,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { DatagridColumn } from '@ovh-ux/muk';

import { StatusBadge } from '@/components/status-badge/StatusBadge.component';
import { TAclData, TAclDraftData, isAclDraftData } from '@/pages/dashboard/Acl/acl.view-model';
import { useAclPermissions } from '@/pages/dashboard/Acl/hooks/useAclPermissions';
import type { CreateAclFormValues } from '@/pages/dashboard/Acl/schema/Acl.schema';
import { ACL_STATUSES, getAclStatusDisplay } from '@/pages/view-model/aclStatus.view-model';

type TUseAclColumnProps = {
  formMethods: UseFormReturn<CreateAclFormValues>;
  hasDraft: boolean;
  onCancelDraft: () => void;
  onDelete: (aclId: string) => void;
  deletingAclId?: string;
  isCreatePending: boolean;
  canManageAcl: boolean;
};

export const useAclColumn = ({
  formMethods,
  hasDraft,
  onCancelDraft,
  onDelete,
  deletingAclId,
  isCreatePending,
  canManageAcl,
}: TUseAclColumnProps): DatagridColumn<TAclData | TAclDraftData>[] => {
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS, 'status']);
  const { permissions, permissionsMap } = useAclPermissions();

  return useMemo(() => {
    return [
      {
        id: 'accessTo',
        accessorKey: 'accessTo',
        header: t('acl:columns.accessTo.header'),
        label: t('acl:columns.accessTo.header'),
        isFilterable: true,
        isSearchable: true,
        type: FilterTypeCategories.String,
        comparator: [FilterComparator.Includes, FilterComparator.IsEqual],
        cell: ({ row }) =>
          isAclDraftData(row.original) ? (
            <div className="p-4">
              <Controller
                control={formMethods.control}
                name="accessTo"
                render={({ field }) => {
                  const accessToError =
                    (formMethods.formState.isSubmitted &&
                      formMethods.formState.errors.accessTo?.message) ||
                    null;

                  return (
                    <FormField invalid={!!accessToError}>
                      <Input
                        {...field}
                        placeholder={t('acl:columns.accessTo.placeholder')}
                        disabled={formMethods.formState.isSubmitting}
                        aria-invalid={!!accessToError}
                        className="w-full"
                      />
                      {<FormFieldError>{t(accessToError ?? '')}</FormFieldError>}
                    </FormField>
                  );
                }}
              />
            </div>
          ) : (
            <Text preset="paragraph">{row.original.accessTo}</Text>
          ),
      },
      {
        id: 'permission',
        accessorKey: 'permission',
        header: t('acl:columns.accessPermission.header'),
        label: t('acl:columns.accessPermission.header'),
        isFilterable: true,
        type: FilterTypeCategories.Options,
        comparator: [FilterComparator.IsEqual],
        filterOptions: permissions.map(({ label, value }) => ({
          label,
          value,
        })),
        cell: ({ row }) =>
          isAclDraftData(row.original) ? (
            <div className="w-full max-w-[250px] p-4">
              {
                <Controller
                  control={formMethods.control}
                  name="permission"
                  render={({ field }) => (
                    <Select
                      items={permissions}
                      value={[formMethods.watch('permission')]}
                      disabled={formMethods.formState.isSubmitting}
                      onValueChange={(permissions: SelectValueChangeDetail) => {
                        const selectedPermission = permissions
                          .value[0] as CreateAclFormValues['permission'];

                        field.onChange(selectedPermission);
                      }}
                    >
                      <SelectControl />
                      <SelectContent />
                    </Select>
                  )}
                />
              }
            </div>
          ) : (
            <Text preset="paragraph">{permissionsMap[row.original.permission]}</Text>
          ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('acl:columns.status.header'),
        label: t('acl:columns.status.header'),
        isFilterable: true,
        type: FilterTypeCategories.Options,
        comparator: [
          FilterComparator.IsEqual,
          FilterComparator.IsDifferent,
          FilterComparator.Includes,
        ],
        filterOptions: ACL_STATUSES.map((status) => ({
          label: t(getAclStatusDisplay(status).labelKey),
          value: status,
        })),
        cell: ({
          row: {
            original: { statusDisplay },
          },
        }) => <StatusBadge {...statusDisplay} />,
      },
      {
        id: 'action',
        header: t('acl:columns.actions.header'),
        cell: ({ row }) => {
          if (isAclDraftData(row.original)) {
            return (
              <div className="flex items-center justify-end gap-2 px-2">
                {isCreatePending ? (
                  <Spinner size={SPINNER_SIZE.sm} />
                ) : (
                  <>
                    <Button
                      type="submit"
                      variant="ghost"
                      color="primary"
                      size="sm"
                      aria-label={t(`${NAMESPACES.ACTIONS}:validate`)}
                    >
                      <Icon name={ICON_NAME.check} />
                    </Button>
                    <Button
                      variant="ghost"
                      color="primary"
                      size="sm"
                      onClick={onCancelDraft}
                      aria-label={t(`${NAMESPACES.ACTIONS}:cancel`)}
                    >
                      <Icon name={ICON_NAME.xmark} />
                    </Button>
                  </>
                )}
              </div>
            );
          }

          const aclId = row.original.id;

          return (
            <div className="flex justify-end px-2">
              {deletingAclId === aclId || row.original.status === 'deleting' ? (
                <Spinner size={SPINNER_SIZE.sm} />
              ) : (
                <Button
                  variant="ghost"
                  color="primary"
                  size="sm"
                  aria-label={t(`${NAMESPACES.ACTIONS}:delete`)}
                  disabled={isCreatePending || hasDraft || !canManageAcl}
                  onClick={() => onDelete(aclId)}
                >
                  <Icon name={ICON_NAME.trash} />
                </Button>
              )}
            </div>
          );
        },
        maxSize: 90,
        minSize: 50,
      },
    ];
  }, [
    deletingAclId,
    formMethods,
    hasDraft,
    isCreatePending,
    onCancelDraft,
    onDelete,
    permissions,
    permissionsMap,
    canManageAcl,
    t,
  ]);
};
