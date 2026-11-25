import { useState } from 'react';
import { Download, ShieldAlert, ArrowLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

interface InsightsPageProps {
  role: UserRole;
  onBackToDashboard?: () => void;
}

const TENURE_DATA = [
  { bracket: '< 1 Year', count: 248, attritionPct: 12.4 },
  { bracket: '1 – 3 Years', count: 482, attritionPct: 8.1 },
  { bracket: '3 – 5 Years', count: 342, attritionPct: 4.6 },
  { bracket: '5+ Years', count: 212, attritionPct: 2.1 },
];

export function InsightsPage({ role, onBackToDashboard }: InsightsPageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'tenure' | 'diversity' | 'cost_variance'>('tenure');

  if (role !== 'hr_admin') {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-10 text-center max-w-lg mx-auto space-y-4 my-8">
        <div className="w-12 h-12 rounded-full bg-[var(--warning)]/10 text-[var(--warning-text)] flex items-center justify-center mx-auto">
          <ShieldAlert size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Access Restricted — Executive Board Analytics
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)] leading-relaxed">
            This module contains executive compensation variance, board-level attrition cohorts, and CXO pay parity audits. This view is restricted to HR Administrators and the Executive Committee under company information governance policy.
          </p>
        </div>
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to {role === 'employee' ? 'Self-Service Home' : 'Manager Hub'}</span>
          </button>
        )}
      </div>
    );
  }

  const handleExportReport = () => {
    showToast({
      type: 'success',
      message: 'Generated Inbox_Infotech_Executive_Board_HR_Intelligence_Report_Q3.pdf',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            Workforce Insights & Board Analytics
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Executive intelligence • Tenure, attrition cohorts, and compensation parity
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
        >
          <Download size={13} strokeWidth={1.7} />
          <span>Export Board Deck (.pdf)</span>
        </button>
      </div>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Voluntary attrition (LTM)</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            5.8%
          </div>
          <span className="text-[11px] text-[var(--success-text)] font-medium">-1.4% vs IT peer median</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Median tenure at exit</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            2.1 yrs
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Highest retention in Band L6+</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Gender diversity ratio</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
            34.2%
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">+3.8% YoY net female addition</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Budget variance (FY27 YTD)</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
            -2.4%
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Within board allocated ceiling</span>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px]">
        <button
          onClick={() => setActiveTab('tenure')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'tenure'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Tenure cohort analysis
        </button>
        <button
          onClick={() => setActiveTab('diversity')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'diversity'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Gender diversity & pay parity audit
        </button>
        <button
          onClick={() => setActiveTab('cost_variance')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'cost_variance'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Department cost allocation & variance
        </button>
      </div>

      {/* View 1: Tenure Cohort Attrition */}
      {activeTab === 'tenure' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Workforce Distribution & Annual Attrition Rate by Tenure Cohort
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Key vulnerability window identified between Month 6 and Month 18 (Analyst bands)
              </p>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">1,284 Sample Total</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TENURE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="bracket" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-2 rounded shadow-lg text-[11px]">
                          <div className="font-semibold text-[var(--text-primary)]">{data.bracket}</div>
                          <div className="text-[var(--text-secondary)]">Headcount: {data.count}</div>
                          <div className="text-[var(--warning-text)] font-semibold">Attrition: {data.attritionPct}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* View 2: Gender Diversity & Pay Parity Audit */}
      {activeTab === 'diversity' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Equal Remuneration Act 1976 & ESG Diversity Pay Parity Audit
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Base salary parity ratio across seniority bands (Target: 98.0% – 102.0%)
              </p>
            </div>
            <span className="text-[11px] font-mono text-[var(--success-text)] font-medium">99.1% Overall Parity</span>
          </div>

          <div className="space-y-3 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Band L1 – L2 (Analysts & Associates)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">38% Female representation • 412 employees</p>
              </div>
              <span className="font-mono text-[var(--success-text)] font-semibold">99.4% parity</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Band L3 – L5 (AVPs & Leads)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">32% Female representation • 580 employees</p>
              </div>
              <span className="font-mono text-[var(--success-text)] font-semibold">98.8% parity</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Band L6 – L8 (VPs, MDs & CXOs)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">26% Female representation • 292 employees</p>
              </div>
              <span className="font-mono text-[var(--success-text)] font-semibold">99.1% parity</span>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Department Cost Allocation */}
      {activeTab === 'cost_variance' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                FY 2026-27 Department Headcount & Compensation Budget vs Actual
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                All figures in INR Crore annualized
              </p>
            </div>
            <span className="text-[11px] font-mono text-[var(--brand-primary)] font-semibold">₹65.8 Cr Total Budget</span>
          </div>

          <div className="space-y-3 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Platform & Cloud Engineering</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">Budget: ₹22.5 Cr • Actual run-rate: ₹21.8 Cr</p>
              </div>
              <span className="font-mono text-[var(--success-text)] font-semibold">-3.1% (Under budget)</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Software Engineering & AI</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">Budget: ₹18.0 Cr • Actual run-rate: ₹18.4 Cr</p>
              </div>
              <span className="font-mono text-[var(--warning-text)] font-semibold">+2.2% (Release delivery bonus)</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Enterprise Solutions & Delivery</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">Budget: ₹16.5 Cr • Actual run-rate: ₹15.9 Cr</p>
              </div>
              <span className="font-mono text-[var(--success-text)] font-semibold">-3.6% (Under budget)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
