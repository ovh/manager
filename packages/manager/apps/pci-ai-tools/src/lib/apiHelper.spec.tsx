import { describe, it, expect } from 'vitest';
import { getAIApiErrorMessage } from './apiHelper';
import { AIError } from '@/data/api';

describe('getAIApiErrorMessage', () => {
  it('should return the "details.message" if it exists', () => {
    const mockError = {
      response: {
        data: {
          details: {
            message: 'Details error message',
          },
        },
      },
    } as AIError;
    const result = getAIApiErrorMessage(mockError);
    expect(result).toBe('Details error message');
  });

  it('should return the "message" if "details.message" does not exist', () => {
    const mockError = {
      response: {
        data: {
          message: 'Fallback error message',
        },
      },
    } as AIError;
    const result = getAIApiErrorMessage(mockError);
    expect(result).toBe('Fallback error message');
  });

  it('should return "unknown error" if neither "details.message" nor "message" exists', () => {
    const mockError = {
      response: {
        data: {},
      },
    } as AIError;
    const result = getAIApiErrorMessage(mockError);
    expect(result).toBe('unknown error');
  });
});
