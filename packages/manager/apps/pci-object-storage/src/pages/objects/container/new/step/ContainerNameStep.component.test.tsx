import { render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { ContainerNameStep } from './ContainerNameStep.component';
import { wrapper } from '@/wrapperRenders';
import { useContainerCreationStore } from '../useContainerCreationStore';

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
      { wrapper },
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
