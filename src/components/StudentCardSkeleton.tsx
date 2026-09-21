import React from 'react';

interface StudentCardSkeletonProps {
  id?: string;
}

export const StudentCardSkeleton: React.FC<StudentCardSkeletonProps> = ({ id }) => {
  return (
    <div
      id={id}
      role="status"
      aria-label="Loading student profile"
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between animate-pulse select-none"
    >
      {/* Card Header & Avatar Skeleton */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-slate-300 ring-2 ring-white" />
          </div>
          <div className="w-20 h-6 rounded-md bg-slate-200" />
        </div>

        {/* Text Details Skeleton */}
        <div className="space-y-2.5">
          {/* Name */}
          <div className="h-5 w-3/4 rounded-md bg-slate-200" />
          {/* Class / Section */}
          <div className="h-3.5 w-1/2 rounded-md bg-slate-200/80" />

          {/* Occupation / Study placeholder box */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-100 border border-slate-100/80 space-y-2">
            <div className="h-3 w-1/3 rounded-sm bg-slate-200" />
            <div className="h-3 w-4/5 rounded-sm bg-slate-200" />
          </div>

          {/* Short Bio placeholder lines */}
          <div className="mt-3.5 space-y-1.5 pt-1">
            <div className="h-3 w-full rounded-sm bg-slate-200/70" />
            <div className="h-3 w-2/3 rounded-sm bg-slate-200/70" />
          </div>
        </div>
      </div>

      {/* Card Footer Skeleton */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3.5 w-20 rounded-md bg-slate-200" />
        <div className="h-7 w-24 rounded-md bg-slate-200" />
      </div>
      <span className="sr-only">Loading alumni record...</span>
    </div>
  );
};
