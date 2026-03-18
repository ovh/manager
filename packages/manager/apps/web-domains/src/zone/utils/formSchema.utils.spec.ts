import { describe, it, expect } from 'vitest';
import { getTargetDisplayValue, zForm } from '@/zone/utils/formSchema.utils';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

const t = (key: string) => key;

// ---------------------------------------------------------------------------
// getTargetDisplayValue — MX trailing dot
// ---------------------------------------------------------------------------

describe('getTargetDisplayValue', () => {
  describe('MX — trailing dot', () => {
    it('appends a trailing dot when the target has none', () => {
      expect(
        getTargetDisplayValue('MX', { priority: 10, target: 'mail.example.com' } as Partial<AddEntrySchemaType>),
      ).toBe('10 mail.example.com.');
    });

    it('does not double the trailing dot when target already ends with one', () => {
      expect(
        getTargetDisplayValue('MX', { priority: 10, target: 'mail.example.com.' } as Partial<AddEntrySchemaType>),
      ).toBe('10 mail.example.com.');
    });

    it('returns an empty string when target is empty', () => {
      expect(
        getTargetDisplayValue('MX', { target: '' } as Partial<AddEntrySchemaType>),
      ).toBe('');
    });
  });
});

// ---------------------------------------------------------------------------
// Hostname validation — host vs host-underscore
// ---------------------------------------------------------------------------

describe('hostname validation', () => {
  const baseFields = { subDomain: '', ttlSelect: 'global' };

  describe('CNAME (host-underscore) — accepts underscore labels', () => {
    const schema = () => zForm(t, 'CNAME').ADD_ENTRY_FORM_SCHEMA;

    it('accepts a target with an underscore-prefixed label', () => {
      const result = schema().safeParse({
        ...baseFields,
        subDomain: 'www',
        recordType: 'CNAME',
        target: '_domainkey.example.com',
      });
      expect(result.success).toBe(true);
    });

    it('accepts a complex DKIM CNAME target with multiple underscore labels', () => {
      const result = schema().safeParse({
        ...baseFields,
        subDomain: 'selector1._domainkey',
        recordType: 'CNAME',
        target: 'ovh111111111-selector1._domainkey.toto.tata.mail.ovh.net.',
      });
      expect(result.success).toBe(true);
    });

    it('accepts a normal hostname without underscores', () => {
      const result = schema().safeParse({
        ...baseFields,
        subDomain: 'www',
        recordType: 'CNAME',
        target: 'alias.example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('NS (host-underscore) — accepts underscore labels', () => {
    const schema = () => zForm(t, 'NS').ADD_ENTRY_FORM_SCHEMA;

    it('accepts a target with an underscore-prefixed label', () => {
      const result = schema().safeParse({
        ...baseFields,
        recordType: 'NS',
        subDomain: 'sub',
        target: '_ns.example.com.',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('MX (host strict) — rejects underscore labels', () => {
    const schema = () => zForm(t, 'MX').ADD_ENTRY_FORM_SCHEMA;

    it('rejects a target with an underscore-prefixed label', () => {
      const result = schema().safeParse({
        ...baseFields,
        recordType: 'MX',
        priority: 10,
        target: '_mail.example.com',
      });
      expect(result.success).toBe(false);
    });

    it('accepts a normal mail server hostname', () => {
      const result = schema().safeParse({
        ...baseFields,
        subDomain: '@',
        recordType: 'MX',
        priority: 10,
        target: 'mail.example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('SRV (host strict) — rejects underscore labels in target', () => {
    const schema = () => zForm(t, 'SRV').ADD_ENTRY_FORM_SCHEMA;

    it('rejects a target with an underscore-prefixed label', () => {
      const result = schema().safeParse({
        ...baseFields,
        recordType: 'SRV',
        subDomain: '_sip._tcp',
        priority: 10,
        weight: 20,
        port: 5060,
        target: '_sip.example.com',
      });
      expect(result.success).toBe(false);
    });

    it('accepts a normal SRV target hostname', () => {
      const result = schema().safeParse({
        ...baseFields,
        recordType: 'SRV',
        subDomain: '_sip._tcp',
        priority: 10,
        weight: 20,
        port: 5060,
        target: 'sip.example.com',
      });
      expect(result.success).toBe(true);
    });
  });
});
