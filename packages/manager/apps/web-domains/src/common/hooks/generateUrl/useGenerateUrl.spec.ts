import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useGenerateUrl } from './useGenerateUrl';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('react-router-dom', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useHref: vi.fn(
      (text) => `#/web-domains/domain/example.com/${text.slice(2)}`,
    ),
  };
});

describe('useGenerateUrl', () => {
  describe('type path', () => {
    it('should return url path', () => {
      const { result } = renderHook(() => useGenerateUrl('./add', 'path'), {
        wrapper,
      });
      expect(result.current).toBe('./add');
    });

    it('should default to path type when no type is provided', () => {
      const { result } = renderHook(() => useGenerateUrl('./add'), {
        wrapper,
      });
      expect(result.current).toBe('./add');
    });

    it('should return url path with queryParams', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl('./delete', 'path', undefined, {
            zoneName: 'example.com',
          }),
        {
          wrapper,
        },
      );
      expect(result.current).toBe('./delete?zoneName=example.com');
    });

    it('should replace a single pathParam placeholder', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl(
            '/domain/:serviceName/information',
            'path',
            { serviceName: 'example.com' },
          ),
        { wrapper },
      );
      expect(result.current).toBe('/domain/example.com/information');
    });

    it('should replace multiple pathParam placeholders', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl(
            '/domain/:serviceName/contact-management/:holderId/edit',
            'path',
            { serviceName: 'example.com', holderId: 'contact-123' },
          ),
        { wrapper },
      );
      expect(result.current).toBe(
        '/domain/example.com/contact-management/contact-123/edit',
      );
    });

    it('should handle numeric pathParam values', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl('/domain/:id/details', 'path', { id: 42 }),
        { wrapper },
      );
      expect(result.current).toBe('/domain/42/details');
    });

    it('should combine pathParams and queryParams', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl(
            '/domain/:serviceName/zone',
            'path',
            { serviceName: 'example.com' },
            { page: 1, perPage: 25 },
          ),
        { wrapper },
      );
      expect(result.current).toBe(
        '/domain/example.com/zone?page=1&perPage=25',
      );
    });

    it('should handle empty pathParams object', () => {
      const { result } = renderHook(
        () => useGenerateUrl('./add', 'path', {}),
        { wrapper },
      );
      expect(result.current).toBe('./add');
    });

    it('should handle empty queryParams object', () => {
      const { result } = renderHook(
        () => useGenerateUrl('./add', 'path', undefined, {}),
        { wrapper },
      );
      expect(result.current).toBe('./add');
    });

    it('should replace placeholder with empty string when value is falsy', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl('/domain/:serviceName/info', 'path', {
            serviceName: '',
          }),
        { wrapper },
      );
      expect(result.current).toBe('/domain//info');
    });
  });

  describe('type href', () => {
    it('should return url href', () => {
      const { result } = renderHook(() => useGenerateUrl('./add', 'href'), {
        wrapper,
      });
      expect(result.current).toBe('#/web-domains/domain/example.com/add');
    });

    it('should return url href with queryParams', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl('./delete', 'href', undefined, {
            zoneName: 'example.com',
          }),
        {
          wrapper,
        },
      );
      expect(result.current).toBe(
        '#/web-domains/domain/example.com/delete?zoneName=example.com',
      );
    });

    it('should return url href with pathParams', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl(
            './:serviceName/dns',
            'href',
            { serviceName: 'example.com' },
          ),
        { wrapper },
      );
      expect(result.current).toBe(
        '#/web-domains/domain/example.com/example.com/dns',
      );
    });

    it('should return url href with pathParams and queryParams', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl(
            './:serviceName/zone',
            'href',
            { serviceName: 'example.com' },
            { page: 2 },
          ),
        { wrapper },
      );
      expect(result.current).toBe(
        '#/web-domains/domain/example.com/example.com/zone?page=2',
      );
    });
  });

  describe('queryParams formatting', () => {
    it('should join multiple queryParams with &', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl('./list', 'path', undefined, {
            page: 1,
            sort: 'name',
            order: 'asc',
          }),
        { wrapper },
      );
      expect(result.current).toBe('./list?page=1&sort=name&order=asc');
    });

    it('should handle numeric queryParam values', () => {
      const { result } = renderHook(
        () =>
          useGenerateUrl('./list', 'path', undefined, {
            page: 3,
            limit: 50,
          }),
        { wrapper },
      );
      expect(result.current).toBe('./list?page=3&limit=50');
    });
  });
});
