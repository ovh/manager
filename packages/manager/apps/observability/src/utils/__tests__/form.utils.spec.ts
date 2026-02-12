import { describe, expect, it } from 'vitest';

import { parseNetworks, toParenthesesLabel, toRequiredLabel } from '@/utils/form.utils';

describe('toRequiredLabel', () => {
  it.each([
    { label: 'Title', requiredLabel: 'required', expected: 'Title - required' },
    { label: '', requiredLabel: '', expected: ' - ' },
  ])('should return "$expected" for label "$label"', ({ label, requiredLabel, expected }) => {
    expect(toRequiredLabel(label, requiredLabel)).toBe(expected);
  });
});

describe('toParenthesesLabel', () => {
  it.each([
    { label: 'Paris', expected: '(Paris)' },
    { label: '', expected: '()' },
  ])('should return "$expected" for label "$label"', ({ label, expected }) => {
    expect(toParenthesesLabel(label)).toBe(expected);
  });
});

describe('parseNetworks', () => {
  it.each([
    {
      description: 'comma-separated IPs',
      input: '1.2.3.4,5.6.7.8',
      expected: ['1.2.3.4', '5.6.7.8'],
    },
    {
      description: 'comma-separated IPs with spaces',
      input: '1.2.3.4, 5.6.7.8, 10.0.0.1',
      expected: ['1.2.3.4', '5.6.7.8', '10.0.0.1'],
    },
    {
      description: 'newline-separated IPs',
      input: '1.2.3.4\n5.6.7.8',
      expected: ['1.2.3.4', '5.6.7.8'],
    },
    {
      description: 'mixed comma and newline-separated IPs',
      input: '1.2.3.4, 5.6.7.8\n10.0.0.0/24',
      expected: ['1.2.3.4', '5.6.7.8', '10.0.0.0/24'],
    },
    {
      description: 'IPs with whitespace to trim',
      input: '  1.2.3.4  ,  5.6.7.8  ',
      expected: ['1.2.3.4', '5.6.7.8'],
    },
    {
      description: 'empty strings filtered out',
      input: '1.2.3.4,,5.6.7.8,',
      expected: ['1.2.3.4', '5.6.7.8'],
    },
    {
      description: 'empty string',
      input: '',
      expected: [],
    },
    {
      description: 'single IP',
      input: '192.168.1.1',
      expected: ['192.168.1.1'],
    },
    {
      description: 'CIDR notation',
      input: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16',
      expected: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'],
    },
    {
      description: 'multiple empty lines and commas',
      input: '\n\n1.2.3.4\n\n,,,5.6.7.8\n',
      expected: ['1.2.3.4', '5.6.7.8'],
    },
  ])('should parse $description', ({ input, expected }) => {
    expect(parseNetworks(input)).toEqual(expected);
  });
});
