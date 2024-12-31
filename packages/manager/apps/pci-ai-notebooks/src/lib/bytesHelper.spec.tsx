import { bytesConverter } from './bytesHelper';

describe('bytes Helper', () => {
  it('should return formated string of bytes (SI) with 1 decimals', () => {
    expect(bytesConverter(2024, false, 1)).toBe('2.0 KiB');
    expect(bytesConverter(2097152, false, 1)).toBe('2.0 MiB');
  });
  it('should return formated string of bytes (IEC) with 2 decimals', () => {
    expect(bytesConverter(1000, true, 2)).toBe('1.00 kB');
    expect(bytesConverter(2000000, true, 2)).toBe('2.00 MB');
  });
  it('should return formated string of B', () => {
    expect(bytesConverter(50, false, 1)).toBe('50 B');
  });
});
