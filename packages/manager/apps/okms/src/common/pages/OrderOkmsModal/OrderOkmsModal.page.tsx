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
import {
  ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID,
  ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID,
  ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
} from './OrderOkmsModal.page.constants';
import { useOrderOkmsModalContext } from './OrderOkmsModalContext';

const CancelButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <OdsButton
      data-testid={ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID}
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
  const { t } = useTranslation([
    'secret-manager/create',
    NAMESPACES.ERROR,
    NAMESPACES.ACTIONS,
  ]);
  const { region } = useParams();
  const navigate = useNavigate();
  const { setOrderProcessingRegion } = useOrderOkmsModalContext();
  const [isContractAccepted, setIsContractAccepted] = useState(false);

  const { mutate, isPending, error } = useCheckoutOrder({
    onSuccess: () => {
      navigate('..');
      setOrderProcessingRegion(region);
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
            data-testid={ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID}
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
              message: error.response.data.message,
            })}
          </OdsMessage>
        )}
      </div>

      <CancelButton onClick={onCancel} />
      <OdsButton
        data-testid={ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID}
        slot="actions"
        label={t('confirm', { ns: NAMESPACES.ACTIONS })}
        isDisabled={!isContractAccepted}
        onClick={() => mutate({ cartId: cart.cartId })}
        isLoading={isPending}
      />
    </>
  );
};

const OrderOkmsModal = () => {
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
          <OdsSpinner data-testid={ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID} />
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
            data-testid={ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID}
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

export default OrderOkmsModal;
