/**
 * API DTOs (Data Transfer Objects) - Raw data structures from the API
 * These types represent the exact structure returned by the API endpoints.
 */

/**
 * NashaService DTO as returned by the API
 */
export type NashaServiceDto = {
  serviceName: string;
  canCreatePartition: boolean;
  customName?: string;
  datacenter: string;
  diskType: string;
  monitored: boolean;
  zpoolCapacity: string;
  zpoolSize: string;
  [key: string]: unknown; // Allow additional fields from API
};

