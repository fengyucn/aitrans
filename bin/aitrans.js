#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { translate, listLanguages } = require('../src/index');
const packageJson = require('../package.json');

// 设置命令行选项
program
  .version(packageJson.version, '-v, --version')
  .description('AI-powered command line translation tool')
  .option('-t, --text <text>', '指定要翻译的文本')
  .option('-l, --lang <lang>', '指定目标语言（默认：zh）', 'zh')
  .option('--list-languages', '显示支持的语言列表');

// 解析命令行参数
program.parse(process.argv);
const options = program.opts();

// 处理标准输入
let stdinData = '';
if (!process.stdin.isTTY) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    stdinData += data;
  });
  process.stdin.on('end', async () => {
    await handleTranslation(stdinData.trim(), options.lang);
  });
} else {
  // 处理命令行参数
  handleCommandLine(options);
}

// 处理命令行参数的函数
async function handleCommandLine(options) {
  try {
    // 显示支持的语言列表
    if (options.listLanguages) {
      listLanguages();
      return;
    }

    // 获取要翻译的文本
    const text = options.text || program.args.join(' ');
    if (!text) {
      console.error(chalk.red('错误：请提供要翻译的文本'));
      program.help();
      return;
    }

    // 执行翻译
    await handleTranslation(text, options.lang);
  } catch (error) {
    console.error(chalk.red('错误：'), error.message);
    process.exit(1);
  }
}

// 处理翻译的函数
async function handleTranslation(text, targetLang) {
  try {
    const result = await translate(text, targetLang);
    console.log(result);
  } catch (error) {
    console.error(chalk.red('翻译错误：'), error.message);
    process.exit(1);
  }
}
