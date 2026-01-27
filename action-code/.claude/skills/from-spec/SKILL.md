---
description: "Implémenter une fonctionnalité à partir d'une spécification (MD, YAML ou visuel)"
---

# Skill : Implémentation depuis Spec

## Déclenchement

Ce skill s'applique quand l'utilisateur fournit :
- Un fichier `.md` de spécification
- Un fichier `.yml/.yaml` de définition
- Une image (maquette, wireframe, screenshot)

## Étapes

### 1. Analyse de la spec

```
□ Lire intégralement la spec
□ Identifier le périmètre exact
□ Lister les composants/fichiers impactés
□ Repérer les edge cases mentionnés
□ Noter les zones d'ombre
```

### 2. Clarification

Si éléments manquants ou ambigus :
- Poser des questions **précises** et **numérotées**
- Proposer des options quand pertinent
- Ne jamais supposer

### 3. Planification

Avant d'écrire du code :
```
□ Décomposer en sous-tâches atomiques
□ Définir l'ordre d'implémentation
□ Identifier les dépendances
□ Vérifier les patterns existants dans le codebase
```

### 4. Implémentation

Pour chaque sous-tâche :
```
□ Implémenter le minimum viable
□ Respecter les conventions du projet
□ Pas de code mort ou commenté
□ Pas de TODO sans validation
```

### 5. Validation

```
□ Relire la spec point par point
□ Vérifier chaque critère d'acceptance
□ Tester les edge cases identifiés
□ S'assurer de la cohérence avec l'existant
```

## Format de spec supportés

### Markdown

```markdown
# Fonctionnalité

## Contexte
[Pourquoi cette feature]

## Comportement
- Cas nominal : ...
- Cas alternatif : ...

## Critères d'acceptance
- [ ] CA1
- [ ] CA2
```

### YAML

```yaml
feature:
  name: feature-name
  components:
    - name: ComponentName
      props: [...]
      behavior: [...]
  acceptance:
    - criteria: Description
```

### Visuel

Pour les maquettes/screenshots :
1. Décrire ce qui est observé
2. Demander confirmation de l'interprétation
3. Identifier les éléments interactifs
4. Clarifier les états (hover, focus, error, etc.)

## Anti-patterns

- Implémenter avant d'avoir lu toute la spec
- Ajouter des features non demandées
- Deviner les comportements non spécifiés
- Ignorer les edge cases
- Copier/coller sans adapter au contexte
