import { describe, expect, it } from 'vitest';

import type { ServiceOperations } from '../types/api-types';
import { servicesToMethodGroup } from './services-utils';

const makeService = (ops: Record<string, unknown>[]): ServiceOperations => ({
  path: '/base',
  operations: ops as unknown as ServiceOperations['operations'],
});

describe('servicesToMethodGroup', () => {
  it('ignores non-GET operations', () => {
    const services = [makeService([{ method: 'POST', path: '/foo' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList).toHaveLength(0);
  });

  it('uses provided functionName over others', () => {
    const services = [makeService([{ method: 'GET', path: '/foo', functionName: 'customFn' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.functionName).toBe('customFn');
  });

  it('falls back to nickname if functionName missing', () => {
    const services = [makeService([{ method: 'GET', path: '/foo', nickname: 'nickFn' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.functionName).toBe('nickFn');
  });

  it('falls back to operationId if nickname missing', () => {
    const services = [makeService([{ method: 'GET', path: '/foo', operationId: 'opFn' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.functionName).toBe('opFn');
  });

  it('falls back to generated name when no names provided', () => {
    const services = [makeService([{ method: 'GET', path: '/cloud/project' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.functionName).toBe('getcloudProject'); // derived from path
  });

  it('appends List when responseType is array', () => {
    const services = [makeService([{ method: 'GET', path: '/items', responseType: 'string[]' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.functionName).toBe('getitemsList');
  });

  it('substitutes ${params.foo} with {foo} in url', () => {
    const services = [makeService([{ method: 'GET', url: '/users/${params.id}/profile' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.apiPath).toBe('/users/{id}/profile');
  });

  it('handles empty path segments gracefully', () => {
    const services = [makeService([{ method: 'GET', path: '/' }])];

    const result = servicesToMethodGroup(services);
    expect(result?.get?.operationList?.[0]?.functionName).toBe('get');
  });
});
