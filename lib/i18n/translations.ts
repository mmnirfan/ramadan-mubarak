import type { ImportantDate } from '@/lib/types'

/**
 * Urdu count phrases: oblique form ("... کے لیے") and direct form
 */
const urduDatesOblique = (n: number) => (n === 1 ? 'ایک تاریخ' : `${n} تاریخوں`)
const urduDates = (n: number) => (n === 1 ? 'ایک تاریخ' : `${n} تاریخیں`)

const en = {
  language: {
    switchTo: 'اردو',
    switchLabel: 'Switch to Urdu',
  },

  header: {
    location: 'Hoskote, Bengaluru Rural',
  },

  hero: {
    titleLine1: 'Sehri',
    titleLine2: 'Registration',
    intro:
      "For brothers and sisters staying in PGs, hostels or rented rooms in Hoskote who can't prepare Sehri themselves. Register the days you need Sehri during Ramadan 2027.",
    prayerTimesTitle: 'Prayer Times - Hoskote',
    prayerTimesNote:
      'Approximate times for mid-Ramadan (24 Feb 2027), Asr per the Hanafi method. They shift by a few minutes over the month - follow your local masjid.',
  },

  prayers: {
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  },

  meals: {
    suhoor: 'Sehri',
  },

  timetable: {
    badge: 'Sehri & Iftar Timings',
    title: 'Ramadan 2027 Timetable',
    subtitle: 'Hoskote, Bengaluru Rural - Sehri ends 5 minutes before the Fajr azan',
    roza: 'Roza',
    date: 'Date',
    day: 'Day',
    sehri: 'Sehri Ends',
    azan: 'Fajr Azan',
    iftar: 'Iftar',
    morning: 'AM',
    evening: 'PM',
    fridayLegend: "Friday (Jumu'ah)",
    note: '* Calculated for Hoskote / Bengaluru and matched to the local Bangalore Rural District masjid timetable (within about 1 minute). Roza numbers assume Ramadan starts on 9 Feb - if it starts a day later, follow the times by date.',
  },

  form: {
    badge: 'Ramadan 2027',
    title: 'Register for Sehri',
    subtitle: 'Fill in your details and select all the days you need Sehri',
    successTitle: 'Registration Successful!',
    successText: 'Jazak Allah Khair. Your Sehri registration has been recorded.',
    registeredFor: (n: number) => `Registered for Sehri on ${n} date${n === 1 ? '' : 's'}:`,
    alreadyRegisteredFor: (n: number) => `Already registered for ${n} date${n === 1 ? '' : 's'}:`,
    personalInfo: 'Your Details',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    phone: 'Mobile Number *',
    phonePlaceholder: '+91 XXXXX XXXXX',
    email: 'Email Address (optional)',
    emailPlaceholder: 'you@example.com',
    occupation: 'Occupation *',
    occupationPlaceholder: 'Select your occupation',
    occupationOther: 'Please specify your occupation *',
    occupationOtherPlaceholder: 'e.g., Tailor, Electrician, Cook',
    stayDetails: 'Where You Are Staying',
    address: 'Address (PG / Hostel / Room) *',
    addressPlaceholder: 'PG or hostel name, room number, street, area - Hoskote',
    masjid: 'Nearest Masjid *',
    masjidPlaceholder: 'Name of the masjid nearest to where you stay',
    masjidHint: 'Enter the masjid closest to your PG / hostel / room',
    sehriDetails: 'Sehri Dates',
    sehriInfo: 'Sehri ends around 5:16 – 5:27 AM during Ramadan - see the timetable above for each day.',
    multiDateHint: 'You can select multiple dates',
    datesLabel: 'Select Dates *',
    duplicateTitle: 'Already Registered!',
    duplicateByName: 'Someone with this name has already registered for Sehri on all selected dates:',
    duplicateByPhone: 'This mobile number has already registered for Sehri on all selected dates:',
    duplicateHelp: 'Please select different dates or contact the organisers to change your registration.',
    submitting: 'Registering...',
    submit: (n: number) => `Register for ${n} Date${n === 1 ? '' : 's'}`,
    privacyNote: 'By registering, you agree to our',
    privacyLink: 'Privacy Policy',
    privacySuffix: '.',
  },

  cancel: {
    title: 'Not Coming for Sehri?',
    text: "If your plans change, please cancel your Sehri booking so that no food is wasted.",
    button: 'Cancel a Sehri Booking',
    modalTitle: 'Cancel Sehri Booking',
    modalSubtitle: 'Enter the mobile number or email you registered with, and choose the dates to cancel.',
    contact: 'Mobile Number or Email *',
    contactPlaceholder: '+91 XXXXX XXXXX',
    datesLabel: 'Dates to Cancel *',
    reason: 'Reason (optional)',
    reasonPlaceholder: "e.g., Travelling home, Eating at a friend's place",
    submit: (n: number) => (n === 0 ? 'Cancel Sehri' : `Cancel Sehri for ${n} Date${n === 1 ? '' : 's'}`),
    submitting: 'Cancelling...',
    close: 'Close',
    successTitle: 'Sehri Cancelled',
    successText: 'Jazak Allah Khair for letting us know - it helps avoid wasting food.',
    cancelledFor: (n: number) => `Cancelled for ${n} date${n === 1 ? '' : 's'}:`,
    notFoundFor: (n: number) => `No booking found on ${n} date${n === 1 ? '' : 's'}:`,
    done: 'Done',
  },

  occupationGroups: {
    education: 'Education',
    working: 'Working',
    business: 'Business',
    other: 'Other',
  },

  occupations: {
    collegeStudent: 'College / University Student',
    schoolStudent: 'School / PU Student',
    madrasaStudent: 'Madrasa / Hifz Student',
    privateEmployee: 'Private Company / IT Employee',
    governmentEmployee: 'Government Employee',
    factoryWorker: 'Factory / Industrial Worker',
    healthcareWorker: 'Hospital / Healthcare Worker',
    driver: 'Driver / Delivery Partner',
    dailyWage: 'Daily Wage / Construction Worker',
    businessOwner: 'Business Owner',
    shopkeeper: 'Shopkeeper / Trader',
    selfEmployed: 'Self-employed / Freelancer',
    jobSeeker: 'Looking for a Job',
    other: 'Other (please specify)',
  },

  datePicker: {
    placeholder: 'Click to select dates (multiple allowed)',
    selected: (n: number) => `${n} date${n === 1 ? '' : 's'} selected`,
    legend: 'Ramadan 2027',
    done: 'Done',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    removeDate: 'Remove date',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },

  errors: {
    fullName: 'Please enter your full name',
    emailInvalid: 'Please enter a valid email address (or leave it empty)',
    phone: 'Please enter a valid 10-digit mobile number',
    occupation: 'Please select your occupation',
    occupationOther: 'Please specify your occupation',
    address: 'Please enter the address where you are staying',
    masjidName: 'Please enter the name of your nearest masjid',
    dates: 'Please select at least one date',
    datesOutOfRange: 'Please select dates within Ramadan (9 Feb – 10 Mar 2027)',
    contact: 'Please enter a valid 10-digit mobile number or email address',
    notFound: 'No active Sehri booking was found for this mobile number / email on the selected dates.',
    network: 'Could not reach the registration server. Please try again later.',
    unconfirmed: 'Could not confirm your registration. Please try again.',
    generic: 'Failed to submit. Please try again.',
    unexpected: 'An unexpected error occurred. Please try again.',
  },

  importantDates: {
    badge: 'Mark Your Calendar',
    title: 'Important Dates',
    subtitle: 'Ramadan & Eid ul-Fitr 2027 Schedule',
    note: '* Dates are based on astronomical calculations and expected moon sighting in India, and may vary by 1-2 days',
    items: [
      {
        date: '9 Feb',
        hijriDate: '1 Ramadan 1448',
        event: 'First Roza of Ramadan',
        description: 'Beginning of the holy month (subject to moon sighting)',
        isHighlight: true,
      },
      {
        date: '28 Feb',
        hijriDate: '20 Ramadan 1448',
        event: 'Last 10 Nights Begin',
        description: 'The odd nights begin after Maghrib',
        isHighlight: false,
      },
      {
        date: '5 Mar',
        hijriDate: '25 Ramadan 1448',
        event: "Jumu'atul Wida",
        description: 'The last Friday of Ramadan',
        isHighlight: false,
      },
      {
        date: '6 Mar',
        hijriDate: '26 Ramadan 1448',
        event: 'Shab-e-Qadr (Expected)',
        description: 'Night of Power - the 27th night, after Maghrib',
        isHighlight: true,
      },
      {
        date: '9 Mar',
        hijriDate: '29 Ramadan 1448',
        event: 'Last Day of Ramadan',
        description: 'Or 10 Mar if Ramadan completes 30 days',
        isHighlight: false,
      },
      {
        date: '10 Mar',
        hijriDate: '1 Shawwal 1448',
        event: 'Eid ul-Fitr',
        description: 'Celebration of breaking the fast (or 11 Mar)',
        isHighlight: true,
      },
      {
        date: '10 Mar',
        hijriDate: '1 Shawwal 1448',
        event: 'Public Holiday (Karnataka)',
        description: 'Khutba-e-Ramzan gazetted holiday - moves with the Eid date',
        isHighlight: false,
      },
    ] as ImportantDate[],
  },

  guidelines: {
    badge: 'How It Works',
    title: 'Sehri Service Guidelines',
    subtitle: 'Please read before registering',
    items: {
      who: {
        title: 'Who Can Register',
        before:
          'Anyone staying in a PG, hostel or rented room in Hoskote who is unable to prepare Sehri in their room. Students and working people are all welcome.',
        strong: '',
        after: '',
      },
      register: {
        title: 'Register in Advance',
        before:
          'Please register at least one day before, so the organisers can plan the quantities. You can select all the days you need at once.',
        strong: '',
        after: '',
      },
      timing: {
        title: 'Sehri Timing',
        before: 'Please be ready ',
        strong: 'before Sehri ends (about 5:16 – 5:27 AM)',
        after: ' - check the timetable for the exact time each day.',
      },
      masjid: {
        title: 'Your Nearest Masjid',
        before:
          'Enter the masjid closest to where you stay. It helps the organisers arrange Sehri near you.',
        strong: '',
        after: '',
      },
      changes: {
        title: 'Changes & Cancellations',
        before: 'If your plans change, please inform the organisers so that no food is wasted.',
        strong: '',
        after: '',
      },
      share: {
        title: 'Spread the Word',
        before:
          'Know someone in a nearby PG or hostel who needs Sehri? Share this page with them.',
        strong: '',
        after: '',
      },
    },
  },

  eid: {
    badge: 'Celebration',
    title: 'Eid ul-Fitr 2027',
    text: 'Eid Mubarak to everyone spending Ramadan away from home! Join the Eid prayer at your nearest Eidgah or masjid in Hoskote.',
    dateLabel: 'Date:',
    dateValue: 'Wednesday, March 10, 2027 (Karnataka public holiday - or March 11, depending on moon sighting)',
    prayerLabel: 'Eid Prayer:',
    prayerValue: 'Your nearest Eidgah / masjid in Hoskote',
    mubarak: 'Eid Mubarak!',
  },

  tips: {
    badge: 'Wellness',
    title: 'Tips for Healthy Fasting',
    subtitle: 'Stay healthy and energetic during Ramadan',
    items: {
      suhoor: {
        title: 'Sehri Nutrition',
        description:
          'Eat complex carbs, protein, and drink plenty of water. Avoid salty and spicy foods that increase thirst during the day.',
      },
      day: {
        title: 'During the Day',
        description:
          'Take short breaks, avoid direct sunlight, and keep demanding work or study for the morning when energy is higher.',
      },
      iftar: {
        title: 'Breaking Fast',
        description:
          'Start with dates and water, eat slowly, and avoid overeating fried snacks. Include fruits and vegetables in your Iftar.',
      },
    },
  },

  contact: {
    title: 'Need Assistance?',
    text: 'Contact the organisers for any questions about Sehri registration or changes to your dates.',
  },

  footer: {
    tagline: 'Serving Sehri to those staying away from home in Hoskote during the holy month of Ramadan.',
    copyright: '© 2027 RamadanHub - Hoskote, Bengaluru Rural',
    home: 'Home',
    privacy: 'Privacy Policy',
  },

  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 30 October 2026',
    intro:
      'RamadanHub is a community service that arranges Sehri during Ramadan 2027 for people staying in PGs, hostels and rooms in Hoskote. This page explains what information we collect and how we use it.',
    sections: [
      {
        heading: 'Information we collect',
        items: [
          'Your full name and mobile number',
          'Your email address, only if you choose to give it',
          'Your occupation',
          'The address where you are staying and your nearest masjid',
          'The dates you register or cancel Sehri for, and an optional reason for cancelling',
        ],
      },
      {
        heading: 'How we use it',
        items: [
          'Only to arrange and deliver Sehri on the dates you choose',
          'To prevent duplicate registrations and plan food quantities, so that nothing is wasted',
          'To contact you about your booking if needed',
        ],
      },
      {
        heading: 'Where it is stored',
        items: [
          'Registrations are saved in a Google Sheet (through Google Apps Script) that only the organisers can access',
          'Your language choice (English / Urdu) is saved only in your own browser',
          'If you install the app, some pages are saved on your device so the timetable works offline',
        ],
      },
      {
        heading: 'Sharing',
        items: [
          'We do not sell your information or use it for advertising',
          'We share only what is needed (such as name, dates and masjid) with the volunteers who prepare and deliver Sehri',
        ],
      },
      {
        heading: 'How long we keep it',
        items: ['Registration data is deleted within 30 days after Eid ul-Fitr 2027'],
      },
      {
        heading: 'Your choices',
        items: [
          'You can cancel any Sehri booking from the home page',
          'You can ask us to correct or delete your information at any time by contacting the organisers',
        ],
      },
    ],
    contact: 'Questions about this policy? Contact the organisers at',
    back: 'Back to Home',
  },

  notFound: {
    title: 'Page Not Found',
    text: 'The page you are looking for does not exist or has been moved.',
    home: 'Go to Home',
    timetable: 'View Sehri Timetable',
  },

  offline: {
    title: "You're Offline",
    text: 'Check your internet connection to register or cancel. You can still see the Sehri and Iftar timetable below.',
    retry: 'Try Again',
  },
}

