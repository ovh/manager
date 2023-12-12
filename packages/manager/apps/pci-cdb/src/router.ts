// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/projects/:projectId`
  | `/projects/:projectId/:serviceType`
  | `/projects/:projectId/:serviceType/services`
  | `/projects/:projectId/:serviceType/services/:serviceId`
  | `/projects/:projectId/:serviceType/services/:serviceId/general`
  | `/projects/:projectId/:serviceType/services/:serviceId/users`
  | `/projects/:projectId/:serviceType/services/:serviceId/users/add`
  | `/projects/:projectId/:serviceType/services/create`

export type Params = {
  '/projects/:projectId': { projectId: string }
  '/projects/:projectId/:serviceType': { projectId: string; serviceType: string }
  '/projects/:projectId/:serviceType/services': { projectId: string; serviceType: string }
  '/projects/:projectId/:serviceType/services/:serviceId': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/general': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/users': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/:serviceId/users/add': { projectId: string; serviceType: string; serviceId: string }
  '/projects/:projectId/:serviceType/services/create': { projectId: string; serviceType: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
