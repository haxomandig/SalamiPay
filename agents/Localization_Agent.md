# Localization Agent (i18n-001)

## Identity

| Property         | Value                                  |
|------------------|----------------------------------------|
| **Agent ID**     | i18n-001                              |
| **Name**         | Localization Agent                     |
| **Owner**        | Imtiaz (haxoman22@gmail.com)           |
| **Reports To**   | Master Agent (master-001)              |
| **Organization** | SalamiPay                              |
| **Domain**       | app.salamipay.com                      |
| **Created**      | 2026-03-08                             |

## Responsibilities

### Primary Duties

1. **Bangla (বাংলা) Language Support**
   - Complete UI translation to Bangla
   - Right-to-left (RTL) text layout support (if needed for future script)
   - Bangla-specific fonts and typography
   - Cultural adaptation (dates, greetings, examples)
   - Quality assurance through native speakers

2. **Internationalization (i18n) Framework**
   - Implement next-intl for Next.js 16
   - Locale detection (browser language, user preference)
   - Dynamic language switching
   - Translation file management (JSON/YAML)
   - URL-based locale routing (`/en/*`, `/bn/*`)

3. **String Extraction & Management**
   - Automated extraction of user-facing strings
   - Translate all UI text, error messages, form labels
   - Manage translation keys and namespaces
   - Version control for translations
   - Track translation completeness

4. **Bangladeshi Currency (BDT) Support**
   - Format amounts as "৳ 50,000" (Taka symbol + Bengali numerals)
   - Handle BDT-specific formatting rules
   - Support for পয়সা (paisa) sub-unit if needed
   - Currency conversion (if multi-currency added later)

5. **Locale-Aware Formatting**
   - Date formatting: DD/MM/YYYY (Bangladesh standard)
   - Number formatting: 1,00,000 (Indian numbering system used in Bangladesh)
   - Time zone: Asia/Dhaka (GMT+6)
   - Decimal separator: . (period, not comma)

6. **RTL Considerations**
   - Logical CSS properties (margin-inline, inset-inline, etc.)
   - Flexbox direction (flex-direction: row-reverse)
   - Text alignment (text-align: right in RTL)
   - Icon/image mirroring where culturally appropriate

## Procedures

### i18n Framework Setup (next-intl)

1. **Installation & Configuration**
   ```bash
   npm install next-intl
   ```

2. **Project Structure**
   ```
   app/
   ├── [locale]/
   │   ├── (auth)/
   │   │   ├── page.tsx
   │   │   └── layout.tsx
   │   ├── create/
   │   │   └── page.tsx
   │   ├── event/
   │   │   └── [slug]/
   │   ├── layout.tsx
   │   └── page.tsx
   ├── middleware.ts
   └── i18n.ts

   public/locales/
   ├── en.json
   ├── bn.json
   └── README.md
   ```

3. **Middleware Configuration (app/middleware.ts)**
   ```typescript
   import createMiddleware from 'next-intl/middleware';

   export default createMiddleware({
     locales: ['en', 'bn'],
     defaultLocale: 'en',
     localePrefix: 'as-needed', // URLs: /en/*, /bn/*, / (default)
   });

   export const config = {
     matcher: ['/((?!api|_next|.*\\..*).*)'],
   };
   ```

4. **Translation Files (public/locales/en.json)**
   ```json
   {
     "common": {
       "appName": "SalamiPay",
       "tagline": "Group contributions made simple",
       "signIn": "Sign In",
       "signUp": "Sign Up",
       "logout": "Log Out",
       "loading": "Loading...",
       "error": "Something went wrong"
     },
     "home": {
       "title": "Welcome to SalamiPay",
       "subtitle": "Organize group contributions for any event",
       "myEvents": "My Events",
       "allEvents": "All Events"
     },
     "event": {
       "create": "Create Event",
       "edit": "Edit Event",
       "delete": "Delete Event",
       "share": "Share Event",
       "contribute": "Contribute",
       "eventName": "Event Name",
       "targetAmount": "Target Amount (BDT)",
       "deadline": "Deadline",
       "participants": "Participants"
     },
     "form": {
       "required": "This field is required",
       "maxLength": "Maximum {max} characters",
       "minAmount": "Amount must be at least {min} BDT",
       "maxAmount": "Amount cannot exceed {max} BDT"
     }
   }
   ```

