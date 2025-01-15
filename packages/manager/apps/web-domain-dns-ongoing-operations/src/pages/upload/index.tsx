import { BaseLayout, GuideButton } from '@ovh-ux/manager-react-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OdsFileUpload,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import { getmeTaskDomainArgument, getmeTaskDomainId } from "@/data/api/web-domain-dns-ongoing-operations";
import SubHeader from '@/components/SubHeader';
import { TArgument } from '@/interface';
import { ODS_TEXT_PRESET } from "@ovhcloud/ods-components";

export default function upload() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {type} = useParams<{type: string}>()

  const fetchDomainData = async (routeId: string) => {
    const response = await getmeTaskDomainId(id);
    return response.data;
  };

  const fetchDomainArgument = async (domainId: string, argumentType: string)=> {
    const response = await getmeTaskDomainArgument(domainId, argumentType);
    return response.data;
  }

  const { data: domain } = useQuery({
    queryKey: ['domain'],
    queryFn: () => fetchDomainData(id),
  });

  const { data: domainArgument } = useQuery({
    queryKey: ['argument'],
    queryFn: () => fetchDomainArgument(id, type),
  });

  console.log(domain);
  console.log(domainArgument);

  return (
    <BaseLayout
      header={{
        headerButton: (
          <GuideButton
            items={[
              {
                href: 'https://www.ovh.com',
                id: 1,
                label: 'ovh.com',
                target: '_blank',
              },
              {
                href:
                  'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
                id: 2,
                label: 'Guides OVH',
                target: '_blank',
              },
            ]}
          />
        ),
        title: t('domain_operations_dashboard_title'),
      }}
    >
      <SubHeader domain={domain} />

      <section>
        <div className="flex flex-col gap-y-1 mb-6">
          <OdsText preset="paragraph">
            Commentaire de l'opération
            <strong>
              { domain?.comment }
            </strong>
          </OdsText>
          <OdsText preset="paragraph">
            Vous pouvez modifier les données relatives à l'opération <strong>"{t(`domain_operations_nicOperation_${domain?.function}`)}"</strong>
          </OdsText>
        </div>

        <div>
          <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.span}>
            <strong>{domainArgument?.description}</strong>
          </OdsText>
          <OdsFileUpload
            maxFile={3}
            maxFileLabel="No file larger than: 1.02 MB"
            acceptedFileLabel="Accepted file types : .jpg, .jpeg"
            className="w-[384px]"
          />
        </div>
      </section>
    </BaseLayout>
  );
}
