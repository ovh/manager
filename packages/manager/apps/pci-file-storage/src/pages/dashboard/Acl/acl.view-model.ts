import { TStatusBadgeProps } from '@/components/status-badge/StatusBadge.component';
import { TAcl, TAclPermission } from '@/domain/entities/acl.entity';
import { getAclStatusDisplay } from '@/pages/view-model/aclStatus.view-model';

export const permissionOptions = ['readOnly', 'readAndWrite'] as const;
export type TPermissionOption = (typeof permissionOptions)[number];

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type TStatusOption = 'draft' | 'activating' | 'active' | 'deleting' | 'error' | string;

export type TAclData = {
  id: string;
  accessTo: string;
  permission: TPermissionOption;
  status: TStatusOption;
  statusDisplay: TStatusBadgeProps;
};

export type TAclDraftData = Omit<TAclData, 'id'> & { _tag: 'draft' };
export const ACL_ACCESS_TO_PLACEHOLDER = '10.0.0.0';
export const ACL_DEFAULT_PERMISSION: TPermissionOption = 'readOnly';

export const isAclDraftData = (data: TAclData | TAclDraftData): data is TAclDraftData =>
  '_tag' in data && data._tag === 'draft';

export const createAclDraft = (): TAclDraftData => ({
  _tag: 'draft',
  accessTo: ACL_ACCESS_TO_PLACEHOLDER,
  permission: ACL_DEFAULT_PERMISSION,
  status: 'draft',
  statusDisplay: getAclStatusDisplay('draft'),
});

export const selectAcls = (acls?: TAcl[]): TAclData[] =>
  acls?.map((acl) => {
    const permission = acl.permissions.reduce<TPermissionOption>(
      (consolidatedPermission, permission) => {
        if (consolidatedPermission === 'readAndWrite') return consolidatedPermission;
        if (permission === 'write') return 'readAndWrite';
        if (permission === 'read') return 'readOnly';
        return 'readOnly';
      },
      'readOnly',
    );

    return {
      id: acl.id,
      accessTo: acl.source.id,
      permission,
      status: acl.status,
      statusDisplay: getAclStatusDisplay(acl.status),
    };
  }) ?? [];

export const mapPermissionOptionToPermissions = (
  permissionOption: TPermissionOption,
): TAclPermission[] => (permissionOption === 'readAndWrite' ? ['read', 'write'] : ['read']);
