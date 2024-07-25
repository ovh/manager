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

export interface IServicesCount {
  total: number;
  serviceTypes: Record<string, number>;
}
/**
 * Given the servicesCount data, a navigation node and a list of node ids to exclude
 * traverse the navigation tree and sum the count of services for this navigation node
 */
export function countServices(
  servicesCount: IServicesCount,
  navigationNode: Node,
  excludeIds: string[] = [],
): number {
  if (excludeIds.includes(navigationNode.id)) {
    return 0;
  }
  if (navigationNode.count) {
    return navigationNode.count as number;
  }
  // exclude public cloud from services count since we are counting projects
  if (navigationNode.id === 'services') {
    excludeIds.push('pci');
  }
  if (navigationNode.id === 'pci') {
    return servicesCount.serviceTypes.CLOUD_PROJECT;
  }
  if (!servicesCount) return 0;
  if (navigationNode.serviceType) {
    const types = [].concat(navigationNode.serviceType);
    return types.reduce(
      (acc, type) => acc + (servicesCount.serviceTypes[type] || 0),
      0,
    );
  }
  if (navigationNode.children && navigationNode.children.length) {
    return navigationNode.children.reduce(
      (acc, child) => acc + countServices(servicesCount, child, excludeIds),
      0,
    );
  }
  return 0;
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

export const shouldHideElement = (node: Node, count: number | boolean) => {
  if (node.hideIfEmpty && !count) {
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

export const isMobile = () => {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
};

/* this function is used to parse a path with the pattern /some/thing/{id}/other/thing
and return it as an array of segments: ['/some/thing/', '/other/thing']
if no curly brackets, that returns an array that contains only the path */
export const splitPathIntoSegmentsWithoutRouteParams = (
  path: string,
): string[] => {
  const regex = /\/(?!{)[^\/]+(\/(?!{)[^\/]+)?/g;
  const matches = path.match(regex);
  return matches ? matches : [path];
};

export const findUniverse = (root: Node, locationPath: string) => {
  const isMatchingNode = (node: Node, pathSegment: string) => {
    if (!node.routing) return null;
    const nodePath = node.routing.hash
      ? node.routing.hash.replace('#', node.routing.application)
      : '/' + node.routing.application;

    const parsedPath = splitPathIntoSegmentsWithoutRouteParams(nodePath);
    return parsedPath.reduce(
      (acc: boolean, segment: string) => pathSegment.includes(segment) && acc,
      true,
    )
      ? node
      : null;
  };

  const exploreTree = (node: Node, pathSegment: string): Node | null => {
    if (node.children && typeof node.children[Symbol.iterator] === 'function') {
      for (let child of node.children) {
        const result = exploreTree(child, pathSegment);
        if (result) return result;
      }
    }

    return isMatchingNode(node, pathSegment);
  };

  const pathSegments = locationPath
    .split('/')
    .filter((segment) => segment.length > 0);
  for (let i = pathSegments.length; i > 0; i--) {
    const path = pathSegments.slice(0, i).join('/');
    const result = exploreTree(root, path);
    if (result) {
      return {
        node: result,
        parent: findNodeById(root, result.universe),
      };
    }
  }
  return { node: null, parent: null };
};

export default {
  initTree,
  countServices,
  findNodeById,
  findPathToNode,
  findPathToNodeByApp,
};
