import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OdsButton,
  OdsCheckbox,
  OdsMessage,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { CreateCartResult } from '@ovh-ux/manager-module-order';
import { useCreateCart } from '@/data/hooks/useCreateCart';
import { useCheckoutOrder } from '@/data/hooks/useCheckoutOrder';

// custom type for the state
export type OkmsRegionOrderSuccessful = {
  orderRegion: string;
};

const CancelButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <OdsButton
      slot="actions"
      type="button"
      variant="ghost"
      label={t('cancel')}
      onClick={onClick}
    />
  );
};

const TermsAndConditions = ({
  cart,
  onCancel,
}: {
  cart: CreateCartResult;
  onCancel: () => void;
}) => {
  const { t } = useTranslation(['secret-manager/create', NAMESPACES.ERROR]);
  const navigate = useNavigate();
  const { region } = useParams();
  const [isContractAccepted, setIsContractAccepted] = useState(false);

  const { mutate, isPending, error } = useCheckoutOrder({
    onSuccess: () => {
      const state: OkmsRegionOrderSuccessful = {
        orderRegion: region,
      };
      navigate('..', { state });
    },
  });

  return (
    <>
      <div className="flex flex-col gap-3 pb-6">
        <OdsText preset="heading-4">{t('create_domain_tc_title')}</OdsText>
        <OdsText preset="paragraph">
          {t('create_domain_tc_description')}
        </OdsText>
        <div className="flex flex-col gap-2">
          {cart.contractList.map(({ name, url }) => (
            <Links
              key={name}
              href={url}
              target="_blank"
              type={LinkType.external}
              label={name}
            />
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <OdsCheckbox
            name="confirm-contract"
            inputId="confirm-contract"
            isChecked={isContractAccepted}
            onOdsChange={(event) => setIsContractAccepted(event.detail.checked)}
          />
          <label className="cursor-pointer" htmlFor="confirm-contract">
            <OdsText preset="span">
              {t('create_domain_tc_confirm_label')}
            </OdsText>
          </label>
        </div>
        {error && (
          <OdsMessage color="danger" isDismissible={false} className="w-full">
            {t(`${NAMESPACES.ERROR}:error_message`, {
              message: error.message,
            })}
          </OdsMessage>
        )}
      </div>

      <CancelButton onClick={onCancel} />
      <OdsButton
        slot="actions"
        label="confirm"
        isDisabled={!isContractAccepted}
        onClick={() => mutate({ cartId: cart.cartId })}
        isLoading={isPending}
      />
    </>
  );
};

export const OrderOkmsModal = () => {
  const { t } = useTranslation([
    'secret-manager/create',
    NAMESPACES.ERROR,
    NAMESPACES.ACTIONS,
  ]);
  const { environment } = useContext(ShellContext);
  const { region } = useParams();
  const { ovhSubsidiary } = environment.getUser();
  const navigate = useNavigate();

  const cancel = () => {
    navigate('..');
  };

  const { mutate: createCart, data: cart, isPending, error } = useCreateCart(
    ovhSubsidiary,
    region,
  );

  /* STEP 1 - create cart on mount */
  useEffect(() => {
    createCart();
  }, []);

  return (
    <OdsModal isOpen onOdsClose={cancel}>
      {isPending && (
        <div className="flex items-center justify-center py-3">
          <OdsSpinner />
        </div>
      )}
      {error && (
        <>
          <OdsMessage
            color="danger"
            isDismissible={false}
            className="w-full pb-5"
          >
            {t(`${NAMESPACES.ERROR}:error_message`, {
              message: error.message,
            })}
          </OdsMessage>
          <CancelButton onClick={cancel} />
          <OdsButton
            slot="actions"
            label={t('retry', { ns: NAMESPACES.ACTIONS })}
            onClick={() => createCart()}
            isLoading={isPending}
          />
        </>
      )}
      {/* STEP 2 - Terms and Conditions */}
      {cart && <TermsAndConditions cart={cart} onCancel={cancel} />}
    </OdsModal>
  );
};
