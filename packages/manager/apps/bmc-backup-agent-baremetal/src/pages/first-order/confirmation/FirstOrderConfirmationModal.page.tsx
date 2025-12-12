import { useNavigate } from 'react-router-dom';

import { OdsModal } from '@ovhcloud/ods-components/react';

import { FirstOrderModalTermsAndConditions } from './_components/FirstOrderModalTermsAndConditions.component';

const FirstOrderConfirmationModal = () => {
  const navigate = useNavigate();

  const onSuccess = () => {
    //Redirect Order Express
  };

  const cancel = () => {
    navigate('..');
  };

  return (
    <OdsModal isOpen onOdsClose={cancel}>
      <FirstOrderModalTermsAndConditions onCancel={cancel} onSuccess={onSuccess} />
    </OdsModal>
  );
};

export default FirstOrderConfirmationModal;
