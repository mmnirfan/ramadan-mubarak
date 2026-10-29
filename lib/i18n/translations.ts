import type { ImportantDate } from '@/lib/types'

/**
 * Arabic count phrase: 1 → singular, 2 → dual, 3-10 → plural, 11+ → accusative singular
 */
function arabicCount(n: number, one: string, two: string, few: string, many: string): string {
  if (n === 1) return one
  if (n === 2) return two
  if (n >= 3 && n <= 10) return `${n} ${few}`
  return `${n} ${many}`
}

const arabicDates = (n: number) => arabicCount(n, 'تاريخ واحد', 'تاريخين', 'تواريخ', 'تاريخًا')

const en = {
  language: {
    switchTo: 'العربية',
    switchLabel: 'Switch to Arabic',
  },

  header: {
    location: 'Abu Dhabi, UAE',
  },

  hero: {
    titleLine1: 'Iftar & Suhoor',
    titleLine2: 'Registration',
    intro:
      'Join your colleagues for blessed meals during the holy month of Ramadan 2027. Register for office Iftar and Suhoor gatherings.',
    prayerTimesTitle: 'Prayer Times - Abu Dhabi',
    prayerTimesNote:
      'Approximate times for mid-Ramadan (23 Feb 2027). They shift by a few minutes over the month.',
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
    suhoor: 'Suhoor',
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
    phonePlaceholder: '+971 XX XXX XXXX',
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
    datesOutOfRange: 'Please select dates within Ramadan (8 Feb – 9 Mar 2027)',
    network: 'Could not reach the registration server. Please try again later.',
    unconfirmed: 'Could not confirm your registration. Please try again.',
    generic: 'Failed to submit. Please try again.',
    unexpected: 'An unexpected error occurred. Please try again.',
  },

  importantDates: {
    badge: 'Mark Your Calendar',
    title: 'Important Dates',
    subtitle: 'Ramadan & Eid Al-Fitr 2027 Schedule',
    note: '* Dates are based on astronomical calculations and expected moon sighting, and may vary by 1-2 days',
    items: [
      {
        date: '8 Feb',
        hijriDate: '1 Ramadan 1448',
        event: 'First Day of Ramadan',
        description: 'Beginning of the holy month (subject to moon sighting)',
        isHighlight: true,
      },
      {
        date: '18 Feb',
        hijriDate: '11 Ramadan 1448',
        event: 'Office Iftar Gathering',
        description: 'Company-wide Iftar event',
        isHighlight: false,
      },
      {
        date: '27 Feb',
        hijriDate: '20 Ramadan 1448',
        event: 'Last 10 Nights Begin',
        description: 'Laylatul Qadr period begins after Maghrib',
        isHighlight: false,
      },
      {
        date: '5 Mar',
        hijriDate: '26 Ramadan 1448',
        event: 'Laylatul Qadr (Expected)',
        description: 'Night of Power - the 27th night, after Maghrib',
        isHighlight: true,
      },
      {
        date: '8 Mar',
        hijriDate: '29 Ramadan 1448',
        event: 'Last Day of Ramadan',
        description: 'Or 9 Mar if Ramadan completes 30 days',
        isHighlight: false,
      },
      {
        date: '9 Mar',
        hijriDate: '1 Shawwal 1448',
        event: 'Eid Al-Fitr',
        description: 'Celebration of breaking the fast (or 10 Mar)',
        isHighlight: true,
      },
      {
        date: '9-11 Mar',
        hijriDate: '1-3 Shawwal 1448',
        event: 'Eid Holiday',
        description: 'UAE public holidays - until 12 Mar if Ramadan has 30 days',
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
        title: 'Reduced Working Hours',
        before: 'During Ramadan, office hours are reduced to ',
        strong: '9:00 AM - 3:00 PM',
        after: ' (6 hours) in accordance with UAE labor law. Please plan your meetings and deadlines accordingly.',
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
        strong: 'Maghrib prayer time (~6:10–6:25 PM)',
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
          ". Wudu facilities are adjacent to each prayer room. Jumu'ah (Friday) prayer is at 1:15 PM in the main hall.",
      },
      charity: {
        title: 'Charity & Giving',
        before:
          'Our company Zakat and Sadaqah collection boxes are available at reception. Contributions support local charities and families in need. HR will match donations up to AED 10,000.',
        strong: '',
        after: '',
      },
    },
  },

  eid: {
    badge: 'Celebration',
    title: 'Eid Al-Fitr 2027',
    text: "Join us for the Eid celebration at our office! We'll be hosting a special Eid breakfast gathering with traditional sweets, gifts for children, and family-friendly activities.",
    dateLabel: 'Date:',
    dateValue: 'March 9-11, 2027 (Public Holidays, until March 12 if Ramadan has 30 days)',
    prayerLabel: 'Eid Prayer:',
    prayerValue: 'Abu Dhabi National Exhibition Centre',
    eventLabel: 'Office Event:',
    eventValue: 'Monday, March 15, 10:00 AM',
    mubarak: 'Eid Mubarak!',
  },

  tips: {
    badge: 'Wellness',
    title: 'Tips for Fasting at Work',
    subtitle: 'Stay healthy and productive during Ramadan',
    items: {
      suhoor: {
        title: 'Suhoor Nutrition',
        description:
          'Eat complex carbs, protein, and drink plenty of water. Avoid salty foods that increase thirst during the day.',
      },
      day: {
        title: 'During the Day',
        description:
          'Take short breaks, avoid direct sunlight, and schedule demanding tasks for the morning when energy is higher.',
      },
      iftar: {
        title: 'Breaking Fast',
        description:
          'Start with dates and water, eat slowly, and avoid overeating. Include fruits and vegetables in your Iftar.',
      },
    },
  },

  contact: {
    title: 'Need Assistance?',
    text: 'Contact HR for any questions about Ramadan arrangements or special accommodations.',
  },

  footer: {
    tagline: 'Bringing colleagues together for blessed meals during the holy month of Ramadan.',
    copyright: '© 2027 RamadanHub - Abu Dhabi, UAE',
  },
}

