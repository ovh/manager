import { Node } from './navigation-tree/node';

/**
 * Initialize an array of feature names required to call feature availability
 */
export const initFeatureNames = (node: Node) => {
  let foundFeatures: string[] = [];

  if (node.children) {
    node.children.forEach((child) => {
      foundFeatures = [...foundFeatures, ...initFeatureNames(child)];
    });
  }

  if (node?.features?.length > 0) {
    foundFeatures = [...foundFeatures, ...node.features];
  }

  return [...new Set(foundFeatures)];
};

/**
 * Initialize the tree by adding a parent attribute in each node
 */
export function initTree(
  nodes: Node[],
  features: Record<string, boolean> = {},
  region: string,
  parentNode?: Node,
) {
  return nodes.reduce((all, node) => {
    if (
      node?.features?.length &&
      !node?.features?.some((feature: string) => features[feature])
    ) {
      return all;
    }

    if (
      node?.hideIfFeatures?.length &&
      node?.hideIfFeatures?.some((feature: string) => features[feature])
    ) {
      return all;
    }
    
    if (node?.region && !node.region.includes(region)) {
      return all;
    }
    const selfNode = {
      ...node,
      parent: parentNode,
    };

    selfNode.children = node.children
      ? initTree(node.children, features, region, selfNode)
      : null;
    return [...all, selfNode];
  }, []);
}

export type ServicesTypes = Record<string, number>;

/**
 * Given the servicesCount data, a navigation node and a list of node ids to exclude
 * traverse the navigation tree and return true if the customer has a service for this navigation node
 */
export function hasService(
  serviceTypes: ServicesTypes,
  navigationNode: Node,
  excludeIds: string[] = [],
): boolean {
  if (excludeIds.includes(navigationNode.id)) {
    return false;
  }
  if (navigationNode.hasService) {
    return true;
  }

  // exclude public cloud from services count since we are counting projects
  if (navigationNode.id === 'services') {
    excludeIds.push('pci');
  }
  if (navigationNode.id === 'pci') {
    return !!serviceTypes.CLOUD_PROJECT;
  }
  if (!serviceTypes) return false;
  if (navigationNode.serviceType) {
    const types = [].concat(navigationNode.serviceType);
    return types.some((type) => serviceTypes[type] > 0);
  }
  if (navigationNode.children && navigationNode.children.length) {
    return navigationNode.children.some((child) =>
      hasService(serviceTypes, child, excludeIds),
    );
  }
  return false;
}

/**
 * Given a navigation node id, find the node in the navigation tree,
 * starting from rootNode
 */
export function findNodeById(rootNode: Node, id: string): Node {
  let found = null;
  if (rootNode && rootNode.id === id) {
    return rootNode;
  }
  if (rootNode && rootNode.children) {
    for (let i = 0; i < rootNode.children.length; i += 1) {
      found = findNodeById(rootNode.children[i], id);
      if (found) {
        return found;
      }
    }
  }
  return found;
}

/**
 * Find path in the tree from rootNode to the node which comparatorFn(node) is truthy,
 * returns an array listing all the node making the path
 */
export function findPathToNode(
  rootNode: Node,
  comparatorFn: CallableFunction,
  appId?: string,
  appHash?: string,
): Node[] {
  const doCompare = (
    node: Node,
    searchAppId?: string,
    searchAppHash?: string,
  ) => {
    try {
      return comparatorFn(node, searchAppId, searchAppHash);
    } catch {
      return false;
    }
  };
  if (doCompare(rootNode, appId, appHash)) {
    return [rootNode];
  }
  if (rootNode && rootNode.children) {
    for (let i = 0; i < rootNode.children.length; i += 1) {
      const subPath = findPathToNode(
        rootNode.children[i],
        comparatorFn,
        appId,
        appHash,
      );
      if (subPath.length) {
        return [rootNode].concat(subPath);
      }
    }
  }
  return [];
}

