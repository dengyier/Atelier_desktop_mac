# Atelier Desktop

**Arte e IA em um espaço de trabalho local.** Atelier Desktop é uma prévia para macOS que ajuda a transformar uma proposta artística em pesquisa, arquivos editáveis e resultados visuais verificáveis. O projeto usa [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) e o host [DSH Desktop](https://github.com/dataelement/dsh-desktop), licenciado sob MIT. Atelier mantém identidade, interface, preset criativo e perfil de usuário próprios.

[English](README.md) · [简体中文](README.zh.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md)

## O que há nesta prévia

- **Criação artística e 3D:** novas sessões usam por padrão o *Atelier Creative Mode*, com uma Skill de fluxo de trabalho no Blender e a configuração do `mcp-for-blender`. Blender e o complemento MCP precisam ser instalados separadamente.
- **Trabalho cotidiano:** botões de documentos, análise e visualização de dados, atas, relatórios e apresentações preenchem o campo de texto com sugestões editáveis; a tarefa não é enviada automaticamente.
- **Arquivos verificáveis:** o fluxo 3D pede a cena editável e a inspeção de vistas renderizadas. Um nome de arquivo na resposta não comprova que o resultado foi criado ou verificado.
- **Modelos e ferramentas:** configure um provedor de modelos no aplicativo. O mercado de conectores MCP reúne projetos selecionados de arte e design. Depois de adicionar um conector ao preset Atelier, abra uma nova sessão para verificar as ferramentas. O mercado de plugins da comunidade está oculto nesta prévia.
- **Ambiente local:** workspaces, sessões e configurações ficam em um perfil Atelier separado do DSH. A interface oferece chinês, inglês e francês. O modo PPT integrado pode gerar arquivos PPTX editáveis.

Esta é uma **prévia local**. Atelier ainda não oferece canal próprio de versões assinadas nem atualização automática. O repositório preserva código multiplataforma herdado, mas as instruções e verificações atuais se concentram no macOS. Versões publicadas pelo DSH Desktop não são versões Atelier. O aplicativo também não substitui o serviço web multiusuário Atelier.

## Executar no macOS

Use **Node.js 24** e execute na raiz do repositório:

```sh
npm ci
npm run dev
```

Configure o provedor de modelos em **Configurações → Modelos**. Atelier não importa chaves, sessões ou plugins de outros perfis DSH. Para gerar um pacote local sem assinatura para Apple Silicon:

```sh
npm run package:dev:mac:arm64
```

Os arquivos ficam em `dist-dev/` e não são instaladores de produção.

Para usar Blender, instale Blender e `uvx`, habilite o complemento `mcp-for-blender==2.0.4` e inicie o serviço em `127.0.0.1:9876`. Confirme a conexão MCP antes de modelar. Consulte o [guia local e de entrega](README-ATELIER.md).

## Desenvolvimento, dados e origem

Execute `npm test`, `npm run typecheck` e `npm run build` e confira o fluxo alterado no aplicativo. A [arquitetura](docs/architecture.md), o [guia de desenvolvimento](docs/development.md) e o [guia do PPT](packages/ppt-runtime/README.md) descrevem o host herdado e ainda podem usar nomes do DSH.

Atelier executa Harness localmente e usa seu próprio diretório de dados. O processo de interface é isolado e usa sandbox. Provedores de modelos e serviços MCP podem acessar arquivos ou enviar dados conforme suas permissões; revise cada conexão antes de usar conteúdo privado. Não publique credenciais nem arquivos de clientes.

O código derivado do DSH Desktop segue a [licença MIT](LICENSE). DeepSeek Harness e outros componentes mantêm suas próprias licenças e equipes responsáveis. Atelier é uma adaptação independente, não uma versão oficial do DeepSeek ou do DSH Desktop.

[Site do Atelier](https://artsmart.space/) · [Repositório](https://github.com/dengyier/Atelier_desktop_mac)
