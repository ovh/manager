const IAM_ACTIONS_OFFICE_PREFIX = 'licenseOffice:apiovh:';
const IAM_ACTIONS_OFFICE_PREPAID_PREFIX = 'licenseOfficePrepaid:apiovh:';

export const IAM_ACTIONS = {
  user: {
    create: `${IAM_ACTIONS_OFFICE_PREFIX}user/create`,
    delete: `${IAM_ACTIONS_OFFICE_PREFIX}user/delete`,
    edit: `${IAM_ACTIONS_OFFICE_PREFIX}user/edit`,
    get: `${IAM_ACTIONS_OFFICE_PREFIX}user/get`,
    password: `${IAM_ACTIONS_OFFICE_PREFIX}user/changePassword`,
  },
  licencePostPaid: {
    get: `${IAM_ACTIONS_OFFICE_PREFIX}get`,
    edit: `${IAM_ACTIONS_OFFICE_PREFIX}edit`,
  },
  licencePrepaid: {
    get: `${IAM_ACTIONS_OFFICE_PREPAID_PREFIX}get`,
    edit: `${IAM_ACTIONS_OFFICE_PREPAID_PREFIX}put`,
    changePassword: `${IAM_ACTIONS_OFFICE_PREPAID_PREFIX}changePassword`,
    unconfigure: `${IAM_ACTIONS_OFFICE_PREPAID_PREFIX}unconfigure`,
    getParentTenant: `${IAM_ACTIONS_OFFICE_PREPAID_PREFIX}parentTenant/get`,
    putParentTenant: `${IAM_ACTIONS_OFFICE_PREPAID_PREFIX}parentTenant/edit`,
  },
};

export default { IAM_ACTIONS };
