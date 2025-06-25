import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  OdsInput,
  OdsFormField,
  OdsText,
  OdsButton,
  OdsLink,
  OdsDivider,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useUserContext } from '@/context/user/useUser';
import {
  useCompanySuggestion,
  useCompanySuggestionQueryKey,
} from '@/data/hooks/useCompanySuggestion';
import { Company } from '@/types/company';
import { useCompanySearchSchema } from '@/hooks/companySearch/useCompanySearch';
import CompanyTile from '@/pages/company/company-tile/CompanyTile.component';
import { searchMinlength } from './company.constants';

type SearchFormData = {
  search: string;
};

export default function CompanyPage() {
  const { t } = useTranslation('company');
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const { t: tForm } = useTranslation(NAMESPACES.FORM);
  const { t: tError } = useTranslation(NAMESPACES.ERROR);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { country, setLegalForm, setCompany } = useUserContext();
  const [search, setSearch] = useState<string>('');
  const queryKey = useCompanySuggestionQueryKey(search);
  const schema = useCompanySearchSchema();
  const { data, refetch, isFetching, error, isFetched } = useCompanySuggestion(
    country,
    search,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const submitCompanySearch: SubmitHandler<SearchFormData> = useCallback(
    ({ search: value }: SearchFormData) => {
      setSearch(value);
    },
    [],
  );

  useEffect(() => {
    if (
      isFetching ||
      queryClient.getQueryData(queryKey) ||
      !search ||
      errors.search
    )
      return;
    // refetch only if not found in cache
    refetch();
  }, [search]);

  const selectCompany = useCallback((company: Company) => {
    setCompany(company);
    navigate('/details');
  }, []);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('title')}</OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('description')}
          </OdsText>
        </div>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(submitCompanySearch)}
        >
          <Controller
            control={control}
            name="search"
            render={({ field: { value, onChange, onBlur } }) => (
              <OdsFormField className="flex flex-row flex-wrap items-center gap-4">
                <OdsInput
                  className="w-full"
                  name="search"
                  type="search"
                  value={value}
                  isRequired={true}
                  isLoading={isFetching}
                  isReadonly={isFetching}
                  hasError={!!errors.search}
                  onOdsChange={onChange}
                  onBlur={onBlur}
                />
                {!!errors.search && (
                  <OdsText
                    className="text-critical leading-[0.8]"
                    preset={ODS_TEXT_PRESET.caption}
                  >
                    {tForm(errors.search.message as string, {
                      value: searchMinlength,
                    })}
                  </OdsText>
                )}
              </OdsFormField>
            )}
          />
          <OdsButton
            className="w-full"
            label={tAction('search')}
            isLoading={isFetching}
            type="submit"
          />
        </form>
        <OdsDivider />
        {isFetching && (
          <div className="text-center">
            <OdsSpinner />
          </div>
        )}
        {!isFetching && !isFetched && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('fallback')}
            </OdsText>
            <OdsLink
              href="#/details"
              onClick={() => setLegalForm('individual')}
              color={ODS_LINK_COLOR.primary}
              label={t('fallback_link')}
            />
          </>
        )}
        {!isFetching && isFetched && error && (
          <>
            {error.status === 404 ? (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('no_result')}
              </OdsText>
            ) : (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {tError('error_message', { message: error.message })}
              </OdsText>
            )}
          </>
        )}
        {!isFetching && isFetched && !error && (
          <>
            {data?.companies?.length ? (
              <>
                <div className="flex flex-col gap-4 cursor-pointer">
                  {data.companies.map((company: Company, index: number) => (
                    <CompanyTile
                      company={company}
                      onClick={() => selectCompany(company)}
                      key={`company-selector-${index}`}
                    />
                  ))}
                </div>
                {data.hasMore && (
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {t('search_suggestion')}
                  </OdsText>
                )}
              </>
            ) : (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('no_result')}
              </OdsText>
            )}
          </>
        )}
        {!isFetching && isFetched && (
          <div>
            <OdsLink
              href="#/details"
              color={ODS_LINK_COLOR.primary}
              label={t('search_not_satisfactory')}
            />
          </div>
        )}
      </div>
    </>
  );
}
