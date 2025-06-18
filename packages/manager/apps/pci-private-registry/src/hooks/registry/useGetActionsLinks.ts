import { useHref } from 'react-router-dom';

export const useGetActionsLinks = (id?: string, url?: string) => ({
  upgradePlan: useHref(`./upgrade-plan?registryId=${id}`),
  rename: useHref(`./update?registryId=${id}`),
  harborUI: url,
  harborAPI: useHref(`${id}/api-url`),
  regenerateCredentials: useHref(`${id}/credentials`),
  manageCIDR: useHref(`${id}/manage-cidr`),
  deleteRegistry: useHref(`./delete?registryId=${id}`),
  manageIAM: useHref(`${id}/iam`),
});
