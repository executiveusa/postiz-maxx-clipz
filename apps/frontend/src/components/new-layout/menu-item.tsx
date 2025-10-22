'use client';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

export const MenuItem: FC<{ label: string; icon: ReactNode; path: string }> = ({
  label,
  icon,
  path,
}) => {
  const currentPath = usePathname();
  const isActive = currentPath.indexOf(path) === 0;

  return (
    <Link
      prefetch={true}
      href={path}
      className={clsx(
        'w-full h-[54px] py-[8px] px-[6px] gap-[4px] flex flex-col text-[10px] font-[600] items-center justify-center rounded-card transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60',
        isActive
          ? 'text-brand-accent bg-brand-accent/10 shadow-soft'
          : 'text-textItemBlur hover:text-brand-accent hover:bg-brand-accent/5'
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      <div>{icon}</div>
      <div className="text-[10px]">{label}</div>
    </Link>
  );
};
