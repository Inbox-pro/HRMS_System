import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-[var(--border-subtle)] dark:bg-[var(--border-default)]',
        className
      )}
      {...props}
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-8 w-28 mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2 border-b border-[var(--border-subtle)]">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-7 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-44 w-full" />
    </div>
  );
}
