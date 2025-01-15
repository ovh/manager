import { act, renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import { getLastXMonths } from '@/utils/formatter/date';
import { getBigestConsumption, isInstanceFlavor } from '@/utils/savingsPlan';
import { useFilteredConsumption } from './useFilteredConsumption';
import { useSavingsPlanConsumption } from './useSavingsPlanConsumption';

vi.mock('./useSavingsPlanConsumption');
vi.mock('@/utils/formatter/date');
vi.mock('@/utils/savingsPlan');

describe('useFilteredConsumption', () => {
  const mockLocale = 'en-US';
  const mockConsumptionData = {
    flavors: [
      { flavor: 'b3-8', consumption: 100 },
      { flavor: 'c3-16', consumption: 200 },
    ],
  };

  beforeEach(() => {
    vi.mocked(useSavingsPlanConsumption).mockReturnValue({
      data: mockConsumptionData,
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(getLastXMonths).mockReturnValue([
      'January 2023',
      'December 2022',
    ]);

    vi.mocked(getBigestConsumption).mockReturnValue(
      mockConsumptionData.flavors[1],
    );

    vi.mocked(isInstanceFlavor).mockImplementation((flavor) =>
      flavor.startsWith('b'),
    );
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFilteredConsumption(mockLocale));

    expect(result.current.period).toBe('January 2023');
    expect(result.current.flavor).toBe('c3-16');
    expect(result.current.isConsumptionLoading).toBe(false);
  });

  it('should provide correct period options', () => {
    const { result } = renderHook(() => useFilteredConsumption(mockLocale));
    expect(result.current.periodOptions).toEqual([
      { value: 'January 2023' },
      { value: 'December 2022' },
    ]);
  });

  it('should provide correct flavor options', () => {
    const { result } = renderHook(() => useFilteredConsumption(mockLocale));

    expect(result.current.flavorOptions).toEqual([
      { label: 'b3-8', value: 'b3-8', prefix: 'Instance' },
      { label: 'c3-16', value: 'c3-16', prefix: 'Rancher' },
    ]);
  });

  it('should update flavor when setFlavor is called', () => {
    const { result } = renderHook(() => useFilteredConsumption(mockLocale));

    act(() => {
      result.current.setFlavor('b3-8');
    });

    expect(result.current.flavor).toBe('b3-8');
  });

  it('should update period when setPeriod is called', () => {
    const { result } = renderHook(() => useFilteredConsumption(mockLocale));

    act(() => {
      result.current.setPeriod('December 2022');
    });

    expect(result.current.period).toBe('December 2022');
  });
});
