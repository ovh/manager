import z from 'zod';
import {
  EDGE_GATEWAY_NAME_MAX_LENGTH,
  EDGE_GATEWAY_NAME_REGEX,
} from '@/pages/dashboard/datacentre/edge-gateway/add/adgeEdgeGateway.constants';

const addEdgeSchema = z.object({
  name: z
    .string()
    .nonempty()
    .max(EDGE_GATEWAY_NAME_MAX_LENGTH)
    .regex(EDGE_GATEWAY_NAME_REGEX, 'ASCII only'),
  ipBlock: z.string().nonempty(),
});
const editEdgeNameSchema = addEdgeSchema.pick({ name: true });
const editEdgeIpBlockSchema = addEdgeSchema.pick({ ipBlock: true });

export const EDGE_SCHEMAS = {
  addEdge: addEdgeSchema,
  editEdgeName: editEdgeNameSchema,
  editEdgeIpBlock: editEdgeIpBlockSchema,
};

export type AddEdgeForm = z.infer<typeof EDGE_SCHEMAS.addEdge>;
export type EditEdgeNameForm = z.infer<typeof EDGE_SCHEMAS.editEdgeName>;
export type EditEdgeIpBlockForm = z.infer<typeof EDGE_SCHEMAS.editEdgeIpBlock>;
