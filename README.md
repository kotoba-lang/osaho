# osaho

**筬 (osa) is the reed of a loom.** Every warp thread passes through one dent of
it, the reed holds them all in position, and the weft is beaten home against it.
`osaho` makes nothing and decides nothing; it is what everything passing through
must fit. That is this repository: **Kotoba KIR — the checked intermediate
representation every backend shares, and the canonical definition identity
(DefCID) they are all keyed on.**

The name is coined, not a traditional weaving term (`osaba` 筬羽, `osauchi`
筬打ち and `osatōshi` 筬通し are; `osaho` is not), so it is stated here rather
than left to be guessed — the workspace rule for a repository whose name does
not announce its function. It sits in the loom the rest of the family is
already named from:

| | | |
|---|---|---|
| `kotoba` | 言葉 | the language |
| `amu` | 編む | the compiler — weaves one closed cloth |
| `abi` | 経 | the warp: WIT / admission contract |
| **`osaho`** | **筬** | **the checked IR every thread passes through, and its identity** |
| 綾 | aya | the backends: `kotoba-wasm`, `kotoba-native`, `kotoba-script`, `kotoba-component` |
| `kototama` | 言霊 | the VM contract — reduction, state, authority, receipt |

**Renamed from `kotoba-kir` on 2026-09-07** (owner decision). GitHub redirects
the old name, so `io.github.kotoba-lang/kotoba-kir` git coordinates keep
resolving; the `kotoba.kir.*` namespaces are **unchanged** and remain the API,
the same way `amu` kept `kotoba.compiler.*` after its own rename. Names are not
in a DefCID on either side of a call, so **no definition identity moved.**

**Tier**: `T0`  **Role**: `contract`

Split out of the overloaded core repos by ADR-2607266000 so that each
responsibility has exactly one owner and the dependency direction is
checkable from outside.

## Owns

- `kotoba.kir (KIR v3/v4 shape + lowering budget)`
- `kotoba.kir.value (portable value model)`
- `kotoba.kir.target (target profile registry)`
- `kotoba.kir.definition-identity (canonical DAG-CBOR DefCID)`
- native typed-feature admission, including the closed scalar-variant export
  boundary (`qualified name`, `1..32` unique cases, `:i64`/`:bool` payloads)

## Does not own

- parse .kotoba source
- define or validate the checked HIR envelope
- emit machine code or wasm
- decide policy

## Depends on

- `kotoba-lang/kotoba-hir`
- `kotoba-lang/security`

## Test

```bash
kbb -M:test
```

## Opaque JS host values

`:js-value` is a target-specific opaque leaf for JS interoperability. On the
ClojureScript host, boundary and constructor checks preserve the original value
(including undefined, functions, symbols, cycles and proxies) without property
reads, coercion or copying. It consumes one boundary node and no payload bytes;
this does not bound the graph retained by that host reference. The embedder owns
its lifetime and host resources. JVM execution refuses this value type.
The reference interpreter also provides `js-nullish?`, `js-truthy?`, and
`js-strict-equal?` over this opaque host ABI. These use JavaScript nullish,
ToBoolean, and strict-equality semantics, without conversion or property
reads. NaN differs from itself, positive and negative zero compare equal,
and objects compare by identity. Other hosts refuse these operations. This
reference contract alone does not add source syntax or backend admission;
those consumers must explicitly implement and qualify the same operations.

The reference interpreter also provides `js-typeof` (`js-value` to `string`),
`js-array?` (`js-value` to `bool`), and `js-bool-value` (`bool` to `js-value`).
The typeof result follows JavaScript, including `null` as `object` and callable
proxies as `function`. Array branding uses `Array.isArray`, recognizes arrays
from other realms, and preserves its TypeError for revoked proxies. Boolean
injection accepts only actual booleans, with no truthiness conversion. Other
hosts refuse all three operations before inspecting their arguments. A static
local `js_host.mjs` exposes the raw typeof operator to the interpreted CLJK
reference host; it never evaluates source or reads properties of its argument.
New finite tests cover boxed primitives, cycles, getters, ordinary/callable/
revoked proxies, foreign arrays and invalid boolean injection. These reference
operations still need explicit source and backend contracts before use through
Amu; they do not grant object fields, mutation, callbacks or ambient services.

Opaque values have no canonical order and cannot be ordered set items or map
keys, including nested descriptors. Existing canonical value profiles retain
their checks. This contract does not serialize JS references or grant property
access, callbacks, ambient authority, Wasm/native transport, source syntax or
backend support. Those consumers must explicitly implement or refuse the type.
The finite Node/nbb test is bootstrap evidence, not compiler selfhost evidence.

The JS array observation normalizes the dynamic Array.isArray return to a
boolean with intrinsic JavaScript truthiness. Non-bool host overrides preserve
negation semantics; operand evaluation occurs once and thrown error objects
propagate unchanged. Return-object coercion hooks are not consulted. The
ambient override fixture runs in a separate process to preserve the test
runner's collection machinery. This correction is operator-authored from a
measured consumer incompatibility, not a new System One generation.
