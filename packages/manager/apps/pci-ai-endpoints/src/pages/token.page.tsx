import { Outlet, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsSearchBar,
  OsdsText,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import CreateModal from '@/components/Token/CreateModal';
import UpdateModal from '@/components/Token/UpdateModal';
import DeleteModal from '@/components/Token/DeleteModal';
import useUserPolicy from '@/hooks/api/database/token/user.hook';
import { useDatagridColumns } from '@/hooks/token/useDatagridColumns';
import {
  useGetTokens,
  useTokenMutations,
} from '@/hooks/api/database/token/useToken.hook';
import { useGetProject } from '@/hooks/api/database/project/useGetProject.hook';
import useUserInfos from '@/hooks/token/useUserInfos';
import { TokenData } from '@/types/cloud/project/database/token';

type ModalState = {
  isOpen: boolean;
  mode: 'create' | 'update' | 'delete';
  selectedToken: TokenData | null;
};

const INFINITE_DATE = new Date('2105-12-31T23:59:59.999Z');

const formatDateForSearch = (date: Date, t: (key: string) => string) => {
  if (date.getTime() === INFINITE_DATE.getTime()) {
    return t('ai_endpoints_token_expiration');
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default function TokenPage() {
  const { t } = useTranslation('token');
  const { projectId } = useParams<{ projectId: string }>();
  const { pagination, setPagination } = useDataGrid();

  const [createdToken, setCreatedToken] = useState<TokenData | null>(null);

  const { data: isAuthorized, isLoading: isAuthLoading } = useUserInfos(
    projectId,
  );
  const {
    createToken,
    updateToken,
    deleteToken,
    isRestricted,
    isCreateSuccess,
  } = useTokenMutations({
    projectId,
    onSuccess: (tok) => setCreatedToken(tok),
  });
  const { data: projectData } = useGetProject(projectId);
  useUserPolicy(projectId);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    selectedToken: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tokensData, isLoading } = useGetTokens({ projectId });

  const openModal = (mode: ModalState['mode'], token?: TokenData) => {
    setModalState({ isOpen: true, mode, selectedToken: token || null });
  };
  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create', selectedToken: null });
    setCreatedToken(null);
  };

  const handleUpdateToken = (token: TokenData) =>
    token.name && openModal('update', token);
  const handleDeleteToken = (token: TokenData) =>
    token.name && openModal('delete', token);

  const { columns, tokenItems } = useDatagridColumns({
    projectId,
    noLimitation: INFINITE_DATE,
    onUpdate: handleUpdateToken,
    onDelete: handleDeleteToken,
  });

  const filteredAndSortedTokens = useMemo(() => {
    let list = tokenItems;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((tk) => {
        const nameMatch = tk.name?.toLowerCase().includes(q);
        let expMatch = false;
        if (tk.expiresAt) {
          expMatch = formatDateForSearch(new Date(tk.expiresAt), t)
            .toLowerCase()
            .includes(q);
        }
        return nameMatch || expMatch;
      });
    }
    return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [searchQuery, tokenItems, t]);

  const startIndex = pagination.pageIndex * pagination.pageSize;
  const paginatedTokens = filteredAndSortedTokens.slice(
    startIndex,
    startIndex + pagination.pageSize,
  );

  return (
    <>
      {!isAuthLoading && (
        <>
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="flex mb-4"
          >
            {t('ai_endpoints_token_management')}
          </OsdsText>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="flex mb-12 max-w-[30rem]"
            size={ODS_TEXT_SIZE._400}
          >
            {t('ai_endpoints_token_intro')}
          </OsdsText>
          {projectData?.planCode === 'project.discovery' && (
            <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="mb-4">
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('ai_endpoints_token_discovery_mod')}
              </OsdsText>
            </OsdsMessage>
          )}
          {!isAuthorized && (
            <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="max-w-fit">
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('ai_endpoints_non_admin_user')}
              </OsdsText>
            </OsdsMessage>
          )}
          {isRestricted && (
            <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="max-w-fit">
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('ai_endpoints_non_admin_user')}
              </OsdsText>
            </OsdsMessage>
          )}
          <div className="sm:flex items-center justify-between mt-16">
            <div className="flex flex-row items-center justify-between w-full">
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.flat}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="mr-4"
                onClick={() => isAuthorized && openModal('create')}
                disabled={!isAuthorized || isRestricted || undefined}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.PLUS}
                  size={ODS_ICON_SIZE.xs}
                  className="mr-2 bg-white"
                />
                {t('ai_endpoints_token_creation')}
              </OsdsButton>
              <OsdsSearchBar
                className="w-[20rem]"
                value={searchQuery}
                placeholder={t('ai_endpoints_token_search')}
                onOdsSearchSubmit={({ detail }) => {
                  setSearchQuery(detail.inputValue);
                  setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize,
                  });
                }}
                onOdsValueChange={({ detail }) => {
                  if (detail.value === '') {
                    setSearchQuery('');
                    setPagination({
                      pageIndex: 0,
                      pageSize: pagination.pageSize,
                    });
                  }
                }}
              />
            </div>
          </div>

          {modalState.isOpen && modalState.mode === 'create' && (
            <CreateModal
              onClose={closeModal}
              projectId={projectId}
              tokens={Array.isArray(tokensData) ? tokensData : []}
              infiniteDate={INFINITE_DATE}
              createToken={createToken}
              isRestricted={isRestricted}
              isSuccess={isCreateSuccess}
              createdToken={createdToken}
            />
          )}
          {modalState.isOpen &&
            modalState.mode === 'update' &&
            modalState.selectedToken && (
              <UpdateModal
                onClose={closeModal}
                infiniteDate={INFINITE_DATE}
                initialValues={{
                  tokenName: modalState.selectedToken.name || '',
                  description: modalState.selectedToken.description || '',
                  expirationDate: modalState.selectedToken.expiresAt
                    ? new Date(modalState.selectedToken.expiresAt)
                    : undefined,
                }}
                onSubmit={(payload) =>
                  updateToken({
                    projectId,
                    name: modalState.selectedToken.name,
                    description: payload.description,
                    expiresAt: payload.expirationDate
                      ? payload.expirationDate.toISOString()
                      : undefined,
                  })
                }
              />
            )}
          {modalState.isOpen &&
            modalState.mode === 'delete' &&
            modalState.selectedToken && (
              <DeleteModal
                onClose={closeModal}
                tokenName={modalState.selectedToken.name || ''}
                onSubmit={() =>
                  deleteToken({
                    projectId,
                    name: modalState.selectedToken.name,
                  })
                }
              />
            )}

          <Outlet />

          {!isLoading && tokenItems && (
            <div className="mt-12">
              <Datagrid
                columns={columns}
                items={paginatedTokens}
                totalItems={filteredAndSortedTokens.length}
                pagination={pagination}
                onPaginationChange={setPagination}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
