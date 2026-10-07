// Static JS-host primitive for the interpreted CLJK reference runtime.
// Never evaluate source, coerce values, or inspect user-controlled properties.
export function typeOf(value) {
  return typeof value;
}