export type Dictionary = typeof en

const ur: Dictionary = {
  language: {
    switchTo: 'English',
    switchLabel: 'انگریزی میں دیکھیں',
  },

  header: {
    location: 'ہوسکوٹے، بنگلورو دیہی',
  },

  hero: {
    titleLine1: 'سحری',
    titleLine2: 'رجسٹریشن',
    intro:
      'ہوسکوٹے میں پی جی، ہاسٹل یا کرائے کے کمروں میں مقیم اُن بھائیوں اور بہنوں کے لیے جو خود سحری کا انتظام نہیں کر سکتے۔ رمضان 2027 میں جن دنوں سحری درکار ہو، ان کے لیے رجسٹر کریں۔',
    prayerTimesTitle: 'اوقاتِ نماز - ہوسکوٹے',
    prayerTimesNote:
      'وسطِ رمضان (24 فروری 2027) کے تقریبی اوقات، عصر حنفی طریقے کے مطابق۔ مہینے بھر میں چند منٹ کا فرق آتا ہے، اپنی مقامی مسجد کے اوقات کی پیروی کریں۔',
  },

  prayers: {
    fajr: 'فجر',
    sunrise: 'طلوعِ آفتاب',
    dhuhr: 'ظہر',
    asr: 'عصر',
    maghrib: 'مغرب',
    isha: 'عشاء',
  },

  meals: {
    suhoor: 'سحری',
  },

  timetable: {
    badge: 'سحری و افطار کے اوقات',
    title: 'اوقاتِ سحری و افطار رمضان المبارک 2027',
    subtitle: 'ہوسکوٹے، بنگلورو دیہی - سحری اذانِ فجر سے 5 منٹ پہلے ختم',
    roza: 'روزہ',
    date: 'تاریخ',
    day: 'دن',
    sehri: 'ختمِ سحری',
    azan: 'اذانِ فجر',
    iftar: 'افطار',
    morning: 'صبح',
    evening: 'شام',
    fridayLegend: 'جمعہ',
    note: '* ہوسکوٹے / بنگلورو کے لیے حساب شدہ اور بنگلورو دیہی ضلع کی مقامی مسجد کے نظام الاوقات کے مطابق (تقریباً ایک منٹ کے فرق کے ساتھ)۔ روزوں کی گنتی 9 فروری سے آغازِ رمضان پر مبنی ہے، اگر رمضان ایک دن بعد شروع ہو تو تاریخ کے مطابق اوقات دیکھیں۔',
  },

  form: {
    badge: 'رمضان 2027',
    title: 'سحری کے لیے رجسٹریشن',
    subtitle: 'اپنی تفصیلات درج کریں اور وہ تمام دن منتخب کریں جن میں سحری درکار ہے',
    successTitle: 'رجسٹریشن کامیاب!',
    successText: 'جزاک اللہ خیر۔ آپ کی سحری کی رجسٹریشن محفوظ ہو گئی ہے۔',
    registeredFor: (n: number) => `${urduDatesOblique(n)} کے لیے سحری کی رجسٹریشن ہو گئی:`,
    alreadyRegisteredFor: (n: number) => `${urduDatesOblique(n)} کے لیے پہلے سے رجسٹرڈ:`,
    personalInfo: 'آپ کی تفصیلات',
    fullName: 'پورا نام *',
    fullNamePlaceholder: 'اپنا پورا نام درج کریں',
    phone: 'موبائل نمبر *',
    phonePlaceholder: '+91 XXXXX XXXXX',
    email: 'ای میل ایڈریس (اختیاری)',
    emailPlaceholder: 'you@example.com',
    occupation: 'پیشہ *',
    occupationPlaceholder: 'اپنا پیشہ منتخب کریں',
    occupationOther: 'براہِ کرم اپنا پیشہ بتائیں *',
    occupationOtherPlaceholder: 'مثلاً درزی، الیکٹریشن، باورچی',
    stayDetails: 'رہائش کی تفصیلات',
    address: 'پتہ (پی جی / ہاسٹل / کمرہ) *',
    addressPlaceholder: 'پی جی یا ہاسٹل کا نام، کمرہ نمبر، گلی، علاقہ - ہوسکوٹے',
    masjid: 'قریب ترین مسجد *',
    masjidPlaceholder: 'آپ کی رہائش کے قریب ترین مسجد کا نام',
    masjidHint: 'اپنے پی جی / ہاسٹل / کمرے کے سب سے قریب والی مسجد کا نام درج کریں',
    sehriDetails: 'سحری کی تاریخیں',
    sehriInfo: 'رمضان میں سحری تقریباً صبح 5:16 تا 5:27 بجے ختم ہوتی ہے، ہر دن کا وقت اوپر دیے گئے نظام الاوقات میں دیکھیں۔',
    multiDateHint: 'آپ کئی تاریخیں منتخب کر سکتے ہیں',
    datesLabel: 'تاریخیں منتخب کریں *',
    duplicateTitle: 'پہلے سے رجسٹرڈ!',
    duplicateByName: 'اس نام سے تمام منتخب تاریخوں پر سحری کی رجسٹریشن پہلے ہی ہو چکی ہے:',
    duplicateByPhone: 'اس موبائل نمبر سے تمام منتخب تاریخوں پر سحری کی رجسٹریشن پہلے ہی ہو چکی ہے:',
    duplicateHelp: 'براہِ کرم دوسری تاریخیں منتخب کریں یا رجسٹریشن میں تبدیلی کے لیے منتظمین سے رابطہ کریں۔',
    submitting: 'رجسٹر ہو رہا ہے...',
    submit: (n: number) => (n === 0 ? 'رجسٹر کریں' : `${urduDatesOblique(n)} کے لیے رجسٹر کریں`),
    privacyNote: 'رجسٹر کر کے آپ ہماری',
    privacyLink: 'رازداری کی پالیسی',
    privacySuffix: ' سے متفق ہیں۔',
  },

  cancel: {
    title: 'سحری میں نہیں آ رہے؟',
    text: 'اگر آپ کا پروگرام بدل جائے تو براہِ کرم اپنی سحری کی بکنگ منسوخ کریں تاکہ کھانا ضائع نہ ہو۔',
    button: 'سحری کی بکنگ منسوخ کریں',
    modalTitle: 'سحری کی بکنگ منسوخ کریں',
    modalSubtitle: 'وہ موبائل نمبر یا ای میل درج کریں جس سے آپ نے رجسٹریشن کی تھی، اور منسوخ کرنے کی تاریخیں منتخب کریں۔',
    contact: 'موبائل نمبر یا ای میل *',
    contactPlaceholder: '+91 XXXXX XXXXX',
    datesLabel: 'منسوخ کرنے کی تاریخیں *',
    reason: 'وجہ (اختیاری)',
    reasonPlaceholder: 'مثلاً گھر جا رہا ہوں، دوست کے یہاں سحری',
    submit: (n: number) => (n === 0 ? 'سحری منسوخ کریں' : `${urduDatesOblique(n)} کی سحری منسوخ کریں`),
    submitting: 'منسوخ ہو رہی ہے...',
    close: 'بند کریں',
    successTitle: 'سحری منسوخ ہو گئی',
    successText: 'اطلاع دینے کا شکریہ، جزاک اللہ خیر۔ اس سے کھانا ضائع ہونے سے بچتا ہے۔',
    cancelledFor: (n: number) => `${urduDatesOblique(n)} کی سحری منسوخ:`,
    notFoundFor: (n: number) => `${urduDatesOblique(n)} پر کوئی بکنگ نہیں ملی:`,
    done: 'ٹھیک ہے',
  },

  occupationGroups: {
    education: 'تعلیم',
    working: 'ملازمت',
    business: 'کاروبار',
    other: 'دیگر',
  },

  occupations: {
    collegeStudent: 'کالج / یونیورسٹی کا طالب علم',
    schoolStudent: 'اسکول / پی یو کا طالب علم',
    madrasaStudent: 'مدرسہ / حفظ کا طالب علم',
    privateEmployee: 'نجی کمپنی / آئی ٹی ملازم',
    governmentEmployee: 'سرکاری ملازم',
    factoryWorker: 'فیکٹری / صنعتی کارکن',
    healthcareWorker: 'اسپتال / طبی عملہ',
    driver: 'ڈرائیور / ڈیلیوری پارٹنر',
    dailyWage: 'یومیہ اجرت / تعمیراتی مزدور',
    businessOwner: 'کاروبار کے مالک',
    shopkeeper: 'دکاندار / تاجر',
    selfEmployed: 'خود روزگار / فری لانسر',
    jobSeeker: 'ملازمت کی تلاش میں',
    other: 'دیگر (وضاحت کریں)',
  },

  datePicker: {
    placeholder: 'تاریخیں منتخب کرنے کے لیے کلک کریں (ایک سے زیادہ ممکن)',
    selected: (n: number) => `${urduDates(n)} منتخب`,
    legend: 'رمضان 2027',
    done: 'ٹھیک ہے',
    previousMonth: 'پچھلا مہینہ',
    nextMonth: 'اگلا مہینہ',
    removeDate: 'تاریخ ہٹائیں',
    weekdays: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  },

  errors: {
    fullName: 'براہِ کرم اپنا پورا نام درج کریں',
    emailInvalid: 'براہِ کرم درست ای میل ایڈریس درج کریں (یا خالی چھوڑ دیں)',
    phone: 'براہِ کرم درست 10 ہندسوں کا موبائل نمبر درج کریں',
    occupation: 'براہِ کرم اپنا پیشہ منتخب کریں',
    occupationOther: 'براہِ کرم اپنا پیشہ بتائیں',
    address: 'براہِ کرم اپنی رہائش کا پتہ درج کریں',
    masjidName: 'براہِ کرم قریب ترین مسجد کا نام درج کریں',
    dates: 'براہِ کرم کم از کم ایک تاریخ منتخب کریں',
    datesOutOfRange: 'براہِ کرم رمضان کی تاریخیں منتخب کریں (9 فروری – 10 مارچ 2027)',
    contact: 'براہِ کرم درست 10 ہندسوں کا موبائل نمبر یا ای میل ایڈریس درج کریں',
    notFound: 'منتخب تاریخوں پر اس موبائل نمبر / ای میل سے سحری کی کوئی فعال بکنگ نہیں ملی۔',
    network: 'رجسٹریشن سرور سے رابطہ نہیں ہو سکا۔ براہِ کرم بعد میں کوشش کریں۔',
    unconfirmed: 'آپ کی رجسٹریشن کی تصدیق نہیں ہو سکی۔ براہِ کرم دوبارہ کوشش کریں۔',
    generic: 'جمع کرنے میں ناکامی۔ براہِ کرم دوبارہ کوشش کریں۔',
    unexpected: 'ایک غیر متوقع خرابی پیش آئی۔ براہِ کرم دوبارہ کوشش کریں۔',
  },

  importantDates: {
    badge: 'اپنے کیلنڈر میں نوٹ کریں',
    title: 'اہم تاریخیں',
    subtitle: 'رمضان اور عید الفطر 2027 کا شیڈول',
    note: '* تاریخیں فلکیاتی حساب اور بھارت میں متوقع رویتِ ہلال پر مبنی ہیں، اور ان میں ایک یا دو دن کا فرق ہو سکتا ہے',
    items: [
      {
        date: '9 فروری',
        hijriDate: '1 رمضان 1448',
        event: 'رمضان کا پہلا روزہ',
        description: 'ماہِ مبارک کا آغاز (رویتِ ہلال سے مشروط)',
        isHighlight: true,
      },
      {
        date: '28 فروری',
        hijriDate: '20 رمضان 1448',
        event: 'آخری عشرہ شروع',
        description: 'مغرب کے بعد طاق راتوں کا آغاز',
        isHighlight: false,
      },
      {
        date: '5 مارچ',
        hijriDate: '25 رمضان 1448',
        event: 'جمعۃ الوداع',
        description: 'رمضان کا آخری جمعہ',
        isHighlight: false,
      },
      {
        date: '6 مارچ',
        hijriDate: '26 رمضان 1448',
        event: 'شبِ قدر (متوقع)',
        description: 'ستائیسویں شب، مغرب کے بعد',
        isHighlight: true,
      },
      {
        date: '9 مارچ',
        hijriDate: '29 رمضان 1448',
        event: 'رمضان کا آخری دن',
        description: 'یا 10 مارچ اگر رمضان کے تیس روزے ہوں',
        isHighlight: false,
      },
      {
        date: '10 مارچ',
        hijriDate: '1 شوال 1448',
        event: 'عید الفطر',
        description: 'عید کی خوشیاں (یا 11 مارچ)',
        isHighlight: true,
      },
      {
        date: '10 مارچ',
        hijriDate: '1 شوال 1448',
        event: 'عام تعطیل (کرناٹک)',
        description: 'خطبۂ رمضان کی سرکاری تعطیل، عید کی تاریخ کے ساتھ بدل سکتی ہے',
        isHighlight: false,
      },
    ],
  },

  guidelines: {
    badge: 'طریقۂ کار',
    title: 'سحری سروس کی ہدایات',
    subtitle: 'رجسٹر کرنے سے پہلے ضرور پڑھیں',
    items: {
      who: {
        title: 'کون رجسٹر کر سکتا ہے',
        before:
          'ہوسکوٹے میں پی جی، ہاسٹل یا کرائے کے کمرے میں مقیم ہر وہ شخص جو اپنے کمرے میں سحری کا انتظام نہیں کر سکتا۔ طلبہ اور ملازمت پیشہ افراد سب کا خیر مقدم ہے۔',
        strong: '',
        after: '',
      },
      register: {
        title: 'پہلے سے رجسٹر کریں',
        before:
          'براہِ کرم کم از کم ایک دن پہلے رجسٹر کریں تاکہ منتظمین مقدار کا اندازہ لگا سکیں۔ آپ ایک ساتھ تمام مطلوبہ دن منتخب کر سکتے ہیں۔',
        strong: '',
        after: '',
      },
      timing: {
        title: 'سحری کا وقت',
        before: 'براہِ کرم ',
        strong: 'سحری ختم ہونے سے پہلے (تقریباً صبح 5:16 تا 5:27)',
        after: ' تیار رہیں، ہر دن کا درست وقت نظام الاوقات میں دیکھیں۔',
      },
      masjid: {
        title: 'آپ کی قریب ترین مسجد',
        before:
          'اپنی رہائش کے سب سے قریب والی مسجد کا نام درج کریں، اس سے منتظمین کو آپ کے قریب سحری کا انتظام کرنے میں مدد ملتی ہے۔',
        strong: '',
        after: '',
      },
      changes: {
        title: 'تبدیلی یا منسوخی',
        before: 'اگر آپ کا پروگرام بدل جائے تو براہِ کرم منتظمین کو اطلاع دیں تاکہ کھانا ضائع نہ ہو۔',
        strong: '',
        after: '',
      },
      share: {
        title: 'دوسروں تک پہنچائیں',
        before:
          'کیا آپ کے قریب کسی پی جی یا ہاسٹل میں کوئی ایسا ہے جسے سحری کی ضرورت ہو؟ یہ صفحہ ان کے ساتھ شیئر کریں۔',
        strong: '',
        after: '',
      },
    },
  },

  eid: {
    badge: 'جشن',
    title: 'عید الفطر 2027',
    text: 'گھر سے دور رمضان گزارنے والے تمام بھائیوں اور بہنوں کو عید مبارک! اپنی قریب ترین عیدگاہ یا ہوسکوٹے کی مسجد میں نمازِ عید ادا کریں۔',
    dateLabel: 'تاریخ:',
    dateValue: 'بدھ، 10 مارچ 2027 (کرناٹک میں عام تعطیل، رویتِ ہلال کے مطابق 11 مارچ بھی ہو سکتی ہے)',
    prayerLabel: 'نمازِ عید:',
    prayerValue: 'ہوسکوٹے میں آپ کی قریب ترین عیدگاہ / مسجد',
    mubarak: 'عید مبارک!',
  },

  tips: {
    badge: 'صحت',
    title: 'صحت مند روزے کے لیے مفید مشورے',
    subtitle: 'رمضان میں صحت مند اور توانا رہیں',
    items: {
      suhoor: {
        title: 'سحری کی غذا',
        description:
          'پیچیدہ کاربوہائیڈریٹس اور پروٹین لیں اور خوب پانی پئیں۔ نمکین اور مسالے دار غذاؤں سے پرہیز کریں جو دن میں پیاس بڑھاتی ہیں۔',
      },
      day: {
        title: 'دن کے دوران',
        description:
          'مختصر وقفے لیں، دھوپ سے بچیں اور مشکل کام یا پڑھائی صبح کے وقت کریں جب توانائی زیادہ ہو۔',
      },
      iftar: {
        title: 'روزہ افطار',
        description:
          'کھجور اور پانی سے افطار کریں، آہستہ کھائیں اور زیادہ تلی ہوئی چیزوں سے بچیں۔ افطار میں پھل اور سبزیاں شامل کریں۔',
      },
    },
  },

  contact: {
    title: 'مدد درکار ہے؟',
    text: 'سحری کی رجسٹریشن یا تاریخوں میں تبدیلی سے متعلق کسی بھی سوال کے لیے منتظمین سے رابطہ کریں۔',
  },

  footer: {
    tagline: 'رمضان المبارک میں ہوسکوٹے میں گھر سے دور مقیم افراد کو سحری پہنچاتے ہوئے۔',
    copyright: '© 2027 RamadanHub - ہوسکوٹے، بنگلورو دیہی',
    home: 'ہوم پیج',
    privacy: 'رازداری کی پالیسی',
  },

  privacy: {
    title: 'رازداری کی پالیسی',
    updated: 'آخری تجدید: 30 اکتوبر 2026',
    intro:
      'RamadanHub ایک سماجی خدمت ہے جو رمضان 2027 میں ہوسکوٹے کے پی جی، ہاسٹل اور کمروں میں مقیم افراد کے لیے سحری کا انتظام کرتی ہے۔ یہ صفحہ بتاتا ہے کہ ہم کون سی معلومات جمع کرتے ہیں اور ان کا استعمال کیسے کرتے ہیں۔',
    sections: [
      {
        heading: 'ہم کون سی معلومات جمع کرتے ہیں',
        items: [
          'آپ کا پورا نام اور موبائل نمبر',
          'آپ کا ای میل ایڈریس، صرف اگر آپ دینا چاہیں',
          'آپ کا پیشہ',
          'آپ کی رہائش کا پتہ اور قریب ترین مسجد',
          'وہ تاریخیں جن کے لیے آپ سحری رجسٹر یا منسوخ کرتے ہیں، اور منسوخی کی اختیاری وجہ',
        ],
      },
      {
        heading: 'ہم انہیں کیسے استعمال کرتے ہیں',
        items: [
          'صرف آپ کی منتخب تاریخوں پر سحری کا انتظام اور ترسیل کے لیے',
          'دوہری رجسٹریشن سے بچنے اور کھانے کی مقدار طے کرنے کے لیے، تاکہ کچھ ضائع نہ ہو',
          'ضرورت پڑنے پر آپ کی بکنگ کے بارے میں آپ سے رابطہ کرنے کے لیے',
        ],
      },
      {
        heading: 'معلومات کہاں محفوظ ہوتی ہیں',
        items: [
          'رجسٹریشن ایک گوگل شیٹ میں (گوگل ایپس اسکرپٹ کے ذریعے) محفوظ ہوتی ہے جس تک صرف منتظمین کی رسائی ہے',
          'آپ کی زبان کا انتخاب (انگریزی / اردو) صرف آپ کے اپنے براؤزر میں محفوظ ہوتا ہے',
          'اگر آپ ایپ انسٹال کریں تو کچھ صفحات آپ کے آلے پر محفوظ ہو جاتے ہیں تاکہ نظام الاوقات انٹرنیٹ کے بغیر بھی دیکھا جا سکے',
        ],
      },
      {
        heading: 'معلومات کی شراکت',
        items: [
          'ہم آپ کی معلومات فروخت نہیں کرتے اور نہ ہی اشتہارات کے لیے استعمال کرتے ہیں',
          'ہم صرف ضروری معلومات (جیسے نام، تاریخیں اور مسجد) سحری تیار کرنے اور پہنچانے والے رضاکاروں کو دیتے ہیں',
        ],
      },
      {
        heading: 'ہم معلومات کب تک رکھتے ہیں',
        items: ['رجسٹریشن کی معلومات عید الفطر 2027 کے بعد 30 دن کے اندر حذف کر دی جاتی ہیں'],
      },
      {
        heading: 'آپ کے اختیارات',
        items: [
          'آپ ہوم پیج سے کسی بھی سحری کی بکنگ منسوخ کر سکتے ہیں',
          'آپ کسی بھی وقت منتظمین سے رابطہ کر کے اپنی معلومات درست یا حذف کروا سکتے ہیں',
        ],
      },
    ],
    contact: 'اس پالیسی کے بارے میں سوالات؟ منتظمین سے رابطہ کریں:',
    back: 'ہوم پیج پر واپس جائیں',
  },

  notFound: {
    title: 'صفحہ نہیں ملا',
    text: 'جو صفحہ آپ تلاش کر رہے ہیں وہ موجود نہیں یا منتقل کر دیا گیا ہے۔',
    home: 'ہوم پیج پر جائیں',
    timetable: 'سحری کا نظام الاوقات دیکھیں',
  },

  offline: {
    title: 'آپ آف لائن ہیں',
    text: 'رجسٹر یا منسوخ کرنے کے لیے اپنا انٹرنیٹ کنکشن چیک کریں۔ سحری و افطار کا نظام الاوقات آپ نیچے اب بھی دیکھ سکتے ہیں۔',
    retry: 'دوبارہ کوشش کریں',
  },
}

export const translations = { en, ur }

export type Locale = keyof typeof translations
