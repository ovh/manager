import {
  Comment,
  type DeclarationReflection,
  type IntrinsicType,
  type LiteralType,
  type ProjectReflection,
  type ReferenceType,
  type ReflectionType,
  type SomeType,
  type UnionType,
  type UnknownType,
} from 'typedoc';
import { ReflectionKind } from 'typedoc/models';
import { extractTags, TAG } from './docgen';

type TypedocEnumMember = {
  name: string;
  value: number | string;
};

type ComponentTypedoc = {
  enums: {
    members: TypedocEnumMember[],
    name: string,
  }[],
  interfaces: {
    name: string,
    props: {
      name: string,
      type: string,
    }[],
  }[],
  unions: {
    name: string,
    value: string,
  }[],
}

function filterByKinds(children: DeclarationReflection[] | undefined, kinds: ReflectionKind[]): DeclarationReflection[] {
  return (children || []).filter((child) => kinds.indexOf(child.kind) > -1);
}

function getComponentTypedoc(data: ProjectReflection): ComponentTypedoc {
  const enumDeclarations = filterByKinds(data.children, [ReflectionKind.Enum]);
  const fakeEnumDeclarations = filterByKinds(data.children, [ReflectionKind.Variable])
    .filter((declaration) => declaration.flags.isConst)
    .filter((declaration) => declaration.type?.type === 'reflection');
  const interfaceDeclarations = filterByKinds(data.children, [ReflectionKind.Interface, ReflectionKind.TypeAlias])
    .filter((declaration) => !declaration.name.endsWith('Prop'))
    .filter((declaration) => declaration.type?.type !== 'templateLiteral' && declaration.type?.type !== 'union');
  const unionTypeDeclarations = filterByKinds(data.children, [ReflectionKind.TypeAlias])
    .filter((declaration) => declaration.type && declaration.type.type === 'union');

  const enums = enumDeclarations.map((enumDeclaration) => ({
    name: enumDeclaration.name,
    members: filterByKinds(enumDeclaration.children, [ReflectionKind.EnumMember])
      .map((member) => ({
        name: member.name,
        value: (member.type as LiteralType)?.value?.toString() || '',
      })),
  }));
  const fakeEnums = fakeEnumDeclarations.map((fakeEnumDeclaration) => ({
    name: fakeEnumDeclaration.name,
    members: filterByKinds((fakeEnumDeclaration.type as ReflectionType)?.declaration.children, [ReflectionKind.EnumMember])
      .map((member) => ({
        name: member.name,
        value: (member.type as LiteralType)?.value?.toString() || '',
      })),
  }));

  return {
    enums: sortByName(enums.concat(fakeEnums).map((enumDoc) => ({
      name: enumDoc.name,
      members: sortByName(enumDoc.members),
    }))),
    interfaces: sortByName(interfaceDeclarations.map((interfaceDeclaration) => ({
      name: interfaceDeclaration.name,
      props: (interfaceDeclaration.children || []).map((child) => ({
        name: `${child.name}${(child.flags.isOptional ? '?' : '')}`,
        type: getTypeValue(child.type, child.comment),
      })),
    }))),
    unions: sortByName(unionTypeDeclarations.map((typeDeclaration) => ({
      name: typeDeclaration.name,
      value: (typeDeclaration.type as UnionType).types
        .map((item: any) => item.name || `"${item.value}"`)
        .join(' | '),
    }))),
  };
}

function getTypeValue(type?: SomeType, comment?: Comment): string {
  if (!type) {
    return '';
  }

  if (comment?.summary && comment.summary.length) {
    let customType = '';

    comment.summary.some((str) => {
      const tagMap = extractTags(str.text);
      if (tagMap.has(TAG.type)) {
        customType = tagMap.get(TAG.type)!;
        return true;
      }
      return false;
    });

    if (customType) {
      return customType;
    }
  }

  if (type.type === 'array') {
    if ((type.elementType as ReflectionType).type === 'reflection') {
      const children = ((type.elementType as ReflectionType).declaration?.children || []).map((child) => {
        return `${child.name}: ${getTypeValue(child.type)}`;
      });

      return `{ ${children.join(', ')} }`;
    }

    return `${(type.elementType as ReferenceType).name}[]`;
  }

  if (type.type === 'reference' && (type as ReferenceType).typeArguments?.length) {
    const arg = ((type as ReferenceType).typeArguments || [])
      .map((t) => {
        if (t.type === 'intrinsic') {
          return (t as IntrinsicType).name;
        }
        return '';
      })
      .filter((t) => !!t)
      .join(', ');

    return `${(type as ReferenceType).name}<${arg}>`;
  }

  if (type.type === 'union' && type.types && type.types.length) {
    return (type.types as UnionType[])
      .sort((a, b) => {
        if (a.type < b.type) {
          return -1;
        }
        if (a.type > b.type) {
          return 1;
        }
        return 0;
      })
      .map((type) => getTypeValue(type))
      .join(' | ');
  }

  const value = (type as LiteralType).value;

  if ((type as LiteralType).value === null) {
    return 'null';
  }

  if ((type as UnknownType).name) {
    return (type as UnknownType).name;
  }

  return value?.toString() || '';
}

function sortByName<T extends { name: string }>(array: T[]): T[] {
  return [...array].sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}

export {
  type ComponentTypedoc,
  type TypedocEnumMember,
  getComponentTypedoc,
};
