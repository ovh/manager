import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  selectDomainsToExport,
  processBatch,
  generateAndDownloadCsv,
} from './exportHelpers';
import { TDomainResource } from '@/domain/types/domainResource';

vi.mock('export-to-csv', () => ({
  mkConfig: vi.fn((config) => config),
  generateCsv: vi.fn((config) => (data: any) => 'mocked,csv,data'),
  download: vi.fn((config) => (csv: any) => {}),
}));

describe('exportHelpers', () => {
  const mockDomains: TDomainResource[] = [
    { id: 'domain1.com' } as TDomainResource,
    { id: 'domain2.com' } as TDomainResource,
    { id: 'domain3.com' } as TDomainResource,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('selectDomainsToExport', () => {
    it('should return fetchedDomains when exportAllServices is true and fetchedDomains is not empty', () => {
      const fetchedDomains: TDomainResource[] = [
        { id: 'fetched1.com' } as TDomainResource,
        { id: 'fetched2.com' } as TDomainResource,
      ];

      const result = selectDomainsToExport(
        true,
        [],
        mockDomains,
        fetchedDomains,
      );

      expect(result).toEqual(fetchedDomains);
      expect(result.length).toBe(2);
    });

    it('should return domainResources when exportAllServices is true and fetchedDomains is empty', () => {
      const result = selectDomainsToExport(true, [], mockDomains, []);

      expect(result).toEqual(mockDomains);
      expect(result.length).toBe(3);
    });

    it('should return domainResources when exportAllServices is true and no fetchedDomains', () => {
      const result = selectDomainsToExport(true, [], mockDomains);

      expect(result).toEqual(mockDomains);
      expect(result.length).toBe(3);
    });

    it('should return filtered domains when exportAllServices is false', () => {
      const selectedNames = ['domain1.com', 'domain3.com'];

      const result = selectDomainsToExport(
        false,
        selectedNames,
        mockDomains,
        undefined,
      );

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('domain1.com');
      expect(result[1].id).toBe('domain3.com');
    });

    it('should return empty array when exportAllServices is false and no domains match', () => {
      const result = selectDomainsToExport(
        false,
        ['nonexistent.com'],
        mockDomains,
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when domainResources is null', () => {
      const result = selectDomainsToExport(false, [], null);

      expect(result).toEqual([]);
    });
  });

  describe('processBatch', () => {
    it('should process all items in batches', async () => {
      const processor = vi.fn(async (domain: TDomainResource) => ({
        id: domain.id,
        processed: true,
      }));

      const result = await processBatch(mockDomains, 2, processor);

      expect(result.length).toBe(3);
      expect(processor).toHaveBeenCalledTimes(3);
      expect(result[0]).toEqual({ id: 'domain1.com', processed: true });
    });

    it('should call onProgress callback with correct progress', async () => {
      const processor = vi.fn(async (domain: TDomainResource) => ({
        id: domain.id,
      }));
      const onProgress = vi.fn();

      await processBatch(mockDomains, 2, processor, onProgress);

      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenNthCalledWith(1, {
        current: 2,
        total: 3,
        phase: 'processing',
        percentage: 67,
      });
      expect(onProgress).toHaveBeenNthCalledWith(2, {
        current: 3,
        total: 3,
        phase: 'processing',
        percentage: 100,
      });
    });

    it('should process items sequentially batch by batch', async () => {
      const processingOrder: string[] = [];
      const processor = vi.fn(async (domain: TDomainResource) => {
        processingOrder.push(domain.id);
        return { id: domain.id };
      });

      await processBatch(mockDomains, 2, processor);

      expect(processingOrder).toEqual([
        'domain1.com',
        'domain2.com',
        'domain3.com',
      ]);
    });

    it('should handle empty items array', async () => {
      const processor = vi.fn();
      const onProgress = vi.fn();

      const result = await processBatch([], 2, processor, onProgress);

      expect(result).toEqual([]);
      expect(processor).not.toHaveBeenCalled();
      expect(onProgress).not.toHaveBeenCalled();
    });

    it('should handle batch size larger than items array', async () => {
      const processor = vi.fn(async (domain: TDomainResource) => ({
        id: domain.id,
      }));

      const result = await processBatch(mockDomains, 10, processor);

      expect(result.length).toBe(3);
      expect(processor).toHaveBeenCalledTimes(3);
    });

    it('should work without onProgress callback', async () => {
      const processor = vi.fn(async (domain: TDomainResource) => ({
        id: domain.id,
      }));

      const result = await processBatch(mockDomains, 2, processor);

      expect(result.length).toBe(3);
    });
  });

  describe('generateAndDownloadCsv', () => {
    beforeEach(() => {
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.Blob = vi.fn() as any;
    });

    it('should generate CSV and return export result', () => {
      const data = [
        { domain: 'test1.com', expiration: '2026-01-01' },
        { domain: 'test2.com', expiration: '2026-02-01' },
      ];

      const result = generateAndDownloadCsv(data);

      expect(result).toEqual({
        downloadUrl: 'blob:mock-url',
        filename: expect.stringMatching(
          /^domains_export_\d{4}-\d{2}-\d{2}\.csv$/,
        ),
        total: 2,
      });
    });

    it('should create blob with correct CSV data', () => {
      const data = [{ domain: 'test.com' }];

      generateAndDownloadCsv(data);

      expect(global.Blob).toHaveBeenCalledWith(['mocked,csv,data'], {
        type: 'text/csv;charset=utf-8;',
      });
    });

    it('should handle empty data array', () => {
      const result = generateAndDownloadCsv([]);

      expect(result.total).toBe(0);
    });

    it('should use current date in filename', () => {
      const data = [{ domain: 'test.com' }];
      const today = new Date().toISOString().split('T')[0];

      const result = generateAndDownloadCsv(data);

      expect(result.filename).toBe(`domains_export_${today}.csv`);
    });
  });
});
