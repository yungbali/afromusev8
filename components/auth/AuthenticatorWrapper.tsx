'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Pixelify_Sans } from 'next/font/google'
import Image from 'next/image'
import { IMAGES } from '@/lib/constants'

const pixelifySans = Pixelify_Sans({ subsets: ['latin'] })

export function AuthenticatorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={pixelifySans.className}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.1) 50%, transparent 50%), linear-gradient(90deg, rgba(0,0,0,.1) 50%, transparent 50%)',
        backgroundSize: '4px 4px',
        mixBlendMode: 'multiply',
        zIndex: -1
      }} />
      
      <Authenticator
        signUpAttributes={['given_name', 'email', 'phone_number']}
        socialProviders={['google']}
        components={{
          Header: () => (
            <div className="flex flex-col items-center gap-4 mb-8">
              <Image
                src={IMAGES.logo}
                alt="Afromuse Digital Logo"
                width={80}
                height={80}
                priority
                className="mx-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
              <h1 className="text-2xl font-semibold text-[#00FF9F]">Welcome to Afromuse Digital</h1>
              <p className="text-[#FF00E6]">Empowering African creators worldwide</p>
            </div>
          ),
        }}
        variation="modal"
        className="bg-[#120458]"
      >
        <div style={{
          '--amplify-colors-background-primary': '#2D0E75',
          '--amplify-colors-background-secondary': '#120458',
          '--amplify-colors-brand-primary-10': '#FF6B6B',
          '--amplify-colors-brand-primary-80': '#00FF9F',
          '--amplify-colors-brand-primary-90': '#FF00E6',
          '--amplify-colors-brand-primary-100': '#4CC9F0',
          '--amplify-colors-font-interactive': '#00FF9F',
          '--amplify-components-button-primary-background-color': '#FF6B6B',
          '--amplify-components-button-primary-hover-background-color': '#4CC9F0',
          '--amplify-components-button-border-color': '#00FF9F',
          '--amplify-components-fieldcontrol-border-color': '#00FF9F',
          '--amplify-components-tabs-item-active-color': '#FF6B6B',
          '--amplify-components-tabs-item-color': '#00FF9F'
        } as React.CSSProperties}>
          {children}
        </div>
      </Authenticator>
    </div>
  )
} 