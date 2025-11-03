import z from 'zod';
import {
  EDGE_GATEWAY_NAME_MAX_LENGTH,
  EDGE_GATEWAY_NAME_REGEX,
} from '@/pages/dashboard/datacentre/edge-gateway/add/adgeEdgeGateway.constants';

export const EDGE_FORM_SCHEMA = z.object({
  edgeGatewayName: z
    .string()
    .nonempty()
    .max(EDGE_GATEWAY_NAME_MAX_LENGTH)
    .regex(EDGE_GATEWAY_NAME_REGEX, 'ASCII only'),
  ipBlock: z.string().nonempty(),
});

export type AddEdgeForm = z.infer<typeof EDGE_FORM_SCHEMA>;
