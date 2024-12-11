import { z } from 'zod';

export const VLAN_ID = {
  default: 1,
  min: 0,
  max: 4000,
};

export const GATEWAY_HOURLY_PLAN_CODE = 'gateway.s.hour.consumption';

const ipSchema = z.string().ip();

const ipNullableSchema = z
  .string()
  .refine((value) => value === '' || ipSchema.safeParse(value).success)
  .nullish();

const maskSchema = z
  .number()
  .min(9)
  .max(29);

const cidrSchema = z.string().refine((value) => {
  const [ip, mask] = value.split('/');
  return (
    ipSchema.safeParse(ip).success && maskSchema.safeParse(Number(mask)).success
  );
});

const allocationPoolSchema = z
  .object({
    start: ipNullableSchema,
    end: ipNullableSchema,
  })
  .refine(
    ({ start, end }) => !(start || end) || (start && end),
    ({ start }) => ({ path: start ? ['end'] : ['start'] }),
  );

const hostRoutesSchema = z
  .object({
    destination: z
      .string()
      .refine((value) => value === '' || cidrSchema.safeParse(value).success)
      .nullish(),
    nextHop: ipNullableSchema,
  })
  .refine(
    ({ destination, nextHop }) =>
      !(destination || nextHop) || (destination && nextHop),
    ({ destination }) => ({
      path: destination ? ['nextHop'] : ['destination'],
    }),
  );

export const NEW_PRIVATE_NETWORK_FORM_SCHEMA = z.object({
  region: z.string().min(1),
  isLocalZone: z.boolean(),
  name: z.string().min(1),
  vlanId: z
    .number()
    .min(VLAN_ID.min)
    .max(VLAN_ID.max)
    .optional(),
  subnet: z.object({
    cidr: cidrSchema,
    enableDhcp: z.boolean(),
    ipVersion: z.number(),
    enableGatewayIp: z.boolean(),
    allocationPools: allocationPoolSchema
      .array()
      .transform((allocationIps) =>
        allocationIps.filter(({ start, end }) => start && end),
      ),
    dnsNameServers: z
      .string()
      .ip()
      .array(),
    hostRoutes: hostRoutesSchema
      .array()
      .transform((hostRoutes) =>
        hostRoutes.filter(({ destination, nextHop }) => destination && nextHop),
      ),
    useDefaultPublicDNSResolver: z.boolean(),
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
