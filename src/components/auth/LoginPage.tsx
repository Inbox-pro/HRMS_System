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
} from 'lucide-react';
import { useHrms } from '../../context/HrmsContext';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';
import loginScene from '../../assets/login-scene.jpg';

export function LoginPage() {
  const { login } = useHrms();
  const { showToast } = useToast();

  const [email, setEmail] = useState('pooja.agarwal@acmefin.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('hr_admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const enterClass = `transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`;
  const enterStyle = (delayMs: number) => ({ transitionDelay: `${delayMs}ms` });

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
      message: `Signed in successfully as ${selectedRole === 'hr_admin'
          ? 'HR Administrator'
          : selectedRole === 'manager'
            ? 'Risk Team Manager'
            : 'Employee (Ananya Iyer)'
        }.`,
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Left Editorial Scene Panel (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white p-12 flex-col justify-between">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, #000 72%, transparent 100%)',
            maskImage: 'linear-gradient(to right, #000 72%, transparent 100%)',
          }}
        >
          <img
            src={loginScene}
            alt="Minimalist walnut ledger desk with a linen-bound book and brass pen in morning light"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#072b25]/55 via-[#072b25]/15 to-[#072b25]/65"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 space-y-10">
          <div className={`flex items-center space-x-3 ${enterClass}`} style={enterStyle(0)}>
            <div className="w-8 h-8 rounded-[6px] bg-white/15 border border-white/25 flex items-center justify-center font-semibold text-[15px]">
              O
            </div>
            <div>
              <span className="text-[16px] font-semibold tracking-tight block leading-tight">Orbit HR</span>
              <span className="text-[12px] text-white/80 block leading-tight">
                Acme Financial Services
              </span>
            </div>
          </div>

          <div className={`max-w-lg space-y-3 pt-6 ${enterClass}`} style={enterStyle(50)}>
            <h1 className="text-[36px] font-medium leading-[1.15] tracking-tight">
              Workforce, payroll, and statutory compliance in one ledger
            </h1>

            <p className="text-[14px] text-white/85 leading-relaxed max-w-md">
              Biometric attendance syncing, EPFO ECR challans, Section 192 TDS calculations, and approvals for Mumbai and Pune offices.
            </p>
          </div>
        </div>


      </div>

      {/* Right Login Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[var(--bg-page)]">
        <div
          className={`w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6 ${enterClass}`}
          style={enterStyle(100)}
        >
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-[6px] bg-[var(--brand-primary)] text-white flex items-center justify-center font-semibold text-[14px]">
              O
            </div>
            <span className="text-[16px] font-semibold text-[var(--text-primary)]">Orbit HR</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-[24px] font-medium text-[var(--text-primary)] tracking-tight">
              Sign in to your workspace
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Enter your corporate credentials or choose a demo role
            </p>
          </div>

          {/* Persona Switcher Buttons for Quick Demo */}
          <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl space-y-3">
            <span className="text-[12px] font-medium text-[var(--text-secondary)] block">
              Demo role
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePersonaSelect('hr_admin', 'pooja.agarwal@acmefin.in')}
                className={`p-3 rounded-[8px] border text-left transition-colors duration-150 cursor-pointer ${selectedRole === 'hr_admin'
                    ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)]'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                  }`}
              >
                <Shield
                  size={16}
                  strokeWidth={1.5}
                  className={selectedRole === 'hr_admin' ? 'text-[var(--brand-primary)] mb-1.5' : 'text-[var(--text-tertiary)] mb-1.5'}
                />
                <span className="text-[12px] font-medium text-[var(--text-primary)] block leading-tight">
                  HR Admin
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)] block truncate">Full system</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('manager', 'vikram.patel@acmefin.in')}
                className={`p-3 rounded-[8px] border text-left transition-colors duration-150 cursor-pointer ${selectedRole === 'manager'
                    ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)]'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                  }`}
              >
                <Briefcase
                  size={16}
                  strokeWidth={1.5}
                  className={selectedRole === 'manager' ? 'text-[var(--brand-primary)] mb-1.5' : 'text-[var(--text-tertiary)] mb-1.5'}
                />
                <span className="text-[12px] font-medium text-[var(--text-primary)] block leading-tight">
                  Manager
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)] block truncate">Team pod (18)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('employee', 'ananya.iyer@acmefin.in')}
                className={`p-3 rounded-[8px] border text-left transition-colors duration-150 cursor-pointer ${selectedRole === 'employee'
                    ? 'bg-[var(--brand-subtle)] border-[var(--brand-primary)]'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                  }`}
              >
                <User
                  size={16}
                  strokeWidth={1.5}
                  className={selectedRole === 'employee' ? 'text-[var(--brand-primary)] mb-1.5' : 'text-[var(--text-tertiary)] mb-1.5'}
                />
                <span className="text-[12px] font-medium text-[var(--text-primary)] block leading-tight">
                  Employee
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)] block truncate">Ananya (ESS)</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                Corporate email
              </label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@acmefin.in"
                  className="w-full h-10 pl-9 pr-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[12px] text-[var(--brand-primary)] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-10 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer text-[12px] text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[var(--border-default)] accent-[var(--brand-primary)]"
              />
              <span>Remember this workstation</span>
            </label>

            <button
              type="submit"
              className="w-full h-10 rounded-[8px] font-medium text-[13px] text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] transition-colors duration-150 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Sign in</span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </form>

          {/* SSO Alternative */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border-subtle)]" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-[var(--bg-surface)] px-2 text-[var(--text-tertiary)]">
                Enterprise authentication
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
            className="w-full h-10 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[8px] text-[13px] font-medium text-[var(--text-primary)] transition-colors duration-150 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Shield size={16} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
            <span>Continue with Acme Corporate SSO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
