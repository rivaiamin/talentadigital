# TalentaDigital Theme & Design System

## Overview
This document defines the visual design system and theme implementation for TalentaDigital, ensuring consistency across all pages and components.

## Theme System

### Theme Modes
- **Dark Mode (Default)**: Primary theme with dark purple background
- **Light Mode**: Alternative theme with light background
- **Auto Toggle**: Users can switch between themes using the theme toggle button

### Color Palette

#### Primary Colors
- **Primary**: `#8b0000` (Dark Red) - Used for buttons, links, and accent elements
- **Primary Content**: `#ffffff` (White) - Text color on primary backgrounds

#### Dark Theme Colors
- **Base 100**: `#1a1324` (Dark Purple) - Main background
- **Base 200**: `#231830` (Raised Purple) - Card backgrounds, elevated surfaces
- **Base 300**: `#2c1f3b` (Higher Purple) - Higher elevation surfaces
- **Base Content**: `#ffffff` (White) - Default text color

#### Light Theme Colors
- Uses DaisyUI default light theme colors
- Primary color remains consistent (`#8b0000`)

## Layout Guidelines

### Container Structure
- **Max Width**: `max-w-screen-sm` (640px) for mobile-first design
- **Padding**: `px-4` (16px) horizontal padding
- **Main Content**: `py-6` (24px) vertical padding

### Header
- **Sticky Header**: Only shown on non-home pages
- **Background**: `bg-base-100/80` with backdrop blur
- **Border**: `border-base-300` bottom border
- **Content**: Logo/Title on left, theme toggle on right
- **Padding**: `py-3` (12px) vertical, `px-4` (16px) horizontal

### Footer
- **Fixed Position**: Bottom of screen
- **Content**: Donation link, decorative elements, copyright
- **Decorative Elements**:
  - Horizontal line with centered circle
  - Wavy line using SVG
  - Consistent spacing and alignment

## Component Guidelines

### Buttons

#### Primary Button
```html
<button class="btn btn-primary btn-lg rounded-full w-48">
  Primary Action
</button>
```
- **Style**: DaisyUI primary button
- **Size**: Large (`btn-lg`)
- **Shape**: Rounded full
- **Width**: Fixed 192px (`w-48`)

#### Secondary Button
```html
<button class="btn btn-lg rounded-full w-48 bg-base-content text-primary border border-primary">
  Secondary Action
</button>
```
- **Background**: Base content color
- **Text**: Primary color
- **Border**: Primary color border
- **Size**: Large (`btn-lg`)
- **Shape**: Rounded full
- **Width**: Fixed 192px (`w-48`)

### Theme Toggle Button
```html
<button class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-base-300 bg-base-100 shadow hover:bg-base-200 active:translate-y-px">
  <!-- Icons for light/dark mode -->
</button>
```
- **Size**: 36px × 36px (`h-9 w-9`)
- **Shape**: Rounded full
- **Border**: Base 300 color
- **Background**: Base 100
- **Hover**: Base 200 background
- **Active**: Slight translate down effect

### Cards and Surfaces
- **Background**: `bg-base-100` for main surfaces
- **Elevated**: `bg-base-200` for cards and raised elements
- **Higher Elevation**: `bg-base-300` for modals and overlays

## Typography

### Headings
- **H1**: `text-3xl font-semibold tracking-tight`
- **H2**: `text-2xl font-semibold`
- **H3**: `text-xl font-medium`

### Body Text
- **Default**: `text-base-content`
- **Muted**: `text-base-content/70` (70% opacity)
- **Small**: `text-sm`

### Text Alignment
- **Center**: `text-center` for hero sections
- **Left**: Default for content

## Spacing System

### Vertical Spacing
- **Small**: `mt-2` (8px)
- **Medium**: `mt-6` (24px)
- **Large**: `mt-8` (32px)
- **Extra Large**: `mt-12` (48px)

### Component Spacing
- **Button Groups**: `gap-3` (12px)
- **Section Padding**: `py-6` (24px)
- **Header Padding**: `py-3` (12px)

## Responsive Design

### Mobile-First Approach
- **Container**: `max-w-screen-sm` (640px max width)
- **Padding**: Consistent `px-4` horizontal padding
- **Full Height**: `min-h-dvh` for full viewport height

### Grid Layouts
- **Centered Content**: `grid place-items-center`
- **Minimum Height**: `min-h-[70dvh]` for hero sections

## Implementation Notes

### Theme Initialization
1. Theme is initialized in `+layout.svelte` with `initTheme()`
2. Prevents flash by setting theme in `<svelte:head>` script
3. Defaults to dark mode if no stored preference
4. Syncs with DaisyUI `data-theme` attribute

### CSS Architecture
- **Tailwind CSS**: Utility-first styling
- **DaisyUI**: Component library with custom theme
- **Custom CSS**: Theme-specific color overrides in `app.css`
- **CSS Variables**: DaisyUI color tokens for consistency

### File Structure
```
src/
├── lib/
│   ├── theme.ts          # Theme logic and utilities
│   └── ThemeToggle.svelte # Theme toggle component
├── app.css              # Global styles and theme overrides
└── routes/
    ├── +layout.svelte   # Main layout with theme initialization
    └── +page.svelte     # Home page implementation
```

## Consistency Checklist

When creating new pages or components, ensure:

- [ ] Use DaisyUI color tokens (`base-100`, `base-content`, `primary`)
- [ ] Maintain consistent spacing using Tailwind utilities
- [ ] Follow button styling patterns (primary/secondary)
- [ ] Use consistent container max-width (`max-w-screen-sm`)
- [ ] Apply proper padding (`px-4` horizontal, appropriate vertical)
- [ ] Test both light and dark themes
- [ ] Ensure proper contrast ratios
- [ ] Use semantic HTML elements
- [ ] Maintain mobile-first responsive design

## Future Considerations

- Consider adding more color variants for different content types
- Implement consistent loading states
- Add animation guidelines for transitions
- Consider accessibility improvements (focus states, screen readers)
- Plan for potential brand color updates
