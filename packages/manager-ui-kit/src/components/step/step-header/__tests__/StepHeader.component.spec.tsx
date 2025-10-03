import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepHeader } from '../StepHeader.component';
import { StepContext } from '../../StepContext';

// Mock the dependencies
vi.mock('../useStepContext', () => ({
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

  const renderWithStepContext = (value) =>
    render(
      <StepContext.Provider value={value}>
        <StepHeader />
      </StepContext.Provider>,
    );

  beforeEach(() => {
    mockEditAction.mockClear();
  });

  it('renders the title correctly', () => {
    renderWithStepContext(defaultContext);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByTestId('edit')).not.toBeInTheDocument();
  });

  it('displays skip hint when provided', () => {
    renderWithStepContext({
      ...defaultContext,
      skip: { hint: 'This is optional' },
    });
    expect(screen.getByText('This is optional')).toBeInTheDocument();
  });

  it('does not render edit button if edit is not defined', () => {
    renderWithStepContext(<StepHeader />);
  });

  it('renders edit button when edit.action and locked are truthy', () => {
    renderWithStepContext({
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
    renderWithStepContext({
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

  it('calls edit.action when edit button is clicked and not disabled', async () => {
    renderWithStepContext({
      ...defaultContext,
      edit: {
        action: mockEditAction,
        label: 'Edit',
        disabled: false,
      },
      locked: true,
    });
    await fireEvent.click(screen.getByTestId('edit-cta'));
    expect(mockEditAction).toHaveBeenCalledWith('step-1');
  });

  it('applies correct styles when step is open', () => {
    renderWithStepContext({
      ...defaultContext,
      open: true,
    });
    const titleElement = screen.getByText('Test Title').parentElement;
    expect(titleElement).toHaveClass('text-[--ods-color-text]');
  });

  it('applies correct styles when step is closed', () => {
    renderWithStepContext({
      ...defaultContext,
    });
    const titleElement = screen.getByText('Test Title').parentElement;
    expect(titleElement).toHaveClass('text-[--ods-color-neutral-500]');
  });
});
