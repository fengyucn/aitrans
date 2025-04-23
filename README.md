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

1. 对于全局安装，创建配置目录并复制环境变量模板文件：
   ```bash
   mkdir -p ~/.aitrans
   cp .env.example ~/.aitrans/.env
   ```

2. 对于本地开发，复制环境变量模板文件：
   ```bash
   cp .env.example .env
   ```

3. 编辑配置文件（全局安装编辑 ~/.aitrans/.env，本地开发编辑项目目录下的 .env），配置以下参数：

   ```bash
   # 必需配置
   AI_API_KEY=your_api_key_here              # OpenAI API 密钥
   
   # 可选配置
   AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions  # API 端点
   AI_MODEL=gpt-3.5-turbo                    # 使用的 AI 模型
   AI_TEMPERATURE=0.3                        # 模型温度参数 (0-1)
   AI_API_PROXY=http://your-proxy:port       # 代理服务器 (可选)
   ```

3. 获取 OpenAI API 密钥：
   - 访问 https://platform.openai.com/
   - 登录或创建账户
   - 在 API Keys 页面创建新的 API 密钥
   - 将密钥复制到 .env 文件中

4. 配置说明：
   - `AI_API_KEY`: 必需，你的 OpenAI API 密钥
   - `AI_API_ENDPOINT`: 可选，默认使用 OpenAI API 端点
   - `AI_MODEL`: 可选，默认使用 gpt-3.5-turbo
   - `AI_TEMPERATURE`: 可选，控制翻译结果的创造性，默认 0.3
   - `AI_API_PROXY`: 可选，如果需要通过代理访问 API

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

1. 如果遇到 API 密钥错误：
   - 检查 .env 文件中的 API_API_KEY 是否正确设置
   - 确保 API 密钥有效且未过期

2. 如果遇到网络错误：
   - 检查网络连接
   - 确认 API 端点是否可访问

3. 如果遇到不支持的语言：
   - 使用 `--list-languages` 查看支持的语言列表
   - 确保使用正确的语言代码

## 许可证

ISC
