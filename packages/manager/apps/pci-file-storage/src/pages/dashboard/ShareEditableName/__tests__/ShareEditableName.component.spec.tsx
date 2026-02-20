import React from 'react';

import { MutateOptions, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UpdateShareCommand, useUpdateShare } from '@/data/hooks/shares/useUpdateShare';

import { ShareEditableName } from '../ShareEditableName.component';

const { mockToast, mockMutate, TestEditingContext } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createContext } = require('react') as typeof import('react');
  return {
    mockToast: vi.fn(),
    mockMutate: vi.fn(),
    TestEditingContext: createContext(false),
  };
});

vi.mock('@/data/hooks/shares/useUpdateShare', () => ({
  useUpdateShare: vi.fn(),
}));

vi.mock('@ovhcloud/ods-react', async () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useContext, forwardRef } = require('react') as typeof import('react');
  const actual = await vi.importActual<typeof import('@ovhcloud/ods-react')>('@ovhcloud/ods-react');
  const RealEditable = actual.Editable;

  return {
    ...actual,
    Skeleton: ({ className }: { className: string }) => (
      <div data-testid="skeleton" className={className} />
    ),
    Input: forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      (props, ref) => <input ref={ref} {...props} />,
    ),
    Editable: ({ children, ...props }: React.ComponentProps<typeof RealEditable>) => {
      const editing = useContext(TestEditingContext);
      return (
        <RealEditable {...props} editing={editing}>
          {children}
        </RealEditable>
      );
    },
    toast: mockToast,
  };
});

const mockUseUpdateShare = vi.mocked(useUpdateShare);

const renderWithQueryClient = (
  ui: React.ReactElement,
  { editing = false }: { editing?: boolean } = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TestEditingContext.Provider value={editing}>{ui}</TestEditingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('ShareEditableName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockUseUpdateShare.mockReturnValue({
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useUpdateShare>);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display skeleton when name is null', () => {
    renderWithQueryClient(
      <ShareEditableName name={null} projectId="project-1" shareId="share-1" region="GRA9" />,
    );

    expect(screen.getByTestId('skeleton')).toBeVisible();
    expect(screen.queryByText('My Share')).not.toBeInTheDocument();
  });

  it('should display name when name is provided', () => {
    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
    );

    expect(screen.getByText('My Share')).toBeVisible();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('should display error message and disable submit when name is empty', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');
    await act(async () => {
      await user.clear(input);
    });

    expect(screen.getByText('create:name.error.too_small')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('should display error message and disable submit when name has invalid format', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');

    await act(async () => {
      await user.clear(input);
      await user.type(input, 'invalid name with spaces');
    });

    expect(screen.getByText('create:name.error.invalid_format')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('should not display error and enable submit when name is valid', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'valid-share-name');
    });

    expect(screen.queryByText('create:name.error.too_small')).not.toBeInTheDocument();
    expect(screen.queryByText('create:name.error.invalid_format')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
  });

  it('should call mutate with new name when submitting valid input', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'new-share-name');
    });

    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { name: 'new-share-name' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('should display success toast when update succeeds', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    let onSuccessCallback: () => void;

    mockMutate.mockImplementation(
      (_data: UpdateShareCommand, options?: MutateOptions<void, Error, UpdateShareCommand>) => {
        onSuccessCallback = options?.onSuccess as () => void;
      },
    );

    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'new-share-name');
    });

    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
    });

    expect(mockMutate).toHaveBeenCalled();

    onSuccessCallback!();

    expect(mockToast).toHaveBeenCalledWith('dashboard:rename.success', {
      color: 'success',
      duration: 5000,
    });
  });

  it('should display error toast when update fails', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    let onErrorCallback: () => void;

    mockMutate.mockImplementation(
      (_data: UpdateShareCommand, options?: MutateOptions<void, Error, UpdateShareCommand>) => {
        onErrorCallback = options?.onError as () => void;
      },
    );

    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'new-share-name');
    });

    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
    });

    expect(mockMutate).toHaveBeenCalled();

    onErrorCallback!();

    expect(mockToast).toHaveBeenCalledWith('dashboard:rename.error', {
      color: 'warning',
      duration: Infinity,
    });
  });

  it('should reset input to initial value when canceling', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    renderWithQueryClient(
      <ShareEditableName name="My Share" projectId="project-1" shareId="share-1" region="GRA9" />,
      { editing: true },
    );

    const input = screen.getByDisplayValue('My Share');

    await act(async () => {
      await user.clear(input);
      await user.type(input, 'modified-name');
    });

    expect(input).toHaveValue('modified-name');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    expect(input).toHaveValue('My Share');
  });
});
