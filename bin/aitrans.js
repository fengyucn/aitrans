#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { translate, listLanguages, showHelp } = require('../src/index');
const packageJson = require('../package.json');

// 设置命令行选项
program
  .version(packageJson.version, '-v, --version')
  .description('AI-powered command line translation tool\n\n使用前请运行: aitrans --setup  # 查看环境配置指南')
  .option('-t, --text <text>', '指定要翻译的文本')
  .option('-l, --lang <lang>', '指定目标语言（默认：zh）', 'zh')
  .option('--list-languages', '显示支持的语言列表')
  .option('--setup', '显示环境配置指南');

// 自定义帮助处理
program.configureHelp({
  showGlobalOptions: true
});

// 重写帮助输出
program.outputHelp = () => {
  const { showHelp } = require('../src/index');
  showHelp();
  process.exit(0);
};

// 解析命令行参数
program.parse(process.argv);
const options = program.opts();

// 处理标准输入
let stdinData = '';
if (!process.stdin.isTTY && !options.setup && !options.listLanguages && !options.text) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    stdinData += data;
  });
  process.stdin.on('end', async () => {
    const text = stdinData.trim();
    if (text) {
      await handleTranslation(text, options.lang);
    } else {
      // 如果标准输入为空，则尝试处理命令行参数
      handleCommandLine(options);
    }
  });
} else {
  // 处理命令行参数
  handleCommandLine(options);
}

// 显示环境配置指南
function showSetupGuide() {
  console.log(chalk.cyan('\n🌍 AITrans 环境配置指南'));
  console.log(chalk.cyan('===========================\n'));

  console.log(chalk.yellow('1. 创建配置目录：'));
  console.log(chalk.white('   mkdir -p ~/.aitrans\n'));

  console.log(chalk.yellow('2. 创建配置文件：'));
  console.log(chalk.white('   nano ~/.aitrans/.env\n'));

  console.log(chalk.yellow('3. 添加以下配置内容：'));
  console.log(chalk.green(`
   # 必需配置
   AI_API_KEY=your_openai_api_key_here

   # 可选配置
   AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
   AI_MODEL=gpt-3.5-turbo
   AI_TEMPERATURE=0.3
   AI_API_PROXY=http://your-proxy:port
  `));

  console.log(chalk.yellow('4. 获取 OpenAI API 密钥：'));
  console.log(chalk.white('   访问 https://platform.openai.com/ 创建 API 密钥\n'));

  console.log(chalk.yellow('5. 快速配置示例：'));
  console.log(chalk.white(`
   mkdir -p ~/.aitrans
   cat > ~/.aitrans/.env << EOF
   AI_API_KEY=sk-your-openai-api-key-here
   AI_MODEL=gpt-3.5-turbo
   AI_TEMPERATURE=0.3
   EOF
  `));

  console.log(chalk.yellow('6. 验证配置：'));
  console.log(chalk.white('   aitrans --list-languages\n'));

  console.log(chalk.blue('📝 配置文件位置: ~/.aitrans/.env'));
  console.log(chalk.blue('📚 更多帮助: aitrans --help\n'));
}

// 处理命令行参数的函数
async function handleCommandLine(options) {
  try {
    // 显示环境配置指南
    if (options.setup) {
      showSetupGuide();
      return;
    }

    // 显示支持的语言列表
    if (options.listLanguages) {
      listLanguages();
      return;
    }

    // 获取要翻译的文本
    const text = options.text || program.args.join(' ');
    const MAX_TEXT_LENGTH = 4000; // 设置最大文本长度限制

    if (!text || text.trim() === '') {
      console.error(chalk.red('错误：请提供要翻译的文本。输入文本不能为空。'));
      console.log(chalk.cyan('\n💡 使用帮助：'));
      console.log(chalk.white('   aitrans --setup     # 查看环境配置指南'));
      console.log(chalk.white('   aitrans --help      # 查看完整帮助信息'));
      console.log(chalk.white('   aitrans --list-languages  # 查看支持的语言'));
      process.exit(1);
    }

    if (text.length > MAX_TEXT_LENGTH) {
      console.error(chalk.red(`错误：输入文本过长。最大允许长度为 ${MAX_TEXT_LENGTH} 个字符，但您提供了 ${text.length} 个字符。`));
      process.exit(1);
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
