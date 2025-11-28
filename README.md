# AITrans - AI 驱动的命令行翻译工具

一个基于 AI 大模型的命令行翻译工具，支持多种输入方式和多语言翻译。

## 安装

### 从 npm 安装（推荐）

```bash
npm install -g aitrans
```

### 从源码安装

```bash
git clone <repository-url>
cd aitrans
npm install
npm link
```

## 配置

### 🌍 全局安装配置（npm install -g aitrans）

1. **创建配置目录**：
   ```bash
   mkdir -p ~/.aitrans
   ```

2. **创建配置文件**：
   ```bash
   # 手动创建配置文件
   nano ~/.aitrans/.env
   # 或使用你喜欢的编辑器
   vim ~/.aitrans/.env
   ```

3. **添加配置内容**：
   ```bash
   # 必需配置
   AI_API_KEY=your_api_key_here              # OpenAI API 密钥

   # 可选配置
   AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions  # API 端点
   AI_MODEL=gpt-3.5-turbo                    # 使用的 AI 模型
   AI_TEMPERATURE=0.3                        # 模型温度参数 (0-1)
   AI_API_PROXY=http://your-proxy:port       # 代理服务器 (可选)
   ```

### 💻 本地开发配置（git clone 安装）

1. **复制环境变量模板文件**：
   ```bash
   cp .env.example .env
   ```

2. **编辑配置文件**：
   ```bash
   nano .env
   ```

### 🔑 获取 OpenAI API 密钥：
   - 访问 https://platform.openai.com/
   - 登录或创建账户
   - 在 API Keys 页面创建新的 API 密钥
   - 将密钥复制到 .env 文件中

4. **配置文件位置说明**：
   - **全局安装**: `~/.aitrans/.env` (用户主目录下的 `.aitrans` 文件夹)
   - **本地开发**: 项目根目录下的 `.env` 文件

5. **配置参数说明**：
   - `AI_API_KEY`: 必需，你的 OpenAI API 密钥
   - `AI_API_ENDPOINT`: 可选，默认使用 OpenAI API 端点
   - `AI_MODEL`: 可选，默认使用 gpt-3.5-turbo
   - `AI_TEMPERATURE`: 可选，控制翻译结果的创造性，默认 0.3
   - `AI_API_PROXY`: 可选，如果需要通过代理访问 API

### ⚡ 快速配置示例

```bash
# 1. 创建配置目录
mkdir -p ~/.aitrans

# 2. 创建并编辑配置文件
cat > ~/.aitrans/.env << EOF
# OpenAI API 配置
AI_API_KEY=sk-your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.3
EOF

# 3. 验证配置
aitrans --list-languages
```

## 使用方法

### 基本用法

1. 直接翻译文本（默认翻译成中文）：
   ```bash
   aitrans "Hello World"
   ```

2. 使用参数指定文本：
   ```bash
   aitrans -t "Hello World"
   aitrans --text "Hello World"
   ```

3. 通过管道输入文本：
   ```bash
   echo "Hello World" | aitrans
   cat file.txt | aitrans
   ```

### 指定目标语言

使用 `-l` 或 `--lang` 参数指定目标语言：

```bash
aitrans -l ja "Hello World"    # 翻译成日语
aitrans --lang fr "Hello World" # 翻译成法语
```

### 查看支持的语言

```bash
aitrans --list-languages
```

### 查看帮助信息

```bash
aitrans --help
```

### 查看版本信息

```bash
aitrans --version
```

## 支持的语言

- zh: 中文
- en: 英语
- ja: 日语
- ko: 韩语
- fr: 法语
- de: 德语
- es: 西班牙语
- it: 意大利语
- ru: 俄语
- pt: 葡萄牙语
- nl: 荷兰语
- pl: 波兰语
- ar: 阿拉伯语
- tr: 土耳其语
- th: 泰语
- vi: 越南语
- hi: 印地语

## 错误处理

### 🔑 API 密钥相关错误

如果看到 `错误：未设置 AI_API_KEY 环境变量`：
```bash
# 检查配置文件是否存在
ls -la ~/.aitrans/.env

# 如果不存在，重新创建
mkdir -p ~/.aitrans
cat > ~/.aitrans/.env << EOF
AI_API_KEY=your-actual-api-key-here
AI_MODEL=gpt-3.5-turbo
EOF
```

### 🌐 网络相关错误

1. **API 密钥错误**：
   - 检查 `~/.aitrans/.env` 文件中的 `AI_API_KEY` 是否正确设置
   - 确保 API 密钥有效且未过期
   - 验证密钥是否有足够的配额

2. **网络连接错误**：
   - 检查网络连接
   - 确认 API 端点是否可访问
   - 如果在国内，可能需要配置代理：`AI_API_PROXY=http://your-proxy:port`

3. **权限问题**：
   ```bash
   # 确保配置文件权限正确
   chmod 600 ~/.aitrans/.env
   ```

### 🗣️ 语言相关错误

如果遇到不支持的语言：
- 使用 `aitrans --list-languages` 查看支持的语言列表
- 确保使用正确的语言代码（如 'zh', 'en', 'ja' 等）

### 🐛 调试技巧

```bash
# 测试配置是否正确
aitrans "Hello" --lang zh

# 查看支持的语言
aitrans --list-languages

# 检查配置文件内容
cat ~/.aitrans/.env
```

## 许可证

ISC
