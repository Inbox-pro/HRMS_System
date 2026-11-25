interface AskOrbitEntryPointProps {
  onOpen: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export function AskOrbitEntryPoint({ onOpen, onSelectPrompt }: AskOrbitEntryPointProps) {
  const samplePrompts = [
    'What is the penalty risk if TDS 24Q is delayed?',
    'Show Ananya Iyer leave balance and coverage plan',
    'How much is our employer PF contribution for November?',
    'Compare attrition in Sales vs Technology',
  ];

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3.5 transition-colors hover:border-[var(--border-default)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              Ask Orbit
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              Policy & live workforce assistant
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            Verified answers from Inbox Infotech internal policy manuals and statutory databases
          </p>
        </div>

        {/* Right Search Input Trigger */}
        <div className="flex items-center space-x-2 flex-1 max-w-md md:justify-end">
          <button
            onClick={onOpen}
            className="w-full h-8 px-3 rounded-[5px] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-tertiary)] flex items-center justify-between transition-colors text-left"
          >
            <span className="truncate">Ask about policies, leaves, PF rules, or employees...</span>
            <span className="text-[11px] font-medium text-[var(--brand-primary)] shrink-0 ml-2">
              Query
            </span>
          </button>
        </div>
      </div>

      {/* Suggested chips (Quiet text buttons, NO heavy colored tags) */}
      <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-[var(--text-tertiary)]">Common queries:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelectPrompt(prompt);
              onOpen();
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-colors"
          >
            {prompt}
            {idx < samplePrompts.length - 1 && <span className="text-[var(--text-muted)] ml-2">|</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
