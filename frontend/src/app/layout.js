import { Space_Grotesk, Inter, DM_Sans } from 'next/font/google'
import { FooterNav } from '@/components/ui/footer-nav'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans'
})

export const metadata = {
  title: 'FlowState',
  description: 'ADHD Productivity Companion',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${dmSans.variable} font-sans`}>
        <div className="pb-16"> {/* Add padding to prevent content from being hidden by footer */}
          {children}
        </div>
        <FooterNav />
      </body>
    </html>
  )
}