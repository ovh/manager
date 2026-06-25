import { z } from 'zod';

export const Ipv4CidrSchema = z
  .string()
  .trim()
  .min(1, { message: 'managed_vcd_migration_order_ip_error_required' })
  .refine((val) => z.cidrv4().safeParse(val).success, {
    message: 'managed_vcd_migration_order_ip_error_invalid',
  });

export const OrderFormSchema = z.object({
  initialWhitelistCidr: Ipv4CidrSchema,
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>;
