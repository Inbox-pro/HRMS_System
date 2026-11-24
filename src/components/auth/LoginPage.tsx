import React, { useState, useEffect } from 'react';
import {
  Shield,
  Briefcase,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useHrms } from '../../context/HrmsContext';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

const TYPEWRITER_PHRASES = [
  'Indian Payroll & Compliance.',
  'Biometric Attendance & Leaves.',
  'Automated EPFO ECR & TDS.',
  'Enterprise Performance & OKRs.',
  'Intelligent People Operations.',
];

export function LoginPage() {
  const { login } = useHrms();
  const { showToast } = useToast();

  const [email, setEmail] = useState('pooja.agarwal@acmefin.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('hr_admin');
  const [rememberMe, setRememberMe] = useState(true);

  // Dynamic Writing Animation State
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIdx];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
        if (typedText.length + 1 === currentPhrase.length) {
          // Pause at full phrase before starting delete
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
        if (typedText.length - 1 === 0) {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, isDeleting ? 30 : 65);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx]);

  const handlePersonaSelect = (role: UserRole, defaultEmail: string) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setPassword('Acme@2026!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, email);
    showToast({
      type: 'success',
      message: `Signed in successfully as ${
        selectedRole === 'hr_admin'
          ? 'HR Administrator'
          : selectedRole === 'manager'
          ? 'Risk Team Manager'
          : 'Employee (Ananya Iyer)'
      }.`,
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Left Branding Showcase (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--brand-primary)] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated glowing ambient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-emerald-300/15 blur-3xl animate-pulse-glow-delayed" />
        <div className="absolute -bottom-32 -left-12 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl animate-pulse-glow" />

        {/* Dynamic perspective dot-matrix grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-[18px] shadow-lg">
              O
            </div>
            <div>
              <span className="text-[20px] font-bold tracking-tight block">Orbit HR</span>
              <span className="text-[11px] text-emerald-200 tracking-wider uppercase font-semibold">
                Enterprise Workforce Cloud
              </span>
            </div>
          </div>

          <div className="pt-16 max-w-lg space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[12px] font-medium text-emerald-200 backdrop-blur-xs">
              <Sparkles size={14} className="text-emerald-300 animate-pulse" />
              <span>Next-Gen Enterprise Human Capital Suite</span>
            </div>

            {/* Dynamic Typewriter Writing Animation Header */}
            <h1 className="text-[38px] font-extrabold leading-[1.2] tracking-tight min-h-[145px]">
              Unified People Operations, <br />
              <span className="text-emerald-300 font-extrabold">
                {typedText}
              </span>
              <span className="inline-block w-[3px] h-[34px] bg-emerald-300 ml-1.5 animate-pulse align-middle" />
            </h1>

            <p className="text-[14px] text-emerald-100/90 leading-relaxed max-w-md pt-2">
              Real-time biometric attendance syncing, Automated EPFO ECR & Section 192 TDS calculations,
              and intelligent HR workflows built for high-scale organizations.
            </p>
          </div>
        </div>

        {/* Client Endorsement Card & Enterprise Trust */}
        <div className="relative z-10 space-y-3.5">
          <div className="p-4 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 space-y-2.5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-white text-[var(--brand-primary)] flex items-center justify-center font-bold text-[13px] shadow-sm">
                PA
              </div>
              <div>
                <span className="text-[13px] font-bold block text-white">Pooja Agarwal • Chief Financial Officer</span>
                <span className="text-[11px] text-emerald-200/80 font-mono">Acme Financial Services Limited</span>
              </div>
            </div>
            <p className="text-[12px] text-white/90 italic leading-snug">
              "Orbit HR replaced manual Excel payroll runs and biometric reconciliation across our Mumbai and Pune offices. Monthly salary disbursement dropped from 5 days to 45 minutes."
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-200/70 border-t border-white/10 pt-3">
            <span>ISO 27001:2022 • SOC 2 Type II Certified</span>
            <span>Direct Kotak & ICICI Banking Gateway</span>
          </div>
        </div>
      </div>

      {/* Right Login Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-[14px]">
              O
            </div>
            <span className="text-[18px] font-bold text-[var(--text-primary)]">Orbit HR</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
              Sign in to your workspace
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Enter your corporate credentials or select a one-click persona
            </p>
          </div>

          {/* Persona Switcher Buttons for Quick Demo */}
          <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                One-Click Demo Personas:
              </span>
              <span className="text-[10px] text-[var(--brand-primary)] font-semibold">Instant Access</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePersonaSelect('hr_admin', 'pooja.agarwal@acmefin.in')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRole === 'hr_admin'
                    ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                }`}
              >
                <Shield size={16} className="text-[var(--brand-primary)] mb-1" />
                <span className="text-[12px] font-bold text-[var(--text-primary)] block leading-tight">
                  HR Admin
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] block truncate">Full System</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('manager', 'vikram.patel@acmefin.in')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRole === 'manager'
                    ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                }`}
              >
                <Briefcase size={16} className="text-emerald-700 mb-1" />
                <span className="text-[12px] font-bold text-[var(--text-primary)] block leading-tight">
                  Manager
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] block truncate">Team Pod (18)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('employee', 'ananya.iyer@acmefin.in')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRole === 'employee'
                    ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                }`}
              >
                <User size={16} className="text-teal-600 mb-1" />
                <span className="text-[12px] font-bold text-[var(--text-primary)] block leading-tight">
                  Employee
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] block truncate">Ananya (ESS)</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@acmefin.in"
                  className="w-full pl-9 pr-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-[var(--brand-primary)] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer text-[12px] text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[var(--border-default)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-medium">SSL Encrypted</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-[6px] font-semibold text-[13px] text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Sign In to Orbit Workspace</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* SSO Alternative */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border-subtle)]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-[var(--bg-page)] px-2 text-[var(--text-tertiary)] font-semibold tracking-wider">
                Enterprise Authentication
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              login(selectedRole, email);
              showToast({
                type: 'info',
                message: 'Authenticated via Acme Okta / Azure AD SAML Single Sign-On.',
              });
            }}
            className="w-full py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] text-[12px] font-semibold text-[var(--text-primary)] shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Shield size={14} className="text-emerald-700" />
            <span>Continue with Acme Corporate SSO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
