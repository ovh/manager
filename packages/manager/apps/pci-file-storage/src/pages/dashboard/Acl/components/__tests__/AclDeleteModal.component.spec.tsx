import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TAclData } from '@/pages/dashboard/Acl/acl.view-model';

import { AclDeleteModal } from '../AclDeleteModal.component';

const createAclData = (accessTo: string) =>
  ({
    id: 'acl-1',
    accessTo,
    permission: 'readOnly' as const,
    status: 'active',
    statusDisplay: { labelKey: 'status:active', badgeColor: 'success' },
  }) as TAclData;

describe('AclDeleteModal', () => {
  it('should not show modal when open is false', () => {
    render(
      <AclDeleteModal
        open={false}
        aclData={null}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toBeVisible();
  });

  it('should render title and description when open', () => {
    const aclData = createAclData('10.0.0.0/24');
    render(
      <AclDeleteModal
        open
        aclData={aclData}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('acl:deleteModal.title')).toBeVisible();
    expect(screen.getByText('acl:deleteModal.description{"accessTo":"10.0.0.0/24"}')).toBeVisible();
  });

  it('should show empty accessTo when aclData is null', () => {
    render(
      <AclDeleteModal
        open
        aclData={null}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('acl:deleteModal.title')).toBeVisible();
  });

  it.each([
    { description: 'should call onCancel when close button is clicked', buttonIndex: 0 },
    { description: 'should call onConfirm when confirm button is clicked', buttonIndex: 1 },
  ])('$description', async ({ buttonIndex }) => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <AclDeleteModal
        open
        aclData={createAclData('10.0.0.0')}
        isDeleting={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttonIndex] as HTMLElement);

    if (buttonIndex === 0) {
      expect(onCancel).toHaveBeenCalled();
      expect(onConfirm).not.toHaveBeenCalled();
    } else {
      expect(onConfirm).toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    }
  });

  it('should disable both buttons when isDeleting is true', () => {
    render(
      <AclDeleteModal
        open
        aclData={createAclData('10.0.0.0')}
        isDeleting
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });
});
