const path = require('path');
const os = require('os');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const dotenv = require('dotenv');
const { isLanguageSupported, getLanguageName, getAllLanguages } = require('./languages');

// 检查是否是帮助或设置命令（这些命令不需要环境变量）
const isHelpOrSetupCommand = process.argv.includes('--help') ||
                            process.argv.includes('-h') ||
                            process.argv.includes('--setup');

// 只有在非帮助/设置命令时才检查环境变量
if (!isHelpOrSetupCommand) {
  // 加载环境变量 - 从用户主目录和当前目录加载
  const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir();
  dotenv.config({ path: path.join(homeDir, '.aitrans/.env') });
  dotenv.config(); // 仍然支持当前目录的.env文件

  // 检查必要的环境变量
  if (!process.env.AI_API_KEY) {
    console.error(chalk.red('错误：未设置 AI_API_KEY 环境变量'));
    console.error(chalk.yellow('请运行 "aitrans --setup" 查看配置指南'));
    process.exit(1);
  }
}

// 加载并验证环境变量配置（只有在需要时才加载）
let API_ENDPOINT, API_KEY, AI_MODEL, AI_TEMPERATURE, AI_API_PROXY, axiosInstance;

function initializeConfig() {
  API_ENDPOINT = process.env.AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  API_KEY = process.env.AI_API_KEY;
  AI_MODEL = process.env.AI_MODEL || 'gpt-3.5-turbo';
  AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.3');
  AI_API_PROXY = process.env.AI_API_PROXY;

  // 解析代理配置
  let proxyConfig = {};
  if (AI_API_PROXY) {
    try {
      const proxyUrl = new URL(AI_API_PROXY);
      proxyConfig = {
        proxy: {
          host: proxyUrl.hostname,
          port: parseInt(proxyUrl.port, 10) || (proxyUrl.protocol === 'https:' ? 443 : 80),
          ...(proxyUrl.protocol ? { protocol: proxyUrl.protocol } : {}),
          ...(proxyUrl.username ? { auth: { username: proxyUrl.username, password: proxyUrl.password } } : {})
        }
      };
    } catch (e) {
      console.error(chalk.red(`警告：代理地址格式无效 (${AI_API_PROXY})，将不使用代理`));
    }
  }

  // 创建 axios 实例
  axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    ...proxyConfig
  });
}

/**
 * 翻译文本
 * @param {string} text 要翻译的文本
 * @param {string} targetLang 目标语言代码
 * @returns {Promise<string>} 翻译结果
 */
async function translate(text, targetLang = 'zh') {
  // 确保配置已初始化
  if (!axiosInstance) {
    initializeConfig();
  }

  // 验证目标语言
  if (!isLanguageSupported(targetLang)) {
    throw new Error(`不支持的目标语言: ${targetLang}`);
  }

  // 创建加载动画
  const spinner = ora('正在翻译...').start();

  try {
    // 构建提示信息
    const targetLanguageName = getLanguageName(targetLang);
    const prompt = `请将以下文本翻译成${targetLanguageName}，只返回翻译结果，不要包含任何其他内容：\n\n${text}`;

    // 调用 AI API 进行翻译
    const response = await axiosInstance.post('', {
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "你是一个专业的翻译助手，请直接提供翻译结果，不要添加任何解释或额外内容。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: AI_TEMPERATURE
    });

    spinner.succeed('翻译完成');
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    spinner.fail('翻译失败');
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('API 密钥无效或没有权限，请检查 AI_API_KEY');
      }
      throw new Error(`API 错误: ${error.response.data.message || '未知错误'} (状态码: ${error.response.status})`);
    } else if (error.request) {
      throw new Error('网络请求失败，请检查网络连接');
    } else {
      throw new Error(`请求错误: ${error.message}`);
    }
  }
}

/**
 * 显示支持的语言列表
 */
function listLanguages() {
  console.log(chalk.cyan('\n支持的语言列表：'));
  console.log(chalk.cyan('================\n'));

  const languages = getAllLanguages();
  const maxCodeLength = Math.max(...languages.map(lang => lang.code.length));

  languages.forEach(({ code, name }) => {
    console.log(
      chalk.green(code.padEnd(maxCodeLength + 2)) +
      chalk.yellow(name)
    );
  });

  console.log('\n');
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(chalk.cyan('\n🌍 AITrans - AI 命令行翻译工具'));
  console.log(chalk.cyan('================================\n'));

  console.log(chalk.yellow('使用方法：'));
  console.log(chalk.white('  aitrans [选项] "要翻译的文本"'));
  console.log(chalk.white('  echo "hello world" | aitrans [选项]\n'));

  console.log(chalk.yellow('选项：'));
  console.log(chalk.green('  -t, --text <text>     ') + chalk.white('指定要翻译的文本'));
  console.log(chalk.green('  -l, --lang <lang>     ') + chalk.white('指定目标语言（默认：zh）'));
  console.log(chalk.green('      --list-languages') + chalk.white('显示支持的语言列表'));
  console.log(chalk.green('      --setup          ') + chalk.white('显示环境配置指南'));
  console.log(chalk.green('  -h, --help            ') + chalk.white('显示帮助信息'));
  console.log(chalk.green('  -v, --version         ') + chalk.white('显示版本信息\n'));

  console.log(chalk.yellow('示例：'));
  console.log(chalk.white('  aitrans "hello world"                                # 翻译成中文'));
  console.log(chalk.white('  aitrans -l ja "hello world"                          # 翻译成日文'));
  console.log(chalk.white('  aitrans -t "hello world" -l en                       # 指定文本和语言'));
  console.log(chalk.white('  echo "bonjour" | aitrans -l zh                       # 管道输入'));
  console.log(chalk.white('  aitrans --list-languages                             # 查看支持的语言\n'));

  console.log(chalk.yellow('首次使用：'));
  console.log(chalk.white('  1. 运行 aitrans --setup 查看配置指南'));
  console.log(chalk.white('  2. 配置 AI_API_KEY 环境变量'));
  console.log(chalk.white('  3. 开始翻译！\n'));

  console.log(chalk.blue('📝 配置文件: ~/.aitrans/.env'));
  console.log(chalk.blue('🌐 项目主页: https://github.com/fengyucn/aitrans\n'));
}

module.exports = {
  translate,
  listLanguages,
  showHelp
};
