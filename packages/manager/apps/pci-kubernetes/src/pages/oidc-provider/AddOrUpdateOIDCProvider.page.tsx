// import {
//   OsdsButton,
//   OsdsFormField,
//   OsdsInput,
//   OsdsModal,
//   OsdsSpinner,
//   OsdsText,
// } from '@ovhcloud/ods-components/react';
// import {
//   ODS_BUTTON_VARIANT,
//   ODS_INPUT_TYPE,
//   ODS_SPINNER_SIZE,
//   ODS_TEXT_COLOR_INTENT,
//   ODS_TEXT_LEVEL,
//   ODS_TEXT_SIZE,
// } from '@ovhcloud/ods-components';
// import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
// import { Translation, useTranslation } from 'react-i18next';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useContext, useEffect } from 'react';
// import { ApiError } from '@ovh-ux/manager-core-api';
// import { useNotifications } from '@ovh-ux/manager-react-components';
// import { ShellContext } from '@ovh-ux/manager-react-shell-client';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   useAddOidcProvider,
//   useOidcProvider,
//   useUpdateOidcProvider,
// } from '@/api/hooks/useKubernetes';

// const oidcSchema = z.object({
//   issuerUrl: z
//     .string()
//     .url({ message: 'Invalid URL format' })
//     .nonempty(),
//   clientId: z.string().nonempty({ message: 'Client ID is required' }),
// });

// type OidcFormValues = z.infer<typeof oidcSchema>;

