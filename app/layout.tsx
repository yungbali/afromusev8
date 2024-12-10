'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import { type Schema } from '@/amplify/data/resource'
import config from '../amplify_outputs.json'
import './globals.css'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.auth.user_pool_id,
      userPoolClientId: config.auth.user_pool_client_id,
      signUpVerificationMethod: 'code',
    }
  },
  API: {
    GraphQL: {
      endpoint: config.data.url,
      region: config.data.aws_region,
      defaultAuthMode: 'userPool'
    }
  }
}, { ssr: true })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>
          <main className="min-h-screen bg-[#120458]">
            {children}
          </main>
        </Authenticator.Provider>
      </body>
    </html>
  )
}
