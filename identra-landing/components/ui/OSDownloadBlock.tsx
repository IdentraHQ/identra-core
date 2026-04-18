"use client";

import { useEffect, useState } from "react";

type OSType = "macOS" | "Windows" | "Linux";

const OS_DATA = {
  macOS: {
    name: "macOS",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.944 14.65c-.019-2.915 2.378-4.321 2.492-4.385-1.354-1.986-3.456-2.253-4.208-2.29-1.791-.183-3.498 1.054-4.408 1.054-.911 0-2.316-1.03-3.796-1.002-1.92.025-3.69 1.116-4.686 2.846-2.016 3.493-.514 8.665 1.45 11.5 .965 1.385 2.11 2.94 3.606 2.883 1.442-.058 1.996-.93 3.744-.93 1.745 0 2.255.93 3.766.872 1.558-.057 2.548-1.446 3.498-2.836 1.101-1.605 1.556-3.161 1.579-3.242-.036-.016-3.037-1.168-3.037-4.47zM15.421 4.791c.791-.958 1.326-2.29 1.179-3.621-1.144.047-2.528.764-3.342 1.737-.655.782-1.246 2.148-1.076 3.447 1.282.1 2.527-.611 3.239-1.563z"/>
      </svg>
    ),
    secondarySvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.944 14.65c-.019-2.915 2.378-4.321 2.492-4.385-1.354-1.986-3.456-2.253-4.208-2.29-1.791-.183-3.498 1.054-4.408 1.054-.911 0-2.316-1.03-3.796-1.002-1.92.025-3.69 1.116-4.686 2.846-2.016 3.493-.514 8.665 1.45 11.5 .965 1.385 2.11 2.94 3.606 2.883 1.442-.058 1.996-.93 3.744-.93 1.745 0 2.255.93 3.766.872 1.558-.057 2.548-1.446 3.498-2.836 1.101-1.605 1.556-3.161 1.579-3.242-.036-.016-3.037-1.168-3.037-4.47zM15.421 4.791c.791-.958 1.326-2.29 1.179-3.621-1.144.047-2.528.764-3.342 1.737-.655.782-1.246 2.148-1.076 3.447 1.282.1 2.527-.611 3.239-1.563z"/>
      </svg>
    )
  },
  Windows: {
    name: "Windows",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0zM10.949 1.95L24 0v11.55H10.949zM0 12.449h9.75v9.451L0 20.55zM10.949 12.449H24V24l-13.051-1.95z"/>
      </svg>
    ),
    secondarySvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0zM10.949 1.95L24 0v11.55H10.949zM0 12.449h9.75v9.451L0 20.55zM10.949 12.449H24V24l-13.051-1.95z"/>
      </svg>
    )
  },
  Linux: {
    name: "Linux",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.011 24c4.137 0 6.649-2.046 7.037-4.47.4-2.502-.857-4.246-.857-4.246 1.423-2.025 1.713-3.957 1.713-6.284C19.904 4 16.713 0 12 0 7.287 0 4.096 4 4.096 9c0 2.327.29 4.259 1.713 6.284 0 0-1.258 1.744-.858 4.246C5.339 21.954 7.85 24 12.011 24zm-2.828-5.357c.974 0 1.233.568 2.828.568 1.594 0 1.854-.568 2.828-.568 1.01 0 1.258 2.526 1.258 2.526-1.127.852-2.316.947-4.086.947-1.77 0-2.96-.095-4.087-.947 0 0 .248-2.526 1.259-2.526z"/>
      </svg>
    ),
    secondarySvg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.011 24c4.137 0 6.649-2.046 7.037-4.47.4-2.502-.857-4.246-.857-4.246 1.423-2.025 1.713-3.957 1.713-6.284C19.904 4 16.713 0 12 0 7.287 0 4.096 4 4.096 9c0 2.327.29 4.259 1.713 6.284 0 0-1.258 1.744-.858 4.246C5.339 21.954 7.85 24 12.011 24zm-2.828-5.357c.974 0 1.233.568 2.828.568 1.594 0 1.854-.568 2.828-.568 1.01 0 1.258 2.526 1.258 2.526-1.127.852-2.316.947-4.086.947-1.77 0-2.96-.095-4.087-.947 0 0 .248-2.526 1.259-2.526z"/>
      </svg>
    )
  }
};

export function OSDownloadBlock() {
  const [os, setOs] = useState<OSType>("macOS");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) {
      setOs("Windows");
    } else if (userAgent.indexOf("Mac") !== -1) {
      setOs("macOS");
    } else if (userAgent.indexOf("Linux") !== -1 || userAgent.indexOf("X11") !== -1) {
      setOs("Linux");
    }
  }, []);

  // To prevent hydration mismatch, we don't render the OS-specific content until mounted
  // However, rendering macOS as default is fine for a skeleton
  const primaryOS = OS_DATA[os];
  const secondaryOSes = Object.values(OS_DATA).filter((o) => o.name !== os);

  return (
    <div className="flex flex-col gap-3.5 w-fit mt-4">
      <button className="flex h-12 min-w-[220px] items-center justify-center gap-2.5 rounded-lg bg-white px-6 text-[15px] font-medium tracking-tight text-black transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-center -ml-1 opacity-90">
          {!mounted ? OS_DATA.macOS.svg : primaryOS.svg}
        </div>
        <span>
          Download for {!mounted ? "macOS" : primaryOS.name}
        </span>
      </button>
      
      <div className="flex items-center justify-center gap-2.5 text-[13px] font-medium text-neutral-500 px-1">
        <span className="hidden sm:inline-block opacity-80">Other platforms:</span>
        <div className="flex items-center gap-2">
          {secondaryOSes.map((secOs, index) => (
            <div key={secOs.name} className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 hover:text-white transition-colors opacity-70 hover:opacity-100">
                {!mounted ? (index === 0 ? OS_DATA.Windows.secondarySvg : OS_DATA.Linux.secondarySvg) : secOs.secondarySvg}
                {!mounted ? (index === 0 ? "Windows" : "Linux") : secOs.name}
              </button>
              {index < secondaryOSes.length - 1 && (
                <span className="text-neutral-700 font-light opacity-50">/</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
