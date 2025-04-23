# AI 翻译工具需求文档

## 1. 项目概述
开发一个基于AI大模型的命令行翻译工具，支持多种输入方式和多语言翻译。

## 2. 功能需求

### 2.1 基本功能
- 支持将输入文本翻译成中文（默认目标语言）
- 支持选择其他目标语言进行翻译
- 支持多种输入方式：
  * 直接输入字符串
  * 命令行参数
  * 管道输入

### 2.2 输入方式详细说明
1. 直接输入字符串：
   ```bash
   aitrans "Hello World"
   ```

2. 参数传入：
   ```bash
   aitrans -t "Hello World"
   aitrans --text "Hello World"
   ```

3. 管道输入：
   ```bash
   echo "Hello World" | aitrans
   cat file.txt | aitrans
   ```

### 2.3 语言选择
- 默认翻译成中文
- 通过参数指定目标语言：
  ```bash
  aitrans -l ja "Hello World"    # 翻译成日语
  aitrans --lang fr "Hello World" # 翻译成法语
  ```

### 2.4 其他功能
- 支持查看支持的目标语言列表
- 支持显示使用帮助信息
- 支持显示版本信息

## 3. 命令参数说明
```bash
Usage: aitrans [options] [text]

Options:
  -v, --version          显示版本信息
  -h, --help            显示帮助信息
  -t, --text <text>     指定要翻译的文本
  -l, --lang <lang>     指定目标语言（默认：zh）
  --list-languages      显示支持的语言列表
```

## 4. 技术实现要点
- 使用 Node.js 开发
- 使用 AI 大模型 API 进行翻译
- 支持命令行参数解析
- 支持管道输入处理
- 支持错误处理和友好的错误提示

## 5. 输出格式
- 默认直接输出翻译结果
- 错误信息以醒目的红色文字显示
- 支持的语言列表以表格形式展示

## 6. 错误处理
- 处理网络连接错误
- 处理 API 调用错误
- 处理无效的输入文本
- 处理无效的目标语言选择

## 7. 性能要求
- 翻译响应时间控制在 3 秒以内
- 支持较长文本的翻译（不少于 1000 字符）

## 8. 使用示例
```bash
# 基本使用
$ aitrans "Hello World"
你好世界

# 指定目标语言
$ aitrans -l ja "Hello World"
こんにちは世界

# 管道输入
$ echo "Hello World" | aitrans
你好世界

# 查看支持的语言
$ aitrans --list-languages
```
