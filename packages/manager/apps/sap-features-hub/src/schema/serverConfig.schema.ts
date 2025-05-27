import { z } from 'zod';
import {
  SERVER_CONFIG_LIMITS,
  SERVER_CONFIG_PATTERNS,
} from '@/pages/installation/stepServerConfig/installationStepServerConfig.constants';
import { hasDuplicatedValues } from '@/utils/duplicatedValues';
import { schemaErrors } from './schemaErrors.constants';
import { APPLICATION_SERVER_ROLES } from '@/utils/applicationServers.constants';

export const VM_SCHEMA = z.object({
  name: z.string().regex(SERVER_CONFIG_PATTERNS.vmName),
  rootPassword: z.string().regex(SERVER_CONFIG_PATTERNS.rootPassword),
  ipAddress: z.string().ip({ version: 'v4' }),
  instanceNumber: z.string().regex(SERVER_CONFIG_PATTERNS.instanceNumber),
});

export const HANA_SERVER_SCHEMA = VM_SCHEMA.extend({
  vcpus: z
    .number()
    .int()
    .min(SERVER_CONFIG_LIMITS.vmHanaMinVcpu)
    .max(SERVER_CONFIG_LIMITS.vmMaxVcpu),
  memory: z
    .number()
    .int()
    .min(SERVER_CONFIG_LIMITS.vmHanaMinRam)
    .max(SERVER_CONFIG_LIMITS.vmMaxRam),
});

export const APPLICATION_SERVER_SCHEMA = VM_SCHEMA.extend({
  role: z.enum(APPLICATION_SERVER_ROLES),
  vcpus: z
    .number()
    .int()
    .min(SERVER_CONFIG_LIMITS.vmApplicationMinVcpu)
    .max(SERVER_CONFIG_LIMITS.vmMaxVcpu),
  memory: z
    .number()
    .int()
    .min(SERVER_CONFIG_LIMITS.vmApplicationMinRam)
    .max(SERVER_CONFIG_LIMITS.vmMaxRam),
});

const APPLICATION_SERVER_LIST_SCHEMA = z
  .array(APPLICATION_SERVER_SCHEMA)
  .superRefine((items, ctx) => {
    const withoutDuplicateFields: {
      key: keyof z.infer<typeof APPLICATION_SERVER_SCHEMA>;
      label: keyof typeof schemaErrors;
    }[] = [
      { key: 'name', label: 'duplicatedName' },
      { key: 'ipAddress', label: 'duplicatedIp' },
    ] as const;

    withoutDuplicateFields.forEach(({ key, label }) => {
      const values = items.map((item) => item[key]);
      if (hasDuplicatedValues(values)) {
        ctx.addIssue({
          code: 'custom',
          message: schemaErrors[label],
          path: [],
        });
      }
    });
  });

export const SERVER_CONFIG_COMMON_SCHEMA = z.object({
  network: z.string().nonempty(),
  netmask: z.string().ip({ version: 'v4' }),
  gateway: z.string().ip({ version: 'v4' }),
  thickDatastorePolicy: z.string().nonempty(),
  passwordCrypted: z.boolean(),
  hanaServerOva: z.string().nonempty(),
  hanaServerDatastore: z.string().nonempty(),
  applicationServerOva: z.string().nonempty(),
  applicationServerDatastore: z.string().nonempty(),
});

export const SERVER_CONFIG_SCHEMA = SERVER_CONFIG_COMMON_SCHEMA.extend({
  hanaServers: z.array(HANA_SERVER_SCHEMA),
  applicationServers: APPLICATION_SERVER_LIST_SCHEMA,
});
