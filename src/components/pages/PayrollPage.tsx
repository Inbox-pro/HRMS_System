import { useState } from 'react';
import {
  Download,
  Printer,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Plus,
  X,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHrms } from '../../context/HrmsContext';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface PayrollPageProps {
  role: UserRole;
}

interface DeptPayrollItem {
  department: string;
  headcount: number;
  grossPay: string;
  basicSalary: string;
  variableIncentives: string;
  pfDeductions: string;
  tdsWithheld: string;
  netPayable: string;
}

const DEPT_PAYROLL: DeptPayrollItem[] = [
  {
    department: 'Investment Banking & Research',
    headcount: 148,
    grossPay: '₹84.50 L',
    basicSalary: '₹42.25 L',
    variableIncentives: '₹18.40 L',
    pfDeductions: '₹5.07 L',
    tdsWithheld: '₹14.20 L',
    netPayable: '₹65.23 L',
  },
  {
    department: 'Risk & Quantitative Trading',
    headcount: 125,
    grossPay: '₹76.20 L',
    basicSalary: '₹38.10 L',
    variableIncentives: '₹16.50 L',
    pfDeductions: '₹4.57 L',
    tdsWithheld: '₹12.80 L',
    netPayable: '₹58.83 L',
  },
  {
    department: 'Technology Infrastructure & Eng',
    headcount: 240,
    grossPay: '₹1,12.80 L',
    basicSalary: '₹56.40 L',
    variableIncentives: '₹14.20 L',
    pfDeductions: '₹6.76 L',
    tdsWithheld: '₹16.50 L',
    netPayable: '₹89.54 L',
  },
  {
    department: 'Private Wealth Management',
    headcount: 172,
    grossPay: '₹78.40 L',
    basicSalary: '₹39.20 L',
    variableIncentives: '₹19.80 L',
    pfDeductions: '₹4.70 L',
    tdsWithheld: '₹11.90 L',
    netPayable: '₹61.80 L',
  },
  {
    department: 'Sales & Client Distribution',
    headcount: 225,
    grossPay: '₹68.90 L',
    basicSalary: '₹34.45 L',
    variableIncentives: '₹12.50 L',
    pfDeductions: '₹4.13 L',
    tdsWithheld: '₹8.40 L',
    netPayable: '₹56.37 L',
  },
  {
    department: 'Customer Operations & Support',
    headcount: 220,
    grossPay: '₹38.60 L',
    basicSalary: '₹19.30 L',
    variableIncentives: '₹4.20 L',
    pfDeductions: '₹2.31 L',
    tdsWithheld: '₹2.10 L',
    netPayable: '₹34.19 L',
  },
];

interface TaxDeclarationItem {
  id: string;
  empName: string;
  empCode: string;
  regime: 'New Regime (115BAC)' | 'Old Regime';
  section: string;
  claimedAmount: string;
  verifiedAmount: string;
  status: 'Pending Verification' | 'Verified & Approved' | 'Rejected';
  proofDocument: string;
}

const INITIAL_TAX_DECLARATIONS: TaxDeclarationItem[] = [
  {
    id: 'tax-1',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    regime: 'Old Regime',
    section: 'HRA (Sec 10(13A))',
    claimedAmount: '₹7,20,000 / yr',
    verifiedAmount: '₹7,20,000',
    status: 'Verified & Approved',
    proofDocument: 'Registered Rent Agreement + Landlord PAN',
  },
  {
    id: 'tax-2',
    empName: 'Rohan Mehta',
    empCode: 'EMP-10931',
    regime: 'Old Regime',
    section: 'Home Loan Interest (Sec 24b)',
    claimedAmount: '₹2,00,000',
    verifiedAmount: 'Pending',
    status: 'Pending Verification',
    proofDocument: 'HDFC Bank Provisional Interest Certificate FY27',
  },
  {
    id: 'tax-3',
    empName: 'Amit Joshi',
    empCode: 'EMP-11309',
    regime: 'Old Regime',
    section: 'Sec 80C (PPF + ELSS)',
    claimedAmount: '₹1,50,000',
    verifiedAmount: 'Pending',
    status: 'Pending Verification',
    proofDocument: 'Mirae Asset ELSS statement + SBI PPF passbook',
  },
];

