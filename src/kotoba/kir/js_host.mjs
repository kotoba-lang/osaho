// Static JS-host primitive for the interpreted CLJK reference runtime.
// Never evaluate source or inspect user-controlled properties.
// Boolean observation uses intrinsic truthiness without user coercion hooks.
export function typeOf(value) {
  return typeof value;
}

export function arrayBrand(value) {
  return !!Array.isArray(value);
}
