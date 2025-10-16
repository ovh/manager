import { describe, it, expect } from 'vitest';
import { Node } from './navigation-tree/node';
import { isMatchingNode } from './utils';

describe('isMatchingNode test suite', () => {
  describe('when node has no routing', () => {
    it('should return null', () => {
      const node: Node = {
        id: 'test-node',
        // no routing property
      };

      const result = isMatchingNode(node, '/some/path');

      expect(result).toBeNull();
    });
  });

  describe('when node has pathMatcher', () => {
    it.each([
      {
        description: 'pathMatcher matches',
        path: '/dashboard/user/123',
        expectedValue: 'node',
        expectedSegments: 3,
      },
      {
        description: 'pathMatcher does not match',
        path: '/profile/user/123',
        expectedValue: null,
        expectedSegments: 3,
      },
    ])('should handle when $description', ({ path, expectedValue, expectedSegments }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
          hash: '#/dashboard/users',
          pathMatcher: /^\/dashboard\/.*$/,
        },
      };

      const result = isMatchingNode(node, path);

      expect(result).toEqual({
        value: expectedValue === 'node' ? node : null,
        segments: expectedSegments,
      });
    });
  });

  describe('when node has hash routing', () => {
    it.each([
      {
        description: 'exact path segments',
        hash: '#/dashboard/users',
        path: '/myapp/dashboard/users',
        expectedValue: 'node',
        expectedSegments: 3,
      },
      {
        description: 'with parameters',
        hash: '#/dashboard/users/{id}',
        path: '/myapp/dashboard/users/123',
        expectedValue: 'node',
        expectedSegments: 4,
      },
      {
        description: 'segments do not align',
        hash: '#/dashboard/users',
        path: '/myapp/dashboard',
        expectedValue: null,
        expectedSegments: null,
      },
      {
        description: 'node segments longer than path segments',
        hash: '#/dashboard/users/profile',
        path: '/myapp/dashboard',
        expectedValue: null,
        expectedSegments: null,
      },
    ])('should handle $description', ({ hash, path, expectedValue, expectedSegments }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
          hash,
        },
      };

      const result = isMatchingNode(node, path);

      if (expectedValue === null) {
        expect(result).toBeNull();
      } else {
        expect(result).toEqual({
          value: expectedValue === 'node' ? node : null,
          segments: expectedSegments,
        });
      }
    });
  });

  describe('when node has application routing only', () => {
    it.each([
      {
        description: 'exact application path',
        path: '/myapp',
        expectedValue: 'node',
        expectedSegments: 1,
      },
      {
        description: 'additional path segments',
        path: '/myapp/dashboard/users',
        expectedValue: 'node',
        expectedSegments: 1,
      },
      {
        description: 'different application',
        path: '/otherapp',
        expectedValue: null,
        expectedSegments: 1,
      },
    ])('should handle $description', ({ path, expectedValue, expectedSegments }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
        },
      };

      const result = isMatchingNode(node, path);

      expect(result).toEqual({
        value: expectedValue === 'node' ? node : null,
        segments: expectedSegments,
      });
    });
  });

  describe('parameter matching', () => {
    it.each([
      {
        description: 'parameter in the middle',
        hash: '#/users/{id}/profile',
        path: '/myapp/users/123/profile',
        expectedSegments: 4,
      },
      {
        description: 'parameter at the end',
        hash: '#/users/{id}',
        path: '/myapp/users/123',
        expectedSegments: 3,
      },
      {
        description: 'parameter at the beginning',
        hash: '#/{id}/users',
        path: '/myapp/123/users',
        expectedSegments: 3,
      },
      {
        description: 'multiple parameters',
        hash: '#/users/{userId}/posts/{postId}',
        path: '/myapp/users/123/posts/456',
        expectedSegments: 5,
      },
    ])('should match when $description', ({ hash, path, expectedSegments }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
          hash,
        },
      };

      const result = isMatchingNode(node, path);

      expect(result).toEqual({
        value: node,
        segments: expectedSegments,
      });
    });
  });

  describe('edge cases', () => {
    it.each([
      {
        description: 'empty path segment',
        path: '',
      },
      {
        description: 'root path',
        path: '/',
      },
    ])('should handle $description', ({ path }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
        },
      };

      const result = isMatchingNode(node, path);

      expect(result).toBeNull();
    });

    it.each([
      {
        description: 'path with trailing slash',
        hash: '#/dashboard',
        path: '/myapp/dashboard/',
        expectedSegments: 2,
      },
      {
        description: 'complex parameter patterns',
        hash: '#/api/v1/{resource}/{id}/action',
        path: '/myapp/api/v1/users/123/action',
        expectedSegments: 6,
      },
      {
        description: 'segments with different lengths',
        hash: '#/dashboard/users',
        path: '/myapp/dashboard/users/profile/settings',
        expectedSegments: 3,
      },
    ])('should handle $description', ({ hash, path, expectedSegments }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
          hash,
        },
      };

      const result = isMatchingNode(node, path);

      expect(result).toEqual({
        value: node,
        segments: expectedSegments,
      });
    });
  });

  describe('pathMatcher priority', () => {
    it.each([
      {
        description: 'prioritize pathMatcher over hash routing',
        path: '/api/users',
        expectedSegments: 2,
      },
      {
        description: 'fall back to hash routing when pathMatcher does not match',
        path: '/myapp/dashboard/users',
        expectedSegments: 3,
      },
    ])('should $description', ({ path,  expectedSegments }) => {
      const node: Node = {
        id: 'test-node',
        routing: {
          application: 'myapp',
          hash: '#/dashboard/users',
          pathMatcher: /^\/api\/.*$/,
        },
      };

      const result = isMatchingNode(node, path);

      expect(result).toEqual({
        value: node,
        segments: expectedSegments,
      });
    });
  });
});
