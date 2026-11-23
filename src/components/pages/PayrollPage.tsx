import { useState } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

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
  {
    id: 'tax-4',
    empName: 'Vikram Patel',
    empCode: 'EMP-10214',
    regime: 'New Regime (115BAC)',
    section: 'Standard Deduction + NPS (80CCD(2))',
    claimedAmount: '₹75,000 + ₹2,80,000',
    verifiedAmount: 'Auto-computed',
    status: 'Verified & Approved',
    proofDocument: 'Corporate NPS Kotak Pension Fund Schedule',
  },
];

interface PayslipData {
  empId: string;
  name: string;
  role: string;
  empCode: string;
  pan: string;
  uan: string;
  pfNo: string;
  bankName: string;
  bankAccount: string;
  basic: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  grossPay: number;
  pfEmployee: number;
  profTax: number;
  tds: number;
  totalDeductions: number;
  netPay: number;
  epfEmployer: number;
  epsEmployer: number;
  gratuity: number;
}

const PAYSLIP_RECORDS: Record<string, PayslipData> = {
  'emp-10482': {
    empId: 'emp-10482',
    name: 'Ananya Iyer',
    role: 'AVP, Equity Research',
    empCode: 'EMP-10482',
    pan: 'ABCPI4920K',
    uan: '100928374615',
    pfNo: 'MH/BAN/0049281/000/010482',
    bankName: 'Kotak Mahindra Bank',
    bankAccount: '•••• •••• 9412',
    basic: 118750,
    hra: 59375,
    specialAllowance: 44375,
    bonus: 15000,
    grossPay: 237500,
    pfEmployee: 14250,
    profTax: 200,
    tds: 28650,
    totalDeductions: 43100,
    netPay: 194400,
    epfEmployer: 4368,
    epsEmployer: 9882,
    gratuity: 5712,
  },
  'emp-10931': {
    empId: 'emp-10931',
    name: 'Rohan Mehta',
    role: 'Lead Compliance Officer',
    empCode: 'EMP-10931',
    pan: 'AAAPM7714C',
    uan: '100812739401',
    pfNo: 'MH/BAN/0049281/000/010931',
    bankName: 'HDFC Bank',
    bankAccount: '•••• •••• 1083',
    basic: 87500,
    hra: 43750,
    specialAllowance: 33750,
    bonus: 10000,
    grossPay: 175000,
    pfEmployee: 10500,
    profTax: 200,
    tds: 18400,
    totalDeductions: 29100,
    netPay: 145900,
    epfEmployer: 3222,
    epsEmployer: 7278,
    gratuity: 4208,
  },
};

