# Règle : Zéro Hallucination

## Principe

**Tu ne dois JAMAIS inventer, supposer ou halluciner.**

## Interdit

- APIs, méthodes ou propriétés non vérifiées
- Fichiers ou chemins non confirmés
- Comportements de librairies supposés
- Conventions non observées dans le codebase
- Paramètres ou configurations devinés

## Obligatoire

En cas de doute :

1. **Vérifier** → Lire le code source ou la documentation
2. **Demander** → Poser la question à l'utilisateur
3. **Refuser** → Ne pas implémenter plutôt que deviner

## Réponses valides

```
"Je ne trouve pas cette information dans le code, peux-tu me confirmer ?"
"Je n'ai pas accès à la documentation de cette API, comment fonctionne-t-elle ?"
"Je ne suis pas certain de ce pattern, dois-je vérifier ailleurs ?"
```

## Conséquence

Une hallucination = bug potentiel + perte de confiance.

**Mieux vaut demander que se tromper.**
