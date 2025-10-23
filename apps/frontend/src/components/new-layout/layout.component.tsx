'use client';

import React, { ReactNode, useCallback } from 'react';
import { Logo } from '@gitroom/frontend/components/new-layout/logo';
import { Inter } from 'next/font/google';
const ModeComponent = dynamic(
  () => import('@gitroom/frontend/components/layout/mode.component'),
  {
    ssr: false,
  }
);

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { CheckPayment } from '@gitroom/frontend/components/layout/check.payment';
import { ToolTip } from '@gitroom/frontend/components/layout/top.tip';
import { ShowMediaBoxModal } from '@gitroom/frontend/components/media/media.component';
import { ShowLinkedinCompany } from '@gitroom/frontend/components/launches/helpers/linkedin.component';
import { MediaSettingsLayout } from '@gitroom/frontend/components/launches/helpers/media.settings.component';
import { Toaster } from '@gitroom/react/toaster/toaster';
import { ShowPostSelector } from '@gitroom/frontend/components/post-url-selector/post.url.selector';
import { NewSubscription } from '@gitroom/frontend/components/layout/new.subscription';
import { Support } from '@gitroom/frontend/components/layout/support';
import { ContinueProvider } from '@gitroom/frontend/components/layout/continue.provider';
import { ContextWrapper, useUser } from '@gitroom/frontend/components/layout/user.context';
import { CopilotKit } from '@copilotkit/react-core';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { Impersonate } from '@gitroom/frontend/components/layout/impersonate';
import { Title } from '@gitroom/frontend/components/layout/title';
import { TopMenu } from '@gitroom/frontend/components/layout/top.menu';
import { LanguageComponent } from '@gitroom/frontend/components/layout/language.component';
import { ChromeExtensionComponent } from '@gitroom/frontend/components/layout/chrome.extension.component';
import NotificationComponent from '@gitroom/frontend/components/notifications/notification.component';
import { BillingAfter } from '@gitroom/frontend/components/new-layout/billing.after';
import { OrganizationSelector } from '@gitroom/frontend/components/layout/organization.selector';
import { PreConditionComponent } from '@gitroom/frontend/components/layout/pre-condition.component';
import { AttachToFeedbackIcon } from '@gitroom/frontend/components/new-layout/sentry.feedback.component';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const HeaderProfile = () => {
  const user = useUser();
  if (!user) return null;

  const identifier = user.name || user.email || 'MAXX CLIPZ';
  const initials = identifier
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0)?.toUpperCase())
    .join('')
    .padEnd(2, 'M');

  return (
    <div className="hidden sm:flex items-center gap-3 rounded-card bg-newBgColorInner/70 px-3 py-2 shadow-soft ring-1 ring-newBoxFocused/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/20 text-sm font-semibold text-brand-accent">
        {initials}
      </div>
      <div className="flex flex-col text-[11px] leading-snug text-textItemBlur">
        <span className="text-sm font-semibold text-newTextColor">{identifier}</span>
        <span className="uppercase tracking-[0.18em]">Active</span>
      </div>
    </div>
  );
};

export const LayoutComponent = ({ children }: { children: ReactNode }) => {
  const fetch = useFetch();

  const { backendUrl, billingEnabled, isGeneral } = useVariables();

  // Feedback icon component attaches Sentry feedback to a top-bar icon when DSN is present
  const searchParams = useSearchParams();
  const load = useCallback(async (path: string) => {
    return await (await fetch(path)).json();
  }, []);
  const { data: user, mutate } = useSWR('/user/self', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });

  if (!user) return null;

  return (
    <ContextWrapper user={user}>
      <CopilotKit
        credentials="include"
        runtimeUrl={backendUrl + '/copilot/chat'}
        showDevConsole={false}
      >
        <MantineWrapper>
          {user.tier === 'FREE' && searchParams.get('check') && (
            <CheckPayment check={searchParams.get('check')!} mutate={mutate} />
          )}
          <ToolTip />
          <ShowMediaBoxModal />
          <ShowLinkedinCompany />
          <MediaSettingsLayout />
          <Toaster />
          <ShowPostSelector />
          <PreConditionComponent />
          <NewSubscription />
          <Support />
          <ContinueProvider />
          <div
            className={clsx(
              'flex flex-col min-h-screen min-w-screen text-newTextColor p-[12px]',
              inter.className
            )}
          >
            <div>{user?.admin ? <Impersonate /> : <div />}</div>
            {user.tier === 'FREE' && isGeneral && billingEnabled ? (
              <BillingAfter />
            ) : (
              <div className="flex-1 flex gap-[8px]">
                <div className="flex flex-col bg-newBgColorInner w-[80px] rounded-card">
                  <div className={clsx("fixed h-full w-[64px] start-[17px] flex flex-1 top-0", user?.admin && 'pt-[60px]')}>
                    <div className="flex flex-col h-full gap-[32px] flex-1 py-[12px]">
                      <Logo />
                      <TopMenu />
                      <div className="mt-auto text-[9px] leading-relaxed text-textItemBlur text-center px-2">
                        Forked from the Postiz project. Backend unchanged.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-newBgLineColor rounded-card overflow-hidden flex flex-col gap-[1px] blurMe">
                  <div className="flex bg-newBgColorInner h-[80px] px-[24px] items-center rounded-b-none">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="hidden lg:flex items-center gap-3 text-brand-muted">
                        <Image
                          src="/brand/maxx-clipz-mark.svg"
                          alt="MAXX CLIPZ mark"
                          width={36}
                          height={36}
                          priority
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-textItemBlur">
                          MAXX CLIPZ
                        </span>
                      </div>
                      <div className="text-[26px] font-[600] leading-tight">
                        <Title />
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px] text-textItemBlur">
                      <Link
                        prefetch
                        href="/launches"
                        className="hidden sm:inline-flex items-center gap-2 rounded-card bg-brand-accent px-5 py-2 text-sm font-semibold text-[#031525] shadow-soft transition-colors hover:bg-[#22d3ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-newBgColorInner"
                        aria-label="Create a new clip"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="#031525"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>New Clip</span>
                      </Link>
                      <OrganizationSelector />
                      <div className="hover:text-newTextColor">
                        <ModeComponent />
                      </div>
                      <div className="w-[1px] h-[20px] bg-blockSeparator" />
                      <LanguageComponent />
                      <ChromeExtensionComponent />
                      <div className="w-[1px] h-[20px] bg-blockSeparator" />
                      <AttachToFeedbackIcon />
                      <NotificationComponent />
                      <HeaderProfile />
                    </div>
                  </div>
                  <div className="flex flex-1 gap-[1px]">{children}</div>
                </div>
              </div>
            )}
          </div>
        </MantineWrapper>
      </CopilotKit>
    </ContextWrapper>
  );
};
