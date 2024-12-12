'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import './globals.css'
import '@/lib/amplify-config'
import { ServiceProvider } from '@/lib/hooks/useServices'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>
          <ServiceProvider>
            {children}
          </ServiceProvider>
        </Authenticator.Provider>
      </body>
    </html>
  )
}
