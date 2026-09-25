# Atelier Desktop v0.1.0 — 本地预览阶段

本文件记录当前仓库的 Atelier Desktop 预览状态，也作为后续发布说明的写作参考。它不是正式发布公告；目前没有已签名的 Atelier 安装包或自动更新源。发布说明应以目标版本的代码差异和实际验收为证据，不能把 DSH Desktop 的历史发布结果写成 Atelier 的成果。

## 更新内容

- **Atelier 桌面工作区**：使用独立的应用名称、图标与数据目录；已有 DSH 配置、会话和凭据不会自动复制到 Atelier。
- **创作入口**：新增日常办公与设计创意两组建议，点击后把提示词填入输入框，用户可编辑再发送。
- **艺术与 3D 预设**：内置 Atelier 创作模式、Blender 工作流 Skill 与 Blender MCP 配置。实际建模仍需要本机 Blender、`uvx` 和可用的 Blender MCP 服务。
- **MCP 连接器市场**：提供精选艺术与设计连接器的发现和配置入口；配置后需在新会话验证工具连接。社区插件市场在此预览中隐藏。
- **可编辑成果**：保留 Harness 的本地会话、工作区与 PPTX 工作流；3D 交付应同时核对场景文件和渲染预览。

## 升级说明

- **开发运行**：使用 Node.js 24，执行 `npm ci` 和 `npm run dev`。Apple Silicon 本地预览包可用 `npm run package:dev:mac:arm64` 构建，输出到 `dist-dev/`。
- **模型与连接器**：首次使用时自行配置模型提供方。Atelier 不迁移其他 DSH Profile 的密钥；Blender MCP 连接需要另行安装和启动外部服务。
- **分发边界**：当前不提供 Atelier 自动更新，也不应把继承自上游的签名、官网、版本或 Windows 发布说明当作本项目的发布状态。

## 说明

- 以本次版本实际验证过的变化为准撰写后续说明，明确区分“已配置”“已连接”“已生成”和“已检查”。
- 保留 DSH Desktop、DeepSeek Harness 及其他第三方组件的许可与来源信息。
