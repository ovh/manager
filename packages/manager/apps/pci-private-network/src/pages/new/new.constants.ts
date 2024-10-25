import { z } from 'zod';

export const VLAN_ID = {
  default: 1,
  min: 0,
  max: 4000,
};

export const DEFAULT_CIDR = '10.{vlanId}.0.0/16';

export const GATEWAY_HOURLY_PLAN_CODE = 'gateway.s.hour.consumption';

export const schema = z.object({
  region: z.string().min(1),
  isLocalZone: z.boolean(),
  name: z.string().min(1),
  vlanId: z
    .number()
    .min(VLAN_ID.min)
    .max(VLAN_ID.max)
    .optional(),
  subnet: z.object({
    cidr: z
      .string()
      .regex(
        new RegExp(
          /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(8|9|1[0-6]|1[7-9]|2[0-9]))$/,
        ),
      ),
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
});
