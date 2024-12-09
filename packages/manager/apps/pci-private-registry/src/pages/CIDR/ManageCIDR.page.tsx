import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { FilterRestrictionsEnum } from '@/types';
import { isCidr, isIp } from '@/helpers';
import BlocCIDR from '@/components/CIDR/CIDR.component';

const schemaAddCidr = z.object({
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
    .refine((value) => isCidr(value), {
      message: 'private_registry_cidr_validation_ipBlock',
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

export type ConfirmCIDRSchemaType = z.infer<typeof schemaAddCidr>;

export default function BlocIPBlock() {
  const methods = useForm<ConfirmCIDRSchemaType>({
    resolver: zodResolver(schemaAddCidr),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <BlocCIDR />
    </FormProvider>
  );
}
