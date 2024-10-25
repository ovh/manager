import { z } from 'zod';

export const VLAN_ID = {
  default: 1,
  min: 0,
  max: 4000,
};

export const DEFAULT_CIDR = '10.{vlanId}.0.0/16';

export const GATEWAY_HOURLY_PLAN_CODE = 'gateway.s.hour.consumption';

const cidrRegex = new RegExp(
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(8|9|1[0-6]|1[7-9]|2[0-9]))$/,
); // a valid ip address with mask between 9 and 29

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
    cidr: z.string().regex(cidrRegex),
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
