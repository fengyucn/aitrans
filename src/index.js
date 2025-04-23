const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const dotenv = require('dotenv');
const { isLanguageSupported, getLanguageName, getAllLanguages } = require('./languages');

// 加载环境变量 - 从用户主目录和当前目录加载
dotenv.config({ path: path.join(process.env.HOME, '.aitrans/.env') });
dotenv.config(); // 仍然支持当前目录的.env文件

// 检查必要的环境变量
if (!process.env.AI_API_KEY) {
  console.error(chalk.red('错误：未设置 AI_API_KEY 环境变量'));
  process.exit(1);
}

// 加载并验证环境变量配置
const API_ENDPOINT = process.env.AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-3.5-turbo';
const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.3');
const AI_API_PROXY = process.env.AI_API_PROXY;

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  ...(AI_API_PROXY ? { proxy: { host: new URL(AI_API_PROXY).hostname, port: new URL(AI_API_PROXY).port } } : {})
});

/**
 * 翻译文本
 * @param {string} text 要翻译的文本
 * @param {string} targetLang 目标语言代码
 * @returns {Promise<string>} 翻译结果
 */
async function translate(text, targetLang = 'zh') {
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
      throw new Error(`API 错误: ${error.response.data.message || '未知错误'}`);
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

module.exports = {
  translate,
  listLanguages
};
