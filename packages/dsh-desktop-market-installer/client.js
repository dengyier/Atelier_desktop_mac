window.__ModuleLoader__.load({
  id: 'dsh-desktop-market-installer',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')

    const NS = 'settings.desktopMarketInstaller'
    const STATUS_PATH = '/dsh-desktop/market-installer/status'
    const INSTALL_PATH = '/dsh-desktop/market-installer/install'
    const UNINSTALL_PATH = '/dsh-desktop/market-installer/uninstall'
    const MARKET_REPOSITORY = 'https://github.com/dsh-market/dsh-market'
    const MCP_DIRECTORY = 'https://github.com/dengyier/awesome-mcp-servers/blob/main/README.md'
    const MCP_CONNECTOR_PATH = '/dsh-desktop/mcp-connectors'
    const MCP_QUICK_INSTALL = {
      openMuseum: 'npx -y open-museum-mcp',
      travelArt: 'https://mcp.travel.art/',
      metMuseum: 'npx -y metmuseum-mcp'
    }
    const SHOW_PLUGIN_MARKET = false
    // MCP servers are not dsh-market plugin packages. Keep this directory separate
    // from the install state and link to each project's own setup instructions.
    const CREATIVE_MCP = [
      { id: 'openMuseum', name: 'Open Museum', category: 'art', url: 'https://github.com/cfpramod/open-museum-mcp' },
      { id: 'blender', name: 'Blender MCP', category: 'art', url: 'https://github.com/ahujasid/blender-mcp' },
      { id: 'travelArt', name: 'Travel Art', category: 'art', url: 'https://github.com/alexzavialov/travel-art-mcp' },
      { id: 'photopea', name: 'Photopea MCP', category: 'art', url: 'https://github.com/attalla1/photopea-mcp-server' },
      { id: 'metMuseum', name: 'Met Museum', category: 'art', url: 'https://github.com/mikechao/metmuseum-mcp' },
      { id: 'build123d', name: 'Build123d MCP', category: 'art', url: 'https://github.com/pzfreo/build123d-mcp' },
      { id: 'figwright', name: 'Figwright', category: 'design', url: 'https://github.com/awdr74100/figwright' },
      { id: 'brandkit', name: 'Brandkit MCP', category: 'design', url: 'https://github.com/ejwhite7/brandkit-mcp' },
      { id: 'excalidraw', name: 'Excalidraw Architect', category: 'design', url: 'https://github.com/BV-Venky/excalidraw-architect-mcp' },
      { id: 'motionlint', name: 'Motionlint', category: 'design', url: 'https://github.com/bobaba99/motionlint' },
      { id: 'flowzap', name: 'FlowZap MCP', category: 'design', url: 'https://github.com/flowzap-xyz/flowzap-mcp' },
      { id: 'saglitz', name: 'Saglitz Design', category: 'design', url: 'https://github.com/HalidSaglam/saglitzdesign-mcp' }
    ]

    const en = {
      nav: 'Plugin market',
      title: 'Plugin market',
      intro: 'Install dsh-market to browse, search, install, and manage community plugins inside DSH Desktop.',
      community: 'dsh-market is maintained by its community. Installing and using community plugins requires network access, and those plugins are not reviewed by DSH Desktop.',
      version: 'Recommended version',
      install: 'Install plugin market',
      installing: 'Installing plugin market…',
      installingHint: 'This can take a few minutes. Keep DSH Desktop open while pnpm downloads and configures the plugin.',
      installed: 'Plugin market installed',
      installedHint: 'Restart Harness once to load the complete market interface.',
      restart: 'Restart Harness',
      restarting: 'Restarting…',
      retry: 'Try again',
      incomplete: 'The previous installation is incomplete. Run the installer again to repair it.',
      failed: 'Plugin market could not be installed.',
      statusFailed: 'Could not read installation status.',
      repository: 'View dsh-market on GitHub',
      futureUpdates: 'After installation, dsh-market will notify you when its own updates are available.',
      managementTab: 'Plugin market',
      managementIntro: 'Manage the optional dsh-market integration installed by DSH Desktop.',
      installedVersion: 'Installed version',
      uninstall: 'Uninstall plugin market',
      uninstalling: 'Uninstalling plugin market…',
      uninstallingHint: 'Removing dsh-market from the web profile. Other plugins are not affected.',
      uninstallConfirmTitle: 'Uninstall plugin market?',
      uninstallConfirmDesc: 'Only dsh-market will be removed. Other plugins installed through the market will remain installed.',
      uninstallConfirmNote: 'Restart Harness after removal to finish unloading the market interface.',
      cancel: 'Cancel',
      removed: 'Plugin market uninstalled',
      removedHint: 'dsh-market has been removed. Restart Harness to finish.',
      uninstallFailed: 'Plugin market could not be uninstalled.',
      mcpTitle: 'MCP Connector Market',
      mcpIntro: 'Selected Art & Culture and Architecture & Design servers from awesome-mcp-servers. MCP servers use separate connection settings; these entries are not installed Harness plugins.',
      mcpSearch: 'Search MCP servers',
      mcpAll: 'All',
      mcpArt: 'Art & Culture',
      mcpDesign: 'Architecture & Design',
      mcpEmpty: 'No matching MCP servers.',
      mcpProject: 'View project and setup',
      mcpSource: 'View the full source directory',
      mcpNote: 'Check each project’s requirements and permissions before connecting it to an agent.',
      mcpInstall: 'Install', mcpInstalled: 'Configured', mcpInstalling: 'Installing…',
      mcpSetup: 'Set up MCP connector', mcpCancel: 'Cancel',
      mcpQuickSetup: 'Add the project’s published connection to the Atelier agent preset. Start a new conversation to verify its tools.',
      mcpManualSetup: 'Enter the MCP command or URL from the project guide. This adds it to the Atelier agent preset; verify the connection in a new conversation.',
      mcpTransport: 'Transport', mcpCommand: 'Executable command', mcpArgs: 'Arguments (JSON array)', mcpUrl: 'MCP URL',
      mcpConfiguredHint: 'Configured in the Atelier preset. Start a new conversation to connect and check tools.',
      mcp_openMuseum: 'Search and explore museum collections across institutions.',
      mcp_blender: 'Create and edit 3D scenes in Blender through MCP.',
      mcp_travelArt: 'Find art events and museum visitor guides.',
      mcp_photopea: 'Edit images and layered documents in Photopea.',
      mcp_metMuseum: 'Search the Metropolitan Museum of Art collection.',
      mcp_build123d: 'Build parametric 3D models and export CAD files.',
      mcp_figwright: 'Read and edit Figma designs through a local relay.',
      mcp_brandkit: 'Expose a brand’s design system to an agent.',
      mcp_excalidraw: 'Create and edit Excalidraw architecture diagrams.',
      mcp_motionlint: 'Check motion and animation quality on live pages.',
      mcp_flowzap: 'Create and validate workflow and architecture diagrams.',
      mcp_saglitz: 'Use sourced UI design guidance and token generators.'
    }

    const zh = {
      nav: '插件市场',
      title: '插件市场',
      intro: '安装 dsh-market，在 DSH Desktop 内浏览、搜索、安装并管理社区插件。',
      community: 'dsh-market 由社区维护。安装和使用社区插件需要联网，这些插件不由 DSH Desktop 审核。',
      version: '推荐版本',
      install: '安装插件市场',
      installing: '正在安装插件市场…',
      installingHint: '下载和配置可能需要几分钟，请保持 DSH Desktop 处于打开状态。',
      installed: '插件市场已安装',
      installedHint: '重启一次 Harness，即可加载完整的插件市场界面。',
      restart: '重启 Harness',
      restarting: '正在重启…',
      retry: '重试',
      incomplete: '上一次安装没有完成，请重新运行安装以修复。',
      failed: '插件市场安装失败。',
      statusFailed: '无法读取安装状态。',
      repository: '在 GitHub 查看 dsh-market',
      futureUpdates: '安装后，dsh-market 会在有新版本时提示并提供升级。',
      managementTab: '插件市场',
      managementIntro: '管理由 DSH Desktop 安装的可选 dsh-market 集成。',
      installedVersion: '当前版本',
      uninstall: '卸载插件市场',
      uninstalling: '正在卸载插件市场…',
      uninstallingHint: '正在从 web profile 中移除 dsh-market，其他插件不会受到影响。',
      uninstallConfirmTitle: '卸载插件市场？',
      uninstallConfirmDesc: '只会移除 dsh-market。通过插件市场安装的其他插件将继续保留。',
      uninstallConfirmNote: '移除完成后需要重启 Harness，插件市场界面才会完全退出。',
      cancel: '取消',
      removed: '插件市场已卸载',
      removedHint: 'dsh-market 已移除，请重启 Harness 完成卸载。',
      uninstallFailed: '插件市场卸载失败。',
      mcpTitle: 'MCP 连接器市场',
      mcpIntro: '精选自 awesome-mcp-servers 的“艺术与文化”“建筑与设计”目录。MCP 服务需要单独配置连接，这些条目不是已安装的 Harness 插件。',
      mcpSearch: '搜索 MCP 服务',
      mcpAll: '全部',
      mcpArt: '艺术与文化',
      mcpDesign: '建筑与设计',
      mcpEmpty: '没有匹配的 MCP 服务。',
      mcpProject: '查看项目与接入说明',
      mcpSource: '查看完整来源目录',
      mcpNote: '连接 Agent 前，请核对各项目的环境要求与权限。',
      mcpInstall: '安装', mcpInstalled: '已配置', mcpInstalling: '安装中…',
      mcpSetup: '配置 MCP 连接器', mcpCancel: '取消',
      mcpQuickSetup: '将项目公布的连接方式写入 Atelier Agent 预设。请新建会话核实工具是否可用。',
      mcpManualSetup: '请根据项目接入说明填写 MCP 命令或地址。配置会写入 Atelier Agent 预设；请在新会话中核实连接。',
      mcpTransport: '传输方式', mcpCommand: '可执行命令', mcpArgs: '参数（JSON 字符串数组）', mcpUrl: 'MCP 地址',
      mcpConfiguredHint: '已配置到 Atelier 预设。请新建会话以连接并核实工具。',
      mcp_openMuseum: '跨机构检索和浏览博物馆藏品。',
      mcp_blender: '通过 MCP 创建和编辑 Blender 三维场景。',
      mcp_travelArt: '查找艺术活动和博物馆参观指南。',
      mcp_photopea: '在 Photopea 中编辑图像和分层文档。',
      mcp_metMuseum: '检索大都会艺术博物馆藏品。',
      mcp_build123d: '构建参数化三维模型并导出 CAD 文件。',
      mcp_figwright: '通过本地桥接读取和编辑 Figma 设计。',
      mcp_brandkit: '向 Agent 提供品牌设计系统资料。',
      mcp_excalidraw: '创建和编辑 Excalidraw 架构图。',
      mcp_motionlint: '检查页面动效与动画质量。',
      mcp_flowzap: '创建和验证工作流及架构图。',
      mcp_saglitz: '提供有出处的界面设计知识与设计变量生成工具。'
    }

    const fr = {
      nav: 'Marché des extensions',
      title: 'Marché des extensions',
      intro: 'Installez dsh-market pour découvrir, rechercher, installer et gérer les extensions de la communauté dans Atelier Desktop.',
      community: 'dsh-market est maintenu par sa communauté. Ses extensions nécessitent un accès réseau et ne sont pas vérifiées par Atelier Desktop.',
      version: 'Version recommandée',
      install: 'Installer le marché',
      installing: 'Installation du marché…',
      installingHint: 'Le téléchargement et la configuration peuvent prendre quelques minutes. Gardez Atelier Desktop ouvert.',
      installed: 'Marché installé',
      installedHint: 'Redémarrez Harness pour charger toute l’interface du marché.',
      restart: 'Redémarrer Harness',
      restarting: 'Redémarrage…',
      retry: 'Réessayer',
      incomplete: 'L’installation précédente est incomplète. Relancez-la pour la réparer.',
      failed: 'Impossible d’installer le marché.',
      statusFailed: 'Impossible de lire l’état de l’installation.',
      repository: 'Voir dsh-market sur GitHub',
      futureUpdates: 'Après l’installation, dsh-market vous signalera ses mises à jour.',
      managementTab: 'Marché des extensions',
      managementIntro: 'Gérez l’intégration facultative de dsh-market installée par Atelier Desktop.',
      installedVersion: 'Version installée',
      uninstall: 'Désinstaller le marché',
      uninstalling: 'Désinstallation du marché…',
      uninstallingHint: 'Suppression de dsh-market du profil web. Les autres extensions ne sont pas affectées.',
      uninstallConfirmTitle: 'Désinstaller le marché ?',
      uninstallConfirmDesc: 'Seul dsh-market sera supprimé. Les autres extensions installées depuis le marché resteront en place.',
      uninstallConfirmNote: 'Redémarrez Harness après la suppression pour fermer son interface.',
      cancel: 'Annuler',
      removed: 'Marché désinstallé',
      removedHint: 'dsh-market a été supprimé. Redémarrez Harness pour terminer.',
      uninstallFailed: 'Impossible de désinstaller le marché.',
      mcpTitle: 'Marché des connecteurs MCP',
      mcpIntro: 'Sélection de serveurs Art et culture et Architecture et design issus d’awesome-mcp-servers. Les serveurs MCP se configurent séparément : ils ne sont pas des extensions Harness installées.',
      mcpSearch: 'Rechercher des serveurs MCP',
      mcpAll: 'Tout',
      mcpArt: 'Art et culture',
      mcpDesign: 'Architecture et design',
      mcpEmpty: 'Aucun serveur MCP correspondant.',
      mcpProject: 'Voir le projet et son installation',
      mcpSource: 'Voir l’annuaire complet',
      mcpNote: 'Vérifiez les prérequis et les autorisations de chaque projet avant de le connecter à un agent.',
      mcpInstall: 'Installer', mcpInstalled: 'Configuré', mcpInstalling: 'Installation…',
      mcpSetup: 'Configurer le connecteur MCP', mcpCancel: 'Annuler',
      mcpQuickSetup: 'Ajoute la connexion publiée par le projet au preset Agent Atelier. Ouvrez une nouvelle conversation pour vérifier les outils.',
      mcpManualSetup: 'Saisissez la commande ou l’URL MCP du guide du projet. La connexion sera ajoutée au preset Agent Atelier ; vérifiez-la dans une nouvelle conversation.',
      mcpTransport: 'Transport', mcpCommand: 'Commande exécutable', mcpArgs: 'Arguments (tableau JSON)', mcpUrl: 'URL MCP',
      mcpConfiguredHint: 'Configuré dans le preset Atelier. Ouvrez une nouvelle conversation pour vérifier la connexion et les outils.',
      mcp_openMuseum: 'Rechercher et explorer les collections de plusieurs musées.',
      mcp_blender: 'Créer et modifier des scènes 3D dans Blender via MCP.',
      mcp_travelArt: 'Trouver des événements artistiques et des guides de visite de musées.',
      mcp_photopea: 'Modifier des images et des documents à calques dans Photopea.',
      mcp_metMuseum: 'Rechercher dans les collections du Metropolitan Museum of Art.',
      mcp_build123d: 'Construire des modèles 3D paramétriques et exporter des fichiers CAO.',
      mcp_figwright: 'Lire et modifier des créations Figma via un relais local.',
      mcp_brandkit: 'Mettre un système de design de marque à la disposition d’un agent.',
      mcp_excalidraw: 'Créer et modifier des schémas d’architecture Excalidraw.',
      mcp_motionlint: 'Contrôler la qualité des animations sur des pages en ligne.',
      mcp_flowzap: 'Créer et valider des diagrammes de flux et d’architecture.',
      mcp_saglitz: 'Fournir des conseils de conception d’interface sourcés et des générateurs de variables.'
    }

    const css = `
      .dshDesktopMarketSection{box-sizing:border-box;max-width:720px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:16px}
      .dshDesktopMarketTitle{margin:0;font-size:20px;font-weight:600;line-height:30px}
      .dshDesktopMarketIntro{margin:0;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:22px}
      .dshDesktopMarketCard{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:18px}
      .dshDesktopMarketMark{width:46px;height:46px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);display:grid;grid-template-columns:repeat(2,10px);grid-auto-rows:10px;place-content:center;gap:4px}
      .dshDesktopMarketMark span{display:block;border-radius:3px;background:var(--dsw-alias-label-primary)}
      .dshDesktopMarketMark span:nth-child(4){opacity:.28}
      .dshDesktopMarketHead{display:flex;align-items:flex-start;gap:14px}
      .dshDesktopMarketIdentity{min-width:0;display:flex;flex-direction:column;gap:3px}
      .dshDesktopMarketName{font-size:16px;font-weight:600;line-height:24px}
      .dshDesktopMarketVersion{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
      .dshDesktopMarketNotice{margin:0;padding-top:16px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:19px}
      .dshDesktopMarketStatus{display:flex;flex-direction:column;gap:5px}
      .dshDesktopMarketStatusTitle{font-size:14px;font-weight:600;line-height:22px}
      .dshDesktopMarketStatusDetail{margin:0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;overflow-wrap:anywhere}
      .dshDesktopMarketActions{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
      .dshDesktopMarketButton{box-sizing:border-box;height:36px;padding:0 16px;border:1px solid transparent;border-radius:18px;font:inherit;font-size:14px;font-weight:500;cursor:pointer}
      .dshDesktopMarketPrimary{color:var(--dsw-alias-label-primary-foreground);background:var(--dsw-alias-button-primary-fill)}
      .dshDesktopMarketPrimary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
      .dshDesktopMarketSecondary{color:var(--dsw-alias-label-primary);background:transparent;border-color:var(--dsw-alias-border-l3)}
      .dshDesktopMarketSecondary:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
      .dshDesktopMarketButton:disabled{cursor:default;opacity:.5}
      .dshDesktopMarketButton:focus-visible,.dshDesktopMarketLink:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
      .dshDesktopMarketLink{color:var(--dsw-alias-label-secondary);border-radius:6px;padding:5px 4px;font-size:13px;line-height:20px;text-decoration:none}
      .dshDesktopMarketLink:hover{color:var(--dsw-alias-label-primary);text-decoration:underline}
      .dshDesktopMarketSpinner{box-sizing:border-box;width:16px;height:16px;border:2px solid var(--dsw-alias-border-l2);border-top-color:var(--dsw-alias-label-primary);border-radius:50%;animation:dshDesktopMarketSpin .75s linear infinite}
      .dshDesktopMarketBusy{display:flex;align-items:center;gap:9px}
      .dshDesktopMarketError{color:var(--dsw-alias-state-error-primary)}
      .dshDesktopMarketModalBackdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.42)}
      .dshDesktopMarketModal{box-sizing:border-box;width:min(440px,100%);padding:24px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 18px 48px rgba(0,0,0,.18);display:flex;flex-direction:column;gap:12px}
      .dshDesktopMarketModalTitle{margin:0;font-size:18px;font-weight:600;line-height:26px}
      .dshDesktopMarketModalText{margin:0;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:22px}
      .dshDesktopMarketModalNote{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:19px}
      .dshDesktopMarketModalActions{display:flex;justify-content:flex-end;gap:10px;padding-top:8px}
      .dshDesktopMcpDirectory{display:flex;flex-direction:column;gap:14px}
      .dshDesktopMcpHeading{margin:0;font-size:18px;font-weight:600;line-height:26px}
      .dshDesktopMcpControls{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
      .dshDesktopMcpSearch{box-sizing:border-box;min-width:180px;flex:1;height:36px;padding:0 12px;border:1px solid var(--dsw-alias-border-l3);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
      .dshDesktopMcpSearch:focus-visible,.dshDesktopMcpFilter:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
      .dshDesktopMcpFilters{display:flex;flex-wrap:wrap;gap:5px}
      .dshDesktopMcpFilter{min-height:34px;padding:5px 10px;border:1px solid var(--dsw-alias-border-l3);border-radius:18px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}
      .dshDesktopMcpFilter[aria-pressed="true"]{background:var(--dsw-alias-button-primary-fill);border-color:transparent;color:var(--dsw-alias-label-primary-foreground)}
      .dshDesktopMcpGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,245px),1fr));gap:10px}
      .dshDesktopMcpCard{box-sizing:border-box;min-width:0;padding:14px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-module-platform);display:flex;flex-direction:column;gap:8px}
      .dshDesktopMcpCardName{font-size:14px;font-weight:600;line-height:20px;overflow-wrap:anywhere}
      .dshDesktopMcpCardHeader{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .dshDesktopMcpInstall{flex:none;min-height:30px;padding:3px 10px;border:0;border-radius:8px;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:12px;cursor:pointer}
      .dshDesktopMcpInstall:disabled{opacity:.6;cursor:default}
      .dshDesktopMcpField{display:flex;flex-direction:column;gap:5px;font-size:12px}
      .dshDesktopMcpField input,.dshDesktopMcpField select{box-sizing:border-box;width:100%;min-height:34px;padding:5px 8px;border:1px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit}
      .dshDesktopMcpCardDescription{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:19px;flex:1}
      .dshDesktopMcpCardLink{align-self:flex-start;color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px;text-decoration:underline;text-underline-offset:2px}
      .dshDesktopMcpCardLink:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:2px}
      @keyframes dshDesktopMarketSpin{to{transform:rotate(360deg)}}
      @media (prefers-reduced-motion:reduce){.dshDesktopMarketSpinner{animation:none}}
    `

    function installStyles() {
      if (document.querySelector('style[data-plugin-css="dsh-desktop-market-installer"]')) return
      const style = document.createElement('style')
      style.dataset.plugin = 'dsh-desktop-market-installer'
      style.dataset.pluginCss = 'dsh-desktop-market-installer'
      style.textContent = css
      document.head.appendChild(style)
    }

    function marketAlreadyComposed() {
      const entries = globalThis.__DSH_BOOT__?.entries
      return Array.isArray(entries) && entries.some((entry) => entry?.id === 'dshmarket')
    }

    function CreativeMcpDirectory({ t }) {
      const [category, setCategory] = React.useState('all')
      const [query, setQuery] = React.useState('')
      const [configured, setConfigured] = React.useState({})
      const [selected, setSelected] = React.useState(null)
      const [transport, setTransport] = React.useState('stdio')
      const [command, setCommand] = React.useState('')
      const [args, setArgs] = React.useState('[]')
      const [url, setUrl] = React.useState('')
      const [saving, setSaving] = React.useState(false)
      const [error, setError] = React.useState('')
      React.useEffect(() => {
        let active = true
        fetch(MCP_CONNECTOR_PATH, { credentials: 'same-origin', cache: 'no-store' })
          .then(async (response) => {
            const payload = await response.json()
            if (!response.ok) throw new Error(payload?.error || `HTTP ${response.status}`)
            if (active) setConfigured(payload.connectors || {})
          })
          .catch((cause) => { if (active) setError(cause.message) })
        return () => { active = false }
      }, [])
      const beginInstall = (item) => {
        setSelected(item)
        setTransport('stdio')
        setCommand('')
        setArgs('[]')
        setUrl('')
        setError('')
      }
      const install = async () => {
        if (!selected || saving) return
        setSaving(true)
        setError('')
        try {
          const input = MCP_QUICK_INSTALL[selected.id]
            ? { id: selected.id }
            : { id: selected.id, config: transport === 'stdio'
                ? { transport, command, args: JSON.parse(args) }
                : { transport, url } }
          const response = await fetch(MCP_CONNECTOR_PATH, {
            method: 'POST', credentials: 'same-origin',
            headers: { 'content-type': 'application/json' }, body: JSON.stringify(input)
          })
          const payload = await response.json()
          if (!response.ok) throw new Error(payload?.error || `HTTP ${response.status}`)
          setConfigured((current) => ({ ...current, [selected.id]: true }))
          setSelected(null)
        } catch (cause) {
          setError(cause.message)
        } finally {
          setSaving(false)
        }
      }
      const needle = query.trim().toLocaleLowerCase()
      const visible = CREATIVE_MCP.filter((item) =>
        (category === 'all' || item.category === category) &&
        (!needle || `${item.name} ${t(`mcp_${item.id}`)}`.toLocaleLowerCase().includes(needle))
      )

      return React.createElement(
        'section',
        { className: 'dshDesktopMcpDirectory', 'aria-label': t('mcpTitle') },
        React.createElement('h3', { className: 'dshDesktopMcpHeading' }, t('mcpTitle')),
        React.createElement('p', { className: 'dshDesktopMarketIntro' }, t('mcpIntro')),
        React.createElement(
          'div',
          { className: 'dshDesktopMcpControls' },
          React.createElement('input', {
            className: 'dshDesktopMcpSearch',
            type: 'search',
            value: query,
            onChange: (event) => setQuery(event.target.value),
            placeholder: t('mcpSearch'),
            'aria-label': t('mcpSearch')
          }),
          React.createElement(
            'div',
            { className: 'dshDesktopMcpFilters', role: 'group', 'aria-label': t('mcpTitle') },
            [['all', 'mcpAll'], ['art', 'mcpArt'], ['design', 'mcpDesign']].map(([id, key]) =>
              React.createElement('button', {
                key: id,
                type: 'button',
                className: 'dshDesktopMcpFilter',
                'aria-pressed': category === id,
                onClick: () => setCategory(id)
              }, t(key))
            )
          )
        ),
        visible.length
          ? React.createElement('div', { className: 'dshDesktopMcpGrid' }, visible.map((item) =>
              React.createElement(
                'article',
                { key: item.id, className: 'dshDesktopMcpCard' },
                React.createElement('div', { className: 'dshDesktopMcpCardHeader' },
                  React.createElement('span', { className: 'dshDesktopMcpCardName' }, item.name),
                  React.createElement('button', {
                    type: 'button', className: 'dshDesktopMcpInstall',
                    disabled: Boolean(configured[item.id]),
                    onClick: () => beginInstall(item)
                  }, t(configured[item.id] ? 'mcpInstalled' : 'mcpInstall'))
                ),
                React.createElement('p', { className: 'dshDesktopMcpCardDescription' }, t(`mcp_${item.id}`)),
                React.createElement('a', {
                  className: 'dshDesktopMcpCardLink',
                  href: item.url,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }, t('mcpProject'))
              )
            ))
          : React.createElement('p', { className: 'dshDesktopMarketIntro', role: 'status' }, t('mcpEmpty')),
        selected && React.createElement('div', { className: 'dshDesktopMarketModalBackdrop', role: 'presentation' },
          React.createElement('div', { className: 'dshDesktopMarketModal', role: 'dialog', 'aria-modal': true, 'aria-label': t('mcpSetup') },
            React.createElement('h4', { className: 'dshDesktopMarketModalTitle' }, `${t('mcpSetup')} · ${selected.name}`),
            React.createElement('p', { className: 'dshDesktopMarketModalText' }, t(MCP_QUICK_INSTALL[selected.id] ? 'mcpQuickSetup' : 'mcpManualSetup')),
            MCP_QUICK_INSTALL[selected.id]
              ? React.createElement('code', null, MCP_QUICK_INSTALL[selected.id])
              : React.createElement(React.Fragment, null,
                  React.createElement('label', { className: 'dshDesktopMcpField' }, t('mcpTransport'),
                    React.createElement('select', { value: transport, onChange: (event) => setTransport(event.target.value) },
                      React.createElement('option', { value: 'stdio' }, 'stdio'),
                      React.createElement('option', { value: 'streamable-http' }, 'Streamable HTTP'))),
                  transport === 'stdio'
                    ? React.createElement(React.Fragment, null,
                        React.createElement('label', { className: 'dshDesktopMcpField' }, t('mcpCommand'),
                          React.createElement('input', { value: command, onChange: (event) => setCommand(event.target.value) })),
                        React.createElement('label', { className: 'dshDesktopMcpField' }, t('mcpArgs'),
                          React.createElement('input', { value: args, onChange: (event) => setArgs(event.target.value) })))
                    : React.createElement('label', { className: 'dshDesktopMcpField' }, t('mcpUrl'),
                        React.createElement('input', { value: url, onChange: (event) => setUrl(event.target.value) }))),
            error && React.createElement('p', { className: 'dshDesktopMarketError', role: 'alert' }, error),
            React.createElement('div', { className: 'dshDesktopMarketModalActions' },
              React.createElement('button', { type: 'button', className: 'dshDesktopMarketButton dshDesktopMarketSecondary', disabled: saving, onClick: () => setSelected(null) }, t('mcpCancel')),
              React.createElement('button', { type: 'button', className: 'dshDesktopMarketButton dshDesktopMarketPrimary', disabled: saving, onClick: install }, t(saving ? 'mcpInstalling' : 'mcpInstall')))
          )
        ),
        React.createElement('p', { className: 'dshDesktopMarketNotice' }, t('mcpNote')),
        Object.values(configured).some(Boolean) && React.createElement('p', { className: 'dshDesktopMarketNotice' }, t('mcpConfiguredHint')),
        React.createElement('a', {
          className: 'dshDesktopMarketLink',
          href: category === 'all'
            ? MCP_DIRECTORY
            : `${MCP_DIRECTORY}#${category === 'art' ? 'art-and-culture' : 'architecture-and-design'}`,
          target: '_blank',
          rel: 'noopener noreferrer'
        }, t('mcpSource'))
      )
    }

    async function readStatus() {
      const response = await fetch(STATUS_PATH, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store'
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || `HTTP ${response.status}`)
      return payload
    }

    function UninstallConfirm({ t, busy, onCancel, onConfirm }) {
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key === 'Escape' && !busy) onCancel()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [busy, onCancel])

      return React.createElement(
        'div',
        {
          className: 'dshDesktopMarketModalBackdrop',
          role: 'presentation',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) onCancel()
          }
        },
        React.createElement(
          'div',
          {
            className: 'dshDesktopMarketModal',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'dsh-desktop-market-uninstall-title'
          },
          React.createElement(
            'h3',
            {
              id: 'dsh-desktop-market-uninstall-title',
              className: 'dshDesktopMarketModalTitle'
            },
            t('uninstallConfirmTitle')
          ),
          React.createElement(
            'p',
            { className: 'dshDesktopMarketModalText' },
            t('uninstallConfirmDesc')
          ),
          React.createElement(
            'p',
            { className: 'dshDesktopMarketModalNote' },
            t('uninstallConfirmNote')
          ),
          React.createElement(
            'div',
            { className: 'dshDesktopMarketModalActions' },
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'dshDesktopMarketButton dshDesktopMarketSecondary',
                disabled: busy,
                onClick: onCancel
              },
              t('cancel')
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'dshDesktopMarketButton dshDesktopMarketPrimary',
                disabled: busy,
                onClick: onConfirm,
                autoFocus: true
              },
              busy ? t('uninstalling') : t('uninstall')
            )
          )
        )
      )
    }

    function MarketManagementTab({ t }) {
      const [status, setStatus] = React.useState()
      const [error, setError] = React.useState()
      const [confirming, setConfirming] = React.useState(false)
      const [restarting, setRestarting] = React.useState(false)

      React.useEffect(() => {
        let disposed = false
        const load = async () => {
          try {
            const next = await readStatus()
            if (disposed) return
            setStatus(next)
            setError(undefined)
          } catch (failure) {
            if (!disposed) setError(failure instanceof Error ? failure.message : String(failure))
          }
        }
        void load()
        return () => {
          disposed = true
        }
      }, [])

      React.useEffect(() => {
        if (status?.phase !== 'uninstalling') return
        let disposed = false
        let timer
        const poll = async () => {
          try {
            const next = await readStatus()
            if (disposed) return
            setStatus(next)
            setError(undefined)
            if (next.phase === 'uninstalling') timer = setTimeout(poll, 850)
            else setConfirming(false)
          } catch (failure) {
            if (disposed) return
            setError(failure instanceof Error ? failure.message : String(failure))
            timer = setTimeout(poll, 1_500)
          }
        }
        timer = setTimeout(poll, 850)
        return () => {
          disposed = true
          clearTimeout(timer)
        }
      }, [status?.phase])

      const uninstall = async () => {
        setError(undefined)
        setStatus((current) => ({ ...current, phase: 'uninstalling' }))
        try {
          const bridge = globalThis.dshDesktop
          if (bridge && typeof bridge.uninstallMarket === 'function') {
            await bridge.uninstallMarket()
            return
          }
          const response = await fetch(UNINSTALL_PATH, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { accept: 'application/json' }
          })
          const payload = await response.json()
          if (!response.ok && response.status !== 409) {
            throw new Error(payload?.error || `HTTP ${response.status}`)
          }
          setStatus(payload)
          if (payload.phase !== 'uninstalling') setConfirming(false)
        } catch (failure) {
          setConfirming(false)
          setError(failure instanceof Error ? failure.message : String(failure))
        }
      }

      const restart = async () => {
        const bridge = globalThis.dshDesktop
        if (!bridge || typeof bridge.restartHarness !== 'function') {
          setError('Harness > Restart Harness')
          return
        }
        setRestarting(true)
        setError(undefined)
        try {
          await bridge.restartHarness()
        } catch (failure) {
          setRestarting(false)
          setError(failure instanceof Error ? failure.message : String(failure))
        }
      }

      const phase = status?.phase
      const uninstalling = phase === 'uninstalling'
      const removed = phase === 'uninstalled' || phase === 'absent'
      const failed = phase === 'error' || phase === 'incomplete' || Boolean(error)
      const installedVersion = status?.installedVersion || status?.dependency

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'section',
          { className: 'dshDesktopMarketSection' },
          React.createElement('h2', { className: 'dshDesktopMarketTitle' }, t('title')),
          React.createElement('p', { className: 'dshDesktopMarketIntro' }, t('managementIntro')),
          React.createElement(
            'div',
            { className: 'dshDesktopMarketCard' },
            React.createElement(
              'div',
              { className: 'dshDesktopMarketHead' },
              React.createElement(
                'div',
                { className: 'dshDesktopMarketMark', 'aria-hidden': 'true' },
                React.createElement('span'),
                React.createElement('span'),
                React.createElement('span'),
                React.createElement('span')
              ),
              React.createElement(
                'div',
                { className: 'dshDesktopMarketIdentity' },
                React.createElement('span', { className: 'dshDesktopMarketName' }, 'dsh-market'),
                installedVersion
                  ? React.createElement(
                      'span',
                      { className: 'dshDesktopMarketVersion' },
                      `${t('installedVersion')} · ${installedVersion}`
                    )
                  : null
              )
            ),
            uninstalling
              ? React.createElement(
                  'div',
                  { className: 'dshDesktopMarketStatus' },
                  React.createElement(
                    'div',
                    { className: 'dshDesktopMarketBusy' },
                    React.createElement('span', {
                      className: 'dshDesktopMarketSpinner',
                      'aria-hidden': 'true'
                    }),
                    React.createElement(
                      'span',
                      { className: 'dshDesktopMarketStatusTitle' },
                      t('uninstalling')
                    )
                  ),
                  React.createElement(
                    'p',
                    { className: 'dshDesktopMarketStatusDetail' },
                    status?.detail || t('uninstallingHint')
                  )
                )
              : removed
                ? React.createElement(
                    'div',
                    { className: 'dshDesktopMarketStatus' },
                    React.createElement(
                      'span',
                      { className: 'dshDesktopMarketStatusTitle' },
                      t('removed')
                    ),
                    React.createElement(
                      'p',
                      { className: 'dshDesktopMarketStatusDetail' },
                      t('removedHint')
                    )
                  )
                : failed
                  ? React.createElement(
                      'div',
                      { className: 'dshDesktopMarketStatus' },
                      React.createElement(
                        'span',
                        { className: 'dshDesktopMarketStatusTitle dshDesktopMarketError' },
                        t('uninstallFailed')
                      ),
                      error || status?.detail
                        ? React.createElement(
                            'p',
                            { className: 'dshDesktopMarketStatusDetail dshDesktopMarketError' },
                            error || status?.detail
                          )
                        : null
                    )
                  : null,
            React.createElement(
              'div',
              { className: 'dshDesktopMarketActions' },
              removed
                ? React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'dshDesktopMarketButton dshDesktopMarketPrimary',
                      disabled: restarting,
                      onClick: () => void restart()
                    },
                    restarting ? t('restarting') : t('restart')
                  )
                : React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'dshDesktopMarketButton dshDesktopMarketSecondary',
                      disabled: uninstalling || !status,
                      onClick: () => setConfirming(true)
                    },
                    t('uninstall')
                  ),
              React.createElement(
                'a',
                {
                  className: 'dshDesktopMarketLink',
                  href: MARKET_REPOSITORY,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                t('repository')
              )
            ),
            React.createElement('p', { className: 'dshDesktopMarketNotice' }, t('futureUpdates'))
          )
        ),
        confirming
          ? React.createElement(UninstallConfirm, {
              t,
              busy: uninstalling,
              onCancel: () => setConfirming(false),
              onConfirm: () => void uninstall()
            })
          : null
      )
    }

    function MarketInstallerSection({ t }) {
      const [status, setStatus] = React.useState()
      const [error, setError] = React.useState()
      const [restarting, setRestarting] = React.useState(false)

      React.useEffect(() => {
        let disposed = false
        const load = async () => {
          try {
            const next = await readStatus()
            if (disposed) return
            setStatus(next)
            setError(undefined)
          } catch (failure) {
            if (!disposed) setError(failure instanceof Error ? failure.message : String(failure))
          }
        }
        void load()
        return () => {
          disposed = true
        }
      }, [])

      React.useEffect(() => {
        if (status?.phase !== 'installing') return
        let disposed = false
        let timer
        const poll = async () => {
          try {
            const next = await readStatus()
            if (disposed) return
            setStatus(next)
            setError(undefined)
            if (next.phase === 'installing') timer = setTimeout(poll, 850)
          } catch (failure) {
            if (disposed) return
            setError(failure instanceof Error ? failure.message : String(failure))
            timer = setTimeout(poll, 1_500)
          }
        }
        timer = setTimeout(poll, 850)
        return () => {
          disposed = true
          clearTimeout(timer)
        }
      }, [status?.phase])

      const install = async () => {
        setError(undefined)
        setStatus((current) => ({
          ...current,
          phase: 'installing',
          recommendedVersion: current?.recommendedVersion || 'latest'
        }))
        try {
          const response = await fetch(INSTALL_PATH, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { accept: 'application/json' }
          })
          const payload = await response.json()
          if (!response.ok && response.status !== 409) {
            throw new Error(payload?.error || `HTTP ${response.status}`)
          }
          setStatus(payload)
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : String(failure))
        }
      }

      const restart = async () => {
        const bridge = globalThis.dshDesktop
        if (!bridge || typeof bridge.restartHarness !== 'function') {
          setError('Harness > Restart Harness')
          return
        }
        setRestarting(true)
        setError(undefined)
        try {
          await bridge.restartHarness()
        } catch (failure) {
          setRestarting(false)
          setError(failure instanceof Error ? failure.message : String(failure))
        }
      }

      const phase = status?.phase
      const busy = phase === 'installing'
      const installed = phase === 'installed'
      const failed = phase === 'error' || phase === 'incomplete' || Boolean(error)
      const version = status?.recommendedVersion || 'latest'

      return React.createElement(
        'section',
        { className: 'dshDesktopMarketSection' },
        React.createElement('h2', { className: 'dshDesktopMarketTitle' }, t('title')),
        React.createElement('p', { className: 'dshDesktopMarketIntro' }, t('intro')),
        React.createElement(
          'div',
          { className: 'dshDesktopMarketCard' },
          React.createElement(
            'div',
            { className: 'dshDesktopMarketHead' },
            React.createElement(
              'div',
              { className: 'dshDesktopMarketMark', 'aria-hidden': 'true' },
              React.createElement('span'),
              React.createElement('span'),
              React.createElement('span'),
              React.createElement('span')
            ),
            React.createElement(
              'div',
              { className: 'dshDesktopMarketIdentity' },
              React.createElement('span', { className: 'dshDesktopMarketName' }, 'dsh-market'),
              React.createElement(
                'span',
                { className: 'dshDesktopMarketVersion' },
                `${t('version')} · ${version}`
              )
            )
          ),
          busy
            ? React.createElement(
                'div',
                { className: 'dshDesktopMarketStatus' },
                React.createElement(
                  'div',
                  { className: 'dshDesktopMarketBusy' },
                  React.createElement('span', {
                    className: 'dshDesktopMarketSpinner',
                    'aria-hidden': 'true'
                  }),
                  React.createElement(
                    'span',
                    { className: 'dshDesktopMarketStatusTitle' },
                    t('installing')
                  )
                ),
                React.createElement(
                  'p',
                  { className: 'dshDesktopMarketStatusDetail' },
                  status?.detail || t('installingHint')
                )
              )
            : installed
              ? React.createElement(
                  'div',
                  { className: 'dshDesktopMarketStatus' },
                  React.createElement(
                    'span',
                    { className: 'dshDesktopMarketStatusTitle' },
                    t('installed')
                  ),
                  React.createElement(
                    'p',
                    { className: 'dshDesktopMarketStatusDetail' },
                    t('installedHint')
                  )
                )
              : failed
                ? React.createElement(
                    'div',
                    { className: 'dshDesktopMarketStatus' },
                    React.createElement(
                      'span',
                      { className: 'dshDesktopMarketStatusTitle dshDesktopMarketError' },
                      phase === 'incomplete' ? t('incomplete') : t('failed')
                    ),
                    error || status?.detail
                      ? React.createElement(
                          'p',
                          { className: 'dshDesktopMarketStatusDetail dshDesktopMarketError' },
                          error || status?.detail
                        )
                      : null
                  )
                : null,
          React.createElement(
            'div',
            { className: 'dshDesktopMarketActions' },
            installed
              ? React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'dshDesktopMarketButton dshDesktopMarketPrimary',
                    disabled: restarting,
                    onClick: () => void restart()
                  },
                  restarting ? t('restarting') : t('restart')
                )
              : React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'dshDesktopMarketButton dshDesktopMarketPrimary',
                    disabled: busy || (!status && !error),
                    onClick: () => void install()
                  },
                  failed ? t('retry') : t('install')
                ),
            React.createElement(
              'a',
              {
                className: 'dshDesktopMarketLink',
                href: MARKET_REPOSITORY,
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              t('repository')
            )
          ),
          React.createElement('p', { className: 'dshDesktopMarketNotice' }, t('community')),
          React.createElement('p', { className: 'dshDesktopMarketNotice' }, t('futureUpdates'))
        )
      )
    }

    const inject = ['slots', 'locale']
    function apply(ctx) {
      installStyles()
      ctx.effect(
        () => ctx.locale.register(NS, { zh, en, fr }),
        'dsh-desktop-market-installer: copy dictionaries'
      )
      const t = ctx.locale.bind(NS)
      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          {
            name: 'settings.section',
            id: 'mcp-connector-market',
            order: 41,
            label: () => t('mcpTitle'),
            inject: () => ({ t })
          },
          CreativeMcpDirectory
        )
      )
      // dsh-market exposes a supported visibility switch; preserve the installed plugin.
      ctx.inject(['market'], (scope) => scope.effect(() => {
        scope.market.setSettingsVisible(false)
        return () => scope.market.setSettingsVisible(true)
      }, 'dsh-desktop-market-installer: hide plugin market section'))
      if (!SHOW_PLUGIN_MARKET) return
      if (marketAlreadyComposed()) {
        ctx.slots.inject('settings.plugins.tab', () =>
          ctx.slots.register(
            {
              name: 'settings.plugins.tab',
              id: 'desktop-market-management',
              order: 30,
              label: () => t('managementTab'),
              inject: () => ({ t })
            },
            MarketManagementTab
          )
        )
        return
      }
      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          {
            name: 'settings.section',
            id: 'market',
            order: 40,
            label: () => t('nav'),
            inject: () => ({ t })
          },
          MarketInstallerSection
        )
      )
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  }
})
