# Atelier Desktop

**L’art et l’IA dans un même espace de travail local.** Atelier Desktop est une préversion pour macOS qui aide à transformer une intention artistique en recherches, fichiers de travail, créations modifiables et vérifications visuelles. L’application s’appuie sur [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) et sur l’hôte [DSH Desktop](https://github.com/dataelement/dsh-desktop), distribué sous licence MIT. Atelier possède sa propre identité, son mode créatif, son interface et un profil utilisateur distinct.

[English](README.md) · [简体中文](README.zh.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md)

## Ce que comprend cette préversion

- **Création artistique :** le mode *Atelier Creative Mode*, sélectionné par défaut, comprend une compétence (Skill) pour le travail dans Blender et un connecteur `mcp-for-blender` configuré. Il sert notamment aux installations, sculptures géométriques, espaces d’exposition et autres projets 3D. Blender et son module MCP doivent être installés séparément.
- **Travail quotidien :** des suggestions de consignes modifiables facilitent le traitement de documents, l’analyse et la visualisation de données, les comptes rendus de réunion, les rapports de recherche et les présentations. Un clic remplit la zone de saisie sans lancer automatiquement la tâche.
- **Livrables vérifiables :** pour un projet 3D, le flux de travail demande les fichiers du projet et des vues rendues, puis contrôle le cadrage et les autres détails visibles avant d’annoncer le résultat. Un nom de fichier seul ne prouve ni la création ni la vérification d’un livrable.
- **Outils et modèles :** configurez un fournisseur de modèles dans l’application. Le marché des connecteurs MCP présente une sélection d’outils pour l’art et le design. L’ajout d’un connecteur configure le mode Atelier ; vérifiez sa connexion dans une nouvelle session. Le marché des extensions communautaires est actuellement masqué.
- **Application locale :** les espaces de travail, sessions et réglages sont conservés dans un profil propre à Atelier Desktop, séparé de toute installation DSH existante. L’interface est disponible en chinois, en anglais et en français. Le mode PPT intégré peut produire des fichiers PPTX modifiables.

Il s’agit d’une **préversion locale**. Atelier ne propose actuellement ni version signée ni mise à jour automatique. Le dépôt conserve du code multiplateforme hérité du projet d’origine, mais les instructions et les vérifications de cette adaptation ciblent pour l’instant macOS. Les programmes d’installation et les annonces de version de DSH ne sont pas des versions d’Atelier. L’application de bureau ne remplace pas le service web Atelier destiné à plusieurs utilisateurs.

## Exécuter l’application en local

Utilisez **Node.js 24** sur macOS. À la racine de ce dépôt :

```sh
npm ci
npm run dev
```

Configurez votre fournisseur de modèles dans **Paramètres → Modèles**. Atelier n’importe ni les clés API, ni les sessions, ni les extensions d’un autre profil DSH. Pour créer une préversion locale non signée sur un Mac Apple Silicon :

```sh
npm run package:dev:mac:arm64
```

Les fichiers produits sont placés dans `dist-dev/` ; ce ne sont pas des programmes d’installation prêts pour la production.

Pour les tâches Blender, installez Blender et `uvx`, activez le module `mcp-for-blender==2.0.4`, puis démarrez son service sur `127.0.0.1:9876`. Vérifiez que les outils MCP se connectent avant de demander à l’agent de modéliser. Consultez le [guide détaillé de configuration et de livraison Atelier](README-ATELIER.md).

## Développement

Exécutez `npm test`, `npm run typecheck` et `npm run build`, puis vérifiez le parcours concerné dans l’application. Les adaptations de Harness se trouvent dans le code de l’hôte, les extensions Atelier et les correctifs de compatibilité suivis dans le dépôt. Les documents hérités sur [l’architecture](docs/architecture.md), [le développement](docs/development.md) et [l’environnement PPT](packages/ppt-runtime/README.md) décrivent l’hôte sous-jacent ; certains emploient encore les noms et procédures de publication du projet DSH.

## Données, sécurité et origine du projet

Atelier démarre un service Harness local et utilise un répertoire de données propre à chaque utilisateur. Le processus d’affichage fonctionne avec isolation et sandboxing. Selon leurs autorisations, les fournisseurs de modèles et services MCP installés peuvent transmettre des données à leurs points de connexion ou accéder aux fichiers de l’espace de travail. Examinez chaque connecteur avant de l’utiliser avec des contenus confidentiels. Ne publiez pas de secrets ni de fichiers clients dans le dépôt.

Atelier Desktop est une adaptation de DSH Desktop distribuée sous [licence MIT](LICENSE). DeepSeek Harness, les bibliothèques incluses, les projets MCP et les autres composants tiers conservent leurs licences et leurs responsables respectifs. Atelier est un projet indépendant : il ne constitue pas une version officielle de DeepSeek ou de DSH Desktop.

[Site Atelier](https://artsmart.space/) · [Dépôt du projet](https://github.com/dengyier/Atelier_desktop_mac)
