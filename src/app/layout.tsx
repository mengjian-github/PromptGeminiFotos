import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// This is the root layout component that wraps all pages
// The actual locale-specific layout is in [locale]/layout.tsx
export default function RootLayout({ children }: Props) {
  return children;
}