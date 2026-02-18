/**
 * Parses a BIND-format DNS record string and returns form-compatible values.
 *
 * Supported format:  `name [ttl] [class] type rdata`
 *
 * Examples:
 *   www 3600 IN A 192.168.1.1
 *   @ 300 IN MX 10 mail.example.com.
 *   _sip._tcp 86400 IN SRV 10 20 5060 sip.example.com.
 *   @ IN TXT "v=spf1 include:mx.ovh.com ~all"
 *   subdomain IN CAA 0 issue "letsencrypt.org"
 *   @ IN NAPTR 100 10 "S" "SIP+D2U" "" _sip._udp.example.com.
 *   @ IN LOC 52 22 23.000 N 4 53 32.000 E -2.00m 0.00m 10000m 10m
 *   @ IN SSHFP 1 1 abc123def456
 *   @ IN TLSA 3 1 1 abc123def456
 *   @ IN RP admin.example.com. info.example.com.
 *   @ IN SVCB 1 . alpn="h2,h3"
 *   @ IN DNAME example.com.
 */

import type { AddEntrySchemaType } from './formSchema.utils';

const RECORD_TYPES = new Set([
  'A', 'AAAA', 'NS', 'CNAME', 'DNAME',
  'CAA', 'HTTPS', 'LOC', 'NAPTR', 'RP', 'SRV', 'SSHFP', 'SVCB', 'TLSA', 'TXT',
  'MX', 'DMARC', 'DKIM', 'SPF',
]);

const DNS_CLASSES = new Set(['IN', 'CH', 'HS', 'CS']);

export type ParseBindResult =
  | { success: true; values: Partial<AddEntrySchemaType> }
  | { success: false; error: string };

/**
 * Tokenise a BIND string, respecting quoted strings as single tokens.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    // skip whitespace
    while (i < len && /\s/.test(input[i])) i++;
    if (i >= len) break;

    if (input[i] === '"') {
      // quoted string — collect until closing quote
      i++; // skip opening quote
      let token = '';
      while (i < len && input[i] !== '"') {
        if (input[i] === '\\' && i + 1 < len) {
          token += input[i + 1];
          i += 2;
        } else {
          token += input[i];
          i++;
        }
      }
      i++; // skip closing quote
      tokens.push(token);
    } else {
      // unquoted token
      let token = '';
      while (i < len && !/\s/.test(input[i])) {
        token += input[i];
        i++;
      }
      tokens.push(token);
    }
  }

  return tokens;
}

/**
 * Strip trailing dot from a hostname if present.
 */
function stripTrailingDot(value: string): string {
  return value.endsWith('.') ? value.slice(0, -1) : value;
}

/**
 * Parse the header tokens: name [ttl] [class] type
 * Returns the index of the first rdata token and extracted header fields.
 */
function parseHeader(tokens: string[]): {
  subDomain: string;
  ttl: number | undefined;
  ttlSelect: 'global' | 'custom';
  recordType: string;
  rdataStart: number;
} | null {
  let idx = 0;
  if (tokens.length < 2) return null;

  // 1. Name (subdomain)
  const rawName = tokens[idx++];
  const subDomain = rawName === '@' ? '' : rawName;

  // 2. Optional TTL (a number)
  let ttl: number | undefined;
  let ttlSelect: 'global' | 'custom' = 'global';

  if (idx < tokens.length && /^\d+$/.test(tokens[idx])) {
    ttl = parseInt(tokens[idx], 10);
    ttlSelect = 'custom';
    idx++;
  }

  // 3. Optional class (IN, CH, HS, CS)
  if (idx < tokens.length && DNS_CLASSES.has(tokens[idx].toUpperCase())) {
    idx++;
  }

  // 4. Record type
  if (idx >= tokens.length) return null;
  const recordType = tokens[idx].toUpperCase();
  idx++;

  if (!RECORD_TYPES.has(recordType)) return null;

  return { subDomain, ttl, ttlSelect, recordType, rdataStart: idx };
}

// ---------------------------------------------------------------------------
// Per-type rdata parsers
// ---------------------------------------------------------------------------

function parseSimpleTarget(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start >= tokens.length) return null;
  return { target: tokens[start] };
}

