# TASKFLOW - Frontend

A modern, animated React task management application built with Vite.

## Features

- ✨ Beautiful loading animation with checklist-style animation
- 🎨 Professional design with Open Sans font
- 🎭 Smooth animations and transitions throughout
- 📱 Fully responsive design
- ⚡ Fast and optimized with Vite

## Tech Stack

- React 18
- Vite
- CSS3 with animations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults to `http://localhost:5000`):
```
VITE_API_BASE=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Vercel Deployment

1. Connect your repository to Vercel
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Add environment variable `VITE_API_BASE` with your backend API URL
5. Deploy!

The `vercel.json` file is already configured for proper routing.

## Color Palette

- Black: `#000000`
- Dark: `#2f4550`
- Medium: `#586f7c`
- Light: `#b8dbd9`
- Background: `#f4f4f9`

## Loading Animation

The app features a unique loading screen with:
- Gradient background (`#2A7B9B` to `#57C785`)
- Animated "TASKFLOW" text with letter-by-letter pop-in
- Checklist-style checkmarks that animate in sequence




