export const subRoutes = {
  tagManager: 'tag-manager',
  assignTag: 'assign-tag',
  tagDetail: ':tag',
  unassignTag: 'unassign-tag',
  permanentTokens: 'manage-tokens/:userId',
};

export const urls = {
  root: '/',
  tagManager: `/${subRoutes.tagManager}`,
  assignTag: `/${subRoutes.tagManager}/${subRoutes.assignTag}`,
  tagDetail: `/${subRoutes.tagManager}/${subRoutes.tagDetail}`,
  tagDetailAssign: `/${subRoutes.tagManager}/${subRoutes.tagDetail}/${subRoutes.assignTag}`,
  tagdetailUnassign: `/${subRoutes.tagManager}/${subRoutes.tagDetail}/${subRoutes.unassignTag}`,
  permanentTokens: `/${subRoutes.permanentTokens}`,
};
