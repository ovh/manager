/**
 * Application entities - Transformed data structures used in the application
 * These types represent the normalized, application-ready data after transformation from DTOs.
 */

/**
 * NashaService entity - transformed from NashaServiceDto
 */
export interface NashaService {
  serviceName: string;
  canCreatePartition: boolean;
  customName?: string;
  datacenter: string;
  diskType: string;
  monitored: boolean;
  zpoolCapacity: string;
  zpoolSize: string;
}

/**
 * NashaListingItem - simplified view for listing pages
 */
export interface NashaListingItem {
  serviceName: string;
  canCreatePartition: boolean;
  customName?: string;
  datacenter: string;
  diskType: string;
}
