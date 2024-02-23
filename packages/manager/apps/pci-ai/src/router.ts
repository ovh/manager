// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/projects/:projectId`
  | `/projects/:projectId/ai-dashboard`
  | `/projects/:projectId/ai-dashboard/cli`
  | `/projects/:projectId/ai-dashboard/home`
  | `/projects/:projectId/ai-dashboard/registries`
  | `/projects/:projectId/ai-dashboard/users-tokens`
  | `/projects/:projectId/apps`
  | `/projects/:projectId/apps/:appId`
  | `/projects/:projectId/apps/:appId/attached-data`
  | `/projects/:projectId/apps/:appId/general-information`
  | `/projects/:projectId/jobs`
  | `/projects/:projectId/jobs/:jobId`
  | `/projects/:projectId/jobs/:jobId/attached-data`
  | `/projects/:projectId/jobs/:jobId/general-information`
  | `/projects/:projectId/jobs/:jobId/logs`
  | `/projects/:projectId/notebooks`
  | `/projects/:projectId/notebooks/:notebookId`
  | `/projects/:projectId/notebooks/:notebookId/attached-data`
  | `/projects/:projectId/notebooks/:notebookId/general-information`
  | `/projects/:projectId/notebooks/new`

export type Params = {
  '/projects/:projectId': { projectId: string }
  '/projects/:projectId/ai-dashboard': { projectId: string }
  '/projects/:projectId/ai-dashboard/cli': { projectId: string }
  '/projects/:projectId/ai-dashboard/home': { projectId: string }
  '/projects/:projectId/ai-dashboard/registries': { projectId: string }
  '/projects/:projectId/ai-dashboard/users-tokens': { projectId: string }
  '/projects/:projectId/apps': { projectId: string }
  '/projects/:projectId/apps/:appId': { projectId: string; appId: string }
  '/projects/:projectId/apps/:appId/attached-data': { projectId: string; appId: string }
  '/projects/:projectId/apps/:appId/general-information': { projectId: string; appId: string }
  '/projects/:projectId/jobs': { projectId: string }
  '/projects/:projectId/jobs/:jobId': { projectId: string; jobId: string }
  '/projects/:projectId/jobs/:jobId/attached-data': { projectId: string; jobId: string }
  '/projects/:projectId/jobs/:jobId/general-information': { projectId: string; jobId: string }
  '/projects/:projectId/jobs/:jobId/logs': { projectId: string; jobId: string }
  '/projects/:projectId/notebooks': { projectId: string }
  '/projects/:projectId/notebooks/:notebookId': { projectId: string; notebookId: string }
  '/projects/:projectId/notebooks/:notebookId/attached-data': { projectId: string; notebookId: string }
  '/projects/:projectId/notebooks/:notebookId/general-information': { projectId: string; notebookId: string }
  '/projects/:projectId/notebooks/new': { projectId: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
