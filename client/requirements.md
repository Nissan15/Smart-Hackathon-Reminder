## Packages
date-fns | Date formatting and manipulation
recharts | Dashboard charts and analytics
framer-motion | Smooth animations and transitions
clsx | Conditional class names
tailwind-merge | Merging tailwind classes

## Notes
- Authentication uses Replit Auth (`/api/login`, `/api/logout`, `/api/auth/user`)
- Hackathon dates need `z.coerce.date()` handling in forms
- Admin role check: `user.role === 'admin'` or `user.isAdmin` (based on auth response)
- `POST /api/make-me-admin` is available for demo purposes