export function findPathToNodeByApp(
  rootNode: Node,
  comparatorFn: CallableFunction,
  appId: string,
  appHash: string,
): Node[] {
  const path = findPathToNode(rootNode, comparatorFn, appId, appHash);
  if (!path.length && appHash.includes('/')) {
    return findPathToNodeByApp(
      rootNode,
      comparatorFn,
      appId,
      appHash.substring(0, appHash.lastIndexOf('/')),
    );
  }

  return path;
}

export const shouldHideElement = (node: Node, hasService: boolean) => {
  if (node.hideIfEmpty && !hasService) {
    return true;
  }

  if (node.forceVisibility) {
    return false;
  }

  if (node.hidden) {
    return true;
  }

  return false;
};

export const debounce = (
  func: () => void,
  [timer, setTimer]: [
    ReturnType<typeof setTimeout>,
    (timeoutId: ReturnType<typeof setTimeout>) => void,
  ],
  timeout = 300,
) => {
  return (...args: unknown[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        func.apply(this, args);
      }, timeout),
    );
  };
};

export const getLastElement = (root: Node) => {
  const getLast = (node: Node): Node => {
    if (!node.children || node.children.length === 0) {
      return node;
    }
    return getLast(node.children[node.children.length - 1]);
  };

  return root ? getLast(root) : null;
};
/* this function is used to parse a path with the pattern /some/thing/{id}/other/thing
and return it as an array of segments: ['some', 'thing', '{param}', 'other', 'thing'] */
export const splitPathIntoSegments = (path: string): string[] => {
  const segments = path.split('/').filter((segment) => segment.length > 0);

  return segments.map((segment) => {
    return segment.startsWith('{') && segment.endsWith('}')
      ? '{param}'
      : segment;
  });
};

/* this function is used to compare a node and a path */
export const isMatchingNode = (node: Node, pathSegment: string) => {
  if (!node.routing) return null;

  const pathSegments = splitPathIntoSegments(pathSegment)
  if (node.routing.pathMatcher?.test(pathSegment)) {
    return { value: node, segments: pathSegments.length };
  }

  const nodePath = node.routing.hash
    ? node.routing.hash.replace('#', node.routing.application)
    : `/${node.routing.application}`;
  const nodeSegments = splitPathIntoSegments(nodePath);

  return nodeSegments.length > pathSegments.length
    ? null
    : {
        value: nodeSegments.reduce((isMatching, segment, index) => {
          const returnValue =
            isMatching &&
            (segment === '{param}' || segment === pathSegments[index]);
          return returnValue;
        }, true)
          ? node
          : null,
        segments: nodeSegments.length,
      };
};

export const findNodeByRouting = (root: Node, locationPath: string) => {
  const exploreTree = (
    node: Node,
    pathSegment: string,
  ): { value: Node | null; segments: number } => {
    if (!node.children || node.children.length === 0)
      return isMatchingNode(node, pathSegment);
    const currentMatch = isMatchingNode(node, pathSegment);
    const childResults = node.children
      .map((child) => exploreTree(child, pathSegment))
      .filter((result) => result?.value)
      .sort((a, b) => b.segments - a.segments);
    return childResults.length > 0 ? childResults[0] : currentMatch;
  };

  const findNodeForSegments = (
    remainingSegments: number,
  ): { node: Node; universe: Node | undefined } | null => {
    if (remainingSegments <= 0) return null;
    const pathSegments = locationPath
      .split('/')
      .filter((segment) => segment.length > 0)
      .slice(0, remainingSegments)
      .join('/');
    const foundNode = exploreTree(root, pathSegments);
    return foundNode?.value
      ? {
          node: foundNode.value,
          universe: findNodeById(root, foundNode.value.universe),
        }
      : findNodeForSegments(remainingSegments - 1);
  };
  const segments = locationPath
    .split('/')
    .filter((segment) => segment.length > 0).length;
  return findNodeForSegments(segments);
};
