import React from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useAcls } from '@/data/hooks/acl/useAcls';

import { AclDatagridTopbar } from '../AclDatagridTopbar.component';

const { mockRefetch } = vi.hoisted(() => ({
  mockRefetch: vi.fn(),
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: () => ({ region: 'GRA9', shareId: 'share-1' }),
}));

vi.mock('@/data/hooks/acl/useAcls', () => ({
  useAcls: vi.fn().mockReturnValue({
    refetch: mockRefetch,
    isFetching: false,
  }),
}));

describe('AclDatagridTopbar', () => {
  it('should render add button and call onAddClick when clicked', async () => {
    const user = userEvent.setup();
    const onAddClick = vi.fn();
    render(<AclDatagridTopbar onAddClick={onAddClick} isButtonDisabled={false} />);

    const addButton = screen.getByRole('button', { name: 'acl:add.label' });
    expect(addButton).toBeVisible();
    expect(addButton).not.toBeDisabled();

    await user.click(addButton);
    expect(onAddClick).toHaveBeenCalled();
  });

  it('should disable add button when isButtonDisabled is true', () => {
    render(<AclDatagridTopbar onAddClick={vi.fn()} isButtonDisabled />);

    const addButton = screen.getByRole('button', { name: 'acl:add.label' });
    expect(addButton).toBeDisabled();
  });

  it('should call refetch when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<AclDatagridTopbar onAddClick={vi.fn()} isButtonDisabled={false} />);

    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[1];
    await user.click(refreshButton as HTMLElement);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should disable refresh button when isFetching', () => {
    vi.mocked(useAcls).mockReturnValueOnce({
      refetch: mockRefetch,
      isFetching: true,
    } as unknown as QueryObserverSuccessResult<unknown>);
    render(<AclDatagridTopbar onAddClick={vi.fn()} isButtonDisabled={false} />);

    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[1];
    expect(refreshButton).toBeDisabled();
  });
});
