import { expect } from 'vitest';

export function assertNotNull<T>(value: T): asserts value is NonNullable<T> {
  expect(value).not.toBeNull();
}
