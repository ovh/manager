import { renderHook, act, waitFor } from '@testing-library/react';
import { User } from '@ovh-ux/manager-config';
import useUser from '@/hooks/user/useUser';
import { describe, it, vi } from 'vitest';

const userMock: Partial<User> = {
    phoneCountry: 'FR',
    firstname: 'john',
    name: 'jihn'
};

const updatedUserMock: Partial<User> = {
    ...userMock,
    phoneCountry: 'EN',
    firstname: 'doe',
};

const environmentMock = {
    user: userMock,
};
const onUserChangeMock = vi.fn();
const pluginEnvironmentMock = {
    getEnvironment: vi.fn(() => environmentMock),
    onUserChange: onUserChangeMock,
};

const shellMock = {
    getPlugin: vi.fn(() => pluginEnvironmentMock),
};

vi.mock('@/context', () => ({
    useShell: vi.fn(() => shellMock),
}));

describe('useUser', () => {
    it('returns the initial user from the environment', async () => {
        const { result } = renderHook(() => useUser());

        onUserChangeMock.mockClear();

        await waitFor(() => {
            expect(result.current).toEqual(userMock);
            expect(shellMock.getPlugin).toHaveBeenCalledWith('environment');
        });
    });

    it('updates the user when onUserChange is triggered', async () => {
        const { result } = renderHook(() => useUser());

        expect(result.current).not.toEqual(updatedUserMock);

        act(() => {
            onUserChangeMock.mock.calls[0][0](updatedUserMock);
        });

        await waitFor(() => {
            expect(result.current).toEqual(updatedUserMock);
        });
    });
});
