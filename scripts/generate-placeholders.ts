import fs from 'fs'
import path from 'path'

const imagesDir = path.join(process.cwd(), 'public', 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Generate Logo SVG
const logoSvg = `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" fill="#120458"/>
  <text x="40" y="40" font-family="Arial" font-size="32" font-weight="bold" 
    fill="#00FF9F" text-anchor="middle" dominant-baseline="middle">AD</text>
</svg>`

// Generate Avatar SVG
const avatarSvg = `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="32" fill="#FF6B6B"/>
  <text x="32" y="32" font-family="Arial" font-size="24" font-weight="bold" 
    fill="white" text-anchor="middle" dominant-baseline="middle">UN</text>
</svg>`

// Generate Placeholder SVG
const placeholderSvg = `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B6B"/>
      <stop offset="100%" style="stop-color:#4CC9F0"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" fill="url(#grad)"/>
</svg>`

fs.writeFileSync(path.join(imagesDir, 'logo.svg'), logoSvg)
fs.writeFileSync(path.join(imagesDir, 'user-avatar.svg'), avatarSvg)
fs.writeFileSync(path.join(imagesDir, 'placeholder.svg'), placeholderSvg)

console.log('SVG placeholder images generated successfully!') 