import { z } from 'zod';

const ipv4Octet = /^(0|[1-9]\d?|1\d\d|2[0-4]\d|25[0-5])$/;

export const Ipv4HostCidrSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const cidr = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/.exec(
      value,
    );
    if (!cidr) {
      ctx.addIssue({ code: 'custom', message: 'cidr.error.format' });
      return;
    }
    const [, a, b, c, d, mask] = cidr;
    if (![a, b, c, d].every((octet) => ipv4Octet.test(octet))) {
      ctx.addIssue({ code: 'custom', message: 'cidr.error.octetRange' });
      return;
    }
    // The whitelist accepts a single host only (D3/R2): the mask is locked to /32.
    if (Number(mask) !== 32) {
      ctx.addIssue({ code: 'custom', message: 'cidr.error.maskRange' });
    }
  });

// The v2 field is `format: ipv4`, so the /32 mask is stripped before the PUT.
export const toHostIp = (cidr: string): string =>
  cidr.trim().replace(/\/32$/, '');

export const isDuplicateHostIp = (hostIp: string, ips: string[]): boolean =>
  ips.includes(hostIp);

export const AddIpFormSchema = z.object({
  cidr: Ipv4HostCidrSchema,
});

export type AddIpFormValues = z.infer<typeof AddIpFormSchema>;
