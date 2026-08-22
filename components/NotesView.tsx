// Renders hand-authored chapter notes (chapter_notes.content) in the Learn tab.
// Content is structured blocks rather than markdown so each kind — comparison
// tables, worked examples, traps, mnemonics — gets its own visual treatment.

export type NoteBlock =
  | { type: "heading"; text: string; emoji?: string }
  | { type: "para"; text: string }
  | { type: "layman"; title?: string; text: string }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "example"; title: string; lines: string[]; punch?: string }
  | { type: "steps"; title?: string; items: { title: string; text: string }[] }
  | { type: "formula"; title: string; formula: string; note?: string }
  | { type: "mnemonic"; text: string }
  | { type: "trap"; text: string };

// **bold** spans only — enough for emphasis without a markdown dependency
function rich(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <b key={i} className="font-semibold text-foreground">
        {part}
      </b>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function NotesView({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="font-display text-xl leading-snug pt-3 flex items-center gap-2"
              >
                {b.emoji && <span>{b.emoji}</span>}
                {b.text}
              </h2>
            );
          case "para":
            return (
              <p key={i} className="text-[15px] leading-relaxed text-foreground/90">
                {rich(b.text)}
              </p>
            );
          case "layman":
            return (
              <div
                key={i}
                className="rounded-3xl bg-accent-soft border border-accent/30 p-4"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-accent mb-1">
                  {b.title ?? "In plain words"}
                </p>
                <p className="text-[15px] leading-relaxed">{rich(b.text)}</p>
              </div>
            );
          case "table":
            return (
              <div key={i} className="rounded-3xl bg-surface border border-line overflow-hidden">
                {b.caption && (
                  <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wide text-muted">
                    {b.caption}
                  </p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        {b.headers.map((h, hi) => (
                          <th
                            key={hi}
                            className="text-left font-bold px-4 py-2.5 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-line last:border-0 align-top">
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`px-4 py-2.5 leading-snug ${
                                ci === 0 ? "font-semibold whitespace-nowrap" : "text-foreground/85"
                              }`}
                            >
                              {rich(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case "example":
            return (
              <div key={i} className="rounded-3xl bg-green-soft border border-green/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-green mb-2">
                  ✏️ {b.title}
                </p>
                <div className="space-y-1.5">
                  {b.lines.map((l, li) => (
                    <p key={li} className="text-[15px] leading-relaxed">
                      {rich(l)}
                    </p>
                  ))}
                </div>
                {b.punch && (
                  <p className="mt-3 pt-3 border-t border-green/25 text-[15px] font-semibold">
                    {rich(b.punch)}
                  </p>
                )}
              </div>
            );
          case "steps":
            return (
              <div key={i} className="rounded-3xl bg-surface border border-line p-4">
                {b.title && <p className="font-bold mb-3">{b.title}</p>}
                <ol className="space-y-3">
                  {b.items.map((s, si) => (
                    <li key={si} className="flex gap-3">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">
                        {si + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-[15px]">{s.title}</p>
                        <p className="text-sm leading-relaxed text-foreground/85">
                          {rich(s.text)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          case "formula":
            return (
              <div key={i} className="rounded-3xl bg-surface-2 border border-line p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">
                  {b.title}
                </p>
                <p className="font-semibold text-[15px] leading-relaxed tabular-nums">
                  {rich(b.formula)}
                </p>
                {b.note && (
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{rich(b.note)}</p>
                )}
              </div>
            );
          case "mnemonic":
            return (
              <div
                key={i}
                className="rounded-full bg-gradient-to-r from-[#f3c98f]/30 to-[#d9b8e8]/30 border border-line px-4 py-2.5 text-sm font-semibold text-center"
              >
                🧠 {rich(b.text)}
              </div>
            );
          case "trap":
            return (
              <div key={i} className="rounded-3xl bg-red-soft border border-red/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-red mb-1">
                  ⚠️ Exam trap
                </p>
                <p className="text-[15px] leading-relaxed">{rich(b.text)}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
