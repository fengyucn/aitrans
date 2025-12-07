# AITrans - AI 驱动的命令行翻译工具

![Version](https://img.shields.io/badge/version-1.1.2-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

一个基于 AI 大模型的命令行翻译工具，支持多种输入方式和多语言翻译。

> 🏠 [项目主页](https://github.com/fengyucn/aitrans) | 📖 [文档](https://github.com/fengyucn/aitrans#readme) | 🐛 [问题反馈](https://github.com/fengyucn/aitrans/issues)

## 安装

### 从 npm 安装（推荐）

```bash
npm install -g aitrans
```

### 从源码安装

```bash
git clone https://github.com/fengyucn/aitrans.git
cd aitrans
npm install
npm link
```

## 快速开始

### 🚀 一键配置（推荐）

首次使用或需要重新配置时，运行：

```bash
aitrans --setup
```

这将显示详细的配置指南，包括 API 密钥获取方法和配置步骤。

## 配置

### 🔧 环境配置

AITrans 需要配置 OpenAI API 密钥才能正常工作。支持两种配置方式：

#### 方式一：运行配置向导（推荐）

```bash
aitrans --setup
```

按照提示完成配置即可。

#### 方式二：手动配置

**全局安装用户**：

```bash
# 创建配置目录
mkdir -p ~/.aitrans

# 创建配置文件
cat > ~/.aitrans/.env << EOF
# 必需配置
AI_API_KEY=sk-your-openai-api-key-here

# 可选配置
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.3
AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
# AI_API_PROXY=http://your-proxy:port  # 如需代理
EOF
```

**本地开发用户**：

```bash
# 复制模板文件
cp .env.example .env

# 编辑配置文件
nano .env
```

### 🔑 获取 API 密钥

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或创建账户
3. 在 API Keys 页面创建新的 API 密钥
4. 将密钥添加到配置文件中

### ⚙️ 配置参数说明

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `AI_API_KEY` | ✅ | - | OpenAI API 密钥 |
| `AI_MODEL` | ❌ | `gpt-3.5-turbo` | 使用的 AI 模型 |
| `AI_TEMPERATURE` | ❌ | `0.3` | 模型温度参数 (0-1) |
| `AI_API_ENDPOINT` | ❌ | OpenAI API | API 端点 |
| `AI_API_PROXY` | ❌ | - | 代理服务器地址 |

### ✅ 验证配置

```bash
# 查看支持的语言列表
aitrans --list-languages

# 测试翻译功能
aitrans "Hello World" --lang zh
```

## 使用方法

### 📝 基本用法

#### 直接翻译

```bash
# 直接翻译文本（默认翻译成中文）
aitrans "Hello World"

# 指定目标语言
aitrans -l ja "Hello World"    # 翻译成日语
aitrans --lang fr "Hello World" # 翻译成法语
```

#### 使用参数

```bash
aitrans -t "Hello World"       # 使用 -t 参数
aitrans --text "Hello World"   # 使用 --text 参数
```

#### 管道输入

```bash
echo "Hello World" | aitrans           # 单行文本
cat file.txt | aitrans                  # 文件内容
pbpaste | aitrans                       # 剪贴板内容（macOS）
```

### 🛠️ 命令行选项

| 选项 | 简写 | 说明 | 示例 |
|------|------|------|------|
| `--text` | `-t` | 指定要翻译的文本 | `aitrans -t "Hello"` |
| `--lang` | `-l` | 目标语言（默认：zh） | `aitrans -l en "你好"` |
| `--list-languages` | - | 显示支持的语言列表 | `aitrans --list-languages` |
| `--setup` | - | 显示环境配置指南 | `aitrans --setup` |
| `--version` | `-v` | 显示版本信息 | `aitrans --version` |
| `--help` | `-h` | 显示帮助信息 | `aitrans --help` |

### 🌍 支持的语言

| 代码 | 语言 | 代码 | 语言 |
|------|------|------|------|
| `zh` | 中文 | `fr` | 法语 |
| `en` | 英语 | `de` | 德语 |
| `ja` | 日语 | `es` | 西班牙语 |
| `ko` | 韩语 | `it` | 意大利语 |
| `ru` | 俄语 | `pt` | 葡萄牙语 |
| `nl` | 荷兰语 | `pl` | 波兰语 |
| `ar` | 阿拉伯语 | `tr` | 土耳其语 |
| `th` | 泰语 | `vi` | 越南语 |
| `hi` | 印地语 | | |

### 💡 使用技巧

```bash
# 翻译命令输出
ls -la | aitrans -l en

# 翻译环境变量
echo $PATH | aitrans -l en

# 组合使用
echo "Bonjour le monde" | aitrans -l zh  # 法语转中文
```

### 🔑 常见问题与解决方案

#### 问题 1：`错误：未设置 AI_API_KEY 环境变量`

**原因**：API 密钥未配置或配置文件不存在

**解决方案**：
```bash
# 方法 1：运行配置向导
aitrans --setup

# 方法 2：手动创建配置文件
mkdir -p ~/.aitrans
cat > ~/.aitrans/.env << EOF
AI_API_KEY=sk-your-actual-openai-api-key-here
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.3
EOF
```

#### 问题 2：`API 密钥无效` 或 `认证失败`

**解决方案**：
1. 检查 API 密钥是否正确（确保以 `sk-` 开头）
2. 访问 [OpenAI Platform](https://platform.openai.com/api-keys) 验证密钥状态
3. 确认账户有足够的配额

#### 问题 3：网络连接超时

**解决方案**：
1. 检查网络连接是否正常
2. 如果在国内网络环境，配置代理：
   ```bash
   echo "AI_API_PROXY=http://your-proxy:port" >> ~/.aitrans/.env
   ```
3. 尝试更换网络环境

#### 问题 4：`不支持的语言代码`

**解决方案**：
```bash
# 查看所有支持的语言
aitrans --list-languages

# 常用语言代码
# zh: 中文, en: 英语, ja: 日语, ko: 韩语
# fr: 法语, de: 德语, es: 西班牙语, ru: 俄语
```

#### 问题 5：`输入文本过长`

**限制**：单次翻译文本最大 4000 字符

**解决方案**：
- 将长文本分段翻译
- 考虑使用其他工具处理文档翻译

### 🔧 诊断工具

```bash
# 检查版本
aitrans --version

# 查看配置向导
aitrans --setup

# 查看支持的语言
aitrans --list-languages

# 测试基本功能
aitrans "Hello" --lang zh
```

### 📞 获取帮助

如果遇到其他问题：

1. **查看帮助**：`aitrans --help`
2. **检查配置**：`aitrans --setup`
3. **提交问题**：[GitHub Issues](https://github.com/fengyucn/aitrans/issues)
4. **查看项目文档**：[项目主页](https://github.com/fengyucn/aitrans)

## 📄 许可证

[ISC License](LICENSE)

---

## 🙏 致谢

感谢所有为 AITrans 做出贡献的开发者和用户！

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请考虑给个 Star！**

Made with ❤️ by [fengyucn](https://github.com/fengyucn)

</div>
