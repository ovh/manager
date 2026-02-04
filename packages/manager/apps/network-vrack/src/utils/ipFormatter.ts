export const fromIpToId = (ip?: string) => ip?.replace(/\./g, '-')?.replace(/\//g, '_');

export const fromIdToIp = (id?: string) => id?.replace(/-/g, '.')?.replace(/_/g, '/');