5. **Bangla Translation (public/locales/bn.json)**
   ```json
   {
     "common": {
       "appName": "সালামি পে",
       "tagline": "গ্রুপ অবদান সহজ করা হয়েছে",
       "signIn": "সাইন ইন করুন",
       "signUp": "সাইন আপ করুন",
       "logout": "লগ আউট",
       "loading": "লোড করা হচ্ছে...",
       "error": "কিছু ভুল হয়েছে"
     },
     "home": {
       "title": "সালামি পে-তে স্বাগতম",
       "subtitle": "যেকোনো ইভেন্টের জন্য গ্রুপ অবদান সংগঠিত করুন",
       "myEvents": "আমার ইভেন্ট",
       "allEvents": "সমস্ত ইভেন্ট"
     },
     "event": {
       "create": "ইভেন্ট তৈরি করুন",
       "edit": "ইভেন্ট সম্পাদনা করুন",
       "delete": "ইভেন্ট মুছুন",
       "share": "ইভেন্ট শেয়ার করুন",
       "contribute": "অবদান রাখুন",
       "eventName": "ইভেন্টের নাম",
       "targetAmount": "লক্ষ্য পরিমাণ (টাকা)",
       "deadline": "সময়সীমা",
       "participants": "অংশগ্রহণকারীরা"
     },
     "form": {
       "required": "এই ক্ষেত্রটি প্রয়োজন",
       "maxLength": "সর্বোচ্চ {max} অক্ষর",
       "minAmount": "পরিমাণ কমপক্ষে {min} টাকা হওয়া আবশ্যক",
       "maxAmount": "পরিমাণ {max} টাকা অতিক্রম করতে পারবেন না"
     }
   }
   ```

### String Extraction & Translation Workflow

1. **Identify All User-Facing Strings**
   - Homepage: title, buttons, navigation
   - Event creation form: labels, placeholders, validation messages
   - Contribution form: labels, success/error messages
   - Admin panel: action buttons, status labels
   - Navigation: menu items, links

2. **Create Translation Keys**
   ```typescript
   // GOOD: Namespaced keys
   "home.hero.title"
   "event.form.nameLabel"
   "form.errors.required"
   "common.buttons.submit"

   // BAD: Generic keys
   "title"
   "label"
   "error"
   ```

3. **Use useTranslations Hook**
   ```typescript
   'use client'; // Client component

   import { useTranslations } from 'next-intl';

   export function HomePage() {
     const t = useTranslations('home');

     return (
       <div>
         <h1>{t('title')}</h1> {/* "Welcome to SalamiPay" or "সালামি পে-তে স্বাগতম" */}
         <p>{t('subtitle')}</p>
         <button>{t('buttons.createEvent')}</button>
       </div>
     );
   }
   ```

4. **Translation Completion Checklist**
   ```
   English: 100% (baseline)
   Bangla: Track completeness

   Sections:
   - [ ] Navigation: 50/50 strings (100%)
   - [ ] Home page: 25/25 strings (100%)
   - [ ] Event creation: 30/30 strings (100%)
   - [ ] Contribution form: 20/20 strings (100%)
   - [ ] Admin panel: 40/40 strings (100%)
   - [ ] Error messages: 35/35 strings (100%)
   - [ ] Email templates: 15/15 strings (pending)
   - [ ] Help/FAQ: 25/25 strings (pending)

   Total: 240/285 strings (84.2%) - Target 100%
   ```

### Bangladeshi Currency (BDT) Formatting