export type Dictionary = typeof en

const ar: Dictionary = {
  language: {
    switchTo: 'English',
    switchLabel: 'التبديل إلى الإنجليزية',
  },

  header: {
    location: 'أبوظبي، الإمارات',
  },

  hero: {
    titleLine1: 'الإفطار والسحور',
    titleLine2: 'سجّل الآن',
    intro:
      'انضم إلى زملائك على موائد مباركة خلال شهر رمضان الفضيل 2027. سجّل في تجمعات الإفطار والسحور في المكتب.',
    prayerTimesTitle: 'مواقيت الصلاة - أبوظبي',
    prayerTimesNote: 'مواقيت تقريبية لمنتصف رمضان (23 فبراير 2027)، وتتغير بضع دقائق خلال الشهر.',
  },

  prayers: {
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
  },

  meals: {
    iftar: 'الإفطار',
    suhoor: 'السحور',
  },

  form: {
    badge: 'رمضان 2027',
    title: 'التسجيل في الوجبات',
    subtitle: 'أدخل بياناتك واختر عدة تواريخ دفعة واحدة',
    successTitle: 'تم التسجيل بنجاح!',
    successText: 'جزاك الله خيرًا. تم حفظ تسجيلك.',
    registeredFor: (n: number) => `تم تسجيلك في ${arabicDates(n)}:`,
    alreadyRegisteredFor: (n: number) => `أنت مسجّل مسبقًا في ${arabicDates(n)}:`,
    personalInfo: 'المعلومات الشخصية',
    fullName: 'الاسم الكامل *',
    fullNamePlaceholder: 'أدخل اسمك الكامل',
    employeeId: 'الرقم الوظيفي',
    employeeIdPlaceholder: 'مثال: EMP-12345',
    email: 'البريد الإلكتروني *',
    emailPlaceholder: 'your.email@company.com',
    phone: 'رقم الهاتف *',
    phonePlaceholder: '+971 XX XXX XXXX',
    department: 'القسم *',
    departmentPlaceholder: 'اختر القسم',
    mealDetails: 'تفاصيل الوجبة',
    mealType: 'نوع الوجبة *',
    iftarDescription: 'وجبة المساء عند الغروب',
    suhoorDescription: 'وجبة ما قبل الفجر',
    multiDateHint: 'يمكنك اختيار عدة تواريخ لنفس نوع الوجبة',
    datesLabel: 'اختر التواريخ *',
    guests: 'عدد الضيوف (لكل يوم)',
    guestOption: (n: number) => arabicCount(n, 'شخص واحد', 'شخصان', 'أشخاص', 'شخصًا'),
    dietary: 'المتطلبات الغذائية',
    dietaryPlaceholder: 'حساسية، قيود غذائية...',
    duplicateTitle: 'مسجّل مسبقًا!',
    duplicateByName: 'سبق لشخص بهذا الاسم التسجيل في',
    duplicateByPhone: 'سبق التسجيل برقم الهاتف هذا في',
    duplicateSuffix: 'في جميع التواريخ المحددة:',
    duplicateHelp: 'يرجى اختيار تواريخ مختلفة أو التواصل مع الموارد البشرية لتعديل تسجيلك.',
    submitting: 'جارٍ التسجيل...',
    submit: (n: number) => (n === 0 ? 'سجّل الآن' : `سجّل في ${arabicDates(n)}`),
  },

  departments: {
    IT: 'تقنية المعلومات',
    HR: 'الموارد البشرية',
    Finance: 'المالية',
    Marketing: 'التسويق',
    Operations: 'العمليات',
    Sales: 'المبيعات',
    Legal: 'الشؤون القانونية',
    Executive: 'الإدارة التنفيذية',
    Admin: 'الشؤون الإدارية',
    Other: 'أخرى',
  },

  datePicker: {
    placeholder: 'اضغط لاختيار التواريخ (يمكن اختيار أكثر من تاريخ)',
    selected: (n: number) => `تم اختيار ${arabicDates(n)}`,
    legend: 'رمضان 2027',
    done: 'تم',
    previousMonth: 'الشهر السابق',
    nextMonth: 'الشهر التالي',
    removeDate: 'إزالة التاريخ',
    weekdays: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  },

  errors: {
    fullName: 'يرجى إدخال اسمك الكامل',
    email: 'يرجى إدخال بريدك الإلكتروني',
    emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
    phone: 'يرجى إدخال رقم هاتف صحيح',
    department: 'يرجى اختيار القسم',
    mealType: 'يرجى اختيار نوع الوجبة',
    dates: 'يرجى اختيار تاريخ واحد على الأقل',
    datesOutOfRange: 'يرجى اختيار تواريخ ضمن شهر رمضان (8 فبراير – 9 مارس 2027)',
    network: 'تعذّر الاتصال بخادم التسجيل. يرجى المحاولة لاحقًا.',
    unconfirmed: 'تعذّر تأكيد تسجيلك. يرجى المحاولة مرة أخرى.',
    generic: 'فشل الإرسال. يرجى المحاولة مرة أخرى.',
    unexpected: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  },

  importantDates: {
    badge: 'دوّن في تقويمك',
    title: 'تواريخ مهمة',
    subtitle: 'جدول رمضان وعيد الفطر 2027',
    note: '* التواريخ مبنية على الحسابات الفلكية والرؤية المتوقعة للهلال، وقد تختلف بيوم أو يومين',
    items: [
      {
        date: '8 فبراير',
        hijriDate: '1 رمضان 1448',
        event: 'أول أيام رمضان',
        description: 'بداية الشهر الفضيل (حسب رؤية الهلال)',
        isHighlight: true,
      },
      {
        date: '18 فبراير',
        hijriDate: '11 رمضان 1448',
        event: 'إفطار جماعي في المكتب',
        description: 'فعالية إفطار لجميع موظفي الشركة',
        isHighlight: false,
      },
      {
        date: '27 فبراير',
        hijriDate: '20 رمضان 1448',
        event: 'بداية العشر الأواخر',
        description: 'تبدأ ليالي القدر بعد صلاة المغرب',
        isHighlight: false,
      },
      {
        date: '5 مارس',
        hijriDate: '26 رمضان 1448',
        event: 'ليلة القدر (متوقعة)',
        description: 'ليلة السابع والعشرين، بعد صلاة المغرب',
        isHighlight: true,
      },
      {
        date: '8 مارس',
        hijriDate: '29 رمضان 1448',
        event: 'آخر أيام رمضان',
        description: 'أو 9 مارس إذا أتمّ رمضان ثلاثين يومًا',
        isHighlight: false,
      },
      {
        date: '9 مارس',
        hijriDate: '1 شوال 1448',
        event: 'عيد الفطر',
        description: 'الاحتفال بعيد الفطر المبارك (أو 10 مارس)',
        isHighlight: true,
      },
      {
        date: '9-11 مارس',
        hijriDate: '1-3 شوال 1448',
        event: 'عطلة العيد',
        description: 'عطلة رسمية في الإمارات، وتمتد حتى 12 مارس إذا كان رمضان ثلاثين يومًا',
        isHighlight: false,
      },
    ],
  },

  guidelines: {
    badge: 'معلومات المكتب',
    title: 'إرشادات رمضان',
    subtitle: 'دعم زملائنا خلال الشهر الفضيل',
    items: {
      hours: {
        title: 'ساعات عمل مخفّضة',
        before: 'خلال شهر رمضان، تُخفَّض ساعات الدوام إلى ',
        strong: '9:00 ص - 3:00 م',
        after: ' (6 ساعات) وفقًا لقانون العمل الإماراتي. يرجى تخطيط اجتماعاتك ومواعيدك النهائية وفقًا لذلك.',
      },
      etiquette: {
        title: 'آداب الأكل والشرب',
        before:
          'احترامًا للزملاء الصائمين، يرجى استخدام غرف الاستراحة المخصصة للأكل والشرب خلال ساعات النهار. سيبقى المقصف مفتوحًا بخدمات محدودة.',
        strong: '',
        after: '',
      },
      iftar: {
        title: 'الإفطار في المكتب',
        before: 'يُقدَّم الإفطار يوميًا في قاعة المؤتمرات الرئيسية بدءًا من ',
        strong: 'موعد أذان المغرب (حوالي 6:10 - 6:25 م)',
        after: '. جميع الموظفين مرحَّب بهم بغض النظر عن خلفيتهم الدينية.',
      },
      considerate: {
        title: 'مراعاة الآخرين',
        before:
          'قد يعاني الزملاء الصائمون من انخفاض في مستوى الطاقة، خاصة بعد الظهر. يرجى التفهّم والمراعاة عند جدولة الاجتماعات المكثفة أو المواعيد النهائية.',
        strong: '',
        after: '',
      },
      prayer: {
        title: 'مرافق الصلاة',
        before: 'تتوفر غرف الصلاة في ',
        strong: 'الطوابق 2 و5 و8',
        after: '. توجد مرافق الوضوء بجوار كل غرفة صلاة. تُقام صلاة الجمعة الساعة 1:15 م في القاعة الرئيسية.',
      },
      charity: {
        title: 'الصدقات والعطاء',
        before:
          'تتوفر صناديق الزكاة والصدقات الخاصة بالشركة في الاستقبال. تدعم المساهمات الجمعيات الخيرية المحلية والأسر المحتاجة. ستقدّم الموارد البشرية مساهمة مماثلة للتبرعات حتى 10,000 درهم.',
        strong: '',
        after: '',
      },
    },
  },

  eid: {
    badge: 'احتفال',
    title: 'عيد الفطر 2027',
    text: 'انضموا إلينا للاحتفال بالعيد في المكتب! سنقيم فطور عيد خاصًا مع الحلويات التقليدية وهدايا للأطفال وأنشطة مناسبة للعائلة.',
    dateLabel: 'التاريخ:',
    dateValue: '9-11 مارس 2027 (عطلة رسمية، وحتى 12 مارس إذا كان رمضان ثلاثين يومًا)',
    prayerLabel: 'صلاة العيد:',
    prayerValue: 'مركز أبوظبي الوطني للمعارض',
    eventLabel: 'فعالية المكتب:',
    eventValue: 'الاثنين 15 مارس، 10:00 ص',
    mubarak: 'عيد مبارك!',
  },

  tips: {
    badge: 'الصحة',
    title: 'نصائح للصيام أثناء العمل',
    subtitle: 'حافظ على صحتك وإنتاجيتك خلال رمضان',
    items: {
      suhoor: {
        title: 'تغذية السحور',
        description:
          'تناول الكربوهيدرات المعقدة والبروتين واشرب الكثير من الماء. تجنّب الأطعمة المالحة التي تزيد العطش خلال النهار.',
      },
      day: {
        title: 'خلال النهار',
        description:
          'خذ فترات راحة قصيرة، وتجنّب أشعة الشمس المباشرة، وخصّص المهام الصعبة للصباح حين تكون طاقتك أعلى.',
      },
      iftar: {
        title: 'الإفطار',
        description:
          'ابدأ بالتمر والماء، وتناول طعامك ببطء وتجنّب الإفراط في الأكل. أضف الفواكه والخضروات إلى إفطارك.',
      },
    },
  },

  contact: {
    title: 'هل تحتاج إلى مساعدة؟',
    text: 'تواصل مع الموارد البشرية لأي استفسارات حول ترتيبات رمضان أو أي احتياجات خاصة.',
  },

  footer: {
    tagline: 'نجمع الزملاء على موائد مباركة خلال شهر رمضان الفضيل.',
    copyright: '© 2027 RamadanHub - أبوظبي، الإمارات',
  },
}

export const translations = { en, ar }

export type Locale = keyof typeof translations
