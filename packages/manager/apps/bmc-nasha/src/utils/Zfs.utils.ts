// ZFS Options utilities
export const NASHA_DEFAULT_ZFS_OPTIONS = {
  atime: 'off',
  recordsize: '131072',
  sync: 'standard',
} as const;

export const ZFS_OPTIONS_TEMPLATES = {
  FILE_SYSTEM: 'File Systems (big files)',
  VIRTUAL_MACHINES: 'Virtual machines',
  DATABASES: 'Databases',
  DEFAULT: 'Default',
  CUSTOM: 'Custom',
} as const;

export type ZfsOptions = {
  atime: boolean;
  recordsize: string;
  sync: string;
  template?: {
    name: string;
    description?: string;
  };
};

export type ZfsOptionsApi = {
  atime?: 'on' | 'off';
  recordsize?: string;
  sync?: string;
  templateName?: string;
};

// Prepare ZFS options from API response
export function prepareZfsOptions(data?: {
  atime?: 'on' | 'off';
  recordsize?: string;
  sync?: string;
}): ZfsOptions {
  const options = data || NASHA_DEFAULT_ZFS_OPTIONS;
  return {
    atime: options.atime === 'on',
    recordsize: options.recordsize || NASHA_DEFAULT_ZFS_OPTIONS.recordsize,
    sync: options.sync || NASHA_DEFAULT_ZFS_OPTIONS.sync,
  };
}

// Export ZFS options for API request
export function exportZfsOptions(model: ZfsOptions, customTemplate: string): ZfsOptionsApi {
  if (!model.template || model.template.name === customTemplate) {
    return {
      atime: model.atime ? 'on' : 'off',
      recordsize: model.recordsize,
      sync: model.sync,
    };
  }
  return {
    templateName: model.template.name,
  };
}

// Format recordsize enum (common recordsize values in bytes)
export function formatRecordsizeEnum(
  bytesFilter: (bytes: number, binary?: boolean) => string,
): Array<{ default: boolean; label: string; value: string }> {
  const recordsizes = ['8192', '16384', '32768', '65536', '131072', '262144', '524288', '1048576'];
  return recordsizes.map((recordsize) => ({
    default: recordsize === NASHA_DEFAULT_ZFS_OPTIONS.recordsize,
    label: bytesFilter(parseInt(recordsize, 10), true),
    value: recordsize,
  }));
}

// Format sync enum
export function formatSyncEnum(): Array<{ default: boolean; label: string; value: string }> {
  const syncs = ['standard', 'always', 'disabled'];
  return syncs.map((sync) => ({
    default: sync === NASHA_DEFAULT_ZFS_OPTIONS?.sync,
    label: sync ? `${sync.charAt(0).toUpperCase()}${sync.slice(1)}` : '',
    value: sync,
  }));
}
