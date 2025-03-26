import { z } from 'zod';
import {
  VM_SCHEMA,
  HANA_SERVER_SCHEMA,
  APPLICATION_SERVER_SCHEMA,
  SERVER_CONFIG_COMMON_SCHEMA,
} from '@/schema/serverConfig.schema';

export type BaseVM = z.infer<typeof VM_SCHEMA>;
export type HanaServer = z.infer<typeof HANA_SERVER_SCHEMA>;
export type ApplicationServer = z.infer<typeof APPLICATION_SERVER_SCHEMA>;
export type CommonServerConfig = z.infer<typeof SERVER_CONFIG_COMMON_SCHEMA>;

export type ServerConfigVM = HanaServer | ApplicationServer;

// for JSON export
type BaseExportProperties = Pick<
  CommonServerConfig,
  'network' | 'netmask' | 'gateway' | 'passwordCrypted'
> & {
  ovaTemplate: string;
  datastoreName: string;
};

export type ApplicationServerExport = ApplicationServer & BaseExportProperties;
export type HanaServerExport = HanaServer &
  BaseExportProperties &
  Pick<CommonServerConfig, 'thickDatastorePolicy'>;
