export const STATUS = {
  cancelled: {
    icon: 'ovh-font-failure text-danger',
  },
  doing: {
    icon: 'ovh-font-inprogress text-primary',
    spinner: true,
  },
  done: {
    icon: 'ovh-font-check text-success',
  },
  error: {
    icon: 'ovh-font-failure text-danger',
  },
  problem: {
    icon: 'ovh-font-failure text-danger',
  },
  todo: {
    icon: 'ovh-font-scheduled text-info',
  },
};

export const PAGINATION_PER_PAGE = 5;

export default {
  STATUS,
  PAGINATION_PER_PAGE,
};
