'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ServiceCardProps = {
  title: string
  description: string
  children: ReactNode
}

export function ServiceCard({ title, description, children }: ServiceCardProps) {
  return (
    <Card className="relative overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
      <CardHeader>
        <CardTitle className="text-2xl text-[#00FF9F]">{title}</CardTitle>
        <CardDescription className="text-[#FF00E6]">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
} 