import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import { LocationStep } from './LocationStep.component';

vi.mock('@/hooks/useHas3AZRegions', () => ({
  default: () => ({
    uniqueRegions: ['multi-zones'],
    contains3AZ: true,
  }),
}));

vi.mock('@/api/hooks/useAvailability', () => ({
  useRefreshProductAvailability: () => ({ refresh: vi.fn() }),
}));

vi.mock('@/components/region-selector/KubeRegionSelector.component', () => ({
  KubeRegionSelector: ({
    onSelectRegion,
  }: {
    onSelectRegion: ({
      name,
      enabled,
      macroLabel,
      microLabel,
    }: {
      name: string;
      enabled: boolean;
      macroLabel: string;
      microLabel: string;
    }) => void;
  }) => {
    onSelectRegion({
      name: 'GRA',
      enabled: true,
      macroLabel: 'France',
      microLabel: 'Gravelines',
    });
    return <div data-testid="mock-region-selector" />;
  },
}));

vi.mock('@/components/region-selector/KubeRegionSelector.component', () => ({
  KubeRegionSelector: vi.fn(),
}));

vi.mock('@/api/hooks/useAddRegion', () => ({
  useAddProjectRegion: () => ({
    isPending: false,
    addRegion: vi.fn(),
    error: null,
    isSuccess: false,
  }),
}));

// ─── Props ───
const baseProps = {
  projectId: 'project-123',
  step: { isOpen: false, isLocked: true, isChecked: false },
  onSubmit: vi.fn(),
};

describe('LocationStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders deployment mode and region selector', () => {
    const props = {
      ...baseProps,
      step: { isLocked: false, isOpen: true, isChecked: true },
    };
    render(<LocationStep {...props} />, { wrapper });

    expect(screen.getByText('add:kubernetes_add_region_title')).toBeInTheDocument();

    expect(screen.getByText('add:kubernetes_add_region_title_multi-zones')).toBeInTheDocument();
  });

  it('disables Next button if no region selected', () => {
    const props = {
      ...baseProps,
      step: { ...baseProps.step, isLocked: false, isOpen: true },
    };
    render(<LocationStep {...props} />, { wrapper });

    const button = screen.getByText(/common_stepper_next_button_label/i);

    expect(button).toBeDisabled();
  });

  it('calls onSubmit when clicking Next with an enabled region', () => {
    const props = {
      ...baseProps,
      step: { ...baseProps.step, isLocked: false, isOpen: true },
    };
    render(<LocationStep {...props} />, { wrapper });

    const button = screen.getByText(/common_stepper_next_button_label/i);

    act(() => {
      fireEvent.click(button);
    });

    expect(baseProps.onSubmit).not.toHaveBeenCalled();
  });
});
