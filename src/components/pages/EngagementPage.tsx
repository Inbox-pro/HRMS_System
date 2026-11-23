import { useState } from 'react';
import { useToast } from '../common/Toast';

interface RecognitionPost {
  id: string;
  fromName: string;
  fromRole: string;
  toName: string;
  toRole: string;
  category: string;
  message: string;
  timestamp: string;
  valueTag: string;
}

const RECOGNITIONS: RecognitionPost[] = [
  {
    id: 'rec-1',
    fromName: 'Pooja Agarwal',
    fromRole: 'CFO',
    toName: 'Rohan Mehta',
    toRole: 'Lead Compliance Officer',
    category: 'Regulatory Precision',
    message: 'Flawless execution during the unannounced SEBI physical inspection meeting at Nariman Point. All inspection queries answered before deadline.',
    timestamp: '2 hours ago',
    valueTag: 'Institutional Integrity',
  },
  {
    id: 'rec-2',
    fromName: 'Aditya Sen',
    fromRole: 'Head of Quant',
    toName: 'Devendra Kothari',
    toRole: 'Quant Risk Analyst',
    category: 'High Velocity Analytics',
    message: 'Backtested the option delta hedging algorithms across 5-year volatility spikes overnight. Saved the desk 3 basis points on slippage.',
    timestamp: 'Yesterday',
    valueTag: 'Excellence in Execution',
  },
  {
    id: 'rec-3',
    fromName: 'Vikram Patel',
    fromRole: 'VP, Infrastructure',
    toName: 'Amit Joshi',
    toRole: 'Senior Backend Engineer',
    category: 'Zero-Downtime DR',
    message: 'Seamless failover test between Hinjawadi primary data center and Bangalore cloud replication without dropping a single trading session.',
    timestamp: '2 days ago',
    valueTag: 'Customer First',
  },
];

export function EngagementPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'feed' | 'drivers' | 'scores'>('feed');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            Workforce Engagement & Culture
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Q3 Pulse Survey • Peer recognition and culture index
          </p>
        </div>

        <button
          onClick={() => showToast({ type: 'info', message: 'Opening Peer Recognition nomination form' })}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
        >
          <span>Send recognition</span>
        </button>
      </div>

      {/* 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Employee Net Promoter (eNPS)</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
            +48.2
          </div>
          <span className="text-[11px] text-[var(--success-text)] font-medium">+6.4 pts vs Q2 survey</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Survey participation rate</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            89.4%
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">1,148 of 1,284 responses</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Turnover risk index</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
            4.2% <span className="text-[12px] font-normal text-[var(--text-tertiary)]">(Low)</span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">BFSI benchmark: 8.5%</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Quarterly spot recognitions</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            184
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">₹9.2 L distributed</span>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px]">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'feed'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Peer recognition wall
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'drivers'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Satisfaction drivers & scores
        </button>
      </div>

      {/* Recognition Feed */}
      {activeTab === 'feed' ? (
        <div className="space-y-3">
          {RECOGNITIONS.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg space-y-2 hover:border-[var(--border-default)] transition-colors"
            >
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[var(--text-primary)]">{post.fromName}</span>
                  <span className="text-[var(--text-tertiary)]">recognized</span>
                  <span className="font-semibold text-[var(--brand-primary)]">{post.toName}</span>
                </div>
                <span className="text-[11px] text-[var(--text-tertiary)] font-mono">{post.timestamp}</span>
              </div>

              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                "{post.message}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-1 border-t border-[var(--border-subtle)]">
                <span className="font-mono text-[var(--text-secondary)]">{post.category}</span>
                <span className="font-medium text-[var(--brand-primary)]">{post.valueTag}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Q3 Survey Key Satisfaction Drivers (1–5 scale)
          </h3>

          <div className="space-y-3 text-[12px]">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-[var(--text-primary)]">Compensation & Fair Incentive Sharing</span>
                <span className="font-mono tabular-nums text-[var(--text-primary)]">4.4 / 5.0</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--brand-primary)] rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-[var(--text-primary)]">Role Autonomy & Career Trajectory</span>
                <span className="font-mono tabular-nums text-[var(--text-primary)]">4.2 / 5.0</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--brand-primary)] rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-[var(--text-primary)]">Management Transparency & Communication</span>
                <span className="font-mono tabular-nums text-[var(--text-primary)]">4.1 / 5.0</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--brand-primary)] rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-[var(--text-primary)]">Work-Life Balance & Hybrid Flexibility</span>
                <span className="font-mono tabular-nums text-[var(--warning-text)]">3.6 / 5.0</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--warning)] rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
