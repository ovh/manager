import * as allBreadcrumbItems from '@secret-manager/components/breadcrumb';
import { screen, waitFor } from '@testing-library/react';
import {
  CREATE_SECRET_BREADCRUMB_ITEM_TEST_ID,
  DOMAIN_BREADCRUMB_ITEM_TEST_ID,
  ROOT_BREADCRUMB_ITEM_TEST_ID,
  SECRET_BREADCRUMB_ITEM_TEST_ID,
} from './breadcrumb.constants';

type BreadcrumbItem = keyof typeof allBreadcrumbItems;

const testIdsVariants: Record<BreadcrumbItem, string> = {
  CreateSecretBreadcrumbItem: CREATE_SECRET_BREADCRUMB_ITEM_TEST_ID,
  RootBreadcrumbItem: ROOT_BREADCRUMB_ITEM_TEST_ID,
  DomainBreadcrumbItem: DOMAIN_BREADCRUMB_ITEM_TEST_ID,
  SecretBreadcrumbItem: SECRET_BREADCRUMB_ITEM_TEST_ID,
};

export const assertBreadcrumbItems = async (items: BreadcrumbItem[]) => {
  await waitFor(async () => {
    items.forEach((item) => {
      expect(screen.getByTestId(testIdsVariants[item])).toBeInTheDocument();
    });
  });
};
