export const subRoutes = {
  tagManager: 'tag-manager',
  assignTag: 'assign-tag',
  tagDetail: ':tag',
};

export const urls = {
  root: '/',
  tagManager: `/${subRoutes.tagManager}`,
  assignTag: `/${subRoutes.tagManager}/${subRoutes.assignTag}`,
  tagDetail: `/${subRoutes.tagManager}/${subRoutes.tagDetail}`,
};
