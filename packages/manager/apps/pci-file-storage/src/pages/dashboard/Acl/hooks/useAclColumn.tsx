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
import { DatagridColumn } from '@ovh-ux/muk';

import { TAclData, TAclDraftData, isAclDraftData } from '@/pages/dashboard/Acl/acl.view-model';
import { useAclPermissions } from '@/pages/dashboard/Acl/hooks/useAclPermissions';
import type { CreateAclFormValues } from '@/pages/dashboard/Acl/schema/Acl.schema';

type TUseAclColumnProps = {
  formMethods: UseFormReturn<CreateAclFormValues>;
  onCancelDraft: () => void;
  isCreatePending: boolean;
};

export const useAclColumn = ({
  formMethods,
  onCancelDraft,
  isCreatePending,
}: TUseAclColumnProps): DatagridColumn<TAclData | TAclDraftData>[] => {
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS]);
  const { permissions, permissionsMap } = useAclPermissions();

  return useMemo(() => {
    return [
      {
        id: 'accessTo',
        accessorKey: 'accessTo',
        header: t('acl:columns.accessTo.header'),
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
        id: 'accessPermission',
        accessorKey: 'permission',
        header: t('acl:columns.accessPermission.header'),
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
        id: 'action',
        header: t('acl:columns.actions.header'),
        cell: ({ row }) =>
          isAclDraftData(row.original) ? (
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
          ) : null,
        maxSize: 50,
      },
    ];
  }, [formMethods, isCreatePending, onCancelDraft, permissions, permissionsMap, t]);
};
