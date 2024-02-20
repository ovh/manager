import React, { useEffect } from 'react';
import { Outlet, useLocation, redirect } from 'react-router-dom';
import { useRouting } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout/PageLayout';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import { database } from '@/models/database';

function BreadcrumbTitle({ category }: { category: string }) {
  const { t } = useTranslation('pci-databases-analytics');
  return (
    <span>
      {t('crumb')} - {category}
    </span>
  );
}

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return <BreadcrumbTitle category={params.category} />;
}

interface ServiceCategoryLayoutProps {
  params: {
    projectId: string;
    category: string;
  };
  request: Request;
}

export const Loader = ({ params, request }: ServiceCategoryLayoutProps) => {
  const { category } = params;
  if (
    !Object.values(database.CategoryEnum).includes(
      category as database.CategoryEnum,
    )
  ) {
    const path = request.url.replace(category, database.CategoryEnum.all);
    return redirect(path);
  }
  return null;
};

function RoutingSynchronisation() {
  const location = useLocation();
  const routing = useRouting();
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
  }, [location]);
  return <></>;
}

export default function Layout() {
  const { t } = useTranslation('pci-databases-analytics');
  return (
    <PageLayout>
      <Breadcrumb />
      <RoutingSynchronisation />
      <h1>{t('title')}</h1>
      <Outlet />
    </PageLayout>
  );
}
// operational
