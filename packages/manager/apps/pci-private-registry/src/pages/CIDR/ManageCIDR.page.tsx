import * as z from 'zod';
import { useParams } from 'react-router-dom';
import { Headers, PciGuidesHeader } from '@ovh-ux/manager-react-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useForm, FormProvider } from 'react-hook-form';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import BreadcrumbCIDR from '@/components/CIDR/Breadcrumb.component';
import { FilterRestrictionsEnum } from '@/types';
import { isCidr, isIp } from '@/helpers';
import BlocCIDR from '@/components/CIDR/CIDR.component';
import { useIpRestrictions } from '@/api/hooks/useIpRestrictions';
import { useSuspenseRegistry } from '@/api/hooks/useRegistry';

const schemaAddCidr = (dataCIDR: string[]) =>
  z.object({
    description: z.string().optional(),
    ipBlock: z
      .string()
      .transform((value) => {
        if (isCidr(value)) {
          return value;
        }
        if (isIp(value)) {
          return `${value}/32`;
        }
        return value;
      })
      .superRefine((value, ctx) => {
        // Vérify CIDR format
        if (!isCidr(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'private_registry_cidr_validation_ipBlock',
          });
        }
        // verify duplication cidr
        const existingIpBlocks = dataCIDR.map((item) => item);
        if (existingIpBlocks.includes(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'private_registry_cidr_already_exist',
          });
        }
      }),
    authorization: z
      .array(
        z.enum([
          FilterRestrictionsEnum.MANAGEMENT,
          FilterRestrictionsEnum.REGISTRY,
        ]),
      )
      .default([])
      .refine((auth) => auth.length > 0, {
        message: 'private_registry_cidr_validation_authorization',
      }),
  });

export type ConfirmCIDRSchemaType = z.infer<ReturnType<typeof schemaAddCidr>>;

export default function BlocIPBlock() {
  const { projectId, registryId } = useParams();
  const { data: project } = useProject();
  const { data: registry } = useSuspenseRegistry(projectId, registryId);
  const { data: dataCIDR } = useIpRestrictions(projectId, registryId);
  const { t } = useTranslation(['ip-restrictions']);
  const methods = useForm<ConfirmCIDRSchemaType>({
    resolver: zodResolver(schemaAddCidr(dataCIDR.map((e) => e.ipBlock))),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  return (
    <>
      {project && <BreadcrumbCIDR />}

      <div className="header my-8">
        <Headers
          title={registry.name}
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="private_registry" />
            </div>
          }
        />
        <OsdsText
          className="block mb-6"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('private_registry_cidr_manage_title')}
        </OsdsText>
      </div>
      <FormProvider {...methods}>
        <BlocCIDR />
      </FormProvider>
    </>
  );
}
