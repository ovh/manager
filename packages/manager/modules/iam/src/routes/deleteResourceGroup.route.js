import { deleteEntity as deleteEntityComponent } from '@iam/components';
import {
  asPath,
  asResolve,
  noBreadcrumbResolve,
  resourceGroupParamResolve,
} from '@iam/resolves';

const name = 'deleteResourceGroup';
const resolves = [noBreadcrumbResolve, resourceGroupParamResolve];

const state = () => ({
  url: `/delete/${asPath(resourceGroupParamResolve)}`,
  component: deleteEntityComponent.name,
  resolve: {
    ...asResolve(deleteEntityComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
