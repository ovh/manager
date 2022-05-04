import { Node } from './navigation-tree/node';

/**
 * Initialize the tree by adding a parent attribute in each node
 */
export function initTree(node: Node, parentNode?: Node = null) {
  if (node.children) {
    const resultNode = {
      ...node,
      parent: parentNode,
    };
    resultNode.children = node.children.map((child) =>
      initTree(child, resultNode),
    );
    return resultNode;
  }
  return {
    ...node,
    parent: parentNode,
  };
}

/**
 * Given the servicesCount data, a navigation node and a list of node ids to exclude
 * traverse the navigation tree and sum the count of services for this navigation node
 */
export function countServices(
  servicesCount: number,
  navigationNode: Node,
  excludeIds: string[] = [],
): number {
  if (excludeIds.includes(navigationNode.id)) {
    return 0;
  }
  if (navigationNode.count) {
    return navigationNode.count;
  }
  // exclude public cloud from services count since we are counting projects
  if (navigationNode.id === 'services') {
    excludeIds.push('public-cloud');
  }
  if (navigationNode.id === 'public-cloud') {
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
export function findPathToNode(rootNode: Node, comparatorFn: CallableFunction) {
  const doCompare = (node: Node) => {
    try {
      return comparatorFn(node);
    } catch {
      return false;
    }
  };
  if (doCompare(rootNode)) {
    return [rootNode];
  }
  if (rootNode && rootNode.children) {
    for (let i = 0; i < rootNode.children.length; i += 1) {
      const subPath = findPathToNode(rootNode.children[i], comparatorFn);
      if (subPath.length) {
        return [rootNode].concat(subPath);
      }
    }
  }
  return [];
}

export default { initTree, countServices, findNodeById, findPathToNode };
