import React, { useEffect, useState } from 'react';
import {
  CommonTitle,
  DashboardLayout,
  Description,
  Notifications,
  Subtitle,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsFormField,
  OsdsInput,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/react';

import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useOkmsServiceKeyReference } from '@/data/hooks/useOkmsReferenceServiceKey';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { OkmsServiceKeyReference } from '@/types/okmsServiceKeyReference.type';
import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyTypeECCurve,
  OkmsServiceKeyTypeOctSize,
  OkmsServiceKeyTypeRSASize,
} from '@/types/okmsServiceKey.type';
import { ServiceKeyOperations } from '@/components/serviceKey/serviceKeyOperations/serviceKeyOperations.component';
import { ServiceKeyType } from '@/components/serviceKey/serviceKeyType/serviceKeyType.component';
import { useCreateOkmsServiceKey } from '@/data/hooks/useCreateOkmsServiceKey';
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  ServiceKeyNameErrorsType,
  validateServiceKeyName,
} from '@/utils/serviceKey/validateServiceKeyName';
import { useOKMSById } from '@/data/hooks/useOKMS';

export default function CreateKey() {
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/serviceKeys');

  const { data: okms, isLoading: okmsIsLoading } = useOKMSById(okmsId);
  const {
    data: servicekeyReference,
    isLoading: serviceKeyReferenceIsLoading,
    refetch: refetchServiceKeyReference,
  } = useOkmsServiceKeyReference(okms?.data?.region);
  const [key, setKey] = useState<OkmsServiceKeyReference>();
  const [keyType, setKeyType] = useState<OkmsKeyTypes>();
  const [keySize, setKeySize] = useState<
    OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize
  >();
  const [keyCurve, setKeyCurve] = useState<OkmsServiceKeyTypeECCurve>();
  const [keyOperation, setKeyOperation] = useState<
    OkmsServiceKeyOperations[]
  >();
  const [keyDisplayName, setKeyDisplayName] = useState<string>('');
  const serviceKeyNameError = validateServiceKeyName(keyDisplayName);

  const { createKmsServiceKey, isPending } = useCreateOkmsServiceKey({
    okmsId,
    onSuccess: () => {
      navigate(`/${okmsId}${ROUTES_URLS.keys}`);
    },
    onError: () => {},
  });

  const getErrorMessage = (error: ServiceKeyNameErrorsType) => {
    switch (error) {
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_invalid_characters',
        );
      case 'REQUIRED':
      case 'TOO_MANY_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_min_max',
        );

      default:
        return null;
    }
  };

  const selectKeyType = (reference: OkmsServiceKeyReference) => {
    setKey(reference);
    setKeyType(reference.type);
  };

  const submitCreateKey = () => {
    createKmsServiceKey({
      name: keyDisplayName,
      context: keyDisplayName,
      curve: keyCurve,
      size: keySize,
      operations: keyOperation,
      type: keyType,
    });
  };

  const selectSizeOrCurveValue = (e: any) => {
    if (key.sizes.length > 0) {
      setKeySize(e.detail.value);
    } else {
      setKeyCurve(e.detail.value);
    }
  };

  useEffect(() => {
    if (okms && !okmsIsLoading && !servicekeyReference) {
      refetchServiceKeyReference();
    }
  }, [okms, okmsIsLoading, refetchServiceKeyReference, servicekeyReference]);

  useEffect(() => {
    if (!serviceKeyReferenceIsLoading && !key) {
      servicekeyReference?.data.forEach((reference) => {
        if (reference.default) {
          setKey(reference);
          setKeyType(reference.type);
        }
      });
    }
  }, [servicekeyReference, serviceKeyReferenceIsLoading]);

  useEffect(() => {
    key?.sizes.forEach((size) => {
      if (size.default) {
        setKeySize(size.value);
        setKeyCurve(null);
      }
    });
    key?.curves.forEach((curve) => {
      if (curve.default) {
        setKeyCurve(curve.value);
        setKeySize(null);
      }
    });
    key?.operations.forEach((operation) => {
      if (operation.default) {
        setKeyOperation(operation.value);
      }
    });
  }, [key]);

  return (
    <>
      <DashboardLayout
        breadcrumb={<Breadcrumb />}
        header={{
          title: t('key_management_service_service-keys_create_title'),
          description: t('key_management_service_service-keys_create_subtitle'),
          headerButton: <KmsGuidesHeader />,
        }}
        content={
          <div className="w-full block">
            <div className="mb-6">
              <Notifications />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col gap-4 md:gap-6">
                <Subtitle>
                  {t(
                    'key_management_service_service-keys_create_general_information_title',
                  )}
                </Subtitle>
                <CommonTitle>
                  {t(
                    'key_management_service_service-keys_create_general_information_field_name_title',
                  )}
                </CommonTitle>
                <Description>
                  {t(
                    'key_management_service_service-keys_create_general_information_field_name_subtitle',
                  )}
                </Description>
                <OsdsFormField error={getErrorMessage(serviceKeyNameError)}>
                  <OsdsInput
                    aria-label="input-service-key-name"
                    type={ODS_INPUT_TYPE.text}
                    error={!!serviceKeyNameError}
                    required
                    className="p-3"
                    placeholder={t(
                      'key_management_service_service-keys_create_general_information_field_name_placeholder',
                    )}
                    value={keyDisplayName}
                    onOdsValueChange={(
                      e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
                    ) => {
                      setKeyDisplayName(e.detail.value);
                    }}
                  />
                </OsdsFormField>
                <OsdsDivider />
                <Subtitle>
                  {t('key_management_service_service-keys_create_crypto_title')}
                </Subtitle>
                <CommonTitle>
                  {t(
                    'key_management_service_service-keys_create_crypto_origin_title',
                  )}
                </CommonTitle>
                <Description>
                  {t(
                    'key_management_service_service-keys_create_crypto_origin_subtitle',
                  )}
                </Description>
                <CommonTitle>
                  {t(
                    'key_management_service_service-keys_create_crypto_field_type_title',
                  )}
                </CommonTitle>
                <Description>
                  {t(
                    'key_management_service_service-keys_create_crypto_field_type_subtitle',
                  )}
                </Description>
                <OsdsRadioGroup value={keyType}>
                  {servicekeyReference?.data.map((reference) => {
                    return (
                      <OsdsRadio
                        id={reference.type.toString()}
                        value={reference.type.toString()}
                        key={reference.type.toString()}
                        checked={key?.type === reference.type}
                        className="mb-6"
                      >
                        <OsdsRadioButton
                          size={ODS_RADIO_BUTTON_SIZE.sm}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          onClick={() => {
                            selectKeyType(reference);
                          }}
                        >
                          <span slot="end">
                            <ServiceKeyType
                              type={reference.type}
                              isText={true}
                            />
                            <Description>
                              {t(
                                `key_management_service_service-keys_create_crypto_field_type_description_${reference.type.toLowerCase()}`,
                              )}
                            </Description>
                          </span>
                        </OsdsRadioButton>
                      </OsdsRadio>
                    );
                  })}
                </OsdsRadioGroup>
                {key?.type === OkmsKeyTypes.EC ? (
                  <>
                    <CommonTitle>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_curve_title',
                      )}
                    </CommonTitle>
                    <Description>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_curve_subtitle',
                      )}
                    </Description>
                  </>
                ) : (
                  <>
                    <CommonTitle>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_size_title',
                      )}
                    </CommonTitle>
                    <Description>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_size_subtitle',
                      )}
                    </Description>
                  </>
                )}

                <OsdsSelect
                  value={keySize || keyCurve}
                  onOdsValueChange={(event) => {
                    selectSizeOrCurveValue(event);
                  }}
                >
                  {key?.sizes.map((size) => {
                    return (
                      <OsdsSelectOption key={size.value} value={size.value}>
                        {t(
                          'key_management_service_service-keys_create_crypto_field_size_unit',
                          { size: size.value },
                        )}{' '}
                        {size.default ? (
                          t(
                            'key_management_service_service-keys_create_crypto_field_size_curve_suffix_default',
                          )
                        ) : (
                          <></>
                        )}
                      </OsdsSelectOption>
                    );
                  })}
                  {key?.curves.map((curve) => {
                    return (
                      <OsdsSelectOption key={curve.value} value={curve.value}>
                        {curve.value}{' '}
                        {curve.default ? (
                          t(
                            'key_management_service_service-keys_create_crypto_field_size_curve_suffix_default',
                          )
                        ) : (
                          <></>
                        )}
                      </OsdsSelectOption>
                    );
                  })}
                </OsdsSelect>
                <CommonTitle>
                  {t(
                    'key_management_service_service-keys_create_crypto_field_usage_title',
                  )}
                </CommonTitle>
                <Description>
                  {t(
                    'key_management_service_service-keys_create_crypto_field_usage_subtitle',
                  )}
                </Description>
                <OsdsRadioGroup>
                  {key?.operations.map((operation) => {
                    return (
                      <OsdsRadio
                        value={operation.value.join(' / ')}
                        key={operation.value.join(' / ')}
                        checked={
                          operation.value.join(' / ') ===
                          keyOperation?.join(' / ')
                        }
                        className="mb-6"
                      >
                        <OsdsRadioButton
                          disabled={
                            key.type === OkmsKeyTypes.EC ||
                            key.type === OkmsKeyTypes.RSA
                          }
                          size={ODS_RADIO_BUTTON_SIZE.sm}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          onClick={() => {
                            setKeyOperation(operation.value);
                          }}
                        >
                          <span slot="end">
                            <ServiceKeyOperations
                              operations={operation.value}
                              isText={true}
                            />
                            <Description>
                              {t(
                                `key_management_service_service-keys_create_crypto_field_usage_description_${operation.value.join(
                                  '_',
                                )}`,
                              )}
                            </Description>
                          </span>
                        </OsdsRadioButton>
                      </OsdsRadio>
                    );
                  })}
                </OsdsRadioGroup>
              </div>
            </div>
            <OsdsDivider />
            <OsdsButton
              size={ODS_BUTTON_SIZE.md}
              inline
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              className={'xs:mt-2 sm:mt-0 w-fit h-fit'}
              onClick={() => {
                navigate(`/${okmsId}${ROUTES_URLS.keys}`);
              }}
            >
              {t('key_management_service_service-keys_create_cta_cancel')}
            </OsdsButton>
            <OsdsButton
              size={ODS_BUTTON_SIZE.md}
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              className={'xs:mt-2 sm:mt-0 sm:ml-4 w-fit h-fit'}
              onClick={submitCreateKey}
              disabled={!!serviceKeyNameError || isPending || undefined}
            >
              {t('key_management_service_service-keys_create_cta_submit')}
            </OsdsButton>
          </div>
        }
      />
      <Outlet />
    </>
  );
}