// export default function AddOrUpdateOIDCProvider() {
//   const { t } = useTranslation('add-oidc-provider');
//   const { t: tCommon } = useTranslation('common');
//   const { projectId, kubeId } = useParams();
//   const navigate = useNavigate();
//   const onClose = () => navigate('..');
//   const { tracking } = useContext(ShellContext)?.shell || {};

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<OidcFormValues>({
//     resolver: zodResolver(oidcSchema),
//     defaultValues: {
//       issuerUrl: '',
//       clientId: '',
//     },
//   });

//   const { addError, addSuccess } = useNotifications();

//   const {
//     data: oidcProvider,
//     isPending: isPendingOidcProvider,
//   } = useOidcProvider(projectId, kubeId);

//   useEffect(() => {
//     if (oidcProvider) {
//       setValue('issuerUrl', oidcProvider.issuerUrl);
//       setValue('clientId', oidcProvider.clientId);
//     }
//   }, [oidcProvider, setValue]);

//   const {
//     addOidcProvider,
//     isPending: isPendingAddOidcProvider,
//   } = useAddOidcProvider({
//     projectId,
//     kubeId,
//     onError(error: ApiError) {
//       addError(
//         <Translation ns="add-oidc-provider">
//           {(_t) =>
//             _t(
//               'pci_projects_project_kubernetes_details_service_add_oidc_provider_request_error',
//               {
//                 message:
//                   error?.response?.data?.message || error?.message || null,
//               },
//             )
//           }
//         </Translation>,
//         true,
//       );
//       onClose();
//     },
//     onSuccess() {
//       addSuccess(
//         <Translation ns="add-oidc-provider">
//           {(_t) =>
//             _t(
//               'pci_projects_project_kubernetes_details_service_add_oidc_provider_request_success',
//             )
//           }
//         </Translation>,
//         true,
//       );
//       onClose();
//     },
//   });

//   const {
//     updateOidcProvider,
//     isPending: isPendingUpdateOidcProvider,
//   } = useUpdateOidcProvider({
//     projectId,
//     kubeId,
//     onError(error: ApiError) {
//       addError(
//         <Translation ns="update-oidc-provider">
//           {(_t) =>
//             _t(
//               'pci_projects_project_kubernetes_details_service_update_oidc_provider_request_error',
//               {
//                 message:
//                   error?.response?.data?.message || error?.message || null,
//               },
//             )
//           }
//         </Translation>,
//         true,
//       );
//       onClose();
//     },
//     onSuccess() {
//       addSuccess(
//         <Translation ns="update-oidc-provider">
//           {(_t) =>
//             _t(
//               'pci_projects_project_kubernetes_details_service_update_oidc_provider_request_success',
//             )
//           }
//         </Translation>,
//         true,
//       );
//       onClose();
//     },
//   });

//   const isPending =
//     isPendingOidcProvider ||
//     isPendingAddOidcProvider ||
//     isPendingUpdateOidcProvider;
//   const isUpdate = !!oidcProvider;

//   const onSubmit = (data: OidcFormValues) => {
//     if (isUpdate) {
//       updateOidcProvider({ params: data });
//     } else {
//       addOidcProvider({ params: data });
//     }
//   };

//   return (
//     <OsdsModal
//       onOdsModalClose={onClose}
//       headline={t(
//         `pci_projects_project_kubernetes_details_service_${
//           isUpdate ? 'update' : 'add'
//         }_oidc_provider_title`,
//       )}
//     >
//       <slot name="content">
//         {isPending ? (
//           <div className="mt-6">
//             <OsdsSpinner
//               inline
//               size={ODS_SPINNER_SIZE.md}
//               className="block text-center"
//               data-testid={`${isUpdate ? 'update' : 'add'}OIDCProvider-spinner`}
//             />
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
//             <OsdsFormField
//               class="mt-6"
//               data-testid="issuerUrl-formfield"
//               error={errors.issuerUrl?.message || ''}
//             >
//               <OsdsText
//                 size={ODS_TEXT_SIZE._200}
//                 level={ODS_TEXT_LEVEL.body}
//                 color={ODS_THEME_COLOR_INTENT.text}
//                 slot="label"
//               >
//                 {t(
//                   `pci_projects_project_kubernetes_details_service_${
//                     isUpdate ? 'update' : 'add'
//                   }_oidc_provider_field_url`,
//                 )}
//               </OsdsText>

//               <OsdsInput
//                 type={ODS_INPUT_TYPE.text}
//                 {...register('issuerUrl')}
//                 className={`mt-3 ${errors.issuerUrl ? 'bg-red-100' : ''}`}
//                 data-testid="issuerUrl-input"
//                 onOdsInputBlur={() => {

//                   setValue('issuerUrl', oidcProvider.issuerUrl);

//                   setFormState({
//                     ...formState,
//                     issuerUrlTouched: true,
//                   });
//                 }}
//                 value={formState.issuerUrl}
//                 onOdsValueChange={(event) => {
//                   setValue('issuerUrl', event.target.value.toString());
//                   setFormState({
//                     ...formState,
//                     issuerUrl: event.target.value.toString(),
//                   });
//                 }}
//               />

//             </OsdsFormField>

//             <OsdsFormField
//               class="mt-10"
//               data-testid="clientId-formfield"
//               error={errors.clientId?.message || ''}
//             >
//               <OsdsText
//                 size={ODS_TEXT_SIZE._200}
//                 level={ODS_TEXT_LEVEL.body}
//                 color={ODS_THEME_COLOR_INTENT.text}
//                 slot="label"
//               >
//                 {t(
//                   `pci_projects_project_kubernetes_details_service_${
//                     isUpdate ? 'update' : 'add'
//                   }_oidc_provider_field_client_id`,
//                 )}
//               </OsdsText>
//               <OsdsInput
//                 type={ODS_INPUT_TYPE.text}
//                 {...register('clientId')}
//                 className={`mt-3 ${errors.clientId ? 'bg-red-100' : ''}`}
//                 data-testid="clientId-input"
//               />
//             </OsdsFormField>

//             <div className="mt-6 flex justify-end gap-4">
//               <OsdsButton
//                 color={ODS_THEME_COLOR_INTENT.primary}
//                 variant={ODS_BUTTON_VARIANT.ghost}
//                 onClick={onClose}
//                 data-testid={`${
//                   isUpdate ? 'update' : 'add'
//                 }OIDCProvider-button_cancel`}
//               >
//                 {t(
//                   `pci_projects_project_kubernetes_details_service_${
//                     isUpdate ? 'update' : 'add'
//                   }_oidc_provider_action_cancel`,
//                 )}
//               </OsdsButton>
//               <OsdsButton
//                 color={ODS_THEME_COLOR_INTENT.primary}
//                 disabled={isPending}
//                 type="submit"
//                 data-testid={`${
//                   isUpdate ? 'update' : 'add'
//                 }OIDCProvider-button_submit`}
//               >
//                 {t(
//                   `pci_projects_project_kubernetes_details_service_${
//                     isUpdate ? 'update' : 'add'
//                   }_oidc_provider_action_${isUpdate ? 'update' : 'add'}`,
//                 )}
//               </OsdsButton>
//             </div>
//           </form>
//         )}
//       </slot>
//     </OsdsModal>
//   );
// }
