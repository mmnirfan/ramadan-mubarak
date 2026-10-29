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
    location: 'Bengaluru, India',
  },

  hero: {
    titleLine1: 'Iftar & Sehri',
    titleLine2: 'Registration',
    intro:
      'Join your colleagues for blessed meals during the holy month of Ramadan 2027. Register for office Iftar and Sehri gatherings.',
    prayerTimesTitle: 'Prayer Times - Bengaluru',
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
    iftar: 'Iftar',
    suhoor: 'Sehri',
  },

  form: {
    badge: 'Ramadan 2027',
    title: 'Register for Meals',
    subtitle: 'Fill in your details and select multiple dates at once',
    successTitle: 'Registration Successful!',
    successText: 'Jazak Allah Khair. Your registration has been recorded.',
    registeredFor: (n: number) => `Registered for ${n} date${n === 1 ? '' : 's'}:`,
    alreadyRegisteredFor: (n: number) => `Already registered for ${n} date${n === 1 ? '' : 's'}:`,
    personalInfo: 'Personal Information',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    employeeId: 'Employee ID',
    employeeIdPlaceholder: 'e.g., EMP-12345',
    email: 'Email Address *',
    emailPlaceholder: 'your.email@company.com',
    phone: 'Phone Number *',
    phonePlaceholder: '+91 XXXXX XXXXX',
    department: 'Department *',
    departmentPlaceholder: 'Select department',
    mealDetails: 'Meal Details',
    mealType: 'Meal Type *',
    iftarDescription: 'Evening meal at sunset',
    suhoorDescription: 'Pre-dawn meal',
    multiDateHint: 'You can select multiple dates for the same meal type',
    datesLabel: 'Select Dates *',
    guests: 'Number of Guests (per day)',
    guestOption: (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`,
    dietary: 'Dietary Requirements',
    dietaryPlaceholder: 'Allergies, restrictions...',
    duplicateTitle: 'Already Registered!',
    duplicateByName: 'Someone with this name has already registered for',
    duplicateByPhone: 'This mobile number has already registered for',
    duplicateSuffix: 'on all selected dates:',
    duplicateHelp: 'Please select different dates or contact HR to modify your registration.',
    submitting: 'Registering...',
    submit: (n: number) => `Register for ${n} Date${n === 1 ? '' : 's'}`,
  },

  departments: {
    IT: 'Information Technology',
    HR: 'Human Resources',
    Finance: 'Finance',
    Marketing: 'Marketing',
    Operations: 'Operations',
    Sales: 'Sales',
    Legal: 'Legal',
    Executive: 'Executive',
    Admin: 'Administration',
    Other: 'Other',
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
    email: 'Please enter your email address',
    emailInvalid: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    department: 'Please select your department',
    mealType: 'Please select a meal type',
    dates: 'Please select at least one date',
    datesOutOfRange: 'Please select dates within Ramadan (9 Feb – 10 Mar 2027)',
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
        date: '18 Feb',
        hijriDate: '10 Ramadan 1448',
        event: 'Office Iftar Gathering',
        description: 'Company-wide Iftar event',
        isHighlight: false,
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
    badge: 'Office Information',
    title: 'Ramadan Guidelines',
    subtitle: 'Supporting our colleagues during the holy month',
    items: {
      hours: {
        title: 'Flexible Working Hours',
        before: 'During Ramadan, fasting colleagues may opt for ',
        strong: 'flexible timings (e.g., 8:00 AM - 4:00 PM)',
        after:
          ' with a shorter lunch break, in coordination with their manager. Please plan your meetings and deadlines accordingly.',
      },
      etiquette: {
        title: 'Eating & Drinking Etiquette',
        before:
          'Out of respect for fasting colleagues, please use designated break rooms for eating and drinking during daylight hours. The cafeteria will remain open with limited services.',
        strong: '',
        after: '',
      },
      iftar: {
        title: 'Iftar at Office',
        before: 'Daily Iftar will be served in the main conference hall starting at ',
        strong: 'Maghrib prayer time (~6:24–6:31 PM)',
        after: '. All employees are welcome to join regardless of religious background.',
      },
      considerate: {
        title: 'Be Considerate',
        before:
          'Fasting colleagues may experience lower energy levels, especially in the afternoon. Please be understanding and considerate when scheduling intensive meetings or deadlines.',
        strong: '',
        after: '',
      },
      prayer: {
        title: 'Prayer Facilities',
        before: 'Prayer rooms are available on ',
        strong: 'floors 2, 5, and 8',
        after:
          ". Wudu facilities are adjacent to each prayer room. Jumu'ah (Friday) prayer at most Bengaluru masjids is around 1:30 PM - an extended lunch break is allowed to attend.",
      },
      charity: {
        title: 'Charity & Giving',
        before:
          'Our company Zakat and Sadaqah collection boxes are available at reception. Contributions support local charities and families in need. HR will match donations up to ₹1,00,000.',
        strong: '',
        after: '',
      },
    },
  },

  eid: {
    badge: 'Celebration',
    title: 'Eid ul-Fitr 2027',
    text: "Join us for the Eid celebration at our office! We'll be hosting a special Eid Milan with traditional sweets and sheer khurma, gifts for children, and family-friendly activities.",
    dateLabel: 'Date:',
    dateValue: 'Wednesday, March 10, 2027 (Karnataka public holiday - or March 11, depending on moon sighting)',
    prayerLabel: 'Eid Prayer:',
    prayerValue: 'Quddus Saheb Eidgah, Millers Road, Bengaluru',
    eventLabel: 'Office Event:',
    eventValue: 'Friday, March 12, 11:00 AM',
    mubarak: 'Eid Mubarak!',
  },

  tips: {
    badge: 'Wellness',
    title: 'Tips for Fasting at Work',
    subtitle: 'Stay healthy and productive during Ramadan',
    items: {
      suhoor: {
        title: 'Sehri Nutrition',
        description:
          'Eat complex carbs, protein, and drink plenty of water. Avoid salty and spicy foods that increase thirst during the day.',
      },
      day: {
        title: 'During the Day',
        description:
          'Take short breaks, avoid direct sunlight, and schedule demanding tasks for the morning when energy is higher.',
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
    text: 'Contact HR for any questions about Ramadan arrangements or special accommodations.',
  },

  footer: {
    tagline: 'Bringing colleagues together for blessed meals during the holy month of Ramadan.',
    copyright: '© 2027 RamadanHub - Bengaluru, India',
  },
}

export type Dictionary = typeof en

const ur: Dictionary = {
  language: {
    switchTo: 'English',
    switchLabel: 'انگریزی میں دیکھیں',
  },

  header: {
    location: 'بنگلورو، بھارت',
  },

  hero: {
    titleLine1: 'افطار و سحری',
    titleLine2: 'رجسٹریشن',
    intro:
      'رمضان المبارک 2027 کے بابرکت مہینے میں اپنے ساتھیوں کے ساتھ افطار اور سحری میں شامل ہوں۔ دفتر میں افطار اور سحری کے اجتماعات کے لیے رجسٹر کریں۔',
    prayerTimesTitle: 'اوقاتِ نماز - بنگلورو',
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
    iftar: 'افطار',
    suhoor: 'سحری',
  },

  form: {
    badge: 'رمضان 2027',
    title: 'کھانے کے لیے رجسٹریشن',
    subtitle: 'اپنی تفصیلات درج کریں اور ایک ساتھ کئی تاریخیں منتخب کریں',
    successTitle: 'رجسٹریشن کامیاب!',
    successText: 'جزاک اللہ خیر۔ آپ کی رجسٹریشن محفوظ ہو گئی ہے۔',
    registeredFor: (n: number) => `${urduDatesOblique(n)} کے لیے رجسٹریشن ہو گئی:`,
    alreadyRegisteredFor: (n: number) => `${urduDatesOblique(n)} کے لیے پہلے سے رجسٹرڈ:`,
    personalInfo: 'ذاتی معلومات',
    fullName: 'پورا نام *',
    fullNamePlaceholder: 'اپنا پورا نام درج کریں',
    employeeId: 'ملازم آئی ڈی',
    employeeIdPlaceholder: 'مثلاً EMP-12345',
    email: 'ای میل ایڈریس *',
    emailPlaceholder: 'your.email@company.com',
    phone: 'فون نمبر *',
    phonePlaceholder: '+91 XXXXX XXXXX',
    department: 'شعبہ *',
    departmentPlaceholder: 'شعبہ منتخب کریں',
    mealDetails: 'کھانے کی تفصیلات',
    mealType: 'کھانے کی قسم *',
    iftarDescription: 'غروبِ آفتاب کے وقت شام کا کھانا',
    suhoorDescription: 'فجر سے پہلے کا کھانا',
    multiDateHint: 'آپ ایک ہی کھانے کے لیے کئی تاریخیں منتخب کر سکتے ہیں',
    datesLabel: 'تاریخیں منتخب کریں *',
    guests: 'مہمانوں کی تعداد (روزانہ)',
    guestOption: (n: number) => (n === 1 ? 'ایک فرد' : `${n} افراد`),
    dietary: 'غذائی ضروریات',
    dietaryPlaceholder: 'الرجی، پرہیز...',
    duplicateTitle: 'پہلے سے رجسٹرڈ!',
    duplicateByName: 'اس نام سے',
    duplicateByPhone: 'اس موبائل نمبر سے',
    duplicateSuffix: 'کے لیے تمام منتخب تاریخوں پر پہلے ہی رجسٹریشن ہو چکی ہے:',
    duplicateHelp: 'براہِ کرم دوسری تاریخیں منتخب کریں یا رجسٹریشن میں تبدیلی کے لیے HR سے رابطہ کریں۔',
    submitting: 'رجسٹر ہو رہا ہے...',
    submit: (n: number) => (n === 0 ? 'رجسٹر کریں' : `${urduDatesOblique(n)} کے لیے رجسٹر کریں`),
  },

  departments: {
    IT: 'انفارمیشن ٹیکنالوجی',
    HR: 'ہیومن ریسورسز',
    Finance: 'مالیات',
    Marketing: 'مارکیٹنگ',
    Operations: 'آپریشنز',
    Sales: 'سیلز',
    Legal: 'قانونی امور',
    Executive: 'ایگزیکٹو',
    Admin: 'انتظامیہ',
    Other: 'دیگر',
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
    email: 'براہِ کرم اپنا ای میل ایڈریس درج کریں',
    emailInvalid: 'براہِ کرم درست ای میل ایڈریس درج کریں',
    phone: 'براہِ کرم درست فون نمبر درج کریں',
    department: 'براہِ کرم اپنا شعبہ منتخب کریں',
    mealType: 'براہِ کرم کھانے کی قسم منتخب کریں',
    dates: 'براہِ کرم کم از کم ایک تاریخ منتخب کریں',
    datesOutOfRange: 'براہِ کرم رمضان کی تاریخیں منتخب کریں (9 فروری – 10 مارچ 2027)',
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
        date: '18 فروری',
        hijriDate: '10 رمضان 1448',
        event: 'دفتر میں اجتماعی افطار',
        description: 'کمپنی کی جانب سے سب کے لیے افطار',
        isHighlight: false,
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
    badge: 'دفتری معلومات',
    title: 'رمضان کی رہنما ہدایات',
    subtitle: 'ماہِ مبارک میں اپنے ساتھیوں کا ساتھ',
    items: {
      hours: {
        title: 'لچکدار اوقاتِ کار',
        before: 'رمضان کے دوران روزہ دار ساتھی اپنے مینیجر کی مشاورت سے ',
        strong: 'لچکدار اوقات (مثلاً صبح 8:00 تا شام 4:00)',
        after: ' اور مختصر لنچ بریک کا انتخاب کر سکتے ہیں۔ براہِ کرم میٹنگز اور ڈیڈ لائنز اسی کے مطابق رکھیں۔',
      },
      etiquette: {
        title: 'کھانے پینے کے آداب',
        before:
          'روزہ دار ساتھیوں کے احترام میں دن کے اوقات میں کھانے پینے کے لیے مخصوص بریک رومز استعمال کریں۔ کینٹین محدود سہولیات کے ساتھ کھلی رہے گی۔',
        strong: '',
        after: '',
      },
      iftar: {
        title: 'دفتر میں افطار',
        before: 'روزانہ افطار مین کانفرنس ہال میں ',
        strong: 'مغرب کے وقت (تقریباً شام 6:24 تا 6:31)',
        after: ' پیش کی جائے گی۔ تمام ملازمین کو، مذہب سے قطع نظر، شرکت کی دعوت ہے۔',
      },
      considerate: {
        title: 'خیال رکھیں',
        before:
          'روزہ دار ساتھیوں کی توانائی خاص طور پر دوپہر کے بعد کم ہو سکتی ہے۔ براہِ کرم سخت میٹنگز یا ڈیڈ لائنز طے کرتے وقت ان کا خیال رکھیں۔',
        strong: '',
        after: '',
      },
      prayer: {
        title: 'نماز کی سہولیات',
        before: 'نماز کے کمرے ',
        strong: 'دوسری، پانچویں اور آٹھویں منزل',
        after:
          ' پر دستیاب ہیں۔ ہر کمرے کے ساتھ وضو خانہ موجود ہے۔ بنگلورو کی بیشتر مساجد میں نمازِ جمعہ تقریباً دوپہر 1:30 بجے ہوتی ہے، اس میں شرکت کے لیے لنچ بریک میں توسیع کی اجازت ہے۔',
      },
      charity: {
        title: 'صدقہ و خیرات',
        before:
          'کمپنی کے زکوٰۃ اور صدقہ کے بکس استقبالیہ پر رکھے گئے ہیں۔ عطیات مقامی خیراتی اداروں اور ضرورت مند خاندانوں کی مدد کے لیے ہیں۔ HR ₹1,00,000 تک کے عطیات کے برابر رقم شامل کرے گا۔',
        strong: '',
        after: '',
      },
    },
  },

  eid: {
    badge: 'جشن',
    title: 'عید الفطر 2027',
    text: 'دفتر میں عید کی خوشیوں میں ہمارے ساتھ شامل ہوں! ہم روایتی مٹھائیوں اور شیر خرمہ، بچوں کے تحائف اور خاندانی سرگرمیوں کے ساتھ خصوصی عید ملن کا اہتمام کر رہے ہیں۔',
    dateLabel: 'تاریخ:',
    dateValue: 'بدھ، 10 مارچ 2027 (کرناٹک میں عام تعطیل، رویتِ ہلال کے مطابق 11 مارچ بھی ہو سکتی ہے)',
    prayerLabel: 'نمازِ عید:',
    prayerValue: 'قدوس صاحب عیدگاہ، ملرز روڈ، بنگلورو',
    eventLabel: 'دفتری تقریب:',
    eventValue: 'جمعہ، 12 مارچ، صبح 11:00 بجے',
    mubarak: 'عید مبارک!',
  },

  tips: {
    badge: 'صحت',
    title: 'دفتر میں روزے کے لیے مفید مشورے',
    subtitle: 'رمضان میں صحت مند اور فعال رہیں',
    items: {
      suhoor: {
        title: 'سحری کی غذا',
        description:
          'پیچیدہ کاربوہائیڈریٹس اور پروٹین لیں اور خوب پانی پئیں۔ نمکین اور مسالے دار غذاؤں سے پرہیز کریں جو دن میں پیاس بڑھاتی ہیں۔',
      },
      day: {
        title: 'دن کے دوران',
        description:
          'مختصر وقفے لیں، دھوپ سے بچیں اور مشکل کام صبح کے وقت کریں جب توانائی زیادہ ہو۔',
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
    text: 'رمضان کے انتظامات یا خصوصی سہولیات کے بارے میں کسی بھی سوال کے لیے HR سے رابطہ کریں۔',
  },

  footer: {
    tagline: 'ماہِ رمضان میں ساتھیوں کو بابرکت دسترخوان پر یکجا کرتے ہوئے۔',
    copyright: '© 2027 RamadanHub - بنگلورو، بھارت',
  },
}

export const translations = { en, ur }

export type Locale = keyof typeof translations
