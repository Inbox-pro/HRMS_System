import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react';
import { useToast } from './Toast';

export interface CalendarDayRecord {
  dayNumber: number;
  dateStr: string; // '2026-11-23'
  dayOfWeek: string; // 'Mon', 'Tue', etc.
  type: 'present' | 'weekend' | 'holiday' | 'leave' | 'late' | 'future' | 'today';
  statusLabel: string;
  inTime?: string;
  outTime?: string;
  workHours?: string;
  overtime?: string;
  holidayName?: string;
  leaveType?: string;
  terminal?: string;
  shiftName?: string;
  isRegularized?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// November 2026 days (30 days, 1 Nov 2026 was Sunday)
const NOVEMBER_DAYS: CalendarDayRecord[] = [
  { dayNumber: 1, dateStr: '2026-11-01', dayOfWeek: 'Sun', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 2, dateStr: '2026-11-02', dayOfWeek: 'Mon', type: 'present', statusLabel: 'Present', inTime: '09:08 AM', outTime: '06:35 PM', workHours: '9h 27m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 3, dateStr: '2026-11-03', dayOfWeek: 'Tue', type: 'present', statusLabel: 'Present', inTime: '09:15 AM', outTime: '06:40 PM', workHours: '9h 25m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 4, dateStr: '2026-11-04', dayOfWeek: 'Wed', type: 'present', statusLabel: 'Present', inTime: '09:12 AM', outTime: '06:30 PM', workHours: '9h 18m', terminal: 'BKC HQ - Turnstile 01', shiftName: 'General 09:30-18:30' },
  { dayNumber: 5, dateStr: '2026-11-05', dayOfWeek: 'Thu', type: 'present', statusLabel: 'Present', inTime: '09:05 AM', outTime: '06:45 PM', workHours: '9h 40m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 6, dateStr: '2026-11-06', dayOfWeek: 'Fri', type: 'present', statusLabel: 'Present', inTime: '09:10 AM', outTime: '07:15 PM', workHours: '10h 05m', overtime: '0h 45m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 7, dateStr: '2026-11-07', dayOfWeek: 'Sat', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 8, dateStr: '2026-11-08', dayOfWeek: 'Sun', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 9, dateStr: '2026-11-09', dayOfWeek: 'Mon', type: 'present', statusLabel: 'Present', inTime: '09:02 AM', outTime: '06:30 PM', workHours: '9h 28m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 10, dateStr: '2026-11-10', dayOfWeek: 'Tue', type: 'present', statusLabel: 'Present', inTime: '09:14 AM', outTime: '06:45 PM', workHours: '9h 31m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 11, dateStr: '2026-11-11', dayOfWeek: 'Wed', type: 'present', statusLabel: 'Present', inTime: '09:10 AM', outTime: '06:35 PM', workHours: '9h 25m', terminal: 'BKC HQ - Turnstile 01', shiftName: 'General 09:30-18:30' },
  { dayNumber: 12, dateStr: '2026-11-12', dayOfWeek: 'Thu', type: 'leave', statusLabel: 'Casual Leave', leaveType: 'Casual Leave (CL)', workHours: 'On Leave' },
  { dayNumber: 13, dateStr: '2026-11-13', dayOfWeek: 'Fri', type: 'present', statusLabel: 'Present', inTime: '09:08 AM', outTime: '06:40 PM', workHours: '9h 32m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 14, dateStr: '2026-11-14', dayOfWeek: 'Sat', type: 'holiday', statusLabel: 'Diwali Balipratipada', holidayName: 'Diwali (State Holiday)' },
  { dayNumber: 15, dateStr: '2026-11-15', dayOfWeek: 'Sun', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 16, dateStr: '2026-11-16', dayOfWeek: 'Mon', type: 'late', statusLabel: 'Late Punch', inTime: '09:44 AM', outTime: '06:50 PM', workHours: '9h 06m', terminal: 'BKC HQ - Turnstile 01', shiftName: 'General 09:30-18:30' },
  { dayNumber: 17, dateStr: '2026-11-17', dayOfWeek: 'Tue', type: 'present', statusLabel: 'Present', inTime: '09:12 AM', outTime: '06:30 PM', workHours: '9h 18m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 18, dateStr: '2026-11-18', dayOfWeek: 'Wed', type: 'present', statusLabel: 'Present', inTime: '09:06 AM', outTime: '06:35 PM', workHours: '9h 29m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 19, dateStr: '2026-11-19', dayOfWeek: 'Thu', type: 'present', statusLabel: 'Present', inTime: '09:08 AM', outTime: '06:20 PM', workHours: '9h 12m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 20, dateStr: '2026-11-20', dayOfWeek: 'Fri', type: 'present', statusLabel: 'Present', inTime: '09:18 AM', outTime: '07:10 PM', workHours: '9h 52m', overtime: '0h 52m', terminal: 'BKC HQ - Turnstile 01', shiftName: 'General 09:30-18:30' },
  { dayNumber: 21, dateStr: '2026-11-21', dayOfWeek: 'Sat', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 22, dateStr: '2026-11-22', dayOfWeek: 'Sun', type: 'present', statusLabel: 'Comp-Off Earned', inTime: '09:05 AM', outTime: '06:30 PM', workHours: '9h 25m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'Production Release On-Call' },
  { dayNumber: 23, dateStr: '2026-11-23', dayOfWeek: 'Mon', type: 'today', statusLabel: 'Today (Active)', inTime: '09:14 AM', outTime: 'In Progress', workHours: '8h 28m', terminal: 'BKC HQ - Turnstile 02', shiftName: 'General 09:30-18:30' },
  { dayNumber: 24, dateStr: '2026-11-24', dayOfWeek: 'Tue', type: 'future', statusLabel: 'Scheduled Work Day' },
  { dayNumber: 25, dateStr: '2026-11-25', dayOfWeek: 'Wed', type: 'future', statusLabel: 'Scheduled Work Day' },
  { dayNumber: 26, dateStr: '2026-11-26', dayOfWeek: 'Thu', type: 'future', statusLabel: 'Scheduled Work Day' },
  { dayNumber: 27, dateStr: '2026-11-27', dayOfWeek: 'Fri', type: 'future', statusLabel: 'Scheduled Work Day' },
  { dayNumber: 28, dateStr: '2026-11-28', dayOfWeek: 'Sat', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 29, dateStr: '2026-11-29', dayOfWeek: 'Sun', type: 'weekend', statusLabel: 'Weekly Off' },
  { dayNumber: 30, dateStr: '2026-11-30', dayOfWeek: 'Mon', type: 'future', statusLabel: 'Payroll Disbursal Day' },
];

// October 2026 days (31 days, 1 Oct 2026 was Thursday)
const OCTOBER_DAYS: CalendarDayRecord[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const date = new Date(2026, 9, day);
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isGandhiJayanti = day === 2;
  const isDussehra = day === 20;

  if (isGandhiJayanti) {
    return {
      dayNumber: day,
      dateStr: `2026-10-02`,
      dayOfWeek,
      type: 'holiday',
      statusLabel: 'Gandhi Jayanti',
      holidayName: 'Mahatma Gandhi Jayanti (National Holiday)',
    };
  }
  if (isDussehra) {
    return {
      dayNumber: day,
      dateStr: `2026-10-20`,
      dayOfWeek,
      type: 'holiday',
      statusLabel: 'Dussehra',
      holidayName: 'Vijayadashami / Dussehra (State Holiday)',
    };
  }
  if (isWeekend) {
    return {
      dayNumber: day,
      dateStr: `2026-10-${String(day).padStart(2, '0')}`,
      dayOfWeek,
      type: 'weekend',
      statusLabel: 'Weekly Off',
    };
  }
  return {
    dayNumber: day,
    dateStr: `2026-10-${String(day).padStart(2, '0')}`,
    dayOfWeek,
    type: 'present',
    statusLabel: 'Present',
    inTime: '09:08 AM',
    outTime: '06:35 PM',
    workHours: '9h 27m',
    terminal: 'BKC HQ - Turnstile 02',
    shiftName: 'General 09:30-18:30',
  };
});

// December 2026 days (31 days, 1 Dec 2026 was Tuesday)
const DECEMBER_DAYS: CalendarDayRecord[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const date = new Date(2026, 11, day);
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isVacation = day >= 2 && day <= 6;
  const isChristmas = day === 25;

  if (isChristmas) {
    return {
      dayNumber: day,
      dateStr: `2026-12-25`,
      dayOfWeek,
      type: 'holiday',
      statusLabel: 'Christmas',
      holidayName: 'Christmas (National Holiday)',
    };
  }
  if (isVacation) {
    return {
      dayNumber: day,
      dateStr: `2026-12-${String(day).padStart(2, '0')}`,
      dayOfWeek,
      type: 'leave',
      statusLabel: 'Approved Annual Vacation',
      leaveType: 'Earned Leave (Annual Family Vacation)',
      workHours: 'On Approved Leave',
    };
  }
  if (isWeekend) {
    return {
      dayNumber: day,
      dateStr: `2026-12-${String(day).padStart(2, '0')}`,
      dayOfWeek,
      type: 'weekend',
      statusLabel: 'Weekly Off',
    };
  }
  return {
    dayNumber: day,
    dateStr: `2026-12-${String(day).padStart(2, '0')}`,
    dayOfWeek,
    type: 'future',
    statusLabel: 'Scheduled Work Day',
    shiftName: 'General 09:30-18:30',
  };
});

// Generic month generator for any year/month
function getDaysForMonth(year: number, month: number): { days: CalendarDayRecord[]; leadingEmpty: number } {
  // month: 0-indexed (0 = Jan, 9 = Oct, 10 = Nov, 11 = Dec)
  if (year === 2026 && month === 10) {
    return { days: NOVEMBER_DAYS, leadingEmpty: 0 }; // 1 Nov 2026 was Sunday
  }
  if (year === 2026 && month === 9) {
    return { days: OCTOBER_DAYS, leadingEmpty: 4 }; // 1 Oct 2026 was Thursday
  }
  if (year === 2026 && month === 11) {
    return { days: DECEMBER_DAYS, leadingEmpty: 2 }; // 1 Dec 2026 was Tuesday
  }

  const firstDay = new Date(year, month, 1);
  const leadingEmpty = firstDay.getDay(); // 0 = Sun, 1 = Mon...
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: CalendarDayRecord[] = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return {
      dayNumber: day,
      dateStr,
      dayOfWeek,
      type: isWeekend ? 'weekend' : 'future',
      statusLabel: isWeekend ? 'Weekly Off' : 'Scheduled Shift',
      shiftName: isWeekend ? undefined : 'General 09:30-18:30',
    };
  });

