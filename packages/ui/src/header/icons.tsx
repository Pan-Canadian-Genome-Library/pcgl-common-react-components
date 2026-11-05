import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  'aria-hidden': true,
  focusable: false,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
};

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

export const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