export function PayrollPage({ role }: PayrollPageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'disbursement' | 'challans' | 'tax_regime' | 'payslip'>(
    role === 'employee' || role === 'manager' ? 'payslip' : 'disbursement'
  );
  const [declarations, setDeclarations] = useState<TaxDeclarationItem[]>(INITIAL_TAX_DECLARATIONS);
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<string>(
    role === 'employee' ? 'emp-10482' : role === 'manager' ? 'emp-10931' : 'emp-10482'
  );

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

  const currentPayslip = PAYSLIP_RECORDS[selectedPayslipEmp] || PAYSLIP_RECORDS['emp-10482'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'My Compensation & Payslips' : 'Payroll & Statutory Processing'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {role === 'employee'
              ? 'Ananya Iyer (EMP-10482) • Band L5 • Disbursed via Kotak Mahindra Bank'
              : 'November 2026 cycle • Kotak Corporate Banking payment gateway'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {role === 'employee' ? (
            <button
              onClick={() => showToast({ type: 'success', message: 'Downloading November 2026 Encrypted Payslip PDF' })}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
            >
              <Download size={13} strokeWidth={1.7} />
              <span>Download Nov 2026 Payslip</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => showToast({ type: 'info', message: 'Downloading Monthly Bank Disbursement advice (.txt/NEFT)' })}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors"
              >
                <Download size={13} strokeWidth={1.7} />
                <span>NEFT batch text</span>
              </button>
              <button
                onClick={handleApproveBatch}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
              >
                <span>Approve & release NEFT batch (₹4,82,40,000)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Metric Tiles */}
      {role === 'employee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Net take-home pay</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums font-mono">
              ₹1,94,400
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">Value date: 30 Nov 2026</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Gross monthly salary</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums font-mono">
              ₹2,37,500
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Annual CTC: ₹28,50,000</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">TDS deducted (IT Act)</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums font-mono">
              ₹28,650
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Old Tax Regime elected</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">PF employee deduction</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums font-mono">
              ₹14,250
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">12% on Basic (EPFO)</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Total gross payout</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              ₹5,48,20,000
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Basic: ₹2,74.1 L • Variables: ₹85.6 L</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Employee PF withheld</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              ₹42,80,000
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">12% on Basic (EPFO ECR)</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">TDS deducted (IT Act)</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              ₹68,40,000
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Section 192 Monthly withholding</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Net bank disbursement</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              ₹4,82,40,000
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">Reconciled to last rupee</span>
          </div>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px] overflow-x-auto">
        {role === 'employee' ? (
          <>
            <button
              onClick={() => setActiveTab('payslip')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'payslip'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My salary slip preview
            </button>
            <button
              onClick={() => setActiveTab('tax_regime')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'tax_regime'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My tax regime & investment proofs
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('disbursement')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'disbursement'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Department disbursement ledger
            </button>
            <button
              onClick={() => setActiveTab('challans')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'challans'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Statutory compliance challans (4)
            </button>
            <button
              onClick={() => setActiveTab('tax_regime')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'tax_regime'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Income tax regime & declarations (Sec 115BAC)
            </button>
            <button
              onClick={() => setActiveTab('payslip')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'payslip'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Interactive salary slip viewer
            </button>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. DISBURSEMENT TABLE */}
      {/* ============================================================== */}
      {activeTab === 'disbursement' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Department</th>
                  <th className="py-2.5 px-4 font-medium text-right">Headcount</th>
                  <th className="py-2.5 px-4 font-medium text-right">Gross payout</th>
                  <th className="py-2.5 px-4 font-medium text-right">Basic salary</th>
                  <th className="py-2.5 px-4 font-medium text-right">Incentives</th>
                  <th className="py-2.5 px-4 font-medium text-right">PF withheld</th>
                  <th className="py-2.5 px-4 font-medium text-right">TDS withheld</th>
                  <th className="py-2.5 px-4 font-medium text-right">Net payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {DEPT_PAYROLL.map((item) => (
                  <tr key={item.department} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">{item.department}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-secondary)]">{item.headcount}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-primary)]">{item.grossPay}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-tertiary)]">{item.basicSalary}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-tertiary)]">{item.variableIncentives}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-secondary)]">{item.pfDeductions}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-secondary)]">{item.tdsWithheld}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-[var(--brand-primary)]">{item.netPayable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. STATUTORY COMPLIANCE CHALLANS */}
      {/* ============================================================== */}
      {activeTab === 'challans' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Statutory Compliance & Challan Summary (November 2026 Cycle)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
            <div className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">EPFO ECR Challan</span>
                <span className="font-mono text-[var(--brand-primary)] font-semibold">₹85.60 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Employer (12%) + Employee (12%) + EDLI & Admin charges. Due date: 15 Dec 2026.</p>
              <span className="text-[11px] text-[var(--success-text)] font-medium">ECR text file generated and validated</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">ESIC Monthly Contribution</span>
                <span className="font-mono text-[var(--brand-primary)] font-semibold">₹1.42 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Employees with monthly wage &le; ₹21,000. Due date: 15 Dec 2026.</p>
              <span className="text-[11px] text-[var(--success-text)] font-medium">Form 5 return prepared</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">Income Tax Section 192 (TDS)</span>
                <span className="font-mono text-[var(--brand-primary)] font-semibold">₹68.40 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Central Government monthly withholding tax. Due date: 07 Dec 2026 (Challan ITNS 281).</p>
              <span className="text-[11px] text-[var(--success-text)] font-medium">NSDL e-payment remittance queued</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">Maharashtra Professional Tax (PT)</span>
                <span className="font-mono text-[var(--brand-primary)] font-semibold">₹2.56 L</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Form III-B state tax. Due date: 30 Nov 2026.</p>
              <span className="text-[11px] text-[var(--success-text)] font-medium">Mahagst challan generated</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TAX REGIME & PROOF VERIFICATION QUEUE */}
      {/* ============================================================== */}
      {activeTab === 'tax_regime' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)]">New Tax Regime (Sec 115BAC)</span>
              <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
                782 employees (60.9%)
              </div>
              <span className="text-[11px] text-[var(--text-tertiary)]">Concessional tax slabs • Standard deduction ₹75,000</span>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Old Tax Regime</span>
              <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
                502 employees (39.1%)
              </div>
              <span className="text-[11px] text-[var(--text-tertiary)]">Claiming Sec 80C, 80D, HRA & Home Loan interest</span>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
            <div className="p-3 border-b border-[var(--border-subtle)] flex justify-between items-center">
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Investment Proof Verification Queue (Old Regime Filers)
              </h3>
              <span className="text-[11px] text-[var(--text-tertiary)]">Deadline for proof submission: 31 Dec 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                    <th className="py-2.5 px-4 font-medium">Employee</th>
                    <th className="py-2.5 px-4 font-medium">Regime</th>
                    <th className="py-2.5 px-4 font-medium">Section</th>
                    <th className="py-2.5 px-4 font-medium">Claimed</th>
                    <th className="py-2.5 px-4 font-medium">Supporting proof</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {declarations.map((d) => (
                    <tr key={d.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-[var(--text-primary)]">{d.empName}</div>
                        <div className="text-[11px] font-mono text-[var(--text-tertiary)]">{d.empCode}</div>
                      </td>
                      <td className="py-2.5 px-4 text-[var(--text-secondary)] text-[11px]">{d.regime}</td>
                      <td className="py-2.5 px-4 font-medium text-[var(--text-primary)]">{d.section}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{d.claimedAmount}</td>
                      <td className="py-2.5 px-4 text-[11px] text-[var(--text-secondary)] max-w-xs truncate">{d.proofDocument}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[11px] font-medium ${
                            d.status === 'Verified & Approved'
                              ? 'text-[var(--success-text)]'
                              : 'text-[var(--warning-text)]'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {d.status !== 'Verified & Approved' ? (
                          <button
                            onClick={() => handleVerifyDeclaration(d.id, d.empName)}
                            className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline"
                          >
                            Verify & approve
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

      {/* ============================================================== */}
      {/* 4. INTERACTIVE SALARY SLIP VIEWER */}
      {/* ============================================================== */}
      {activeTab === 'payslip' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <div className="flex items-center space-x-2 text-[12px]">
              <span className="text-[var(--text-secondary)]">Select employee payslip:</span>
              <select
                value={selectedPayslipEmp}
                onChange={(e) => setSelectedPayslipEmp(e.target.value)}
                className="px-2.5 py-1 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)]"
              >
                <option value="emp-10482">Ananya Iyer (AVP, Equity Research • EMP-10482)</option>
                <option value="emp-10931">Rohan Mehta (Lead Compliance Officer • EMP-10931)</option>
              </select>
            </div>

            <button
              onClick={() => showToast({ type: 'success', message: `Downloading encrypted Payslip PDF for ${currentPayslip.name} (Password: PAN in capital + Birth Year)` })}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px]"
            >
              <Download size={13} />
              <span>Download Payslip PDF</span>
            </button>
          </div>

          {/* Payslip Document Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 space-y-4 text-[12px] max-w-4xl mx-auto shadow-xs">
            {/* Payslip Header */}
            <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">
                  ACME FINANCIAL SERVICES LIMITED
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Level 8, Tower 2, Equinox Business Park, Bandra-Kurla Complex (BKC), Mumbai 400051
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)]">CIN: U67120MH2012PLC239104 • SEBI Reg: INZ000219438</p>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-semibold text-[var(--brand-primary)] block">
                  PAYSLIP FOR NOVEMBER 2026
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Generated: 23 Nov 2026</span>
              </div>
            </div>

            {/* Employee Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[11px]">
              <div>
                <span className="text-[var(--text-tertiary)] block">Employee Name</span>
                <strong className="text-[var(--text-primary)]">{currentPayslip.name}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Employee Code</span>
                <strong className="text-[var(--text-primary)] font-mono">{currentPayslip.empCode}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Designation</span>
                <strong className="text-[var(--text-primary)]">{currentPayslip.role}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">PAN</span>
                <strong className="text-[var(--text-primary)] font-mono">{currentPayslip.pan}</strong>
              </div>

              <div>
                <span className="text-[var(--text-tertiary)] block">UAN</span>
                <strong className="text-[var(--text-primary)] font-mono">{currentPayslip.uan}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">PF Account Number</span>
                <strong className="text-[var(--text-primary)] font-mono">{currentPayslip.pfNo}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Bank Disbursement</span>
                <strong className="text-[var(--text-primary)]">{currentPayslip.bankName}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Bank Account</span>
                <strong className="text-[var(--text-primary)] font-mono">{currentPayslip.bankAccount}</strong>
              </div>
            </div>

            {/* Earnings and Deductions Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="border border-[var(--border-subtle)] rounded overflow-hidden">
                <div className="px-3 py-1.5 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] font-semibold text-[11px] text-[var(--text-secondary)]">
                  EARNINGS
                </div>
                <div className="p-3 space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Basic Salary (50%)</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.basic.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">House Rent Allowance (HRA)</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.hra.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Special Allowance</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.specialAllowance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Performance Incentive</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.bonus.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between font-semibold">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.grossPay.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-[var(--border-subtle)] rounded overflow-hidden">
                <div className="px-3 py-1.5 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] font-semibold text-[11px] text-[var(--text-secondary)]">
                  DEDUCTIONS
                </div>
                <div className="p-3 space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Provident Fund (Employee 12%)</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.pfEmployee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Maharashtra Professional Tax</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.profTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Tax Deducted at Source (TDS 192)</span>
                    <span className="font-mono tabular-nums text-[var(--text-primary)]">₹{currentPayslip.tds.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-transparent select-none">
                    <span>Spacer</span>
                    <span>—</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span className="font-mono tabular-nums text-[var(--danger-text)]">₹{currentPayslip.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay Callout */}
            <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[var(--text-tertiary)] block">Net Take-Home Pay (Disbursed via NEFT)</span>
                <span className="text-[20px] font-bold text-[var(--brand-primary)] font-mono tabular-nums">
                  ₹{currentPayslip.netPay.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-[11px] text-[var(--text-secondary)]">
                <span>Paid days: <strong>30.0</strong> • Loss of Pay (LOP): <strong>0.0</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
