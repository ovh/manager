import { urls } from '@/routes/routes.constant';
import { PageType, ButtonType } from '@ovh-ux/manager-react-shell-client';
// exampleRoutes.ts
export const routes = [
  {
    path: urls.listing,
    tracking: [
      {
        id: 'listing-display',
        type: 'page.display',
        description: 'Affichage de la page d’accueil',
        pageName: 'listing',
        pageType: 'listing',
      },
      {
        id: 'listing-open-modal',
        type: 'page.click',
        description: 'click open button for delete modal',
        buttonType: 'button',
        actionType: 'action',
        actions: ['modal-open'],
      },
    ],
    children: [
      {
        path: urls.deleteVeeam,
        tracking: [
          {
            id: 'listing-modal-delete-display',
            type: 'page.display',
            description: 'Affichage de la modal delete veeam',
            pageName: 'delete_veeam-backup',
            pageType: 'pop-up',
          },
          {
            id: 'listing-modal-delete-confirm-click',
            type: 'page.click',
            description: 'click confirm button in delete modal',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal-confirm'],
          },
          {
            id: 'listing-modal-delete-cancel-click',
            type: 'page.click',
            description: 'click cancel button in delete modal',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal-cancel'],
          },
        ],
      },
    ],
  },
  {
    path: urls.dashboard,
    tracking: [
      {
        id: 'dashboard-display',
        type: 'page.display',
        description: 'Affichage de la modal delete veeam',
        pageName: 'delete_veeam-backup',
        pageType: 'pop-up',
      },
      {
        id: 'dashboard-modal-open-edit-click',
        type: 'page.click',
        description: 'click open button edit modal',
        buttonType: 'button',
        actionType: 'action',
        actions: ['modal-open'],
      },
      {
        id: 'dashboard-modal-open-delete-click',
        type: 'page.click',
        description: 'click open button delete modal',
        buttonType: 'button',
        actionType: 'action',
        actions: ['modal-open'],
      },
    ],
    children: [
      {
        path: urls.deleteVeeamFromDashboard,
        tracking: [
          {
            id: 'dashboard-modal-delete-veem-display',
            type: 'page.display',
            description: 'Affichage de la modal delete veeam',
            pageName: 'delete_veeam-backup',
            pageType: 'pop-up',
          },
          {
            id: 'dashboard-modal-delete-confirm-click',
            type: 'page.click',
            description: 'click confirm button in delete modal',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal-confirm'],
          },
          {
            id: 'dashboard-modal-delete-cancel-click',
            type: 'page.click',
            description: 'click cancel button in delete modal',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal-cancel'],
          },
        ],
      },
      {
        path: urls.editVeeamDisplayNameFromDashboard,
        tracking: [
          {
            id: 'dashboard-modal-edit-veem-display',
            type: 'page.display',
            description: 'Affichage de la modal edit veeam',
            pageName: 'edit_veeam-backup',
            pageType: 'pop-up',
          },
          {
            id: 'dashboard-modal-edit-confirm-click',
            type: 'page.click',
            description: 'click confirm button in edit modal',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal-confirm'],
          },
          {
            id: 'dashboard-modal-edit-cancel-click',
            type: 'page.click',
            description: 'click cancel button in edit modal',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal-cancel'],
          },
        ],
      },
    ],
  },
  {
    path: urls.onboarding,
    tracking: [
      {
        id: 'onboarding-display',
        type: 'page.display',
        description: 'Affichage de la page onboarding',
        pageName: 'onboarding',
        pageType: 'onboarding',
      },
      {
        id: 'onboarding-external-link-click',
        type: 'page.click',
        description: 'click on external link',
        buttonType: 'link',
        actionType: 'navigation',
        actions: ['go-to-external'],
      },
    ],
  },
  {
    path: urls.orderVeeam,
    tracking: [
      {
        id: 'order-display',
        type: 'page.display',
        description: 'Affichage de la page order',
        pageName: 'order-veeam',
        pageType: 'funnel',
      },
      {
        id: 'order-goback-click',
        type: 'page.click',
        description: 'click on navigate back',
        buttonType: 'link',
        actionType: 'navigation',
        actions: ['go-back'],
      },
      {
        id: 'order-confirm-click',
        type: 'page.click',
        description: 'click confirm order form',
        buttonType: 'button',
        actionType: 'action',
        actions: ['confirm-form'],
      },
    ],
  },
];