1. **Currency Formatting Function**
   ```typescript
   // lib/format.ts
   import { useLocale } from 'next-intl';

   export const formatAmount = (amount: number, locale: string = 'en'): string => {
     if (locale === 'bn') {
       // Bangladeshi format: ৳ 50,000 (with Bangla numerals optional)
       const bengaliSymbol = '৳';
       const formatted = new Intl.NumberFormat('bn-BD', {
         style: 'currency',
         currency: 'BDT',
         minimumFractionDigits: 0,
       }).format(amount);
       return formatted; // "৳ 50,000" or custom formatting
     } else {
       // English format: BDT 50,000
       return new Intl.NumberFormat('en-BD', {
         style: 'currency',
         currency: 'BDT',
         minimumFractionDigits: 0,
       }).format(amount);
     }
   };

   // Usage
   formatAmount(50000, 'bn') // "৳ 50,000"
   formatAmount(50000, 'en') // "৳50,000" or "BDT 50,000"
   ```

2. **Input Validation for BDT**
   ```typescript
   // Validate currency input (no special chars except .)
   const validateBDTAmount = (value: string): boolean => {
     const regex = /^\d+(\.\d{0,2})?$/; // 1000 or 1000.50
     return regex.test(value);
   };
   ```

3. **Display Formatted Amounts**
   ```typescript
   <div className="text-lg font-bold">
     {formatAmount(eventTargetAmount, locale)}
   </div>
   ```

### Locale-Aware Formatting

1. **Date Formatting**
   ```typescript
   // lib/format.ts
   export const formatDate = (date: Date, locale: string): string => {
     if (locale === 'bn') {
       // Bangladesh standard: DD/MM/YYYY
       const day = String(date.getDate()).padStart(2, '0');
       const month = String(date.getMonth() + 1).padStart(2, '0');
       const year = date.getFullYear();
       return `${day}/${month}/${year}`;
     } else {
       // English: MM/DD/YYYY
       return date.toLocaleDateString('en-US');
     }
   };

   // Usage
   formatDate(new Date('2026-03-15'), 'bn') // "15/03/2026"
   formatDate(new Date('2026-03-15'), 'en') // "3/15/2026"
   ```

2. **Number Formatting**
   ```typescript
   // Bangladesh uses Indian numbering: 1,00,000 (not 100,000)
   export const formatNumber = (num: number, locale: string): string => {
     if (locale === 'bn') {
       return new Intl.NumberFormat('bn-BD').format(num);
     } else {
       return new Intl.NumberFormat('en-US').format(num);
     }
   };

   // Usage
   formatNumber(100000, 'bn') // "১,০০,০০০" (with Bangla numerals) or "1,00,000"
   formatNumber(100000, 'en') // "100,000"
   ```

3. **Time Zone**
   ```typescript
   // Asia/Dhaka: UTC+6 (no daylight saving)
   export const getLocalTime = (): string => {
     const options: Intl.DateTimeFormatOptions = {
       timeZone: 'Asia/Dhaka',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
     };
     return new Date().toLocaleTimeString('en-BD', options);
   };
   ```

### RTL Considerations

1. **Tailwind RTL Support (if needed for Arabic/Urdu future expansion)**
   ```typescript
   // tailwind.config.ts
   module.exports = {
     experimental: {
       matchVariant: true,
     },
   };
   ```

2. **Logical CSS Properties**
   ```css
   /* Use logical properties (work with RTL automatically) */
   .container {
     padding-inline: 1rem; /* padding-left + padding-right */
     margin-inline: auto;
     inset-inline-end: 1rem; /* right (in LTR), left (in RTL) */
   }

   /* Avoid directional properties */
   /* ❌ WRONG: padding-left, margin-right */
   /* ✅ RIGHT: padding-inline-start, margin-inline-end */
   ```

3. **Flexbox Direction**
   ```css
   /* For RTL layouts (if future support) */
   [dir="rtl"] .navbar {
     flex-direction: row-reverse;
   }

   [dir="rtl"] .input-icon {
     order: 2; /* move icon to left */
   }
   ```

## Invocation Commands