export function PayrollPage({ role }: PayrollPageProps) {
  const { showToast } = useToast();
  const { payrollSteps, advancePayrollStep, resetPayrollCycle, currentUser, employees } = useHrms();

  const [activeTab, setActiveTab] = useState<'disbursement' | 'challans' | 'tax_regime' | 'payslip'>(
    role === 'employee' || role === 'manager' ? 'payslip' : 'disbursement'
  );
  const [declarations, setDeclarations] = useState<TaxDeclarationItem[]>(INITIAL_TAX_DECLARATIONS);
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<string>(currentUser.id);

  // Modals
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  // New tax declaration state
  const [newRegime, setNewRegime] = useState<'Old Regime' | 'New Regime (115BAC)'>('Old Regime');
  const [newSection, setNewSection] = useState('Sec 80C (PPF / ELSS / Life Insurance)');
  const [newAmount, setNewAmount] = useState('₹1,50,000');
  const [newDoc, setNewDoc] = useState('Investment Receipt / Passbook scan');

  const handleVerifyDeclaration = (id: string, empName: string) => {
    setDeclarations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Verified & Approved' } : d))
    );
    showToast({
      type: 'success',
      message: `Tax declaration proof for ${empName} verified and approved.`,
    });
  };

  const handleApproveBatch = () => {
    showToast({
      type: 'success',
      message: 'Kotak Corporate Banking NEFT Batch (₹4,82,40,000) authenticated and queued for 30 Nov value date.',
    });
  };

  const handleExportDisbursementCSV = () => {
    const headers = ['Department', 'Headcount', 'Gross Pay', 'Basic Salary', 'Variable Incentives', 'PF Withheld', 'TDS Withheld', 'Net Payable'];
    const rows = DEPT_PAYROLL.map((d) => [
      `"${d.department}"`,
      `"${d.headcount}"`,
      `"${d.grossPay}"`,
      `"${d.basicSalary}"`,
      `"${d.variableIncentives}"`,
      `"${d.pfDeductions}"`,
      `"${d.tdsWithheld}"`,
      `"${d.netPayable}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inbox_infotech_payroll_disbursement_nov2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      message: 'Exported department payroll disbursement ledger to CSV.',
    });
  };

  const handleAddTaxDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TaxDeclarationItem = {
      id: `tax-${Date.now()}`,
      empName: currentUser.name,
      empCode: currentUser.employeeCode,
      regime: newRegime,
      section: newSection,
      claimedAmount: newAmount,
      verifiedAmount: 'Pending',
      status: 'Pending Verification',
      proofDocument: newDoc,
    };
    setDeclarations((prev) => [newEntry, ...prev]);
    setIsTaxModalOpen(false);
    showToast({
      type: 'success',
      message: `Submitted ${newSection} tax declaration for payroll review.`,
    });
  };

  const activeEmp = employees.find((e) => e.id === selectedPayslipEmp) || currentUser;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'My Compensation & Payslips' : 'Payroll & Statutory Processing'}
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            {role === 'employee'
              ? `${currentUser.name} (${currentUser.employeeCode}) • Disbursed via Kotak Corporate Banking`
              : 'November 2026 cycle • Salary computation, EPFO/ESIC reconciliation, and NEFT batch'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {role === 'employee' ? (
            <button
              onClick={() => setIsPayslipModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
            >
              <FileText size={14} strokeWidth={2} />
              <span>View & Print Payslip</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleExportDisbursementCSV}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-subtle)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
              >
                <Download size={14} strokeWidth={1.8} />
                <span>Export Ledger CSV</span>
              </button>
              <button
                onClick={handleApproveBatch}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
              >
                <span>Authorize NEFT (₹4.82 Cr)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Interactive 5-Step Payroll Stepper for Admin */}
      {role === 'hr_admin' && (
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Monthly Processing Lifecycle:
              </span>
              <span className="text-[12px] text-emerald-700 font-semibold">November 2026 Cycle</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={advancePayrollStep}
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>Advance Next Stage</span>
                <ArrowRight size={12} />
              </button>
              <button
                onClick={resetPayrollCycle}
                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded cursor-pointer"
                title="Reset Stepper"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
            {payrollSteps.map((step) => {
              const isDone = step.status === 'completed';
              const isCurrent = step.status === 'in_progress';

              return (
                <div
                  key={step.step}
                  className={cn(
                    'p-2.5 rounded-lg border text-[11px] transition-all',
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
                      : isCurrent
                      ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)] text-[var(--brand-primary)]'
                      : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] text-[var(--text-tertiary)]'
                  )}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>Stage {step.step}</span>
                    {isDone ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Clock size={13} className="text-[var(--brand-primary)] animate-spin shrink-0" />
                    ) : null}
                  </div>
                  <div className="font-bold text-[12px] mt-1 text-[var(--text-primary)] truncate">
                    {step.shortName}
                  </div>
                  <div className="text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                    {step.subtext}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Metric Tiles */}
      {role === 'employee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Net Take-Home Pay</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--brand-primary)] tabular-nums font-mono">
              ₹1,94,400
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Credited on 30 Nov 2026</span>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Gross Monthly Salary</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums font-mono">
              ₹2,37,500
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Annual CTC: ₹28,50,000</span>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Income Tax TDS Withheld</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums font-mono">
              ₹28,650
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Old Tax Regime elected</span>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Provident Fund (EPFO)</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums font-mono">
              ₹14,250
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">12% on Basic • Reconciled</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Total Gross Workforce Payout</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              ₹5,48,20,000
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Basic: ₹2,74.1 L • Variables: ₹85.6 L</span>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Employee PF Withheld</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              ₹42,80,000
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">12% on Basic (EPFO ECR)</span>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">TDS Deducted (Sec 192)</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              ₹68,40,000
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Challan 281 generated</span>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Net Bank NEFT Batch</span>
            <div className="mt-1 text-[22px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              ₹4,82,40,000
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Reconciled to last rupee</span>
          </div>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px] overflow-x-auto">
        {role === 'employee' ? (
          <>
            <button
              onClick={() => setActiveTab('payslip')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'payslip'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              My Salary Slip Preview
            </button>
            <button
              onClick={() => setActiveTab('tax_regime')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'tax_regime'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Tax Regime & Declarations
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('disbursement')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'disbursement'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Department Disbursement Ledger
            </button>
            <button
              onClick={() => setActiveTab('challans')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'challans'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Statutory Challans (4)
            </button>
            <button
              onClick={() => setActiveTab('tax_regime')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'tax_regime'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Tax Proof Verification Queue
            </button>
            <button
              onClick={() => setActiveTab('payslip')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'payslip'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Interactive Salary Slip Viewer
            </button>
          </>
        )}
      </div>

      {/* Tab 1: Disbursement Table */}
      {activeTab === 'disbursement' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Department</th>
                  <th className="py-3 px-4 font-medium text-right">Headcount</th>
                  <th className="py-3 px-4 font-medium text-right">Gross Payout</th>
                  <th className="py-3 px-4 font-medium text-right">Basic Salary</th>
                  <th className="py-3 px-4 font-medium text-right">Incentives</th>
                  <th className="py-3 px-4 font-medium text-right">PF Withheld</th>
                  <th className="py-3 px-4 font-medium text-right">TDS Withheld</th>
                  <th className="py-3 px-4 font-medium text-right">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {DEPT_PAYROLL.map((item) => (
                  <tr key={item.department} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{item.department}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--text-secondary)]">{item.headcount}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--text-primary)]">{item.grossPay}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--text-tertiary)]">{item.basicSalary}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--text-tertiary)]">{item.variableIncentives}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--text-secondary)]">{item.pfDeductions}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--text-secondary)]">{item.tdsWithheld}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">{item.netPayable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Challans */}
      {activeTab === 'challans' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4 shadow-xs">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Statutory Compliance & Challan Summary (November 2026 Cycle)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">EPFO ECR Challan</span>
                <span className="font-mono text-[var(--brand-primary)] font-bold">₹85.60 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Employer (12%) + Employee (12%) + EDLI & Admin charges. Due date: 15 Dec 2026.</p>
              <span className="text-[11px] text-emerald-700 font-semibold">ECR text file generated and validated</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">ESIC Monthly Contribution</span>
                <span className="font-mono text-[var(--brand-primary)] font-bold">₹1.42 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Employees with monthly wage &le; ₹21,000. Due date: 15 Dec 2026.</p>
              <span className="text-[11px] text-emerald-700 font-semibold">Form 5 return prepared</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">Income Tax Section 192 (TDS)</span>
                <span className="font-mono text-[var(--brand-primary)] font-bold">₹68.40 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Central Government monthly withholding tax. Due date: 07 Dec 2026 (Challan ITNS 281).</p>
              <span className="text-[11px] text-emerald-700 font-semibold">NSDL e-payment remittance queued</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">Maharashtra Professional Tax (PT)</span>
                <span className="font-mono text-[var(--brand-primary)] font-bold">₹2.56 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Form III-B state tax. Due date: 30 Nov 2026.</p>
              <span className="text-[11px] text-emerald-700 font-semibold">Mahagst challan generated</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tax Regime & Proofs */}
      {activeTab === 'tax_regime' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Tax Regime & Investment Proof Verification
            </h3>
            <button
              onClick={() => setIsTaxModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs cursor-pointer"
            >
              <Plus size={14} strokeWidth={2} />
              <span>Submit Declaration Proof</span>
            </button>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">Employee</th>
                    <th className="py-3 px-4 font-medium">Regime</th>
                    <th className="py-3 px-4 font-medium">Section / Category</th>
                    <th className="py-3 px-4 font-medium">Claimed Amount</th>
                    <th className="py-3 px-4 font-medium">Proof Document</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {declarations.map((dec) => (
                    <tr key={dec.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[var(--text-primary)]">{dec.empName}</div>
                        <div className="text-[11px] font-mono text-[var(--text-tertiary)]">{dec.empCode}</div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{dec.regime}</td>
                      <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{dec.section}</td>
                      <td className="py-3 px-4 font-mono font-medium text-[var(--text-primary)]">{dec.claimedAmount}</td>
                      <td className="py-3 px-4 text-[11px] text-[var(--text-secondary)] max-w-xs truncate">{dec.proofDocument}</td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'text-[11px] font-semibold',
                            dec.status === 'Verified & Approved' ? 'text-emerald-700' : 'text-amber-600'
                          )}
                        >
                          {dec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {dec.status === 'Pending Verification' && role === 'hr_admin' ? (
                          <button
                            onClick={() => handleVerifyDeclaration(dec.id, dec.empName)}
                            className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
                          >
                            Verify & Approve
                          </button>
                        ) : (
                          <span className="text-[11px] text-[var(--text-tertiary)]">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Payslip Viewer */}
      {activeTab === 'payslip' && (
        <div className="space-y-4">
          {role === 'hr_admin' && (
            <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between text-[12px]">
              <span className="font-medium text-[var(--text-secondary)]">Inspect employee payslip:</span>
              <select
                value={selectedPayslipEmp}
                onChange={(e) => setSelectedPayslipEmp(e.target.value)}
                className="px-3 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none font-medium"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeCode}) — {emp.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Realistic Payslip Document Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-md p-6 max-w-3xl mx-auto space-y-6">
            <div className="border-b border-[var(--border-subtle)] pb-4 flex items-start justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
                  INBOX INFOTECH
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)] font-mono mt-0.5">
                  CIN: L65920MH2010PLC204812 • SEBI Reg: INZ000219438
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Tower 2, Floor 14, Bandra-Kurla Complex (BKC), Mumbai 400051
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-[var(--brand-subtle)] text-[var(--brand-primary)] font-bold text-[12px] border border-[var(--brand-border)]">
                  PAYSLIP: NOV 2026
                </span>
              </div>
            </div>

            {/* Employee Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] p-3.5 bg-[var(--bg-surface-subtle)] rounded-lg">
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Employee Name</span>
                <span className="font-bold text-[var(--text-primary)]">{activeEmp.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Employee Code</span>
                <span className="font-mono font-medium text-[var(--text-primary)]">{activeEmp.employeeCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Department</span>
                <span className="font-medium text-[var(--text-primary)]">{activeEmp.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Bank Account</span>
                <span className="font-mono text-[var(--text-primary)]">Kotak •••• 9412</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Income Tax PAN</span>
                <span className="font-mono font-medium text-[var(--text-primary)]">{activeEmp.panNumber || 'ABCPI8821K'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">EPFO UAN</span>
                <span className="font-mono font-medium text-[var(--text-primary)]">{activeEmp.uanNumber || '101482910482'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Days Payable</span>
                <span className="font-bold text-[var(--text-primary)]">30 Days</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Tax Regime</span>
                <span className="font-medium text-emerald-700">Old Regime (Opted)</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12px]">
              {/* Earnings */}
              <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                <div className="bg-[var(--bg-surface-subtle)] p-2.5 font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] flex justify-between">
                  <span>Earnings Breakdown</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="p-3 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Basic Salary</span>
                    <span className="font-medium">₹1,18,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">House Rent Allowance (HRA)</span>
                    <span className="font-medium">₹59,375</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Special Executive Allowance</span>
                    <span className="font-medium">₹44,375</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Performance Incentive</span>
                    <span className="font-medium">₹15,000</span>
                  </div>
                  <div className="border-t border-[var(--border-subtle)] pt-2 flex justify-between font-bold text-[var(--text-primary)] text-[13px]">
                    <span>Total Gross Earnings</span>
                    <span>₹2,37,500</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                <div className="bg-[var(--bg-surface-subtle)] p-2.5 font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] flex justify-between">
                  <span>Statutory Deductions</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="p-3 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Provident Fund (Employee 12%)</span>
                    <span className="font-medium">₹14,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Maharashtra Professional Tax</span>
                    <span className="font-medium">₹200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">TDS (Income Tax Sec 192)</span>
                    <span className="font-medium">₹28,650</span>
                  </div>
                  <div className="flex justify-between text-transparent select-none">
                    <span>—</span>
                    <span>—</span>
                  </div>
                  <div className="border-t border-[var(--border-subtle)] pt-2 flex justify-between font-bold text-[var(--danger)] text-[13px]">
                    <span>Total Deductions</span>
                    <span>₹43,100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Take-Home Highlight */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
                  Net Take-Home Pay Disbursed
                </span>
                <span className="text-[12px] text-emerald-800 dark:text-emerald-400">
                  One Lakh Ninety Four Thousand Four Hundred Rupees Only
                </span>
              </div>
              <div className="text-right">
                <span className="text-[26px] font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                  ₹1,94,400
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--text-tertiary)]">
                Digitally generated and verified by Inbox Infotech HR & Finance Department.
              </span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs cursor-pointer"
              >
                <Printer size={14} strokeWidth={2} />
                <span>Print Official Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Fullscreen / Print Modal */}
      {isPayslipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">November 2026 Payslip</h3>
              <button onClick={() => setIsPayslipModalOpen(false)} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={16} />
              </button>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              This official payslip is certified and archived. You can print directly or save as PDF.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsPayslipModalOpen(false)}
                className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] rounded-[6px] flex items-center space-x-1.5"
              >
                <Printer size={14} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Submit Tax Declaration */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Submit Tax Deduction Proof</h3>
              <button onClick={() => setIsTaxModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddTaxDeclaration} className="p-5 space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Tax Regime</label>
                <select
                  value={newRegime}
                  onChange={(e) => setNewRegime(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                >
                  <option value="Old Regime">Old Tax Regime (With Deductions)</option>
                  <option value="New Regime (115BAC)">New Tax Regime (Sec 115BAC)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Deduction Section</label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                >
                  <option value="Sec 80C (PPF / ELSS / Life Insurance)">Sec 80C (PPF / ELSS / Life Insurance)</option>
                  <option value="HRA (Sec 10(13A))">House Rent Allowance (HRA Sec 10(13A))</option>
                  <option value="Sec 80D (Mediclaim)">Medical Insurance Premium (Sec 80D)</option>
                  <option value="Home Loan Interest (Sec 24b)">Home Loan Interest (Sec 24b)</option>
                  <option value="NPS (Sec 80CCD(1B))">National Pension System (80CCD(1B))</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Claimed Amount (INR)</label>
                <input
                  type="text"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Supporting Document Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Rent Agreement + Rent Receipts"
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsTaxModalOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px]"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
