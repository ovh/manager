import * as z from 'zod';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { FilterRestrictionsEnum } from '@/types';
import { isCidr, isIp } from '@/helpers';
import BlocCIDR from '@/components/CIDR/CIDR.component';
import { useIpRestrictions } from '@/api/hooks/useIpRestrictions';

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
        // Vérification CIDR format
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
  const { data: dataCIDR, isPending } = useIpRestrictions(
    projectId,
    registryId,
  );
  const methods = useForm<ConfirmCIDRSchemaType>({
    resolver: zodResolver(
      !isPending && schemaAddCidr(dataCIDR.map((e) => e.ipBlock)),
    ),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <BlocCIDR />
    </FormProvider>
  );
}
