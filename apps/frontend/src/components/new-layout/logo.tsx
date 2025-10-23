'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link
      href="/launches"
      className="flex flex-col items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-newTextColor"
      aria-label="MAXX CLIPZ dashboard"
    >
      <div className="relative h-[54px] w-[54px] rounded-full bg-newBgColorInner/60 p-[10px] shadow-[0_12px_32px_rgba(6,182,212,0.18)] ring-1 ring-newBoxFocused">
        <Image
          src="/brand/maxx-clipz-mark.svg"
          alt="MAXX CLIPZ logo mark"
          fill
          sizes="54px"
          priority
        />
      </div>
      <span className="text-center leading-tight text-[10px] text-textItemBlur">
        MAXX
        <br />
        CLIPZ
      </span>
    </Link>
  );
};
