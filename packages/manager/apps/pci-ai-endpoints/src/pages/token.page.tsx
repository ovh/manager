import { Outlet, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsSearchBar,
  OsdsText,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  useDataGrid,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
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
  useUpdateToken,
  useDeleteToken,
} from '@/hooks/api/database/token/useToken.hook';
import { useGetProject } from '@/hooks/api/database/project/useGetProject.hook';
import { TokenData } from '@/types/cloud/project/database/token';

type ModalState = {
  isOpen: boolean;
  mode: 'create' | 'update' | 'delete';
  selectedToken: TokenData | null;
};

const INFINITE_DATE = new Date('2105-12-31T23:59:59.999Z');
const CREATE_TOKEN = 'pci-ai-endpoints:create-token';

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
  const { projectId } = useParams();
  const { pagination, setPagination } = useDataGrid();

  const { data: availability } = useFeatureAvailability([CREATE_TOKEN]);

  const { data: projectData } = useGetProject(projectId);

  useUserPolicy(projectId);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    selectedToken: null,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tokensData, isLoading } = useGetTokens({ projectId });

  const updateTokenMutation = useUpdateToken({
    projectId,
    onError: () => {},
    onSuccess: () => {},
  });

  const deleteTokenMutation = useDeleteToken({
    projectId,
    onError: () => {},
    onSuccess: () => {},
  });

  const openModal = (
    mode: 'create' | 'update' | 'delete',
    token?: TokenData,
  ) => {
    setModalState({
      isOpen: true,
      mode,
      selectedToken: token || null,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
      selectedToken: null,
    });
  };

  const handleUpdateToken = (token: TokenData) => {
    if (!token.name) return;
    openModal('update', token);
  };

  const handleDeleteToken = (token: TokenData) => {
    if (!token.name) return;
    openModal('delete', token);
  };

  const { columns, tokenItems } = useDatagridColumns({
    projectId,
    noLimitation: INFINITE_DATE,
    onUpdate: handleUpdateToken,
    onDelete: handleDeleteToken,
  });

  const filteredAndSortedTokens = useMemo(() => {
    let tokens = tokenItems;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      tokens = tokens.filter((token) => {
        const nameMatch = token.name?.toLowerCase().includes(query);
        let expirationMatch = false;
        if (token.expiresAt) {
          const tokenDate = new Date(token.expiresAt);
          const formattedDate = formatDateForSearch(tokenDate, t).toLowerCase();
          expirationMatch = formattedDate.includes(query);
        }
        return nameMatch || expirationMatch;
      });
    }
    return [...tokens].sort((a, b) =>
      (a.name || '').localeCompare(b.name || ''),
    );
  }, [searchQuery, tokenItems, t]);

  const startIndex = pagination.pageIndex * pagination.pageSize;
  const paginatedTokens = filteredAndSortedTokens.slice(
    startIndex,
    startIndex + pagination.pageSize,
  );

  return (
    <>
      {availability && (
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
            <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="mb-12">
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('ai_endpoints_token_discovery_mod')}
              </OsdsText>
            </OsdsMessage>
          )}
          <div className="sm:flex items-center justify-between mt-4">
            <div className="flex flex-row items-center justify-between w-full">
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.flat}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="xs:mb-0.5 sm:mb-0 mr-4"
                onClick={() => openModal('create')}
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
              infiniteDate={INFINITE_DATE}
              onClose={closeModal}
              projectId={projectId}
              tokens={Array.isArray(tokensData) ? tokensData : []}
            />
          )}

          {modalState.isOpen &&
            modalState.mode === 'update' &&
            modalState.selectedToken && (
              <UpdateModal
                infiniteDate={INFINITE_DATE}
                onClose={closeModal}
                initialValues={{
                  tokenName: modalState.selectedToken.name || '',
                  description: modalState.selectedToken.description || '',
                  expirationDate: modalState.selectedToken.expiresAt
                    ? new Date(modalState.selectedToken.expiresAt)
                    : undefined,
                }}
                onSubmit={(payload) => {
                  if (payload) {
                    updateTokenMutation.updateToken({
                      projectId,
                      name: modalState.selectedToken?.name,
                      description: payload.description,
                      expiresAt: payload.expirationDate
                        ? payload.expirationDate.toISOString()
                        : undefined,
                    });
                  }
                }}
              />
            )}

          {modalState.isOpen &&
            modalState.mode === 'delete' &&
            modalState.selectedToken && (
              <DeleteModal
                onClose={closeModal}
                tokenName={modalState.selectedToken.name || ''}
                onSubmit={() => {
                  deleteTokenMutation.deleteToken({
                    projectId,
                    name: modalState.selectedToken?.name,
                  });
                }}
              />
            )}

          <Outlet />

          {!isLoading && tokenItems && (
            <div className="mt-12">
              <Datagrid
                columns={columns}
                items={
                  filteredAndSortedTokens.length > 0 ? paginatedTokens : []
                }
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
