import React, { FC } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { Spinner, Text } from '@ovhcloud/ods-react';

import { PciDiscoveryBanner } from '@ovh-ux/manager-pci-common';
import { BaseLayout } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { LinkWithArrow } from '@/components/link-with-arrow/LinkWithArrow.component';
import { getOnboardingLinkFor } from '@/constants/Guides.constants';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { useGetProject } from '@/hooks/useGetProject';
import { useGetUser } from '@/hooks/useGetUser';
import { CreateShareForm } from '@/pages/create/components/form/CreateShareForm.component';

const CreateSharePage: FC = () => {
  const { t } = useTranslation(['create']);
  const { ovhSubsidiary } = useGetUser();
  const { isLoading } = useShareCatalog();

  const getStartedLink = getOnboardingLinkFor('get-started', ovhSubsidiary);
  const project = useGetProject();

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb items={[{ label: t('title') }]} />}
      header={{
        title: (
          <>
            <Text preset="heading-2">{t('create:title')}</Text>
            <Text className="w-2/3">
              <Trans
                i18nKey="description"
                ns="create"
                components={[<LinkWithArrow key="0" href={getStartedLink} target="_blank" />]}
              />
            </Text>
          </>
        ),
      }}
    >
      {project && <PciDiscoveryBanner project={project} />}
      <section className="mt-8">{isLoading ? <Spinner /> : <CreateShareForm />}</section>
    </BaseLayout>
  );
};

export default CreateSharePage;
