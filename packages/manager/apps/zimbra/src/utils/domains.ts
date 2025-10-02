export const parseSRVRecord = (record: string) => {
  const parts = record.trim().split(/\s+/);

  const srvIndex = parts.findIndex((p) => p.toUpperCase() === 'SRV');
  if (srvIndex === -1 || parts.length < srvIndex + 4) {
    throw new Error('Invalid SRV record format');
  }

  const subdomain = parts[0]; // e.g. "_autodiscover._tcp"
  const priority = parseInt(parts[srvIndex + 1], 10);
  const weight = parseInt(parts[srvIndex + 2], 10);
  const port = parseInt(parts[srvIndex + 3], 10);
  const target = parts[srvIndex + 4]?.replace(/\.$/, ''); // remove trailing dot

  return { subdomain, priority, weight, port, target };
};
