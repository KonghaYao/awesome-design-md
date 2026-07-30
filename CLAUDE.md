# CLAUDE.md

## 项目概述

Awesome DESIGN.md 是一个精选的 DESIGN.md 文件集合，收录了来自 73+ 知名网站/产品的设计系统分析文档。基于 Google Stitch 提出的 [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) 概念——一种纯文本格式的设计系统文档，AI 编程代理可直接读取以生成视觉一致的 UI。

用户将 DESIGN.md 放入项目根目录，然后告诉 AI "给我建一个像 X 的页面"，即可生成符合对应设计语言的高质量 UI。

## 仓库结构

```
.
├── README.md                  # 项目说明、合集列表、AI 设计工具生态
├── CONTRIBUTING.md            # 贡献指南
├── CLAUDE.md                  # 本文件
├── LICENSE                    # MIT License
├── .gitignore                 # 忽略 .DS_Store
├── .github/
│   ├── FUNDING.yml            # GitHub Sponsors 配置
│   └── ISSUE_TEMPLATE/
│       └── design-md-request.yml  # 请求新 DESIGN.md 的 Issue 模板
└── design-md/                 # 所有 DESIGN.md 文件
    ├── {company}/             # 每个公司/产品一个目录
    │   ├── DESIGN.md          # 核心设计系统文档（YAML frontmatter + 设计规则）
    │   └── README.md          # 重定向至 getdesign.md 网站查看预览
    └── ...
```

## DESIGN.md 文件格式

每个 `design-md/{company}/DESIGN.md` 使用以下结构：

### YAML Frontmatter（必需字段）
- `version`: 固定为 `alpha`
- `name`: 设计分析名称，格式如 `{Company}-design-analysis`
- `description`: 一句话概述该设计语言的核心特征
- `colors`: 设计系统颜色令牌（primary, ink, body, canvas, link, error, hairline 等）
- `typography`: 排版规格（fontFamily, fontSize, fontWeight, lineHeight, letterSpacing），按用途命名（hero-display, display-lg, body, label 等）

### Markdown Body
包含设计规则、组件模式、间距系统、暗色模式规则等，用自然语言描述，便于 AI 理解和执行。

## 目录命名规范

- 使用小写字母和连字符，如 `linear.app`、`mistral.ai`
- 部分包含年份后缀，如 `dell-1996`、`nintendo-2001`
- 共 73 个目录，涵盖 AI/LLM 平台、SaaS/DX 产品、设计/创意工具、汽车/硬件品牌、金融/加密货币、消费品牌等多类别

## 贡献流程

1. **改进已有 DESIGN.md**：先开 Issue 讨论，再修改文件。修改 `DESIGN.md` 后需同步更新 `preview.html` 和 `preview-dark.html`（如果存在）
2. **请求新 DESIGN.md**：通过 [Issue 模板](.github/ISSUE_TEMPLATE/design-md-request.yml) 或 [getdesign.md/request](https://getdesign.md/request) 提交
3. **不接受外部 DESIGN.md PR**：为保持合集质量，不直接接受新的 DESIGN.md 拉取请求

## 常用操作

### 验证 DESIGN.md 格式
检查 YAML frontmatter 是否包含必需的 `version`、`name`、`description`、`colors`、`typography` 字段。

### 添加新的设计目录
```bash
mkdir -p design-md/{company-name}
# 创建 DESIGN.md（含完整 frontmatter 和设计规则）
# 创建 README.md（重定向至 getdesign.md）
```

### README.md 更新
添加新条目时，在 `README.md` 对应分类下添加一行：
```markdown
- [**Company Name**](https://getdesign.md/{slug}/design-md) - 简短的一句话描述
```

## 相关链接

- 项目主页: https://github.com/VoltAgent/awesome-design-md
- DESIGN.md 预览与下载: https://getdesign.md
- DESIGN.md 规范: https://stitch.withgoogle.com/docs/design-md/overview/
- Discord 社区: https://s.voltagent.dev/discord
