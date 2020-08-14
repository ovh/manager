export const PACK_AVAILABILITY = {
  order: ['FR'],
};

angular.module('managerApp').constant('PACK', {
  frames: {
    informations: {
      name: 'informations',
      index: 0,
    },
    task: {
      name: 'task',
      index: 50,
    },
    promotionCode: {
      name: 'promotionCode',
      data: null,
      index: 60,
    },
  },

  fiberAccess: ['ftth'],
});

export default {
  PACK_AVAILABILITY,
};
