import { useContext, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  postManagedCmsResourceWebsite,
  putManagedCmsResourceWebsiteTasks,
} from '@/data/api/managedWordpress';
import { useManagedWordpressWebsiteDetails } from '@/data/hooks/managedWordpress/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails';
import { ManagedWordpressCmsType } from '@/data/types/product/managedWordpress/cms';
import { useGenerateUrl } from '@/hooks';
import { zForm } from '@/utils/formSchemas.utils';

import Step1, { Step1FormValues } from './ImportForm/Step1';
import Step2 from './ImportForm/Step2';
import { Step2FormValues } from './ImportForm/types';

export default function ImportForm() {
  const { t } = useTranslation([NAMESPACES.FORM, NAMESPACES.ERROR, 'common', 'managedWordpress']);
  const { serviceName } = useParams();
  const [step, setStep] = useState(1);
  const { environment } = useContext(ShellContext);
  const { language } = environment.getUser();
  const { addError, addSuccess } = useNotifications();
  // form control for step 1
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<Step1FormValues>({
    defaultValues: {
      adminLogin: '',
      adminPassword: '',
      adminURL: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(zForm(t).ADD_SITE_FORM_SCHEMA),
  });

  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const { data } = useManagedWordpressWebsiteDetails(serviceName, websiteId);
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: createWebsite, isPending: isSubmittingStep1 } = useMutation({
    mutationFn: async ({
      adminLogin,
      adminPassword,
      adminURL,
    }: {
      adminLogin: string;
      adminPassword: string;
      adminURL: string;
    }) => {
      return postManagedCmsResourceWebsite(serviceName, {
        adminLogin,
        adminPassword,
        adminURL,
        cms: ManagedWordpressCmsType.WORDPRESS,
        cmsSpecific: {
          wordPress: { language },
        },
      });
    },
    onSuccess: (response: { id?: string } | void) => {
      if (response && typeof response === 'object' && 'id' in response && response.id) {
        setWebsiteId(response.id);
        setStep(2);
      }
    },
    onError: (error: unknown) => {
      addError(
        <OdsText>
          {t(`${NAMESPACES.ERROR}error_message`, {
            error: (error as ApiError)?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
  });

  const onStep1Submit: SubmitHandler<Step1FormValues> = ({
    adminLogin,
    adminPassword,
    adminURL,
  }) => {
    createWebsite({ adminLogin, adminPassword, adminURL });
  };

  // form control for step 2
  const defaultValuesStep2 = useMemo<Step2FormValues | null>(() => {
    if (!data?.currentState.import.checkResult.cmsSpecific.wordPress) {
      return null;
    }
    const plugins = data?.currentState.import.checkResult.cmsSpecific.wordPress.plugins.map(
      (plugin) => ({
        name: plugin.name,
        version: plugin.version,
        enabled: true,
      }),
    );
    const themes = data?.currentState.import.checkResult.cmsSpecific.wordPress.themes.map(
      (theme) => ({
        name: theme.name,
        version: theme.version,
        active: true,
      }),
    );
    return {
      plugins,
      themes,
      media: false,
      wholeDatabase: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    };
  }, [data]);

  const step2Form = useForm<Step2FormValues>({
    defaultValues: defaultValuesStep2 ?? {
      plugins: [],
      themes: [],
      media: true,
      wholeDatabase: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    },
    mode: 'onChange',
  });
  useEffect(() => {
    if (data?.currentState.import.checkResult.cmsSpecific.wordPress) {
      step2Form.reset({
        plugins: data?.currentState.import.checkResult.cmsSpecific.wordPress.plugins.map(
          (plugin) => ({
            name: plugin.name,
            version: plugin.version,
            enabled: true,
          }),
        ),
        themes: data?.currentState.import.checkResult.cmsSpecific.wordPress.themes.map((theme) => ({
          name: theme.name,
          version: theme.version,
          active: true,
        })),
        media: true,
        wholeDatabase: true,
        posts: false,
        pages: false,
        comments: false,
        tags: false,
        users: false,
      });
    }
  }, [data, step2Form]);
  const {
    handleSubmit: handleSubmitStep2,
    formState: { isValid: isValidStep2 },
  } = step2Form;

  const { mutate: launchImport, isPending: isSubmittingStep2 } = useMutation({
    mutationFn: async (values: Step2FormValues) => {
      const inputs = {
        'import.cmsSpecific.wordpress.selection': {
          plugins: values.plugins
            .filter((plugin) => plugin.enabled)
            .map(({ name, version, enabled }) => ({ name, version, enabled })),
          themes: values.themes
            .filter((theme) => theme.active)
            .map(({ name, version, active }) => ({ name, version, active })),
          wholeDatabase: values.wholeDatabase,
          media: values.media,
          posts: values.posts,
          pages: values.pages,
          comments: values.comments,
          tags: values.tags,
          users: values.users,
        },
      };
      const currentTaskId = data?.currentTasks?.[0]?.id;
      return putManagedCmsResourceWebsiteTasks(serviceName, inputs, currentTaskId);
    },
    onSuccess: () => {
      addSuccess(
        <div>
          <span className="block font-bold">
            {t('managedWordpress:web_hosting_managed_wordpress_import_success_message_part_1')}
          </span>
          <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block">
            {t('managedWordpress:web_hosting_managed_wordpress_import_success_message_part_2')}
          </OdsText>
        </div>,
        true,
      );
      queryClient
        .invalidateQueries({
          queryKey: ['managedWordpressWebsiteDetails', serviceName, websiteId],
        })
        .catch(console.error);
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });
  const onStep2Submit: SubmitHandler<Step2FormValues> = (values) => {
    launchImport(values);
  };

  return (
    <>
      {step === 1 && (
        <Step1
          t={t}
          control={control}
          errors={errors}
          isDirty={isDirty}
          isValid={isValid}
          isSubmitting={isSubmittingStep1}
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onStep1Submit)(e);
          }}
        />
      )}
      {step === 2 && (
        <Step2
          t={t}
          step2Form={step2Form}
          data={data}
          isValid={isValidStep2}
          isSubmitting={isSubmittingStep2}
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmitStep2(onStep2Submit)(e);
          }}
        />
      )}
    </>
  );
}