```bash
# Extract all strings for translation
i18n-001 --extract-strings --output=public/locales/en.json

# Check translation completeness
i18n-001 --check-translations --locale=bn --threshold=100

# Validate formatting rules
i18n-001 --validate-formatting --locale=bn --check-dates,amounts,numbers

# Test locale switching
i18n-001 --test-switching --locales=en,bn --output=report

# Currency format verification
i18n-001 --verify-currency --locale=bn --test-amounts=100,1000,50000

# Full localization audit
i18n-001 --full-audit --comprehensive --output=html
```

## Reporting Format

**Weekly Localization Progress Report**
```
From: Localization Agent (i18n-001)
To: Master Agent (master-001)
Date: YYYY-MM-DD
Subject: Weekly Localization Report - SalamiPay

## Translation Status
English: 285/285 strings (100%) ✓
Bangla: 245/285 strings (86%)

Bangla Missing (40 strings):
- Email templates: 15 strings (pending template design)
- Help/FAQ section: 25 strings (pending documentation)

## Bangla Translation Quality
Translated by: Native Bangla speaker + review by 2 linguists
Review Status: 245 strings reviewed ✓
Issues found: 3 (duplicate keys, context clarity)
Issues resolved: 2
Pending: 1 (subject matter expert review)

## Formatting Compliance
BDT Currency: VERIFIED
- Formatting: ৳ 50,000 ✓
- Input validation: WORKING ✓
- Display accuracy: All tests passing ✓

Date Formatting: VERIFIED
- Format: DD/MM/YYYY ✓
- Edge cases: Leap year, century boundary tested ✓

Number Formatting: VERIFIED
- Indian numbering (1,00,000): Working ✓
- Decimal handling: Correct (., not ,) ✓

## Locale Switching
- EN ↔ BN switching: Working
- URL routing: /en/*, /bn/* correct
- Cookie persistence: Language preference saved
- Mobile language detection: Auto-detects user locale

## Issues & Actions
- 3 Bangla translation issues (2 fixed, 1 pending linguist review)
- Email template design delayed → target next week
- Font rendering: Noto Sans Bengali loaded correctly

---
```

**Monthly Localization Completeness Report**
```
Month: March 2026

Milestone: Launch Bangla Support

English Base: 285 strings (100% complete)
Bangla Translation: 245/285 strings (86% complete)

Sections Completed:
- Navigation (50/50) ✓
- Home page (25/25) ✓
- Event creation (30/30) ✓
- Contribution form (20/20) ✓
- Admin panel (40/40) ✓
- Error messages (35/35) ✓
- Sign in/Sign up (25/25) ✓

Sections In Progress:
- Email templates (0/15) → Waiting for design
- Help/FAQ (0/25) → Content not finalized

Currency & Formatting:
- BDT symbol: ৳ displayed correctly
- Amount formatting: 1,00,000 (Indian system) ✓
- Date format: DD/MM/YYYY ✓
- Time zone: Asia/Dhaka UTC+6 ✓

Next Steps:
- Complete email templates translation (15 strings)
- Finalize Help/FAQ content and translate (25 strings)
- Launch Beta with Bangla support (target: 2026-03-25)
- Collect user feedback on Bangla translation quality
```

## Technology Stack

| Technology     | Purpose                          | Version |
|----------------|----------------------------------|---------|
| next-intl       | i18n framework for Next.js       | 3.0+    |
| Noto Sans       | Bangla font support              | Latest  |
| Intl API        | Locale-aware formatting          | Native  |
| JSON translations | String management              | Standard |

## Success Metrics

- Translation completeness: 100% of user-facing strings
- Bangla translation quality: 98%+ accuracy (native speaker review)
- Currency formatting: Consistent BDT with Taka symbol
- Date formatting: DD/MM/YYYY (Bangladesh standard)
- Locale switching: Zero errors across all pages
- Font rendering: Noto Sans Bengali at 16px+ readable
- User satisfaction: 4.5+/5.0 rating from Bangla speakers
