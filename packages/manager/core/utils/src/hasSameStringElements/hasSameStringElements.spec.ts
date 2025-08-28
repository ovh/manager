import { describe, it, expect } from 'vitest';
import { hasSameStringElements } from '.';

describe('hasSameStringElements', () => {
  it('should return true if the arrays have the same elements regardless of the order', () => {
    // Given
    const array1 = ['world', 'hello', 'hello'];
    const array2 = ['hello', 'world', 'hello'];

    // When
    const output = hasSameStringElements(array1, array2);

    // Then
    expect(output).toBeTruthy();
  });

  it('should return false if the arrays does not have the same elements', () => {
    // Given
    const array1 = ['world', 'hello', 'world'];
    const array2 = ['hello', 'world', 'hello'];

    // When
    const output = hasSameStringElements(array1, array2);

    // Then
    expect(output).toBeFalsy();
  });

  it('should return false if the other array is undefined', () => {
    // Given
    const array1 = ['hello', 'world'];
    const array2 = undefined;

    // When
    const output = hasSameStringElements(array1, array2);

    // Then
    expect(output).toBeFalsy();
  });

  it('should return false if the first array is undefined', () => {
    // Given
    const array1 = undefined;
    const array2 = ['hello', 'world'];

    // When
    const output = hasSameStringElements(array1, array2);

    // Then
    expect(output).toBeFalsy();
  });

  it('should return false if the arrays do not have the same length', () => {
    // Given
    const array1 = ['hello'];
    const array2 = ['hello', 'world'];

    // When
    const output = hasSameStringElements(array1, array2);

    // Then
    expect(output).toBeFalsy();
  });
});
