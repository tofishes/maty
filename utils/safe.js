function toHtmlEntity(str) {
  return str.split('')
    .map(chars => {
      const code = chars.charCodeAt(0);
      const prefix = code < 100 ? '&#' : '&#x';
      const radix = code < 100 ? 10 : 16;

      return `${prefix}${code.toString(radix)};`
    })
    .join('');
}

module.exports = {
  toHtmlEntity
};
