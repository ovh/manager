import { paginateResults, sortResults } from './volume';
import { TVolume } from '@/api/hooks/useVolume';

describe('paginateResults and sortResults', () => {
  it('should paginate and sort results', () => {
    const mockVolumes = [
      { id: '1', name: 'Volume 1' },
      { id: '2', name: 'Volume 2' },
    ];
    const pagination = { pageIndex: 0, pageSize: 10 };
    const sorting = { id: 'name', desc: false };

    const paginatedResults = paginateResults(mockVolumes, pagination);
    const sortedResults = sortResults(
      paginatedResults.rows as TVolume[],
      sorting,
    );

    expect(paginatedResults).toEqual({
      rows: mockVolumes,
      pageCount: 1,
      totalRows: 2,
    });
    expect(sortedResults).toEqual(mockVolumes);
  });
});
