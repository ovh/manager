import * as React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { StepProps } from '@/components';

import { StepContext } from '../../StepContext';
import { StepHeader } from '../StepHeader.component';

vi.mock('../../useStepContext', () => ({
  useStepContext: vi.fn(),
}));

const mockEditAction = vi.fn();

describe('StepHeader Component', () => {
  const defaultContext = {
    id: 'step-1',
    open: false,
    title: 'Test Title',
    edit: undefined,
    locked: true,
    skip: undefined,
  };

  beforeEach(() => {
    mockEditAction.mockClear();
  });

  const renderStepHeaderWithContext = (value: Partial<StepProps>) =>
    render(
      <StepContext.Provider value={value as StepProps}>
        <StepHeader />
      </StepContext.Provider>,
    );

  it('renders the title correctly', () => {
    renderStepHeaderWithContext(defaultContext);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByTestId('edit')).not.toBeInTheDocument();
  });

  it('displays skip hint when provided', () => {
    renderStepHeaderWithContext({
      ...defaultContext,
      skip: {
        hint: 'This is optional',
        action: () => {},
        label: '',
      },
    });
    expect(screen.getByText('This is optional')).toBeInTheDocument();
  });

  it('renders edit button when edit.action and locked are truthy', () => {
    renderStepHeaderWithContext({
      ...defaultContext,
      edit: {
        action: mockEditAction,
        label: 'Edit',
        disabled: false,
      },
      locked: true,
    });
    expect(screen.getByTestId('edit')).toBeInTheDocument();
    expect(screen.getByTestId('edit-cta')).toHaveTextContent('Edit');
  });

  it('disables edit button when edit.disabled is true', () => {
    renderStepHeaderWithContext({
      ...defaultContext,
      edit: {
        action: mockEditAction,
        label: 'Edit',
        disabled: true,
      },
      locked: true,
    });
    expect(screen.getByTestId('edit-cta')).toBeDisabled();
  });

  it('calls edit.action when edit button is clicked and not disabled', () => {
    renderStepHeaderWithContext({
      ...defaultContext,
      edit: {
        action: mockEditAction,
        label: 'Edit',
        disabled: false,
      },
      locked: true,
    });
    fireEvent.click(screen.getByTestId('edit-cta'));
    expect(mockEditAction).toHaveBeenCalledWith('step-1');
  });

  it('applies correct styles when step is open', () => {
    renderStepHeaderWithContext({
      ...defaultContext,
      open: true,
    });
    const titleElement = screen.getByText('Test Title').parentElement;
    expect(titleElement).toHaveClass('text-(--ods-color-text)');
  });

  it('applies correct styles when step is closed', () => {
    renderStepHeaderWithContext({
      ...defaultContext,
    });
    const titleElement = screen.getByText('Test Title').parentElement;
    expect(titleElement).toHaveClass('text-(--ods-color-neutral-500)');
  });
});
