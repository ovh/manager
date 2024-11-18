import { z } from 'zod';

export const VLAN_ID = {
  default: 1,
  min: 0,
  max: 4000,
};

export const DEFAULT_CIDR = '10.{vlanId}.0.0/16';

export const GATEWAY_HOURLY_PLAN_CODE = 'gateway.s.hour.consumption';

const ipSchema = z.string().ip();
const maskSchema = z
  .number()
  .min(9)
  .max(29);

export const NEW_PRIVATE_NETWORK_FORM_SCHEMA = z.object({
  region: z.string().min(1),
  isLocalZone: z.boolean(),
  name: z.string().min(1),
  defaultVlanId: z.number().optional(),
  vlanId: z
    .number()
    .min(VLAN_ID.min)
    .max(VLAN_ID.max)
    .optional(),
  subnet: z.object({
    cidr: z.string().refine((value) => {
      const [ip, mask] = value.split('/');
      return (
        ipSchema.safeParse(ip).success && maskSchema.safeParse(+mask).success
      );
    }),
    enableDhcp: z.boolean(),
    ipVersion: z.number(),
    enableGatewayIp: z.boolean(),
  }),
  gateway: z
    .object({
      model: z.string(),
      name: z.string(),
    })
    .optional(),
  existingGatewayId: z.string().optional(),
  enableSnat: z.boolean().optional(),
});
