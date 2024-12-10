'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import './globals.css'

// Initial config with simpler password policy
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_78hZYfLRj',
      userPoolClientId: '69ccvp1t9jera396jdj1a85v11',
      signUpVerificationMethod: 'code',
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://geva3gsrrfgxdgatgt3sgkjjp4.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  }
}, { ssr: true })

// Update config after hydration with same password policy
if (typeof window !== 'undefined') {
  fetch('/amplify_outputs.json')
    .then(response => response.json())
    .then(config => {
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: config.auth.user_pool_id,
            userPoolClientId: config.auth.user_pool_client_id,
            signUpVerificationMethod: 'code',
            passwordFormat: {
              minLength: 8,
              requireLowercase: true,
              requireUppercase: true,
              requireNumbers: true,
              requireSpecialCharacters: true,
            }
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
    })
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>{children}</Authenticator.Provider>
      </body>
    </html>
  )
}
