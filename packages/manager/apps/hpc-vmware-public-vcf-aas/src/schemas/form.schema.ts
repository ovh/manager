import { z } from 'zod/v3';
import { z as zV4 } from 'zod';

export const VLAN_MIN = 1;
export const VLAN_MAX = 4094;

export const ZOD_ERROR_VLAN_ID_HELPER = 'ZOD_ERROR_VLAN_ID_HELPER';
export const ZOD_ERROR_IPV4_OR_IPV4CIDR_INVALID =
  'ZOD_ERROR_IPV4_OR_IPV4CIDR_INVALID';
export const ZOD_ERROR_IPV4_OR_IPV4CIDR_OVERLAP =
  'ZOD_ERROR_IPV4_OR_IPV4CIDR_OVERLAP';
export const ZOD_ERROR_VLAN_ID_ALREADY_IN_USE =
  'ZOD_ERROR_VLAN_ID_ALREADY_IN_USE';

export const NETWORK_ACL_SCHEMA = z.object({
  network: z
    .string()
    .refine(
      (val) =>
        zV4.ipv4().safeParse(val).success ||
        zV4.cidrv4().safeParse(val).success,
      {
        message: ZOD_ERROR_IPV4_OR_IPV4CIDR_INVALID,
      },
    ),
  description: z.string().trim(),
});

export const VLAN_ID_FORM_SCHEMA = z.object({
  vlanId: z
    .number({ message: ZOD_ERROR_VLAN_ID_HELPER })
    .min(VLAN_MIN, { message: ZOD_ERROR_VLAN_ID_HELPER })
    .max(VLAN_MAX, { message: ZOD_ERROR_VLAN_ID_HELPER }),
});

export const zodErrorParamMapper = (error: string) => {
  switch (error) {
    case ZOD_ERROR_VLAN_ID_HELPER:
      return {
        minId: VLAN_MIN,
        maxId: VLAN_MAX,
      };
    default:
      return undefined;
  }
};
