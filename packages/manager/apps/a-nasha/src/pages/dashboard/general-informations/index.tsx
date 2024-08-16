import React, { useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { apiClient } from '@ovh-ux/manager-core-api';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ODS_BUTTON_TYPE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { UpdateNameModal } from '@ovhcloud/manager-components';
import { getServiceInfos } from '@/data/api/a-nasha';

function GeneralInfos() {
  const { serviceName } = useParams();
  const { data } = useQuery({
    queryKey: ['a-nasha-service-info', serviceName],
    queryFn: () => getServiceInfos({ serviceName }),
    refetchInterval: 5000,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateCustomName = (params: any) => {
    apiClient.v6.put(`/dedicated/nasha/${serviceName}`, params);
  };

  return (
    <div className="py-[20px]">
      <div>
        <span>
          <b>serviceName :</b>{' '}
        </span>
        <span>{data?.data.serviceName}</span>
      </div>
      <div>
        <span>
          <b>customName :</b>{' '}
        </span>
        <span>{data?.data.customName}</span>
      </div>
      <div className="py-[20px] w-[250px]">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={() => setIsModalOpen(true)}
        >
          Edit Service Name
        </OsdsButton>
      </div>
      {isModalOpen && (
        <UpdateNameModal
          headline={'Nom du nasHA'}
          inputLabel=""
          closeModal={() => setIsModalOpen(false)}
          defaultValue={data?.data.customName}
          updateDisplayName={(nasha: string) => {
            updateCustomName({
              customName: nasha,
            });
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default GeneralInfos;
