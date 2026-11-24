import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
} from 'lucide-react';
import { useHrms } from '../../context/HrmsContext';
import { cn } from '../../lib/utils';

interface ChatMessage {
  id: string;
  sender: 'orbit' | 'user';
  text: string;
  time: string;
}

export function FloatingAiRobot() {
  const { currentUser, role } = useHrms();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting =
    role === 'employee'
      ? `Hi ${currentUser.name.split(' ')[0]}! 👋 I'm Orbit, your personal HRMS AI assistant. Ask me about your remaining leave days, November payslip breakdown, tax declarations, or company policies.`
      : role === 'manager'
      ? `Hello Vikram! I'm Orbit. I can help you with team attendance regularizations, leave approvals, headcount mandates, and employee performance tracking.`
      : `Hello Pooja! I'm Orbit AI. Ask me about November payroll reconciliation, EPFO ECR challan status, TDS 24Q filing deadlines, or workforce analytics.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'orbit',
      text: initialGreeting,
      time: 'Just now',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: 'Check leave balance', query: 'What is my current leave balance?' },
    { label: 'Explain TDS deductions', query: 'Explain my income tax TDS deduction for November' },
    { label: 'HRA claim process', query: 'How do I claim House Rent Allowance (HRA) exemption?' },
    { label: 'Did my punch register?', query: 'Did my biometric attendance punch register today?' },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('leave') || lower.includes('balance') || lower.includes('vacation')) {
        const bal = currentUser.leaveBalance || { casual: 4.5, earned: 12.0, sick: 6.0 };
        reply = `Here is your reconciled leave balance for CY 2026:\n- **Earned Leave (EL)**: ${bal.earned} days available (accrues 1.75d/mo)\n- **Casual Leave (CL)**: ${bal.casual} days available (valid till 31 Dec)\n- **Sick Leave (SL)**: ${bal.sick} days available\n\nYou also have **2.0 days of Compensatory Off** earned from weekend trading sessions.`;
      } else if (lower.includes('tds') || lower.includes('tax') || lower.includes('deduction') || lower.includes('payslip')) {
        reply = `For your **November 2026 Payslip**, your Gross Earnings are **₹2,37,500** with the following deductions:\n- **TDS (Sec 192)**: ₹28,650\n- **EPF Employee (12%)**: ₹14,250\n- **Professional Tax**: ₹200\n- **Net Disbursed Take-Home**: **₹1,94,400** credited to your Kotak Bank account.\n\nReminder: Upload your HRA & 80C investment proofs before **31 Dec 2026**.`;
      } else if (lower.includes('punch') || lower.includes('biometric') || lower.includes('attendance')) {
        reply = `Your biometric attendance is active! Today's first check-in was logged at **09:12 AM IST** at **BKC HQ Main Turnstile 02**. You are on track within the 15-minute grace window.`;
      } else if (lower.includes('hra') || lower.includes('rent')) {
        reply = `To claim HRA under **Section 10(13A)**:\n1. Upload your registered Rent Agreement\n2. Provide monthly rent receipts\n3. Landlord PAN is mandatory if annual rent exceeds ₹1,00,000.\nGo to **Payroll & Tax → Tax Proofs** to submit directly.`;
      } else if (lower.includes('manager') || lower.includes('reporting')) {
        reply = `Your reporting manager is **${currentUser.reportingManager}** (Head of Research). You have your bi-weekly 1-on-1 scheduled for **Thursday at 03:30 PM** at the BKC Research Pod.`;
      } else {
        reply = `I have cross-checked the Acme Financial Services enterprise policy engine. All systems are operational. You can ask me to draft leave handovers, check provident fund balances, or verify tax declarations.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `orb-${Date.now()}`,
          sender: 'orbit',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Robot Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          title="Ask Orbit AI Assistant"
        >
          <div className="relative">
            <Bot size={22} className="text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="text-[13px] font-bold tracking-tight pr-1">Ask Orbit</span>
        </button>
      )}

      {/* Floating AI Chat Pop-up Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[400px] h-[540px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in-50 slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-[var(--brand-primary)] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-[14px]">Orbit AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-emerald-100 block font-mono">HRMS Intelligence Grounded</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Dock */}
          <div className="p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center space-x-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--brand-subtle)] hover:text-[var(--brand-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[12px]">
            {messages.map((m) => {
              const isOrbit = m.sender === 'orbit';
              return (
                <div
                  key={m.id}
                  className={cn(
                    'flex flex-col max-w-[85%]',
                    isOrbit ? 'self-start items-start' : 'self-end items-end ml-auto'
                  )}
                >
                  <div
                    className={cn(
                      'p-3 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs',
                      isOrbit
                        ? 'bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-sm'
                        : 'bg-[var(--brand-primary)] text-white rounded-tr-sm font-medium'
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] mt-1 px-1">{m.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="self-start p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl rounded-tl-sm flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask Orbit about policy, leaves, payslips..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
