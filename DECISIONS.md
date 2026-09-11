# Decisions

Append-only, at the end, and never edited. An entry is an account of a moment,
not a description of the system, which is why it cannot go stale. To reverse a
decision, append a new entry naming the one it supersedes.

An entry gives the date, the choice, the alternative refused, and what the
choice costs — when there is a real cost; a one-time rename is not one. If it
cannot name an alternative, it is not a decision — leave it out. Keep it short:
a few lines each, no paragraph where a sentence does. The reader is as smart as
the writer.

## 2026-09-11 — ReScript names one `given` per capture count

`given` binds a pattern with no captures, `given1` one, `given2` two. Each
types the handle and the captured values.

Refused: one `given` with the whole callback polymorphic, `(string, 'a) =>
unit`, the shape `step` already uses. `step` can do that because nothing
precedes its `'a`. `given` must keep the handle typed, and with the callback
free there is no expected type to resolve it: `({test}) =>` falls back to
field-name disambiguation, so a user record carrying a `test` field in their
own steps file captures it. No ordering inside the binding can prevent that.

Refused: currying the builder, `({step}) => (name: string) => ...`, which types
the handle and leaves the captures' arity free. `Given` hands over the handle
and the captures in one call, so this needs a `%raw` shim to uncurry, puts a
`() =>` on every builder that captures nothing, and reads as two phases where
the runtime has one.

Costs a name for each arity, and a ceiling at two. The ceiling is the point:
the guide already holds that a `Given` with three parameters is a scenario
hiding its setup.
