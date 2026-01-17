import './globals.css'
import type { Metadata } from 'next'
import { outfit, patrick_hand, dosis, cabinSketch } from './fonts'

import { AlertContextProvider } from '@/contexts/AlertContext'
import { LoadingScreenProvider } from '@/contexts/LoadingContext'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { LocomotiveScrollPositionProvider } from '@/contexts/LocomotiveScrollPositionContext'
import { LocomotiveScrollProvider } from '@/contexts/LocomotiveScrollContext'
import { PageExitContextProvider } from '@/contexts/PageExitContext'

export const metadata: Metadata = {
  title: "Jacky FAN - Frontend Developer",
  description: 'Hello I am Jacky FAN, a front end developer in Hong Kong who focus on building high-quality websites.',
  openGraph: {
    title: 'Jacky FAN - Frontend Developer',
    description: 'Hello I am Jacky FAN, a front end developer in Hong Kong who focus on building high-quality websites.',
    siteName: 'Jacky FAN',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${outfit.variable} ${patrick_hand.variable} ${dosis.variable} ${cabinSketch.variable} overflow-x-hidden`}>
        <AlertContextProvider>
          <LoadingScreenProvider>
            <PageExitContextProvider>
              <LocomotiveScrollPositionProvider>
                <LocomotiveScrollProvider>
                  {children}
                </LocomotiveScrollProvider>
              </LocomotiveScrollPositionProvider>
            </PageExitContextProvider>
          </LoadingScreenProvider>
        </AlertContextProvider>
      </body>
      <GoogleAnalytics />
    </html>
  )
}
