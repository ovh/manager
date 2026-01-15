import { useContext, useEffect } from 'react';

import { Location, useLocation, useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Input,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  GuideMenu,
  GuideMenuItem,
  Link,
  LinkType,
  useDataApi,
  useNotifications,
} from '@ovh-ux/muk';

import {
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  GIT_ASSOCIATION_GUIDE_LINK,
  GIT_WEBHOOK_GUIDE_LINK,
  REPOSITORY_PLACEHOLDER,
} from '@/constants';
import {
  useGetSshKey,
  useGetVcsWebhookUrls,
  usePostWebsiteV6,
  usePutWebsiteV6,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { zForm } from '@/utils/formSchemas.utils';

interface AssociateGitState {
  isConfiguration?: boolean;
}

export default function AssociateGitPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('multisite');
  const { serviceName, path } = useParams();
  const { addSuccess, addWarning } = useNotifications();
  const { state } = useLocation() as Location<AssociateGitState>;
  const isConfiguration = state?.isConfiguration ?? false;
  const { data } = useGetVcsWebhookUrls(serviceName, path, GITHUB_VCS);
  const { data: sshData } = useGetSshKey(serviceName);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { flattenData } = useDataApi({
    version: 'v6',
    route: `/hosting/web/${serviceName}/website?path=${path}`,
    cacheKey: ['hosting', 'web', serviceName, 'website', path],
    enabled: !!serviceName,
    iceberg: true,
  });
  const gitAssociationGuideLink =
    GIT_ASSOCIATION_GUIDE_LINK[ovhSubsidiary as keyof typeof GIT_ASSOCIATION_GUIDE_LINK] ??
    GIT_ASSOCIATION_GUIDE_LINK.DEFAULT;
  const gitWebhookGuideLink =
    GIT_WEBHOOK_GUIDE_LINK[ovhSubsidiary as keyof typeof GIT_WEBHOOK_GUIDE_LINK] ??
    GIT_WEBHOOK_GUIDE_LINK.DEFAULT;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors, isDirty },
  } = useForm({
    defaultValues: {
      repositoryUrl: isConfiguration ? (flattenData?.[0]?.vcsUrl as string) : '',
      branch: '',
    },
    resolver: zodResolver(zForm(t).GIT_ASSOCIATION_FORM_SCHEMA),
  });

  useEffect(() => {
    if (!flattenData || !isConfiguration) return;
    reset({
      repositoryUrl: isConfiguration ? (flattenData?.[0]?.vcsUrl as string) : '',
      branch: '',
    });
  }, [flattenData, reset, isConfiguration]);

  const { postWebsiteV6 } = usePostWebsiteV6(
    serviceName,
    () => {
      addSuccess(
        <>
          <Text className="mr-3">{t('multisite_git_association_success_message')}</Text>
          <Link href={`#/${serviceName}/task`}>{t('multisite_add_website_in_progress')}</Link>
        </>,
      );
    },
    (error) => {
      addWarning(
        t('multisite_git_association_error_message', {
          error: error?.response?.data?.message,
        }),
      );
    },
  );
  const { putWebsiteV6 } = usePutWebsiteV6(
    serviceName,
    () => {
      addSuccess(
        <Text className="mr-3">{t('multisite_git_association_reconfigure_success')}</Text>,
      );
    },
    (error) => {
      addWarning(
        t('multisite_git_association_reconfigure_error', {
          error: error?.response?.data?.message,
        }),
      );
    },
  );

  const onSubmit = (formData: { repositoryUrl: string; branch: string }) => {
    if (isConfiguration) {
      void putWebsiteV6({
        id: path,
        vcsBranch: formData.branch,
      });
    } else {
      void postWebsiteV6({
        path,
        vcsUrl: formData.repositoryUrl,
        vcsBranch: formData.branch,
      });
    }
    navigate(-1);
  };

  const guideItems: GuideMenuItem[] = [
    {
      id: 1,
      href: gitAssociationGuideLink,
      target: '_blank',
      children: t('multisite_git_association_guide_name'),
    },
  ];

  return (
    <form className="flex flex-col space-y-6">
      <Link type={LinkType.back} onClick={() => navigate(-1)} className="mb-4">
        {t('multisite_button_go_back')}
      </Link>
      <div className="flex items-center justify-between">
        <Text preset={TEXT_PRESET.heading1}>{t('multisite_git_association_title', { path })}</Text>
        <GuideMenu items={guideItems} />
      </div>
      <Text>{t('multisite_git_association_configure_description')}</Text>
      <Text preset={TEXT_PRESET.heading2}>{t('multisite_git_association_configure')}</Text>
      <Message color={MESSAGE_COLOR.information} dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          <div className="flex flex-col space-y-2">
            <Text preset={TEXT_PRESET.heading5}>
              {t('multisite_git_association_configure_info_title')}
            </Text>
            <ul className="mt-0">
              <li>
                <Text>{t('multisite_git_association_configure_info_description')}</Text>
              </li>
              <li>
                <Text>{t('multisite_git_association_configure_info_https')}</Text>
              </li>
              <li>
                <Text>{t('multisite_git_association_configure_info_ssh')}</Text>
              </li>
            </ul>
            <Text preset={TEXT_PRESET.heading6}>
              {t('multisite_git_association_configure_info_empty_repo')}
            </Text>
            <Text>{t('multisite_git_association_configure_info_not_empty_repo')}</Text>
            <Text preset={TEXT_PRESET.heading6}>
              {t('multisite_git_association_configure_info_add_in_parameters')}
            </Text>
          </div>
        </MessageBody>
      </Message>
      <div className="w-1/3">
        <Controller
          name="repositoryUrl"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="mb-4 w-full" invalid={!!error && invalid}>
              <FormFieldLabel>{t('multisite_git_association_repository')}</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                invalid={!!errors.repositoryUrl || !!error}
                disabled={isConfiguration}
                className="w-full"
                name="repository"
                {...field}
                placeholder={REPOSITORY_PLACEHOLDER}
              />
              <FormFieldError>{errors?.repositoryUrl?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Text preset={TEXT_PRESET.caption}>
          {t('multisite_git_association_ssh_url_repo_help', {
            httpsRepo: EXAMPLE_HTTPS_REPOSITORY_URL,
            sshRepo: EXAMPLE_SSH_REPOSITORY_URL,
          })}
        </Text>
      </div>
      <div className="w-1/3">
        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <FormField className="mb-4 w-full">
              <FormFieldLabel>{t('multisite_git_association_branch')}</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                className="w-full"
                name="branch"
                {...field}
                placeholder={t('multisite_git_association_branch')}
              />
            </FormField>
          )}
        />
        <Text preset={TEXT_PRESET.caption}>
          {t('multisite_git_association_ssh_branches_names', {
            branchesNames: EXAMPLE_BRANCHES_NAMES,
          })}
        </Text>
      </div>
      {isConfiguration && !(flattenData?.[0]?.vcsUrl as string)?.startsWith('https://') && (
        <>
          <Text preset={TEXT_PRESET.heading2}>{t('multisite_git_association_ssh_key')}</Text>
          <Text>{t('multisite_git_association_ssh_key_description')}</Text>
          <div className="w-1/3">
            <FormField className="mb-4 w-full">
              <FormFieldLabel>{t('multisite_git_association_ssh_key')}</FormFieldLabel>
              <Clipboard value={sshData?.publicKey || ''} className="w-full">
                <ClipboardControl />
                <ClipboardTrigger />
              </Clipboard>
            </FormField>
          </div>
        </>
      )}
      <Text preset={TEXT_PRESET.heading2}>{t('multisite_git_association_configure_auto')}</Text>
      <Text>{t('multisite_git_association_webhook_description')}</Text>
      <div className="w-1/3">
        <FormField className="mb-4 w-full">
          <FormFieldLabel>{t('multisite_git_association_webhook_url')}</FormFieldLabel>
          <Clipboard value={data?.push || ''} className="w-full">
            <ClipboardControl />
            <ClipboardTrigger />
          </Clipboard>
        </FormField>
      </div>
      <div className="flex flex-col">
        <Link href={gitWebhookGuideLink} target="_blank" type={LinkType.external}>
          {t('multisite_git_association_guide_configure_webhook')}
        </Link>
        <Link href={gitAssociationGuideLink} target="_blank" type={LinkType.external}>
          {t('multisite_git_association_guide_configure_tutorial')}
        </Link>
      </div>
      <div className="py-5">
        <Button onClick={() => void handleSubmit(onSubmit)()} disabled={!isDirty || !isValid}>
          {t('multisite_git_association_apply_configuration')}
        </Button>
      </div>
    </form>
  );
}
