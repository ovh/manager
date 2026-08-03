import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';

import { validateVaultName } from '@/utils/vault/vaultName';

/**
 * The name rule is not restated here: `validateVaultName` already owns BKP-1223's bounds and pattern
 * and is unit-tested against them, so a schema copy would be a second rule free to drift.
 *
 * `.trim()` comes first because the resolver hands its parsed output to `handleSubmit`: trimming there
 * is what keeps the rule and the ordered payload judging the same string.
 */
export const VAULT_ORDER_SCHEMA = z.object({
  name: z
    .string()
    .trim()
    .refine((value) => value !== '', { message: 'order.error.name_required' })
    .refine((value) => value === '' || validateVaultName(value) === undefined, {
      message: 'order.error.name_format',
    }),
  region: z.string().min(1, { message: 'order.error.region_required' }),
});

export type VaultOrderFormValues = z.infer<typeof VAULT_ORDER_SCHEMA>;

export const useVaultOrderForm = (): UseFormReturn<VaultOrderFormValues> =>
  useForm<VaultOrderFormValues>({
    resolver: zodResolver(VAULT_ORDER_SCHEMA),
    // Errors appear on blur and on submit, never on every keystroke: a half-typed name is not wrong
    // yet. `isValid` still tracks the whole schema live, which is what gates the submit control.
    mode: 'onTouched',
    defaultValues: { name: '', region: '' },
  });
