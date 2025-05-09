import { render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { ContainerNameStep } from './ContainerNameStep.component';
import { wrapperShow } from '@/wrapperRenders';
import { useContainerCreationStore } from '../useContainerCreationStore';

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useOvhTracking: () => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    }),
  };
});

describe('ContainerNameStep', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the component', () => {
    const { result } = renderHook(() => useContainerCreationStore());
    result.current.stepper.containerName.isOpen = true;
    const { asFragment } = render(
      <ContainerNameStep isCreationPending={false} onSubmit={mockOnSubmit} />,
      { wrapper: wrapperShow },
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
