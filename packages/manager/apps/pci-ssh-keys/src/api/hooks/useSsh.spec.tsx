import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  TAddSshProps,
  useAddSsh,
  useAllSshKeys,
  useRemoveSsh,
  useSshKey,
  useSshKeys,
} from './useSsh';
import { wrapper } from '@/setupTests';
import {
  addSshKey,
  getAllSshKeys,
  getSshKey,
  removeSshKey,
} from '@/api/data/ssh';
import { TSshKey } from '@/interface';

vi.mock('@/api/data/ssh', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    addSshKey: vi.fn(),
    getAllSshKeys: vi.fn(),
    getSshKey: vi.fn(),
    removeSshKey: vi.fn(),
  };
});

const sshKeysMock = ([
  {
    id: '1',
    name: 'ssh-key-1',
    fingerprint: 'fingerprint',
  },
] as unknown) as TSshKey[];

const sshKeyMock = ({
  id: '1',
  name: 'ssh-key-1',
  fingerprint: 'fingerprint',
} as unknown) as TSshKey;

describe('useAllSshKeys', () => {
  it('successfully fetches all SSH keys', async () => {
    vi.mocked(getAllSshKeys).mockResolvedValue(sshKeysMock);
    const { result } = renderHook(() => useAllSshKeys('project1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it('handles error on fetching SSH keys', async () => {
    const { result } = renderHook(() => useAllSshKeys('invalidProject'), {
      wrapper,
    });

    await waitFor(() => result.current.isError);

    expect(result.current.error).toBeDefined();
  });
});

describe('useSshKey', () => {
  it('successfully fetches SSH key', async () => {
    vi.mocked(getSshKey).mockResolvedValue(sshKeyMock);
    const { result } = renderHook(() => useSshKey('project1', 'ssh1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});

describe('useAddSsh', () => {
  it('successfully adds SSH key', async () => {
    const onSuccess = vi.fn();
    const params: TAddSshProps = {
      projectId: 'test',
      onError: vi.fn(),
      onSuccess,
    };
    const { result } = renderHook(() => useAddSsh(params), {
      wrapper,
    });

    vi.mocked(addSshKey).mockResolvedValue({ id: '1' } as never);

    const newSshKey = {
      name: 'ssh-key-1',
      publicKey: 'public-key',
    };

    await act(() => result.current.add(newSshKey));
    expect(onSuccess).toHaveBeenCalled();
  });
  // test call onError when mutation fails
  it('handles error on adding SSH key', async () => {
    const onError = vi.fn();
    const params: TAddSshProps = {
      projectId: 'test',
      onError,
      onSuccess: vi.fn(),
    };
    const { result } = renderHook(() => useAddSsh(params), {
      wrapper,
    });

    vi.mocked(addSshKey).mockRejectedValue(new Error('error'));

    const newSshKey = {
      name: 'ssh-key-1',
      publicKey: 'public-key',
    };

    await act(() => result.current.add(newSshKey));
    expect(onError).toHaveBeenCalled();
  });
  // test call add with mock data
  it('calls add with mock data', async () => {
    const { result } = renderHook(
      () =>
        useAddSsh({ projectId: 'test', onSuccess: vi.fn(), onError: vi.fn() }),
      {
        wrapper,
      },
    );

    vi.mocked(addSshKey).mockResolvedValue({ id: '1' } as never);

    const newSshKey = {
      name: 'ssh-key-1',
      publicKey: 'public-key',
    };

    await act(() => result.current.add(newSshKey));
    expect(addSshKey).toHaveBeenCalledWith('test', newSshKey);
  });
});

describe('useRemoveSsh', () => {
  // test error remove
  it('handles error on removing SSH key', async () => {
    const onError = vi.fn();
    const { result } = renderHook(
      () =>
        useRemoveSsh({
          projectId: 'test',
          sshId: '1',
          onError,
          onSuccess: vi.fn(),
        }),
      {
        wrapper,
      },
    );

    vi.mocked(removeSshKey).mockRejectedValue(new Error('error'));

    await act(() => result.current.remove());
    expect(onError).toHaveBeenCalled();
  });
  // test remove with mock data
  it('calls remove with mock data', async () => {
    const { result } = renderHook(
      () =>
        useRemoveSsh({
          projectId: 'test',
          sshId: '1',
          onError: vi.fn(),
          onSuccess: vi.fn(),
        }),
      {
        wrapper,
      },
    );

    vi.mocked(removeSshKey).mockResolvedValue(null);

    await act(() => result.current.remove());
    expect(removeSshKey).toHaveBeenCalledWith('test', '1');
  });
});

describe('useSshKeys', () => {
  it('successfully fetches all SSH keys', async () => {
    vi.mocked(getAllSshKeys).mockResolvedValue(sshKeysMock);
    const { result } = renderHook(
      () =>
        useSshKeys(
          'project1',
          {
            pagination: { pageIndex: 0, pageSize: 10 },
            sorting: { id: 'name', desc: false },
          },
          [] as string[],
        ),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(getAllSshKeys).toHaveBeenCalledWith('project1');
      expect(result.current.data).toBeDefined();
      expect(result.current.data.rows.length).toBeGreaterThan(0);
    });
  });

  it('handles error on fetching SSH keys', async () => {
    const { result } = renderHook(() => useAllSshKeys('invalidProject'), {
      wrapper,
    });

    await waitFor(() => result.current.isError);

    expect(result.current.error).toBeDefined();
  });
});
