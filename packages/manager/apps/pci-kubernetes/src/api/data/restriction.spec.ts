import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { deleteRestriction, updateRestriction } from '@/api/data/restriction';

describe('deleteRestriction', () => {
  it('deletes restriction successfully', async () => {
    vi.mocked(v6.delete).mockResolvedValue({});
    await deleteRestriction('project1', 'kube1', '192.168.1.1');
    expect(v6.delete).toHaveBeenCalledWith(
      '/cloud/project/project1/kube/kube1/ipRestrictions/192.168.1.1',
    );
  });

  it('handles error when deleting restriction', async () => {
    vi.mocked(v6.delete).mockRejectedValue(new Error('Network Error'));
    await expect(deleteRestriction('project1', 'kube1', '192.168.1.1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('updateRestriction', () => {
  it('updates restriction successfully', async () => {
    const ips = ['192.168.1.1', '192.168.1.2'];
    vi.mocked(v6.put).mockResolvedValue({});
    await updateRestriction('project1', 'kube1', ips);
    expect(v6.put).toHaveBeenCalledWith('/cloud/project/project1/kube/kube1/ipRestrictions', {
      ips,
    });
  });

  it('handles error when updating restriction', async () => {
    const ips = ['192.168.1.1', '192.168.1.2'];
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));
    await expect(updateRestriction('project1', 'kube1', ips)).rejects.toThrow('Network Error');
  });
});
