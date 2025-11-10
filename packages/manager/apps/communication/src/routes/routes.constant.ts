export const urls = {
  root: '/',
  communication: {
    listing: '/',
    detail: '/:notificationId',
    detailTo: (notificationId: string) => `/${notificationId}`,
  },
  contact: {
    listing: '/contacts',
    create: '/contacts/create',
    edit: '/contacts/:contactMeanId/edit',
    editTo: (contactMeanId: string) => `/contacts/${contactMeanId}/edit`,
    validate: '/contacts/:contactMeanId/validate',
    validateTo: (contactMeanId: string) =>
      `/contacts/${contactMeanId}/validate`,
    delete: '/contacts/:contactMeanId/delete',
    deleteTo: (contactMeanId: string) => `/contacts/${contactMeanId}/delete`,
  },
  routing: {
    listing: '/routing',
    create: '/routing/create',
    edit: '/routing/:routingId/edit',
    editTo: (routingId: string) => `/routing/${routingId}/edit`,
    delete: '/routing/:routingId/delete',
    deleteTo: (routingId: string) => `/routing/${routingId}/delete`,
  },
};
