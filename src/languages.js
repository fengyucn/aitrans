// 支持的语言列表
const SUPPORTED_LANGUAGES = {
  zh: '中文',
  en: '英语',
  ja: '日语',
  ko: '韩语',
  fr: '法语',
  de: '德语',
  es: '西班牙语',
  it: '意大利语',
  ru: '俄语',
  pt: '葡萄牙语',
  nl: '荷兰语',
  pl: '波兰语',
  ar: '阿拉伯语',
  tr: '土耳其语',
  th: '泰语',
  vi: '越南语',
  hi: '印地语'
};

// 检查语言是否支持
function isLanguageSupported(lang) {
  return lang in SUPPORTED_LANGUAGES;
}

// 获取语言的本地化名称
function getLanguageName(lang) {
  return SUPPORTED_LANGUAGES[lang] || lang;
}

// 获取所有支持的语言
function getAllLanguages() {
  return Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({
    code,
    name
  }));
}

module.exports = {
  SUPPORTED_LANGUAGES,
  isLanguageSupported,
  getLanguageName,
  getAllLanguages
};
