import { z } from 'zod';
import {
  CONTAINER_ID_REGEX,
  BACKUP_KEY_LENGTH,
  ALPHANUMERIC_REGEX,
  OVH_URL_REGEX,
  CERTIFICAT_REGEX,
  CONTAINER_ID_MIN_LENGTH,
  CONTAINER_ID_MAX_LENGTH,
} from '../constants/form.constants';

export const ENABLEMENT_FORM_SCHEMA = z.object({
  hasBackup: z
    .boolean()
    .nullable()
    .optional(),
  bucketBackint: z
    .object({
      id: z
        .string()
        .min(CONTAINER_ID_MIN_LENGTH)
        .max(CONTAINER_ID_MAX_LENGTH)
        .regex(CONTAINER_ID_REGEX),
      endpoint: z.string().url(),
      accessKey: z
        .string()
        .length(BACKUP_KEY_LENGTH)
        .regex(ALPHANUMERIC_REGEX),
      secretKey: z
        .string()
        .length(BACKUP_KEY_LENGTH)
        .regex(ALPHANUMERIC_REGEX),
    })
    .optional(),
  hasLogsInLdpOvh: z
    .boolean()
    .nullable()
    .optional(),
  logsDataPlatform: z
    .object({
      entrypoint: z
        .string()
        .url()
        .regex(OVH_URL_REGEX),
      certificate: z
        .string()
        .trim()
        .regex(CERTIFICAT_REGEX),
    })
    .optional(),
});
