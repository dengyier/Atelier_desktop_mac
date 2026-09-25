# Atelier Desktop

**把艺术创作与 AI 工具放进同一个本地工作区。** Atelier Desktop 是面向 macOS 的桌面预览版，帮助你从艺术命题出发，完成资料研究、可编辑创作文件和视觉检查。项目基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 与采用 MIT 许可的 [DSH Desktop](https://github.com/dataelement/dsh-desktop) 桌面宿主开发；Atelier 维护自己的品牌、创作预设、界面和独立用户数据。

[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md)

## 当前预览版包含什么

- **艺术与 3D 创作**：新会话默认使用 Atelier 创作模式，内置 Blender 工作流 Skill 和 `mcp-for-blender` 连接配置。适合装置、几何雕塑、展陈场景等任务；Blender 与对应插件仍需单独安装。
- **日常办公**：文档处理、数据分析与可视化、会议纪要、研究报告、幻灯片等按钮会将可编辑提示词填入输入框，不会自动提交任务。
- **可核对的文件**：3D 工作流要求保存可编辑项目并检查渲染视图。只在回复中出现文件名，不代表文件已生成、可打开或已完成验收。
- **模型与工具**：在应用中配置模型提供方。MCP 连接器市场提供精选艺术与设计项目；添加后会写入 Atelier 预设，需在新会话验证工具是否连接。社区插件市场目前隐藏。
- **本地桌面体验**：工作区、会话和设置使用独立于 DSH 的 Atelier 数据目录；界面支持中文、英文和法文。内置 PPT 模式可以输出可编辑的 PPTX。

这是**本地早期预览版**。Atelier 尚无已签名的公开发行包、更新源或自动更新。仓库保留了上游跨平台代码，但当前 Atelier 的本地说明与验证以 macOS 为主；上游 DSH 的安装包和发布声明不等于 Atelier 已发布。桌面应用也不替代多用户版 Atelier Web 服务。

## 本地运行

macOS 上使用 **Node.js 24**，在仓库根目录执行：

```sh
npm ci
npm run dev
```

随后在 **设置 → 模型** 中配置模型提供方。Atelier 不会复制其他 DSH Profile 中的密钥、会话和插件。若要制作未签名的 Apple Silicon 本地预览包：

```sh
npm run package:dev:mac:arm64
```

输出位于 `dist-dev/`，不能当作正式安装包分发。

进行 Blender 任务时，还需安装 Blender 与 `uvx`，启用 `mcp-for-blender==2.0.4` 插件，并在 `127.0.0.1:9876` 启动服务。开始建模前先确认 MCP 工具可连接。完整流程见 [Atelier 本地预览与交付指南](README-ATELIER.md)。

## 开发

运行 `npm test`、`npm run typecheck`、`npm run build`，再在实际应用中检查受影响的流程。宿主代码、Atelier 插件与版本化兼容补丁共同构成桌面实现。[架构](docs/architecture.md)、[开发指南](docs/development.md)及 [PPT 运行时说明](packages/ppt-runtime/README.md)仍有部分上游 DSH 名称和发布流程，阅读时请以本页的 Atelier 状态为准。

## 数据、安全与来源

Atelier 在本机启动 Harness 服务，并使用独立的用户数据目录。渲染进程启用隔离与沙盒。模型提供方和已配置的 MCP 服务可能根据其权限访问工作区文件或向其端点传输数据；处理私密材料前请检查连接器。不要把凭据或客户文件提交到仓库。

Atelier Desktop 基于采用 [MIT 许可证](LICENSE)的 DSH Desktop。DeepSeek Harness、打包依赖及 MCP 项目保留各自许可与维护者。Atelier 是独立改造项目，并非 DeepSeek 或 DSH Desktop 的官方版本。

[Atelier 官网](https://artsmart.space/) · [项目仓库](https://github.com/dengyier/Atelier_desktop_mac)