function parseHostTarget(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start >= tokens.length) return null;
  return { target: stripTrailingDot(tokens[start]) };
}

function parseMX(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 1 >= tokens.length) return null;
  return {
    priority: parseInt(tokens[start], 10),
    target: stripTrailingDot(tokens[start + 1]),
  };
}

function parseSRV(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 3 >= tokens.length) return null;
  return {
    priority: parseInt(tokens[start], 10),
    weight: parseInt(tokens[start + 1], 10),
    port: parseInt(tokens[start + 2], 10),
    target: stripTrailingDot(tokens[start + 3]),
  };
}

function parseCAA(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 2 >= tokens.length) return null;
  return {
    flags: parseInt(tokens[start], 10),
    tag: tokens[start + 1].toLowerCase(),
    target: stripTrailingDot(tokens[start + 2]),
  };
}

function parseTXT(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start >= tokens.length) return null;
  // TXT rdata may be split across multiple quoted strings — join them
  const value = tokens.slice(start).join('');
  return { target: value };
}

function parseSSHFP(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 2 >= tokens.length) return null;
  return {
    algorithm: tokens[start],
    fptype: tokens[start + 1],
    fp: tokens[start + 2],
  };
}

function parseTLSA(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 3 >= tokens.length) return null;
  return {
    usage: parseInt(tokens[start], 10),
    selector: parseInt(tokens[start + 1], 10),
    matchingType: parseInt(tokens[start + 2], 10),
    certificateData: tokens[start + 3],
  };
}

function parseRP(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 1 >= tokens.length) return null;
  return {
    mbox: stripTrailingDot(tokens[start]),
    txt: stripTrailingDot(tokens[start + 1]),
  };
}

function parseSVCB(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  if (start + 1 >= tokens.length) return null;
  const priority = parseInt(tokens[start], 10);
  const target = stripTrailingDot(tokens[start + 1]);
  const params = tokens.length > start + 2
    ? tokens.slice(start + 2).join(' ')
    : undefined;
  return { priority, target, params };
}

function parseNAPTR(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  // order pref "flags" "service" "regex" replacement
  if (start + 5 >= tokens.length) return null;
  return {
    order: parseInt(tokens[start], 10),
    pref: parseInt(tokens[start + 1], 10),
    flag: tokens[start + 2],
    service: tokens[start + 3],
    regex: tokens[start + 4] || undefined,
    replace: stripTrailingDot(tokens[start + 5]),
  };
}

function parseLOC(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  // lat_deg lat_min lat_sec N/S long_deg long_min long_sec E/W altitude size hp vp
  const remaining = tokens.slice(start);
  if (remaining.length < 8) return null;

  let idx = 0;
  const lat_deg = parseFloat(remaining[idx++]);
  const lat_min = parseFloat(remaining[idx++]);
  const lat_sec = parseFloat(remaining[idx++]);
  const latitude = remaining[idx++].toUpperCase() as 'N' | 'S';
  const long_deg = parseFloat(remaining[idx++]);
  const long_min = parseFloat(remaining[idx++]);
  const long_sec = parseFloat(remaining[idx++]);
  const longitude = remaining[idx++].toUpperCase() as 'E' | 'W';

  const result: Partial<AddEntrySchemaType> = {
    lat_deg, lat_min, lat_sec, latitude,
    long_deg, long_min, long_sec, longitude,
  };

  // Optional: altitude, size, hp, vp (may have 'm' suffix)
  const stripM = (val: string) => parseFloat(val.replace(/m$/i, ''));
  if (idx < remaining.length) result.altitude = stripM(remaining[idx++]);
  if (idx < remaining.length) result.size = stripM(remaining[idx++]);
  if (idx < remaining.length) result.hp = stripM(remaining[idx++]);
  if (idx < remaining.length) result.vp = stripM(remaining[idx++]);

  return result;
}

