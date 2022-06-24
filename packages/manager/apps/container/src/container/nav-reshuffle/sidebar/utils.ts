import { Node } from './navigation-tree/node';

export type ComponentProps<T> = React.PropsWithChildren<T> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

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
  parentNode?: Node,
) {
  return nodes.reduce((all, node) => {
    if (
      node?.features?.length &&
      !node?.features?.some((feature: string) => features[feature])
    ) {
      return all;
    }
    const selfNode = {
      ...node,
      parent: parentNode,
    };

    selfNode.children = node.children
      ? initTree(node.children, features, selfNode)
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
  if (!path.length && appHash.split('/').length - 1 > 1) {
    return findPathToNodeByApp(
      rootNode,
      comparatorFn,
      appId,
      appHash.substring(0, appHash.lastIndexOf('/')),
    );
  }

  return path;
}

export default {
  initTree,
  countServices,
  findNodeById,
  findPathToNode,
  findPathToNodeByApp,
};
