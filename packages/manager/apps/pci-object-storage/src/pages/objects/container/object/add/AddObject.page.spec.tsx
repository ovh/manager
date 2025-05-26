import { render } from '@testing-library/react';
import { vi } from 'vitest';
import AddObjectPage from './AddObject.page';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/hooks/useFeatureAvailability', () => ({
  useFeatureAvailability: vi.fn(() => ({
    data: {
      'storage:standard-infrequent-access': true,
    },
  })),
}));

vi.mock('@/hooks/useStandardInfrequentAccessAvailability', () => ({
  default: vi.fn(() => true),
}));

vi.mock('@/constants', async () => {
  const actual = await vi.importActual('@/constants');
  return {
    ...actual,
    standardInfrequentAcess: 'storage:standard-infrequent-access',
  };
});

describe('AddObjectPage', () => {
  it('should display correctly', () => {
    const { container } = render(<AddObjectPage />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