function parseDMARC(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  // DMARC rdata is a TXT record with structured content: "v=DMARC1; p=none; pct=100; rua=..."
  if (start >= tokens.length) return null;
  const raw = tokens.slice(start).join(' ');
  const result: Partial<AddEntrySchemaType> = {};

  const pairs = raw.split(/;\s*/);
  for (const pair of pairs) {
    const [key, ...rest] = pair.split('=');
    const value = rest.join('=').trim();
    const k = key?.trim().toLowerCase();
    if (k === 'v') result.v = value;
    if (k === 'p') result.p = value;
    if (k === 'pct') result.pct = parseInt(value, 10);
    if (k === 'rua') result.rua = value;
    if (k === 'sp') result.sp = value;
    if (k === 'aspf') result.aspf = value;
  }

  if (!result.p) return null;
  return result;
}

function parseDKIM(tokens: string[], start: number): Partial<AddEntrySchemaType> | null {
  // DKIM rdata is a TXT record with structured content: "v=DKIM1; k=rsa; p=MIG..."
  if (start >= tokens.length) return null;
  const raw = tokens.slice(start).join(' ').replace(/^"|"$/g, '').replace(/"\s*"/g, '');
  const result: Partial<AddEntrySchemaType> = {};

  const pairs = raw.split(/;\s*/);
  for (const pair of pairs) {
    const [key, ...rest] = pair.split('=');
    const value = rest.join('=').trim();
    const k = key?.trim().toLowerCase();
    if (k === 'k') result.k = value;
    if (k === 'h') result.h = value;
    if (k === 'g') result.g = value;
    if (k === 'n') result.n = value;
    if (k === 's') result.s = value;
    if (k === 'p') {
      if (value === '' || !value) {
        result.dkim_status = 'revoked';
      } else {
        result.p = value;
        result.dkim_status = 'active';
      }
    }
    if (k === 't') {
      const flags = value.split(':').map((f: string) => f.trim());
      result.t_y = flags.includes('y') ? 'yes' : 'no';
      result.t_s = flags.includes('s') ? 'yes' : 'no';
    }
  }

  // p is always present in a valid DKIM record (even if empty for revoked keys)
  return result;
}

// ---------------------------------------------------------------------------
// Main parse function
// ---------------------------------------------------------------------------

export function parseBindRecord(input: string): ParseBindResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, error: 'empty_input' };
  }

  const tokens = tokenize(trimmed);
  const header = parseHeader(tokens);

  if (!header) {
    return { success: false, error: 'invalid_format' };
  }

  const { subDomain, ttl, ttlSelect, recordType, rdataStart } = header;
  let rdata: Partial<AddEntrySchemaType> | null = null;

  switch (recordType) {
    case 'A':
    case 'AAAA':
      rdata = parseSimpleTarget(tokens, rdataStart);
      break;
    case 'NS':
    case 'CNAME':
    case 'DNAME':
      rdata = parseHostTarget(tokens, rdataStart);
      break;
    case 'MX':
      rdata = parseMX(tokens, rdataStart);
      break;
    case 'SRV':
      rdata = parseSRV(tokens, rdataStart);
      break;
    case 'CAA':
      rdata = parseCAA(tokens, rdataStart);
      break;
    case 'TXT':
    case 'SPF':
      rdata = parseTXT(tokens, rdataStart);
      break;
    case 'DKIM':
      rdata = parseDKIM(tokens, rdataStart);
      break;
    case 'SSHFP':
      rdata = parseSSHFP(tokens, rdataStart);
      break;
    case 'TLSA':
      rdata = parseTLSA(tokens, rdataStart);
      break;
    case 'RP':
      rdata = parseRP(tokens, rdataStart);
      break;
    case 'SVCB':
    case 'HTTPS':
      rdata = parseSVCB(tokens, rdataStart);
      break;
    case 'NAPTR':
      rdata = parseNAPTR(tokens, rdataStart);
      break;
    case 'LOC':
      rdata = parseLOC(tokens, rdataStart);
      break;
    case 'DMARC':
      rdata = parseDMARC(tokens, rdataStart);
      break;
    default:
      return { success: false, error: 'unsupported_type' };
  }

  if (!rdata) {
    return { success: false, error: 'invalid_rdata' };
  }

  return {
    success: true,
    values: {
      recordType,
      subDomain,
      ttl,
      ttlSelect,
      ...rdata,
    },
  };
}
