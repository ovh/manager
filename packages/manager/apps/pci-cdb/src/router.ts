// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/projects/:projectId`
  | `/projects/:projectId/:serviceType`
  | `/projects/:projectId/:serviceType/services`
  | `/projects/:projectId/:serviceType/services/:serviceId`
  | `/projects/:projectId/:serviceType/services/:serviceId/backups`
  | `/projects/:projectId/:serviceType/services/:serviceId/databases`
  | `/projects/:projectId/:serviceType/services/:serviceId/general`
  | `/projects/:projectId/:serviceType/services/:serviceId/integrations`
  | `/projects/:projectId/:serviceType/services/:serviceId/logs`
  | `/projects/:projectId/:serviceType/services/:serviceId/metrics`
  | `/projects/:projectId/:serviceType/services/:serviceId/namespaces`
  | `/projects/:projectId/:serviceType/services/:serviceId/pools`
  | `/projects/:projectId/:serviceType/services/:serviceId/queries`
  | `/projects/:projectId/:serviceType/services/:serviceId/serviceData/hook`
  | `/projects/:projectId/:serviceType/services/:serviceId/settings`
  | `/projects/:projectId/:serviceType/services/:serviceId/users`
  | `/projects/:projectId/:serviceType/services/create`

export type Params = {
  '/projects/:projectId': { projectId: string }
  '/projects/:projectId/:serviceType': { projectId: string; serviceType: string }
  '/projects/:projectId/:serviceType/services': { projectId: string; serviceType: string }
  '/projects/:projectId/:serviceType/services/:serviceId': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/backups': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/databases': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/general': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/integrations': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/logs': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/metrics': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/namespaces': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/pools': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/queries': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/serviceData/hook': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/settings': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/users': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/create': { projectId: string; serviceType: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
