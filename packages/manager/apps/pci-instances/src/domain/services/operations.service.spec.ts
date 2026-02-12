/* eslint-disable max-lines-per-function */
import { describe, it, expect } from 'vitest';
import {
  isOperationInProgress,
  isOperationInError,
  isInstanceCreationOperationPendingOrInError,
} from './operations.service';
import { TOperation } from '../entities/operations';

describe('operations.service', () => {
  describe('isOperationInProgress', () => {
    it('should return true for operation with pending status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [],
      };

      expect(isOperationInProgress(operation)).toBe(true);
    });

    it('should return true for operation with created status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'created',
        subOperations: [],
      };

      expect(isOperationInProgress(operation)).toBe(true);
    });

    it('should return false for operation with canceled status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'canceled',
        subOperations: [],
      };

      expect(isOperationInProgress(operation)).toBe(false);
    });

    it('should return false for operation with unknown status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'unknown',
        subOperations: [],
      };

      expect(isOperationInProgress(operation)).toBe(false);
    });

    it('should return false for operation with completed status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'completed',
        subOperations: [],
      };

      expect(isOperationInProgress(operation)).toBe(false);
    });

    it('should return false for operation with error status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'error',
        subOperations: [],
      };

      expect(isOperationInProgress(operation)).toBe(false);
    });

    it('should return false for undefined operation', () => {
      expect(isOperationInProgress(undefined)).toBe(false);
    });
  });

  describe('isOperationInError', () => {
    it('should return true for operation with error status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'error',
        subOperations: [],
      };

      expect(isOperationInError(operation)).toBe(true);
    });

    it('should return false for operation with pending status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [],
      };

      expect(isOperationInError(operation)).toBe(false);
    });

    it('should return false for operation with completed status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'completed',
        subOperations: [],
      };

      expect(isOperationInError(operation)).toBe(false);
    });

    it('should return false for operation with created status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'created',
        subOperations: [],
      };

      expect(isOperationInError(operation)).toBe(false);
    });

    it('should return false for undefined operation', () => {
      expect(isOperationInError(undefined)).toBe(false);
    });
  });

  describe('isInstanceCreationOperationPendingOrInError', () => {
    it('should return true for instance creation with pending status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(true);
    });

    it('should return true for instance creation with created status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'created',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(true);
    });

    it('should return true for instance creation with error status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'error',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(true);
    });

    it('should return false for instance creation with completed status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'completed',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(
        false,
      );
    });

    it('should return false for instance creation with canceled status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#create',
        status: 'canceled',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(
        false,
      );
    });

    it('should return false for other action with pending status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#delete',
        status: 'pending',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(
        false,
      );
    });

    it('should return false for other action with created status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#delete',
        status: 'created',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(
        false,
      );
    });

    it('should return false for other action with error status', () => {
      const operation: TOperation = {
        id: '1',
        action: 'instance#delete',
        status: 'error',
        subOperations: [],
      };

      expect(isInstanceCreationOperationPendingOrInError(operation)).toBe(
        false,
      );
    });

    it('should return false for undefined operation', () => {
      expect(isInstanceCreationOperationPendingOrInError(undefined)).toBe(
        false,
      );
    });
  });
});
