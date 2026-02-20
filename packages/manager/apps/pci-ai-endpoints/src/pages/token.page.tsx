import { Outlet, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  Icon,
  Input,
  INPUT_TYPE,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import {
  Datagrid,
  useDataGrid,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TRACKING } from '@/configuration/tracking.constants';
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
import useUserInfos from '@/hooks/token/useUserInfos';

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
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('token');
  const { projectId } = useParams();
  const { pagination, setPagination } = useDataGrid();
  const { isAdmin } = useUserInfos();

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
    if (mode === 'create') {
      trackClick(TRACKING.apikey.createNewApikeyClick);
    }
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
  const applySearch = (value: string) => {
    setSearchQuery(value);
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <>
      {availability && (
        <>
          <Text
            preset={TEXT_PRESET.heading3}
            className="flex mb-4 text-[var(--ods-theme-primary-color)]"
          >
            {t('ai_endpoints_token_management')}
          </Text>
          <Text
            preset={TEXT_PRESET.paragraph}
            className="flex mb-12 max-w-[30rem]"
          >
            {t('ai_endpoints_token_intro')}
          </Text>
          {projectData?.planCode === 'project.discovery' && (
            <Message color={MESSAGE_COLOR.information} className="mb-4">
              <MessageIcon name="circle-info" className="text-sm" />
              <MessageBody>
                <Text preset={TEXT_PRESET.paragraph} className="">
                  {t('ai_endpoints_token_discovery_mod')}
                </Text>
              </MessageBody>
            </Message>
          )}
          {!isAdmin && (
            <Message
              color={MESSAGE_COLOR.information}
              className=" p-4 max-w-fit"
            >
              <MessageIcon name="circle-info" className="" />
              <MessageBody>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('ai_endpoints_non_admin_user')}
                </Text>
              </MessageBody>
            </Message>
          )}
          <div className="sm:flex items-center justify-between mt-16">
            <div className="flex flex-row items-center justify-between w-full">
              <Button
                className="xs:mb-0.5 sm:mb-0 mr-4 --ods-button-background-color-primary"
                onClick={() => openModal('create')}
                disabled={!isAdmin || undefined}
              >
                <Icon name="plus" className="mr-1 " />
                {t('ai_endpoints_token_creation')}
              </Button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applySearch(searchQuery);
                }}
              >
                <Input
                  className="border-blue-500"
                  type={INPUT_TYPE.search}
                  clearable
                  value={searchQuery}
                  placeholder={t('ai_endpoints_token_search')}
                  onChange={(event) => {
                    const { value } = event.target as HTMLInputElement;
                    if (value === '') {
                      applySearch('');
                      return;
                    }
                    setSearchQuery(value);
                  }}
                />
              </form>
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
