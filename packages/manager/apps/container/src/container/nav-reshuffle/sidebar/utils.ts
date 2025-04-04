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
export function hasService(serviceTypes: ServicesTypes, navigationNode: Node, excludeIds: string[] = []): boolean {
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
    return types.some(
      (type) => serviceTypes[type] > 0,
    );
  }
  if (navigationNode.children && navigationNode.children.length) {
    return navigationNode.children.some(
      (child) => hasService(serviceTypes, child, excludeIds),
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

export const shouldHideElement = (node: Node, hasService:boolean) => {
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
  func: Function,
  [timer, setTimer]: [ReturnType<typeof setTimeout>, Function],
  timeout: number = 300,
) => {
  return (...args: any[]) => {
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

export const splitPathIntoSegmentsWithoutRouteParams = (
  path: string,
): string[] => {
  const pathWithoutParams = path.replace(/\/{[^}]*}/g, '');
  return pathWithoutParams.split('/').filter(segment => segment.length > 0);
}

export const findNodeByRouting = (root: Node, locationPath: string) => {
  const containsAllSegmentsInOrder = (nodeSegments: string[], pathSegments: string[]): boolean => {
    if (nodeSegments.length === 0) return true;
    if (nodeSegments.length > pathSegments.length) return false;
    return nodeSegments[0] === pathSegments[0] ? containsAllSegmentsInOrder(
        nodeSegments.slice(1),
        pathSegments.slice(1)
      ) : containsAllSegmentsInOrder(nodeSegments, pathSegments.slice(1));
  }

  const isMatchingNode = (node: Node, pathSegment: string) => {
    if (!node.routing) return null;

    const nodePath = node.routing.hash ? node.routing.hash.replace('#', node.routing.application) : '/' + node.routing.application;
    const normalizedPath = nodePath.startsWith('/') ? nodePath : '/' + nodePath;
    const nodeSegments = splitPathIntoSegmentsWithoutRouteParams(normalizedPath);
    const pathSegments = splitPathIntoSegmentsWithoutRouteParams(pathSegment);

    return {
      value: containsAllSegmentsInOrder(nodeSegments, pathSegments) ? node : null,
      segments: nodeSegments.length
    }
  }

  const exploreTree = (node: Node, pathSegment: string) : { value: Node | null; segments: number } => {
    if (!node.children || node.children.length === 0) return isMatchingNode(node, pathSegment);
    const currentMatch = isMatchingNode(node, pathSegment);
    const childResults = node.children.map(child => exploreTree(child, pathSegment)).filter(result => result?.value).sort((a, b) => b.segments - a.segments);
    return childResults.length > 0 ?childResults[0] : currentMatch;
  };

  const findNodeForSegments = (remainingSegments: number): any => {
    if (remainingSegments <= 0) return null;
    const pathSegments = locationPath.split('/').filter(segment => segment.length > 0).slice(0, remainingSegments).join('/');
    const foundNode = exploreTree(root, pathSegments);
    return foundNode?.value ? {
        node: foundNode.value,
        universe: findNodeById(root, foundNode.value.universe),
      } : findNodeForSegments(remainingSegments - 1);
  }
  const segments = locationPath.split('/').filter(segment => segment.length > 0).length;
  return findNodeForSegments(segments);
};
