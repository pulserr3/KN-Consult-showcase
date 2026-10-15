// fall back to english when a key is missing, and warn about it
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

function mergeContent(base, over, trail, lang, warnings) {
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) { warnings.push(`${lang}: ${trail} should be a list`); return base; }
    if (over.length !== base.length) warnings.push(`${lang}: ${trail} has ${over.length} items, English has ${base.length}`);
    return over.map((item, i) =>
      (i < base.length && isObj(base[i])) ? mergeContent(base[i], item, `${trail}[${i}]`, lang, warnings) : item);
  }
  if (isObj(base)) {
    const out = {};
    for (const key of Object.keys(base)) {
      if (over && key in over) out[key] = mergeContent(base[key], over[key], `${trail}.${key}`, lang, warnings);
      else { out[key] = base[key]; warnings.push(`${lang}: missing ${trail}.${key} (using English)`); }
    }
    for (const key of Object.keys(over || {})) {
      if (!(key in base)) warnings.push(`${lang}: unknown key ${trail}.${key}`);
    }
    return out;
  }
  return over === undefined ? base : over;
}

module.exports = { mergeContent };
