import { describe } from 'vitest';
import { decodeVrackNetwork, encodeVrackNetwork } from './encodeVrackNetwork';

describe('encodeVrackNetwork function', () => {
  it.each([
    ['127.0.0.1/00', '127.0.0.1__00'],
    ['10.0.0.0/99', '10.0.0.0__99'],
    ['1.1.1.1/1', '1.1.1.1__1'],
    ['2001:db8::1/15', '2001:db8::1__15'],
    ['already__encoded', 'already__encoded'],
    ['/leading/slash', '__leading__slash'],
    ['trailing/slash/', 'trailing__slash__'],
    ['withoutSlash', 'withoutSlash'],
  ])('encodes "%s" to "%s"', (input, expected) => {
    expect(encodeVrackNetwork(input)).toBe(expected);
  });
});

describe('decodeVrackNetwork function', () => {
  it.each([
    ['127.0.0.1__00', '127.0.0.1/00'],
    ['10.0.0.0__99', '10.0.0.0/99'],
    ['1.1.1.1__1', '1.1.1.1/1'],
    ['2001:db8::1__15', '2001:db8::1/15'],
    ['already/decoded', 'already/decoded'],
    ['__leading__slash', '/leading/slash'],
    ['trailing__slash__', 'trailing/slash/'],
    ['withoutSlash', 'withoutSlash'],
  ])('decodes "%s" to "%s"', (input, expected) => {
    expect(decodeVrackNetwork(input)).toBe(expected);
  });
});
