window.__ModuleLoader__.load({
  id: 'dsh-desktop-client-ui',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')
    const NS = 'atelier.desktop.home'
    const STYLE_ID = 'atelier-desktop-home-style'
    const groups = {
      work: ['documents', 'data', 'minutes', 'research', 'slides'],
      creative: ['theme', 'poster', 'brand', 'web', 'presentation']
    }
    const zh = {
  "eyebrow": "ATELIER · ART & AI",
  "headline": "AI，让艺术焕发新生",
  "subtitle": "从馆藏发现到创意表达，把灵感、资料与工具放在同一处。",
  "work": "日常办公",
  "creative": "设计创意",
  "modes": "任务模式",
  "suggestions": "任务建议",
  "documents": "文档处理",
  "prompt.documents": "请处理我附上的文档。我的目标是：【写明要摘要、提取、改写、校对、翻译或对比的内容】。先确认实际读取的文件与范围，再直接交付结果；重要事实或引用标注页码或章节，无法读取或材料不足的部分明确说明。若尚未附文件或目标不明确，请只问完成任务所必需的问题。",
  "data": "数据分析与可视化",
  "prompt.data": "请用我附上的数据回答：【填写决策问题或分析目标】。先核对字段、单位、时间范围、缺失值与异常值，并说明处理口径；再给出关键指标、合适的图表、主要发现及其含义，附可复核的计算方法。区分相关性与因果推断；若缺数据，指出具体缺口。",
  "minutes": "会议纪要",
  "prompt.minutes": "请把我提供的会议录音、逐字稿或笔记整理成可执行的纪要。按“会议目标—关键讨论—确定事项—待办（负责人和期限）—未决问题”呈现，保留重要分歧及决定依据。只记录材料能支持的内容；人员或日期不明时写“待确认”。若尚无材料，请提示我提供。",
  "research": "研究报告",
  "prompt.research": "请围绕【主题】回答【需要支持的决策问题】，写一份可核验的研究报告。界定研究范围和资料截至日期，核查可用的可靠来源，比较关键证据与相反观点，再给出结论、适用条件和未解决问题。关键事实附来源链接与发布日期；无法检索时说明资料边界，不虚构引用。",
  "slides": "幻灯片",
  "prompt.slides": "请根据【主题】、【受众】、【汇报场景】和我提供的材料制作幻灯片。提炼核心观点与叙事顺序，逐页写明标题句、要点、证据来源及推荐图表或画面，原则上每页只表达一个结论。具备文件制作能力时交付可预览、可下载的文件并核对内容；否则交付可直接制作的逐页稿。",
  "theme": "主题方案",
  "prompt.theme": "请以【艺术主题、作品或场地】为基础，策划适用于【展览、装置或活动】的主题方案。提炼已有资料与受众体验目标，提出两到三个真正不同的概念方向，分别说明叙事、空间动线、视觉语言、媒介、互动与实现条件；推荐一案并列出下一步制作清单。未提供的尺寸、预算或授权条件请标为待确认。",
  "poster": "视觉海报",
  "prompt.poster": "请为【作品、展览或活动】设计面向【受众及发布渠道】的海报。提炼一句传播重点，给出主视觉概念、版式层级、色彩与字体方案，以及可直接使用的标题和信息区；不要编造日期、地点或主办方。若尺寸或必需文字尚未明确，请先确认；有生成工具时制作可查看的成品。",
  "brand": "品牌设计",
  "prompt.brand": "请为【品牌或项目】制定可落地的视觉识别方向。依据我提供的定位、受众和使用场景，提炼核心差异点，再给出品牌关键词、标志方向、配色、字体、图形语言和应用示例；解释主要选择如何服务定位。资料不足时列出最影响设计的待确认项，不虚构品牌历史或用户研究。",
  "web": "网页设计",
  "prompt.web": "请为【项目或产品】设计服务于【目标用户与关键任务】的网页。明确页面目标与主要操作路径，给出信息结构、关键区块文案、交互状态、响应式布局和视觉原则，并照顾移动端与无障碍使用。若具备实现工具，请制作可运行页面并检查关键流程；否则交付可执行的页面规格。",
  "presentation": "演示文稿",
  "prompt.presentation": "请为【提案、展览或路演】创作面向【受众】的视觉叙事型演示文稿。提出贯穿全稿的核心主张与视觉母题，安排开场、论证或作品展示、高潮与结尾行动；逐页写清主信息、画面构思、讲述提示及所需素材。事实和图像来源应可追溯；能制作文件时交付可预览、可下载的成品，否则提供可直接制作的分镜稿。"
}
    const en = {
  "eyebrow": "ATELIER · ART & AI",
  "headline": "AI brings new life to art",
  "subtitle": "From museum collections to creative expression, keep inspiration, sources, and tools together.",
  "work": "Everyday work",
  "creative": "Creative design",
  "modes": "Task mode",
  "suggestions": "Task suggestions",
  "documents": "Work with documents",
  "prompt.documents": "Work with the attached document. My goal is: [specify what to summarize, extract, rewrite, proofread, translate, or compare]. Confirm which files and sections you actually read, then deliver the result. Cite pages or sections for important facts or quotations, and clearly identify anything unreadable or unsupported. If the file or goal is missing, ask only the questions needed to proceed.",
  "data": "Data analysis and charts",
  "prompt.data": "Use the attached data to answer: [enter the decision question or analysis goal]. Check fields, units, time range, missing values, and outliers, and explain any cleaning choices. Then present key metrics, suitable charts, findings and their implications, with reproducible calculations. Distinguish correlation from causation; identify any specific data gaps.",
  "minutes": "Meeting notes",
  "prompt.minutes": "Turn my recording, transcript, or notes into actionable meeting minutes. Organize them as meeting goal, key discussion, decisions, action items (owner and deadline), and open questions. Preserve important disagreements and reasons for decisions. Include only supported details; mark unknown names or dates as “to confirm”. If no source is attached, ask me to provide one.",
  "research": "Research report",
  "prompt.research": "Write a verifiable research report on [topic] to answer [decision question]. Define the scope and information cutoff, check reliable sources that are available, compare key evidence with opposing views, and state conclusions, conditions where they apply, and open questions. Link and date important factual sources. If you cannot research live, state the evidence limits and do not invent citations.",
  "slides": "Slides",
  "prompt.slides": "Create slides for [topic], [audience], and [presentation setting] using my materials. Build the main argument and narrative order; for each slide, provide a takeaway title, key points, source of evidence, and suitable chart or visual. Aim for one conclusion per slide. If you can create a file, deliver a checked, previewable and downloadable deck; otherwise provide a slide-by-slide production script.",
  "theme": "Theme concept",
  "prompt.theme": "Develop a theme concept for [art theme, work, or venue] in [exhibition, installation, or event]. Use the available material and desired audience experience to create two or three genuinely different directions. For each, explain the narrative, visitor route, visual language, media, interaction, and practical requirements. Recommend one direction and list the next production steps. Mark unknown dimensions, budget, or rights as to confirm.",
  "poster": "Visual poster",
  "prompt.poster": "Design a poster for [artwork, exhibition, or event] aimed at [audience and channel]. Formulate one clear message, then specify the key visual, layout hierarchy, colors, typography, a usable headline, and information area. Do not invent dates, venues, or organizers. If dimensions or required wording are missing, ask for them before generating an image; create a viewable result when image tools are available.",
  "brand": "Brand design",
  "prompt.brand": "Develop a practical visual identity direction for [brand or project]. From the positioning, audience, and use cases I provide, identify the central differentiator. Then propose brand keywords, logo direction, palette, type, graphic language, and application examples, explaining how the main choices support the positioning. List the missing facts that most affect the design; do not invent brand history or user research.",
  "web": "Web design",
  "prompt.web": "Design a web page for [project or product] serving [target users and key task]. Define the page goal and primary user path, then provide the information structure, key section copy, interaction states, responsive layout, and visual principles, including mobile and accessibility needs. If implementation tools are available, build a working page and check the key flow; otherwise deliver an actionable page specification.",
  "presentation": "Presentation",
  "prompt.presentation": "Create a visually driven presentation for [proposal, exhibition, or pitch] aimed at [audience]. Define the core claim and visual motif, then structure the opening, evidence or work showcase, peak, and closing action. For each slide, specify its main message, visual concept, speaker cue, and needed assets. Keep facts and image sources traceable. If you can create a file, deliver a previewable and downloadable deck; otherwise provide a production-ready storyboard."
}
    const fr = {
      eyebrow: 'ATELIER · ART & IA',
      headline: 'L’IA donne un nouveau souffle à l’art',
      subtitle: 'Des collections muséales à la création, réunissez inspirations, sources et outils.',
      work: 'Travail quotidien',
      creative: 'Création visuelle',
      modes: 'Mode de travail',
      suggestions: 'Suggestions de tâches',
      documents: 'Traitement de documents',
      'prompt.documents': 'Traitez le document joint. Mon objectif est : [préciser ce qu’il faut résumer, extraire, réécrire, corriger, traduire ou comparer]. Confirmez les fichiers et passages réellement lus, puis livrez le résultat. Indiquez les pages ou sections pour les faits et citations importants, et signalez clairement ce qui est illisible ou non étayé. Si le fichier ou l’objectif manque, posez uniquement les questions nécessaires.',
      data: 'Analyse et visualisation',
      'prompt.data': 'Utilisez les données jointes pour répondre à : [indiquer la question de décision ou l’objectif d’analyse]. Vérifiez les champs, unités, périodes, valeurs manquantes et anomalies, et expliquez les corrections. Présentez ensuite les indicateurs, graphiques pertinents, constats et implications avec des calculs vérifiables. Distinguez corrélation et causalité et signalez les données manquantes.',
      minutes: 'Compte rendu',
      'prompt.minutes': 'Transformez mon enregistrement, ma transcription ou mes notes en compte rendu exploitable. Présentez l’objectif, les échanges clés, les décisions, les actions à mener avec responsable et échéance, puis les questions ouvertes. Conservez les désaccords importants et les raisons des décisions. N’ajoutez aucun détail non étayé ; marquez les noms ou dates inconnus « à confirmer ». Si aucune source n’est jointe, demandez-la.',
      research: 'Rapport de recherche',
      'prompt.research': 'Rédigez un rapport vérifiable sur [sujet] pour répondre à [question de décision]. Définissez le périmètre et la date de référence, vérifiez les sources fiables disponibles, confrontez les preuves et les points de vue contraires, puis exposez les conclusions, leurs conditions de validité et les questions ouvertes. Donnez un lien et une date pour les faits importants. Si la recherche en ligne est impossible, indiquez cette limite sans inventer de références.',
      slides: 'Diapositives',
      'prompt.slides': 'Créez des diapositives sur [sujet] pour [public] dans [contexte de présentation], à partir de mes documents. Construisez l’argument principal et l’ordre du récit. Pour chaque page, précisez le titre conclusif, les points clés, les sources et le visuel ou graphique adapté ; visez une idée par page. Si vous pouvez produire un fichier, livrez-le après vérification avec aperçu et téléchargement ; sinon, fournissez un plan page par page prêt à réaliser.',
      theme: 'Concept thématique',
      'prompt.theme': 'À partir de [thème artistique, œuvre ou lieu], imaginez un concept pour [exposition, installation ou événement]. Appuyez-vous sur les éléments disponibles et l’expérience recherchée pour proposer deux ou trois directions réellement distinctes. Pour chacune, décrivez le récit, le parcours, le langage visuel, les médias, l’interaction et les contraintes de réalisation. Recommandez une direction et listez les prochaines étapes. Marquez les dimensions, budgets et droits inconnus « à confirmer ».',
      poster: 'Affiche visuelle',
      'prompt.poster': 'Concevez une affiche pour [œuvre, exposition ou événement] destinée à [public et canal]. Formulez un message central, puis proposez le visuel principal, la hiérarchie de mise en page, les couleurs, la typographie, un titre utilisable et la zone d’informations. N’inventez ni date, ni lieu, ni organisateur. Confirmez les dimensions ou textes obligatoires manquants avant de créer une image ; produisez un résultat consultable si les outils le permettent.',
      brand: 'Identité de marque',
      'prompt.brand': 'Définissez une identité visuelle réalisable pour [marque ou projet]. À partir du positionnement, du public et des usages fournis, identifiez la différence essentielle. Proposez ensuite des mots clés, une direction de logo, une palette, une typographie, un langage graphique et des applications, en expliquant vos choix. Listez les informations manquantes qui influencent le plus le design ; n’inventez ni histoire de marque ni étude d’utilisateurs.',
      web: 'Conception web',
      'prompt.web': 'Concevez une page web pour [projet ou produit] au service de [public et tâche principale]. Définissez l’objectif et le parcours clé, puis la structure, les textes essentiels, les états interactifs, la mise en page adaptable et les principes visuels, y compris l’accessibilité et le mobile. Si des outils de développement sont disponibles, créez une page fonctionnelle et vérifiez le parcours ; sinon, livrez une spécification exploitable.',
      presentation: 'Présentation',
      'prompt.presentation': 'Créez une présentation visuelle pour [proposition, exposition ou projet] destinée à [public]. Définissez l’idée directrice et le motif visuel, puis organisez l’ouverture, les preuves ou œuvres, le temps fort et l’action finale. Pour chaque page, précisez le message, le visuel, les notes orales et les ressources nécessaires. Rendez les faits et images traçables. Si vous pouvez créer un fichier, livrez une version vérifiée, consultable et téléchargeable ; sinon, fournissez un scénario prêt à produire.'
    }
    const frenchChrome = {
      common: {
        ok: 'OK', cancel: 'Annuler', close: 'Fermer', copy: 'Copier', copied: 'Copié',
        retry: 'Réessayer', loading: 'Chargement…', submit: 'Envoyer', submitting: 'Envoi…',
        next: 'Suivant', previous: 'Précédent', skip: 'Ignorer', delete: 'Supprimer',
        edit: 'Modifier', save: 'Enregistrer', search: 'Rechercher', more: 'Plus',
        collapse: 'Réduire', expand: 'Développer', back: 'Retour', unknown: 'Inconnu', none: 'Aucun'
      },
      'settings.locale': { 'language.title': 'Langue' },
      'settings.permission': {
        title: 'Autorisations', description: 'Choisissez les autorisations par défaut des nouvelles sessions',
        loading: 'Chargement', unavailable: 'Indisponible',
        'preset.readOnly': 'Lecture seule', 'preset.workspaceWrite': 'Modifier l’espace de travail',
        'preset.fullAccess': 'Accès complet',
        'confirm.title': 'Activer l’accès complet ?',
        'confirm.description': 'L’accès complet permet aux nouvelles sessions d’effectuer davantage d’actions directement, notamment des opérations sensibles, des modifications de fichiers et des commandes externes. Activez-le seulement si vous faites confiance aux tâches à venir.',
        'confirm.acknowledge': 'Je comprends les risques et souhaite continuer',
        'confirm.cancel': 'Annuler', 'confirm.enable': 'Activer l’accès complet'
      },
      'settings.theme': {
        'appearance.title': 'Apparence', 'appearance.light': 'Clair',
        'appearance.dark': 'Sombre', 'appearance.system': 'Suivre le système',
        'fontSize.title': 'Taille du texte',
        'fontSize.description': 'Modifie uniquement le texte de la conversation',
        'fontSize.unit': 'px', 'fontSize.increase': 'Agrandir le texte',
        'fontSize.decrease': 'Réduire le texte'
      },
      chat: {
        'settings.transcript.title': 'Affichage de la conversation',
        'settings.transcript.description': 'Contrôle l’affichage des étapes des tours terminés',
        'settings.transcript.normal': 'Standard',
        'settings.transcript.compact': 'Compact'
      },
      conversation: {
        'settings.enter.title': 'Envoi pendant une tâche en cours',
        'settings.enter.description': 'Action de la touche Entrée et du bouton Envoyer pendant l’exécution ; Cmd/Ctrl+Entrée utilise l’autre action',
        'settings.enter.queue': 'Mettre en file d’attente',
        'settings.enter.steer': 'Corriger la tâche'
      },
      settings: {
        trigger: 'Paramètres', title: 'Paramètres', close: 'Fermer',
        openDocument: 'Ouvrir le fichier de configuration',
        'openDocument.error': 'Impossible d’ouvrir le fichier de configuration',
        'general.nav': 'Général',
        'connection.error': 'Connexion interrompue',
        'connection.retry': 'Reconnexion',
        'connection.connecting': 'Reconnexion en cours',
        'connection.connected': 'Connecté',
        'connection.reconnect': 'Connexion interrompue, reconnecter',
        'connection.restart': 'Reconnexion automatique en cours'
      },
      sidebar: {
        'session.new': 'Nouvelle session',
        'session.new.label': 'Créer une session',
        'toggle.open': 'Afficher la barre latérale',
        'toggle.collapse': 'Masquer la barre latérale',
        'panels.label': 'Panneaux globaux'
      },
      workspace: {
        'group.ungrouped': 'Sans groupe', 'session.new': 'Nouvelle session',
        'section.workspaces': 'Espaces de travail', 'section.sessions': 'Sessions',
        'viewOptions.label': 'Options d’affichage', 'workspace.add': 'Ajouter un espace de travail',
        'search.sessions.aria': 'Rechercher des sessions',
        'search.placeholder': 'Rechercher des sessions…',
        'search.clear': 'Effacer la recherche',
        'empty.none': 'Aucune session', 'empty.noMatches': 'Aucun résultat',
        'menu.addWorkspace': 'Ajouter un espace de travail…',
        'menu.openInFinder': 'Ouvrir dans le Finder',
        'rename': 'Renommer', 'rename.workspace.title': 'Renommer l’espace de travail',
        'rename.session.title': 'Renommer la session',
        'delete.workspace': 'Supprimer l’espace de travail',
        'delete.session': 'Supprimer la session',
        'status.running': 'En cours', 'status.completed': 'Terminé',
        'status.waitingApproval': 'En attente d’approbation',
        'status.waitingAnswer': 'En attente de réponse'
      },
      'settings.models': { nav: 'Modèles', title: 'Modèles' },
      'settings.plugins': { nav: 'Extensions', title: 'Extensions' },
      'settings.agentPreset': {
        nav: 'Préréglages de l’agent',
        seatHint: 'Préréglage de l’agent pour la prochaine session',
        headerHint: 'Préréglage utilisé par cette session depuis sa création',
        presetStandardName: 'Mode standard', presetPtcName: 'Mode PTC',
        presetMinimalName: 'Mode minimal', presetCordisName: 'Mode créateur'
      }
    }
    const styles = `.atelier-home-hero{text-align:center;padding:20px 16px 32px;color:var(--dsw-alias-label-primary)}.atelier-home-eyebrow{display:block;margin-bottom:14px;color:var(--dsw-alias-state-business-primary);font-size:11px;font-weight:700;letter-spacing:.18em}.atelier-home-title{margin:0 0 10px;font-size:clamp(30px,3vw,42px);font-weight:650;letter-spacing:-.05em;line-height:1.25}.atelier-home-subtitle{margin:0;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:1.6}.atelier-home-actions{width:100%;box-sizing:border-box;padding:0 16px 2px}.atelier-home-tabs{display:flex;justify-content:center;gap:4px;width:max-content;max-width:100%;margin:0 auto 36px;padding:4px;border-radius:22px;background:var(--dsw-alias-interactive-bg-hover)}.atelier-home-tabs button{border:0;border-radius:18px;padding:7px 14px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;white-space:nowrap;cursor:pointer}.atelier-home-tabs button[aria-selected=true]{background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-bg-base);font-weight:600}.atelier-home-tabs button:hover:not([aria-selected=true]){background:var(--dsw-alias-interactive-bg-hover-solid)}.atelier-home-suggestions{display:flex;align-items:center;gap:9px;overflow-x:auto;scrollbar-width:none}.atelier-home-suggestions::-webkit-scrollbar{display:none}.atelier-home-suggestions button{flex:none;border:1px solid var(--dsw-alias-border-l2);border-radius:20px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);padding:8px 13px;font:inherit;font-size:12px;white-space:nowrap;cursor:pointer}.atelier-home-suggestions button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-state-business-primary)}.atelier-home-actions button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.atelier-home-suggestions button:disabled{opacity:.5;cursor:default}@media(max-width:640px){.atelier-home-hero{padding-bottom:24px}.atelier-home-tabs{margin-bottom:22px}.atelier-home-actions{padding:0 10px}}`

    const brandStyles = `.at-logo{text-decoration:none}.at-mark{position:relative;display:inline-block;width:24px;height:28px;color:var(--dsw-alias-label-primary)}.at-mark i{position:absolute;width:5px;border-radius:999px;background:currentColor;transform:rotate(-18deg)}.at-mark i:nth-child(1){left:2px;top:13px;height:14px}.at-mark i:nth-child(2){left:9px;top:3px;height:23px}.at-mark i:nth-child(3){left:16px;top:1px;height:14px}.at-word{font-size:20px;font-weight:700;letter-spacing:-.05em;line-height:1}.at-beta{box-sizing:border-box;display:inline-flex;align-items:center;height:17px;padding:0 4px;border:1px solid var(--dsw-alias-border-l2);border-radius:3px;color:var(--dsw-alias-label-secondary);font-size:8px;font-weight:700;letter-spacing:.12em;line-height:1}`

    function installStyles() {
      if (document.getElementById(STYLE_ID)) return () => undefined
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.pluginCss = NS
      style.textContent = styles + brandStyles
      document.head.appendChild(style)
      return () => style.remove()
    }

    function AtelierMark() {
      return React.createElement('span', { className: 'at-mark', 'aria-hidden': 'true' },
        React.createElement('i'), React.createElement('i'), React.createElement('i'))
    }

    function AtelierName() {
      return React.createElement(React.Fragment, null,
        React.createElement('span', { className: 'at-word' }, 'atelier'),
        React.createElement('span', { className: 'at-beta' }, 'BETA'))
    }

    const inject = ['slots', 'locale']
    function apply(ctx) {
      ctx.effect(installStyles, 'atelier: home styles')
      ctx.effect(() => ctx.locale.addLanguage({ id: 'fr', label: 'Français', fallback: 'en' }), 'atelier: French language')
      ctx.effect(() => ctx.locale.register(NS, { zh, en, fr }), 'atelier: home copy')
      for (const [namespace, dictionary] of Object.entries(frenchChrome)) {
        ctx.effect(() => ctx.locale.register(namespace, 'fr', dictionary), `atelier: French ${namespace}`)
      }
      const t = ctx.locale.bind(NS)

      function AtelierHero() {
        return React.createElement('div', { className: 'atelier-home-hero' },
          React.createElement('span', { className: 'atelier-home-eyebrow' }, t('eyebrow')),
          React.createElement('h1', { className: 'atelier-home-title' }, t('headline')),
          React.createElement('p', { className: 'atelier-home-subtitle' }, t('subtitle'))
        )
      }

      function AtelierSuggestions({ input, inputActions }) {
        const [mode, setMode] = React.useState('work')
        const fill = (key) => {
          const prompt = t(`prompt.${key}`)
          const draft = input?.draft || ''
          inputActions.setDraft(draft ? `${draft}\n\n${prompt}` : prompt)
        }
        return React.createElement('div', { className: 'atelier-home-actions' },
          React.createElement('div', { className: 'atelier-home-tabs', role: 'tablist', 'aria-label': t('modes') },
            ['work', 'creative'].map((key) => React.createElement('button', {
              key, type: 'button', role: 'tab', 'aria-selected': mode === key,
              onClick: () => setMode(key)
            }, t(key)))
          ),
          React.createElement('div', { className: 'atelier-home-suggestions', 'aria-label': t('suggestions') },
            groups[mode].map((key) => React.createElement('button', {
              key, type: 'button', disabled: !inputActions,
              onClick: () => fill(key)
            }, t(key)))
          )
        )
      }

      ctx.slots.inject('sidebar.brand.mark', () =>
        ctx.slots.inject('sidebar.brand.name', () =>
          ctx.slots.inject('conversation.hero.presentation', () =>
            ctx.slots.inject('conversation.hero.suggestions', function* () {
              yield ctx.slots.register({ name: 'sidebar.brand.mark' }, AtelierMark)
              yield ctx.slots.register({ name: 'sidebar.brand.name' }, AtelierName)
              yield ctx.slots.register({ name: 'conversation.hero.presentation' }, AtelierHero)
              yield ctx.slots.register({ name: 'conversation.hero.suggestions', id: 'atelier-home-suggestions' }, AtelierSuggestions)
            })
          )
        )
      )
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  }
})
