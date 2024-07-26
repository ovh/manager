import { ComponentEnum } from '@/types/cloud/project/database/service/endpoint/ComponentEnum';

/** Defines the endpoint object in a cluster */
export interface Endpoint {
  /** Type of component the URI relates to */
  component?: ComponentEnum;
  /** Domain of the cluster */
  domain?: string;
  /** Path of the endpoint */
  path?: string;
  /** Connection port for the endpoint */
  port?: number;
  /** Scheme used to generate the URI */
  scheme?: string;
  /** Defines whether the endpoint uses SSL */
  ssl?: boolean;
  /** SSL mode used to connect to the service if the SSL is enabled */
  sslMode?: string;
  /** URI of the endpoint */
  uri?: string;
}
