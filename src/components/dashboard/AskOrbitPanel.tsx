import { useState, useEffect } from 'react';
import {
  X,
  Send,
  ArrowRight,
  Database,
  Bot,
} from 'lucide-react';
import type { AskOrbitMessage } from '../../types';
import { INITIAL_ASK_ORBIT_HISTORY } from '../../data/mockData';
import { cn } from '../../lib/utils';

interface AskOrbitPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AskOrbitPanel({ isOpen, onClose }: AskOrbitPanelProps) {
  const [messages, setMessages] = useState<AskOrbitMessage[]>(INITIAL_ASK_ORBIT_HISTORY);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: AskOrbitMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Realistic intelligent simulated response based on company policy and live HRMS data
    setTimeout(() => {
      let replyText = '';
      let sources: string[] = ['Inbox Infotech HR Manual FY 2026-27'];
      let followups: string[] = [];

      const lower = text.toLowerCase();
      if (lower.includes('tds') || lower.includes('penalty') || lower.includes('24q')) {
        replyText =
          'Under **Section 234E** of the Income Tax Act, delay in filing Form 24Q or challan deposit incurs a statutory late fee of **₹200 per day** of default until compliance. For our November 2026 payroll, the deposit deadline is **07 Dec 2026** with an estimated withholding liability of **₹48.90 Lakh**. Finance has already verified 1,180 declarations.';
        sources = ['Income Tax Act 1961 - Sec 234E & 271H', 'Challan ITNS 281 Records'];
        followups = [
          'Generate Form 24Q pre-validation report',
          'Who are the employees with pending tax declarations?',
        ];
      } else if (lower.includes('ananya') || lower.includes('leave balance') || lower.includes('coverage')) {
        replyText =
          '**Ananya Iyer (EMP-10482)** has applied for **5 days of Earned Leave (02 Dec – 06 Dec 2026)**. Her current leave balances are:\n- Casual Leave: 4.5 days\n- Earned Leave: 12.0 days\n- Sick Leave: 6.0 days\n\nHer sprint release notes and client architecture briefs have been formally handed over to **Rohan Mehta**. Coverage sign-off was confirmed by Vikramaditya Singhania.';
        sources = ['Inbox Infotech Leave Register 2026', 'Handover Docket HD-10482'];
        followups = ['Approve Ananya leave request now', 'View Ananya Iyer full employee file'];
      } else if (lower.includes('attrition') || lower.includes('sales') || lower.includes('tech')) {
        replyText =
          'Our annualized attrition in **Enterprise Sales is 14.2%** (32 exits YTD out of 225 headcount), whereas **Engineering is 7.9%** (19 exits out of 240). The IT services industry benchmark in Mumbai/Pune is 12.5% for sales and 9.5% for engineering.';
        sources = ['HRMS Turnover Analytics', 'NASSCOM IT Benchmark 2026'];
        followups = ['What were the exit interview reasons in Sales?', 'Download turnover cohort report'];
      } else if (lower.includes('pf') || lower.includes('epfo') || lower.includes('contribution')) {
        replyText =
          'Inbox Infotech employs 1,142 PF-eligible members. The employer contribution for November 2026 is projected at **₹34.20 Lakh** (including 3.67% EPF, 8.33% EPS capped at ₹15,000 wage ceiling, and 0.5% EDLI charges). Due date for ECR remittance is **15 Dec 2026**.';
        sources = ['EPFO Unified Portal API Sync', 'Nov 2026 Payroll Calculation'];
        followups = ['Download EPFO ECR text format', 'Show ESIC contribution estimate'];
      } else {
        replyText = `Based on Inbox Infotech live database, we have **1,284 total employees** across Mumbai, Pune, Surat, and Bengaluru. Current biometric attendance is **92.8% active today**. All payroll calculations for November (₹4.82 Cr) are progressing through Step 3 (Statutory Tax Reconciliations).`;
        sources = ['Inbox Infotech Enterprise Data Store', 'Biometric Gate Log API'];
        followups = ['Show me open positions in Technology', 'Check compliance checklist for this month'];
      }

      const botMsg: AskOrbitMessage = {
        id: `orb-${Date.now()}`,
        sender: 'orbit',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        sources,
        suggestedFollowups: followups,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Ask Orbit AI Assistant"
        className="relative w-full max-w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] h-full overflow-hidden shadow-2xl z-10 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-hover)]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[var(--brand-primary)] text-white flex items-center justify-center font-semibold shadow-xs">
              <Bot size={18} strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                  Ask Orbit
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--brand-subtle)] text-[var(--brand-primary)] border border-[var(--brand-border)]">
                  Live Data & Policy
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Inbox Infotech HR Knowledge Base • Indian Statutory Rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
            aria-label="Close assistant panel"
          >
            <X size={18} strokeWidth={1.7} />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'orbit';

            return (
              <div
                key={msg.id}
                className={cn('flex flex-col', isBot ? 'items-start' : 'items-end')}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-[var(--text-tertiary)]">
                  <span>{isBot ? 'Orbit AI' : 'You'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={cn(
                    'p-3.5 rounded-lg max-w-[90%] leading-relaxed border',
                    isBot
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                      : 'bg-[var(--brand-primary)] text-white border-transparent'
                  )}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Sources citation */}
                  {isBot && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
                      <span className="font-semibold block mb-1">Sources verified:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                          >
                            <Database size={10} />
                            <span>{src}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {isBot && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                      <span className="text-[11px] font-semibold text-[var(--text-tertiary)] block">
                        Suggested questions:
                      </span>
                      {msg.suggestedFollowups.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="w-full text-left p-1.5 rounded-[4px] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[11px] text-[var(--brand-primary)] font-medium flex items-center justify-between transition-colors group"
                        >
                          <span className="truncate">{q}</span>
                          <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-[12px] text-[var(--text-tertiary)] p-2">
              <Bot size={15} className="animate-spin text-[var(--brand-primary)]" />
              <span>Orbit is analyzing company policy and live records...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-hover)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about PF, leave policies, TDS deadline, or employee data..."
              className="flex-1 h-9 px-3 text-[13px] rounded-[6px] bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="h-9 px-3 rounded-[6px] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-xs"
              aria-label="Send message"
            >
              <Send size={14} strokeWidth={2} />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
            <span>Powered by Inbox Infotech Policy Semantic Engine</span>
            <span>Confidential HR data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
