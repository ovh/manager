import React, { FC } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { Spinner, Text } from '@ovhcloud/ods-react';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { LinkWithArrow } from '@/components/link-with-arrow/LinkWithArrow.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareForm } from '@/pages/create/components/form/CreateShareForm.component';

const CreateSharePage: FC = () => {
  const { t } = useTranslation(['create']);

  const { isLoading } = useShareCatalog();

  return (
    <main className="px-4 py-8 md:mt-2 md:px-10 md:py-9">
      <Breadcrumb items={[{ label: t('title') }]} />
      <section className="mt-8">
        <article>
          <Text preset="heading-1">{t('create:title')}</Text>
          <Text className="w-2/3">
            <Trans
              i18nKey="description"
              ns="create"
              components={[
                <LinkWithArrow
                  key="0"
                  href={
                    'https://www.figma.com/design/Zd87aaPa2s2AZWD9tHGoXY/TAPC-541--FSaaS---Manager-?node-id=1402-25772&p=f&t=SWfMvwaNLzXFkhoS-0'
                  }
                />,
              ]}
            />
          </Text>
        </article>
      </section>
      <section className="mt-8">{isLoading ? <Spinner /> : <CreateShareForm />}</section>
    </main>
  );
};

export default CreateSharePage;
