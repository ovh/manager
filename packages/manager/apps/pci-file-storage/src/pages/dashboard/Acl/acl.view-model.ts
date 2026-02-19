import { TAcl, TAclPermission } from '@/domain/entities/acl.entity';

export const permissionOptions = ['readOnly', 'readAndWrite'] as const;
export type TPermissionOption = (typeof permissionOptions)[number];

export type TAclData = {
  id: string;
  accessTo: string;
  permission: TPermissionOption;
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
    };
  }) ?? [];

export const mapPermissionOptionToPermissions = (
  permissionOption: TPermissionOption,
): TAclPermission[] => (permissionOption === 'readAndWrite' ? ['read', 'write'] : ['read']);
