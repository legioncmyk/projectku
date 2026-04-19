---
Task ID: 2
Agent: Main
Task: Add game images, enhance admin dashboard, integrate ad monetization

Work Log:
- Generated 28 game card images (1024x1024) using AI image generation CLI
- Generated 4 banner images (1344x768) for hero slider
- Updated seed data: 28 games with real image paths, 37 with emoji fallback
- Added Valorant as new game (popular, 7 VP nominals)
- Updated 4 slider entries with real banner image URLs
- Rewrote page.tsx with:
  - Image support in GameCard (next/image with fallback to emoji)
  - Banner images in HeroSlider with overlay gradient
  - Fully functional Admin Dashboard with CRUD for products and sliders
  - Product dialog: add/edit name, slug, image URL, category, nominals
  - Slider dialog: add/edit image URL, title, subtitle, game slug, order
  - Ad monetization integration (AdBanner component with script injection)
  - Game detail image in TopUpForm header
- Build passes with zero errors, lint clean

Stage Summary:
- 28 real game images + 4 banner images generated via AI
- Admin can now add/edit/delete products with image URLs and nominal management
- Admin can now add/edit/delete sliders with image URLs
- Ad monetization code integrated below slider and above footer
- All data served from database (no hardcoding)