  return { days, leadingEmpty };
}

interface AttendanceCalendarProps {
  onApplyLeave?: () => void;
}

export function AttendanceCalendar({ onApplyLeave }: AttendanceCalendarProps) {
  const { showToast } = useToast();
  // Month state: year and 0-indexed month (10 = November 2026)
  const [currentDate, setCurrentDate] = useState({ year: 2026, month: 10 });
  
  const { days, leadingEmpty } = getDaysForMonth(currentDate.year, currentDate.month);
  
  // Selected day within the active month
  const [selectedDay, setSelectedDay] = useState<CalendarDayRecord | null>(
    currentDate.year === 2026 && currentDate.month === 10 ? NOVEMBER_DAYS[22] : days[0] || null
  );

  const [isRegularizeModalOpen, setIsRegularizeModalOpen] = useState(false);
  const [regularizeReason, setRegularizeReason] = useState('');

  const currentMonthLabel = `${MONTH_NAMES[currentDate.month]} ${currentDate.year}`;

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      const newMonthData = getDaysForMonth(newYear, newMonth);
      setSelectedDay(newMonthData.days[0] || null);
      showToast({ type: 'info', message: `Loaded ${MONTH_NAMES[newMonth]} ${newYear} calendar` });
      return { year: newYear, month: newMonth };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      const newMonthData = getDaysForMonth(newYear, newMonth);
      setSelectedDay(newMonthData.days[0] || null);
      showToast({ type: 'info', message: `Loaded ${MONTH_NAMES[newMonth]} ${newYear} calendar` });
      return { year: newYear, month: newMonth };
    });
  };

  const handleDayClick = (day: CalendarDayRecord) => {
    setSelectedDay(day);
  };

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegularizeModalOpen(false);
    showToast({
      type: 'success',
      message: `Regularization request for ${selectedDay?.dateStr} submitted to Vikramaditya Singhania.`,
    });
    setRegularizeReason('');
  };

  // Metrics for active month
  const presentCount = days.filter((d) => d.type === 'present').length;
  const compOffTodayCount = days.filter((d) => d.type === 'today' || d.statusLabel === 'Comp-Off Earned').length;
  const lateCount = days.filter((d) => d.type === 'late').length;
  const leaveCount = days.filter((d) => d.type === 'leave').length;
  const holidayCount = days.filter((d) => d.type === 'holiday').length;
  const weekendCount = days.filter((d) => d.type === 'weekend').length;
  const workingDays = days.length - weekendCount - holidayCount;

  return (
    <div className="space-y-4">
      {/* Calendar Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-[var(--bg-surface-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-[14px] text-[var(--text-primary)] min-w-[140px] text-center font-mono">
              {currentMonthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-[var(--bg-surface-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-[var(--text-tertiary)] font-mono">
            Payable days: {days.length} • Working days: {workingDays} • Present: {presentCount} • Paid Leaves: {leaveCount} • Offs: {weekendCount}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onApplyLeave && (
            <button
              onClick={onApplyLeave}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
            >
              <Plus size={13} />
              <span>Apply leave</span>
            </button>
          )}
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md text-[11px] text-[var(--text-secondary)]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] inline-block" />
          <span>Present ({presentCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] inline-block" />
          <span>Comp-Off / Today ({compOffTodayCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)] inline-block" />
          <span>Late / Grace ({lateCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span>Approved Leave ({leaveCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
          <span>Public Holiday ({holidayCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-tertiary)] inline-block opacity-40" />
          <span>Weekly Off ({weekendCount})</span>
        </div>
      </div>

      {/* Main Calendar Grid and Selected Day Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 7-Column Calendar Grid (8 columns) */}
        <div className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-center text-[11px] font-semibold text-[var(--text-secondary)] py-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[var(--border-subtle)] text-[11px]">
            {/* Leading empty padding cells for alignment to correct day of week */}
            {Array.from({ length: leadingEmpty }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="p-2 min-h-[78px] bg-[var(--bg-surface-subtle)]/30 border-b border-[var(--border-subtle)] opacity-40 select-none"
              />
            ))}

            {days.map((day) => {
              const isSelected = selectedDay?.dayNumber === day.dayNumber && selectedDay?.dateStr === day.dateStr;
              const isToday = day.type === 'today';

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`p-2 min-h-[78px] text-left flex flex-col justify-between transition-colors relative ${
                    isSelected
                      ? 'bg-[var(--brand-primary)]/10 ring-1 ring-[var(--brand-primary)] z-10'
                      : isToday
                      ? 'bg-[var(--bg-page)]'
                      : day.type === 'weekend'
                      ? 'bg-[var(--bg-surface-subtle)] opacity-70'
                      : 'hover:bg-[var(--bg-surface-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[12px] font-semibold tabular-nums ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center text-[11px]'
                          : isSelected
                          ? 'text-[var(--brand-primary)]'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {/* Dot status */}
                    {day.type === 'present' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />}
                    {day.type === 'late' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />}
                    {day.type === 'leave' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    {day.type === 'holiday' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                    {day.type === 'today' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />}
                  </div>

                  <div className="mt-1 space-y-0.5 truncate">
                    {day.type === 'present' && (
                      <>
                        <span className="font-mono text-[10px] text-[var(--text-primary)] block leading-tight">
                          {day.inTime}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] block font-mono">
                          {day.workHours}
                        </span>
                      </>
                    )}

                    {day.type === 'today' && (
                      <>
                        <span className="font-mono text-[10px] text-[var(--brand-primary)] font-semibold block leading-tight">
                          In: {day.inTime}
                        </span>
                        <span className="text-[10px] text-[var(--success-text)] block font-mono">
                          Active ({day.workHours})
                        </span>
                      </>
                    )}

                    {day.type === 'late' && (
                      <>
                        <span className="font-mono text-[10px] text-[var(--warning-text)] font-semibold block leading-tight">
                          Late ({day.inTime})
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] block font-mono">
                          {day.workHours}
                        </span>
                      </>
                    )}

                    {day.type === 'leave' && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium block truncate">
                        {day.leaveType || 'On Leave'}
                      </span>
                    )}

                    {day.type === 'holiday' && (
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium block truncate">
                        {day.statusLabel}
                      </span>
                    )}

                    {day.type === 'weekend' && (
                      <span className="text-[10px] text-[var(--text-tertiary)] block">
                        Weekly Off
                      </span>
                    )}

                    {day.type === 'future' && (
                      <span className="text-[10px] text-[var(--text-tertiary)] block">
                        Scheduled
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Day Detail Card & Actions (4 columns) */}
        <div className="lg:col-span-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div>
                <span className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase">
                  PUNCH DETAIL & AUDIT
                </span>
                <h4 className="font-semibold text-[14px] text-[var(--text-primary)]">
                  {selectedDay ? `${selectedDay.dayOfWeek}, ${selectedDay.dateStr}` : 'Select a date'}
                </h4>
              </div>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  selectedDay?.type === 'present' || selectedDay?.type === 'today'
                    ? 'bg-[var(--success)]/10 text-[var(--success-text)]'
                    : selectedDay?.type === 'late'
                    ? 'bg-[var(--warning)]/10 text-[var(--warning-text)]'
                    : selectedDay?.type === 'leave'
                    ? 'bg-blue-500/10 text-blue-600'
                    : selectedDay?.type === 'holiday'
                    ? 'bg-purple-500/10 text-purple-600'
                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-tertiary)]'
                }`}
              >
                {selectedDay?.statusLabel}
              </span>
            </div>

            {selectedDay?.type === 'present' || selectedDay?.type === 'today' || selectedDay?.type === 'late' ? (
              <div className="space-y-2.5 text-[12px]">
                <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-tertiary)]">First In Punch</span>
                    <strong className="font-mono text-[var(--text-primary)]">{selectedDay.inTime}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-tertiary)]">Last Out Punch</span>
                    <strong className="font-mono text-[var(--text-primary)]">{selectedDay.outTime}</strong>
                  </div>
                  <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-1.5">
                    <span className="text-[var(--text-secondary)] font-medium">Total Duration</span>
                    <strong className="font-mono text-[var(--brand-primary)]">{selectedDay.workHours}</strong>
                  </div>
                  {selectedDay.overtime && (
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-secondary)] font-medium">Overtime Logged</span>
                      <strong className="font-mono text-[var(--success-text)]">{selectedDay.overtime}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Shift assigned:</span>
                    <strong className="text-[var(--text-primary)]">{selectedDay.shiftName || 'General 09:30-18:30'}</strong>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Reader terminal:</span>
                    <strong className="text-[var(--text-primary)]">{selectedDay.terminal || 'BKC HQ - Turnstile 02'}</strong>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Biometric auth:</span>
                    <span className="text-[var(--success-text)] font-semibold flex items-center space-x-1">
                      <CheckCircle2 size={11} />
                      <span>Fingerprint Verified</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : selectedDay?.type === 'holiday' ? (
              <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[12px] space-y-2">
                <span className="font-semibold text-[var(--text-primary)] block">
                  {selectedDay.holidayName || selectedDay.statusLabel}
                </span>
                <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
                  Declared under the Negotiable Instruments Act 1881 by the State Government of Maharashtra and Reserve Bank of India.
                </p>
                <span className="text-[11px] text-[var(--brand-primary)] font-medium block">
                  Paid Statutory Holiday • 100% CTC credit
                </span>
              </div>
            ) : selectedDay?.type === 'leave' ? (
              <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[12px] space-y-2">
                <span className="font-semibold text-[var(--text-primary)] block">
                  {selectedDay.leaveType || selectedDay.statusLabel}
                </span>
                <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
                  Planned leave. Approved by Vikramaditya Singhania. Handover completed with Rohan Mehta.
                </p>
                <span className="text-[11px] text-[var(--success-text)] font-medium block">
                  Leave balance debited: 1.0 day
                </span>
              </div>
            ) : selectedDay?.type === 'weekend' ? (
              <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[12px] space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">Weekly Off (Sunday/Saturday)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">Standard 5-day corporate working week for Investment Banking & Research desk.</p>
              </div>
            ) : (
              <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[12px] space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">Upcoming Scheduled Day</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">Shift assigned: General 09:30 AM – 06:30 PM IST.</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
            {selectedDay?.type === 'late' && (
              <button
                onClick={() => setIsRegularizeModalOpen(true)}
                className="w-full py-2 px-3 text-[12px] font-medium text-[var(--warning-text)] bg-[var(--warning)]/10 border border-[var(--warning)]/30 hover:bg-[var(--warning)]/20 rounded-[5px] transition-colors flex items-center justify-center space-x-1.5"
              >
                <AlertCircle size={13} />
                <span>Request late punch regularization</span>
              </button>
            )}

            <button
              onClick={() => showToast({ type: 'info', message: `Exporting daily audit slip for ${selectedDay?.dateStr}` })}
              className="w-full py-1.5 px-3 text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors flex items-center justify-center space-x-1"
            >
              <FileText size={12} />
              <span>Download daily timesheet record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regularization Modal */}
      {isRegularizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Attendance Regularization Request
              </h3>
              <button onClick={() => setIsRegularizeModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">✕</button>
            </div>

            <form onSubmit={handleRegularizeSubmit} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Date of punch</label>
                <input type="text" readOnly value={`${selectedDay?.dateStr} (${selectedDay?.inTime || 'Late'})`} className="w-full px-2.5 py-1.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-primary)]" />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Requested correction in-time</label>
                <input type="text" defaultValue="09:15 AM" className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-primary)]" />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Reason for late punch / scanner discrepancy</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Turnstile scanner optical timeout at BKC Main Entrance..."
                  value={regularizeReason}
                  onChange={(e) => setRegularizeReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
                <button type="button" onClick={() => setIsRegularizeModalOpen(false)} className="px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px]">Cancel</button>
                <button type="submit" className="px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px]">Submit to manager</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
