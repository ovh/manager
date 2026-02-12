# Règle : Conformité Spec 100%

## Principe

**L'implémentation DOIT correspondre EXACTEMENT à la spécification. Ni plus, ni moins.**

## Obligations

### Couverture totale

- [ ] **TOUT** ce qui est dans la spec DOIT être implémenté
- [ ] **RIEN** de ce qui n'est pas dans la spec ne doit être ajouté
- [ ] Chaque élément de la spec = un élément implémenté

### Traçabilité

Pour chaque implémentation, tu dois pouvoir répondre :
> "Où est-ce dans la spec ?"

Si tu ne peux pas pointer vers un élément précis de la spec → **NE PAS IMPLÉMENTER**.

## Interdits absolus

### Pas d'oubli
```
❌ "J'ai implémenté 90% de la spec"
❌ "Ce cas edge n'était pas prioritaire"
❌ "J'y reviendrai plus tard"
✅ "J'ai implémenté 100% de la spec ou je signale ce qui manque"
```

### Pas d'ajout
```
❌ "J'ai ajouté une validation supplémentaire par sécurité"
❌ "J'ai refactoré ce code en passant"
❌ "J'ai amélioré l'UX avec ce petit plus"
✅ "J'ai implémenté uniquement ce qui est demandé"
```

### Pas d'interprétation
```
❌ "Je suppose que l'utilisateur voudrait aussi..."
❌ "Il serait logique d'ajouter..."
❌ "Dans ce cas, on devrait probablement..."
✅ "La spec ne précise pas ce point, je demande clarification"
```

### Pas de sur-ingénierie
```
❌ Abstractions "pour le futur"
❌ Configurations "au cas où"
❌ Gestion d'erreurs pour des cas non spécifiés
✅ Code minimal répondant exactement à la spec
```

## Checklist pré-implémentation

Avant de coder, vérifier :

```
□ J'ai lu la spec en entier
□ J'ai listé tous les éléments à implémenter
□ Je n'ai aucune zone d'ombre (sinon → demander)
□ Je sais exactement ce que je vais faire (et ne pas faire)
```

## Checklist post-implémentation

Après avoir codé, vérifier :

```
□ Chaque élément de la spec est implémenté
□ Aucun code n'existe sans correspondance dans la spec
□ Aucune fonctionnalité "bonus" n'a été ajoutée
□ Les edge cases sont ceux de la spec (pas d'invention)
```

## En cas d'ambiguïté

**STOP. Ne pas deviner.**

1. Identifier précisément l'ambiguïté
2. Formuler la question clairement
3. Demander à l'utilisateur
4. Attendre la réponse avant d'implémenter

## Réponses valides

```
"La spec mentionne X mais ne précise pas Y. Quel comportement souhaites-tu ?"
"Je ne vois pas ce cas dans la spec. Dois-je l'implémenter ?"
"La spec est ambiguë sur ce point. Peux-tu clarifier ?"
"J'ai terminé l'implémentation. Voici le mapping spec ↔ code : [...]"
```

## Conséquence

```
Écart spec/code = Bug fonctionnel = Rejet
```

**La spec est le contrat. Le code est la livraison. Les deux doivent correspondre à 100%.**
