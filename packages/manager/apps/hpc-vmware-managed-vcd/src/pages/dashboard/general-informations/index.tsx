import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/loading/Loading.component';
import VcdGenerationInformationTile from '@/components/tiles/vcd-general-information-tile/VcdGeneralInformationTile.component';
import VcdOptionsTile from '@/components/tiles/vcd-options-tile/VcdOptionsTile.component';
import { urls } from '@/routes/routes.constant';
import BillingTile from '@/components/tiles/billing-tile/BillingTile.component';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';

function GeneralInformation() {
  const { id } = useParams();
  const {
    data: vcdOrganisation,
    isError,
    isLoading,
  } = useManagedVcdOrganization(id);

  const navigate = useNavigate();

  if (isError) {
    navigate(urls.root); // TODO display error
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-10">
      <VcdGenerationInformationTile vcdOrganisation={vcdOrganisation?.data} />
      <div>
        <VcdOptionsTile />
      </div>
      <div>
        <BillingTile id={id} />
      </div>
    </div>
  );
}

export default GeneralInformation;
