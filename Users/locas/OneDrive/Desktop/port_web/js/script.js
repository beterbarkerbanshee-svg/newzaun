const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const languageToggle = document.getElementById('languageToggle');
const languageMenu = document.getElementById('languageMenu');
const languageMenuOptions = document.querySelectorAll('.lang-option');
const i18nElements = document.querySelectorAll('[data-i18n-key]');
const i18nPlaceholderElements = document.querySelectorAll('[data-i18n-placeholder]');
const navLinks = document.querySelectorAll('.site-nav a');
const mobileNavButton = document.querySelector('.mobile-nav-button');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

// Loading State Management
class LoadingManager {
  constructor() {
    this.overlay = null;
  }

  showOverlay(message = '') {
    if (this.overlay) return;
    
    this.overlay = document.createElement('div');
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-content">
        <div class="spinner spinner-lg"></div>
        ${message ? `<div class="loading-text">${message}</div>` : ''}
      </div>
    `;
    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      document.body.style.overflow = '';
    }
  }

  setButtonLoading(button, isLoading = true) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
      button.dataset.originalText = button.textContent;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
      }
    }
  }

  setFormLoading(form, isLoading = true) {
    if (isLoading) {
      form.classList.add('form-loading');
      const inputs = form.querySelectorAll('input, textarea, select, button');
      inputs.forEach(input => input.disabled = true);
    } else {
      form.classList.remove('form-loading');
      const inputs = form.querySelectorAll('input, textarea, select, button');
      inputs.forEach(input => input.disabled = false);
    }
  }

  showSkeleton(container, template) {
    container.innerHTML = template;
  }

  hideSkeleton(container, content) {
    container.innerHTML = content;
  }

  createSpinner(size = 'md') {
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner-${size}`;
    return spinner;
  }

  createProgressBar(value = 0, indeterminate = false) {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    if (indeterminate) {
      progressBar.classList.add('progress-bar-indeterminate');
    } else {
      const fill = document.createElement('div');
      fill.className = 'progress-bar-fill';
      fill.style.width = `${value}%`;
      progressBar.appendChild(fill);
    }
    
    return progressBar;
  }

  updateProgressBar(progressBar, value) {
    const fill = progressBar.querySelector('.progress-bar-fill');
    if (fill) {
      fill.style.width = `${value}%`;
    }
  }
}

// Initialize loading manager
const loading = new LoadingManager();

const translations = {
  en: {
    brand: 'Zaun Tech',
    navMenu: 'Menu',
    navHome: 'Home',
    navServices: 'Services',
    navPortfolio: 'Portfolio',
    navAbout: 'About',
    navFAQ: 'FAQ',
    navDashboard: 'My project',
    navContact: 'Contact',
    navProfile: 'Profile',
    heroBadge: 'Zaun Tech',
    heroHeading: 'Build modern apps and websites with precision.',
    heroText: 'Flutter mobile apps and polished web experiences using HTML, CSS, and TypeScript — designed to launch fast and scale cleanly.',
    heroServicesBtn: 'Our services',
    heroContactBtn: 'Start a project',
    heroFeatured: 'Featured',
    heroFeaturedProject: 'gov_guide',
    heroFeaturedText: 'A mobile app designed to help citizens discover government services, access information, and complete tasks quickly.',
    servicesLabel: 'Services',
    servicesHeading: 'Focused mobile and web development.',
    service1Title: 'Flutter App Development',
    service1Text: 'Build polished mobile apps with responsive UI, fast performance, and a strong usability focus.',
    service2Title: 'Web Development',
    service2Text: 'Create modern websites with HTML, CSS, and TypeScript that are clean, fast, and easy to maintain.',
    service1Feature1: 'UI design',
    service1Feature2: 'Offline support',
    service1Feature3: 'Platform integrations',
    service2Feature1: 'Responsive design',
    service2Feature2: 'SEO basics',
    service2Feature3: 'Performance budgets',
    service1Detail: 'We deliver production-ready Flutter apps with clean architecture, responsive layouts, and platform integrations.',
    service2Detail: 'Building accessible, responsive websites with performance budgets, SEO basics, and maintainable code.',
    
    service4Title: 'Python Task Automation',
    service4Text: 'Automate routine tasks and workflows using Python scripts and lightweight tooling.',
    service4Feature1: 'Scripting & automation',
    service4Feature2: 'API integrations',
    service4Feature3: 'Scheduling & monitoring',
    service4Detail: 'Automate repetitive workflows, data processing, scraping, scheduled jobs, and integrations using Python scripts, cron, and lightweight tooling.',
    closeModal: 'Close',
    workLabel: 'Work',
    workHeading: 'Current focus',
    workProjectTitle: 'gov_guide',
    workProjectText: 'A citizen-focused government guide app that helps people find services, read instructions, and complete tasks with confidence.',
    aboutLabel: 'About',
    aboutHeading: 'Zaun Tech builds focused digital products.',
    aboutText: 'I keep the scope simple and professional: mobile app development in Flutter, and web development using core front-end tools. This helps deliver polished results without distraction.',
    stat1Text: 'Mobile-first development',
    stat2Text: 'Web craftsmanship',
    
    typicalDelivery: 'Typical delivery',
    moreInfo: 'More info',
    contactLabel: 'Contact',
    contactHeading: 'Ready to start your app or website?',
    contactText: 'Send a short brief and I will create a polished solution with fast delivery and clean execution.',
    contactBtn: 'Email Zaun Tech',
    telegramSupport: 'Telegram Support',
    contactNameLabel: 'Name',
    contactNamePlaceholder: 'Your name',
    contactEmailLabel: 'Email',
    contactEmailPlaceholder: 'your@email.com',
    contactSubjectLabel: 'Subject',
    contactSubjectPlaceholder: 'Project inquiry',
    contactMessageLabel: 'Message',
    contactMessagePlaceholder: 'Tell me about your project...',
    contactSubmit: 'Send Message',
    contactSuccess: 'Message sent successfully! We\'ll get back to you soon.',
    contactEmailTitle: 'Email',
    contactTelegramTitle: 'Telegram',
    contactLocationTitle: 'Location',
    contactLocation: 'Available worldwide, remote work',
    statTotalProjects: 'Total Projects',
    statInProgress: 'In Progress',
    statCompleted: 'Completed',
    statAvgRating: 'Avg Rating',
    projectProgress: 'Progress',
    projectWorkflow: 'Workflow',
    projectEstimatedTime: 'Estimated Time',
    projectDemo: 'Demo',
    viewDemo: 'View Demo',
    demoNotAvailable: 'We need some time to let you follow your project\'s progress',
    viewDetails: 'View details',
    emailSupport: 'Email support',
    workflowCompleted: 'Completed',
    workflowInProgress: 'In Development',
    workflowPending: 'Pending',
    footerText: '© 2026 Zaun Tech. Modern mobile and web development.',
    accountLabel: 'Account',
    dashboardHeading: 'My project',
    dashboardText: 'View requested work, check project status, and ask for support.',
    purchaseLabel: 'Request',
    purchaseSubtitle: 'Submit a request and I will contact you to discuss your project and support.',
    serviceLabel: 'Service',
    priceLabel: 'Price',
    orderIdLabel: 'Order ID',
    statusLabel: 'Status',
    buyerLabel: 'Buyer',
    supportLabel: 'Support',
    nameLabel: 'Name',
    emailLabel: 'Email',
    contactEmailLabel: 'Contact Email',
    phoneLabel: 'Phone Number',
    telegramLabel: 'Telegram ID',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    pleaseEnterNameEmail: 'Please enter name and email.',
    themeLight: 'Light',
    themeDark: 'Dark',
    buyNow: 'Request now',
    backButton: 'Back',
    orderDetailsLabel: 'Order details',
    orderDetailsSubtitle: 'Review your purchase and support options.',
    orderBack: 'Back to purchases',
    emailSupport: 'Email support',
    telegramSupport: 'Telegram Support',
    noPurchases: 'No purchases yet. Browse services to buy.',
    browseServices: 'Browse services',
    requestService: 'Request service',
    profileLabel: 'Account',
    profileHeading: 'Personal Profile',
    phoneLabel: 'Phone Number',
    saveChanges: 'Save Changes',
    signOut: 'Sign Out',
    aboutLabel: 'About',
    aboutHeading: 'About Zaun Tech',
    aboutText: 'Zaun Tech is a modern development studio focused on building high-quality mobile and web applications. We specialize in Flutter for cross-platform mobile development and modern web technologies including HTML, CSS, and TypeScript. Our mission is to deliver clean, performant, and scalable solutions that help businesses grow and succeed in the digital world.',
    aboutValue1: 'Quality First',
    aboutValue2: 'Modern Tech',
    aboutValue3: 'Client Focus',
    missionLabel: 'Mission',
    missionHeading: 'Our Mission',
    missionText: 'To empower businesses with cutting-edge technology solutions that drive growth and innovation. We believe in building long-term partnerships with our clients, understanding their unique needs, and delivering solutions that exceed expectations.',
    valuesLabel: 'Values',
    valuesHeading: 'Our Values',
    value1Title: 'Quality First',
    value1Text: 'We never compromise on quality. Every line of code is written with care and attention to detail.',
    value2Title: 'Modern Tech',
    value2Text: 'We stay up-to-date with the latest technologies and best practices to deliver modern solutions.',
    value3Title: 'Client Focus',
    value3Text: 'Our clients are at the center of everything we do. We listen, understand, and deliver.',
    faqLabel: 'FAQ',
    faqHeading: 'Frequently Asked Questions',
    faqQ1: 'What technologies do you use?',
    faqA1: 'We primarily use Flutter for mobile app development and HTML, CSS, and TypeScript for web development. We also work with Python for automation tasks.',
    faqQ2: 'How long does a typical project take?',
    faqA2: 'Project timelines vary based on complexity. Simple websites typically take 2-6 weeks, while mobile apps can take 4-10 weeks. We provide detailed estimates during our initial consultation.',
    faqQ3: 'Do you offer ongoing support?',
    faqA3: 'Yes, we offer maintenance and support packages to ensure your application continues to run smoothly after launch. Contact us for details on our support plans.',
    faqQ4: 'How do I get started?',
    faqA4: 'Simply reach out to us through our contact page or start a project directly. We\'ll schedule a consultation to discuss your needs and provide a detailed proposal.',
    faqQ5: 'What is your pricing model?',
    faqA5: 'We offer flexible pricing based on project scope and requirements. We can work on fixed-price projects or hourly rates depending on your preference. Contact us for a custom quote.',
    faqQ6: 'Do you work with startups?',
    faqA6: 'Absolutely! We love working with startups and helping them bring their ideas to life. We offer special packages for early-stage startups to help them get started.',
    footerCompany: 'Company',
    footerAbout: 'About Us',
    footerServices: 'Services',
    footerContact: 'Contact',
    footerResources: 'Resources',
    footerFAQ: 'FAQ',
    footerDashboard: 'My Project',
    footerProfile: 'Profile',
    footerLegal: 'Legal',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    portfolioLabel: 'Portfolio',
    portfolioHeading: 'Our Work',
    portfolioText: 'Explore our completed projects showcasing Flutter mobile apps and modern web solutions.',
    project1Badge: 'Featured',
    project1Title: 'gov_guide',
    project1Description: 'A citizen-focused government guide app that helps people find services, read instructions, and complete tasks with confidence.',
    project2Badge: 'Mobile',
    project2Title: 'ShopEase App',
    project2Description: 'Modern e-commerce mobile application with seamless checkout, product catalog, and order tracking features.',
    project3Badge: 'Web',
    project3Title: 'TechCorp Website',
    project3Description: 'Professional corporate website with modern design, responsive layout, and optimized performance.',
    project4Badge: 'Automation',
    project4Title: 'AutoFlow System',
    project4Description: 'Python-based automation system for data processing, report generation, and workflow optimization.',
    project5Badge: 'Health',
    project5Title: 'HealthTrack',
    project5Description: 'Health monitoring mobile app with activity tracking, medication reminders, and health reports.',
    project6Badge: 'Dashboard',
    project6Title: 'Analytics Dashboard',
    project6Description: 'Interactive web dashboard with real-time data visualization, charts, and reporting tools.',
    viewProject: 'View Details',
    footerPortfolio: 'Portfolio',
    backToPortfolio: '← Back to Portfolio',
    projectNotFound: 'Project not found',
    projectNotFoundText: 'The requested project could not be found. Please return to the portfolio.',
    projectGallery: 'Project Gallery',
    projectOverview: 'Project Overview',
    projectTechnologies: 'Technologies Used',
    projectFeatures: 'Key Features',
    startSimilarProject: 'Start Similar Project',
    viewMoreProjects: 'View More Projects',
    loading: 'Loading...',
    saving: 'Saving...',
    submitting: 'Submitting...',
    processing: 'Processing...',
    pleaseWait: 'Please wait',
  },
  ar: {
    brand: 'Zaun Tech',
     requestService: 'اطلب الخدمة',
    navMenu: 'القائمة',
    navHome: 'الصفحة الرئيسية',
    navServices: 'الخدمات',
    navPortfolio: 'معرض الأعمال',
    navAbout: 'عن الشركة',
    navFAQ: 'الأسئلة الشائعة',
    navDashboard: 'مشروعي',
    navContact: 'اتصل',
    navProfile: 'الملف الشخصي',
    heroBadge: 'Zaun Tech',
    heroHeading: 'نبني تطبيقات ومواقع حديثة بدقة.',
    heroText: 'تطوير تطبيقات Flutter وتجارب ويب مصقولة باستخدام HTML و CSS و TypeScript — مصممة للإطلاق بسرعة والنمو بسهولة.',
    heroServicesBtn: 'خدماتنا',
    heroContactBtn: 'ابدأ مشروعك',
    heroFeatured: 'مميز',
    heroFeaturedProject: 'gov_guide',
    heroFeaturedText: 'تطبيق مخصص لمساعدة المواطنين في اكتشاف الخدمات الحكومية والوصول إلى المعلومات بسرعة.',
    servicesLabel: 'الخدمات',
    servicesHeading: 'تطوير موجه للهواتف وتطبيقات الويب.',
    service1Title: 'تطوير تطبيقات Flutter',
    service1Text: 'بناء تطبيقات موبايل مصقولة بواجهة متجاوبة وأداء سريع وتركيز قوي على سهولة الاستخدام.',
    service2Title: 'تطوير الويب',
    service2Text: 'إنشاء مواقع حديثة باستخدام HTML و CSS و TypeScript تكون نظيفة وسريعة وسهلة الصيانة.',
    service1Feature1: 'تصميم واجهة المستخدم',
    service1Feature2: 'دعم بدون اتصال',
    service1Feature3: 'تكامل المنصات',
    service2Feature1: 'تصميم متجاوب',
    service2Feature2: 'أساسيات السيو',
    service2Feature3: 'معايير الأداء',
    service1Detail: 'نقدم تطبيقات Flutter جاهزة للإنتاج مع هندسة نظيفة وتخطيطات متجاوبة وتكاملات المنصات.',
    service2Detail: 'بناء مواقع متاحة ومتجاوبة مع ميزانيات أداء وأساسيات SEO وكود سهل الصيانة.',
    
    service4Title: 'أتمتة المهام باستخدام Python',
    service4Text: 'أتمتة أي مهمة روتينية قابلة للتشغيل باستخدام سكربتات Python وأدوات خفيفة.',
    service4Feature1: 'البرمجة والنصوص',
    service4Feature2: 'تكامل مع واجهات برمجة التطبيقات',
    service4Feature3: 'الجدولة والمراقبة',
    service4Detail: 'أتمتة عمليات متكررة، معالجة بيانات، سحب بيانات، مهام مجدولة، وتكاملات باستخدام سكربتات Python و cron وأدوات خفيفة.',
    closeModal: 'إغلاق',
    workLabel: 'العمل',
    workHeading: 'التركيز الحالي',
    workProjectTitle: 'gov_guide',
    workProjectText: 'تطبيق يركز على المواطنين يساعد الناس في العثور على الخدمات وقراءة التعليمات وإتمام المهام بثقة.',
    aboutLabel: 'حول',
    aboutHeading: 'Zaun Tech تبني منتجات رقمية موجهة.',
    aboutText: 'أبقي النطاق بسيطاً ومهنياً: تطوير تطبيقات الموبايل بـ Flutter، وتطوير الويب باستخدام أدوات الواجهة الأمامية الأساسية. هذا يساعد في تقديم نتائج مصقولة بدون تشتيت.',
    stat1Text: 'تطوير موجه للموبايل',
    stat2Text: 'إتقان الويب',
    
    typicalDelivery: 'مدة التنفيذ التقريبية',
    moreInfo: 'مزيد من المعلومات',
    contactLabel: 'اتصل',
    contactHeading: 'هل أنت مستعد لبدء تطبيقك أو موقعك؟',
    contactText: 'أرسل ملخصاً قصيراً وسأبني حلاً مصقولاً بسرعة وتنفيذ نظيف.',
    contactBtn: 'راسل Zaun Tech',
    telegramSupport: 'دعم تيليجرام',
    contactNameLabel: 'الاسم',
    contactNamePlaceholder: 'اسمك',
    contactEmailLabel: 'البريد الإلكتروني',
    contactEmailPlaceholder: 'بريدك@الإلكتروني.com',
    contactSubjectLabel: 'الموضوع',
    contactSubjectPlaceholder: 'استفسار عن مشروع',
    contactMessageLabel: 'الرسالة',
    contactMessagePlaceholder: 'أخبرني عن مشروعك...',
    contactSubmit: 'إرسال الرسالة',
    contactSuccess: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
    contactEmailTitle: 'البريد الإلكتروني',
    contactTelegramTitle: 'تيليجرام',
    contactLocationTitle: 'الموقع',
    contactLocation: 'متاح عالمياً، عمل عن بعد',
    statTotalProjects: 'إجمالي المشاريع',
    statInProgress: 'قيد التنفيذ',
    statCompleted: 'مكتمل',
    statAvgRating: 'متوسط التقييم',
    projectProgress: 'التقدم',
    projectWorkflow: 'سير العمل',
    projectEstimatedTime: 'الوقت المتوقع',
    projectDemo: 'نموذج تجريبي',
    viewDemo: 'عرض النموذج',
    demoNotAvailable: 'نحتاج لبعض الوقت لنجعلك تتابع تطور مشروعك',
    viewDetails: 'عرض التفاصيل',
    emailSupport: 'دعم البريد الإلكتروني',
    workflowCompleted: 'مكتمل',
    workflowInProgress: 'قيد التطوير',
    workflowPending: 'معلق',
    footerText: '© 2026 Zaun Tech. تطوير موبايل وويب حديث.',
    accountLabel: 'الحساب',
    dashboardHeading: 'مشروعي',
    dashboardText: 'عرض طلبات المشروع، والتحقق من حالة المشروع، وطلب الدعم.',
    purchaseLabel: 'طلب',
    purchaseSubtitle: 'أرسل طلباً وسأقوم بالتواصل معك لمناقشة مشروعك والدعم.',
    serviceLabel: 'الخدمة',
    priceLabel: 'السعر',
    orderIdLabel: 'رقم الطلب',
    statusLabel: 'الحالة',
    buyerLabel: 'المشتري',
    supportLabel: 'الدعم',
    nameLabel: 'الاسم',
    emailLabel: 'البريد الإلكتروني',
    contactEmailLabel: 'بريد الاتصال',
    phoneLabel: 'رقم الهاتف',
    telegramLabel: 'معرف تلغرام',
    namePlaceholder: 'اسمك',
    emailPlaceholder: 'you@example.com',
    pleaseEnterNameEmail: 'الرجاء إدخال الاسم والبريد الإلكتروني.',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    buyNow: 'اطلب الآن',
    backButton: 'رجوع',
    orderDetailsLabel: 'تفاصيل الطلب',
    orderDetailsSubtitle: 'راجع عملية الشراء وخيارات الدعم.',
    orderBack: 'العودة إلى مشروعي',
    emailSupport: 'دعم عبر البريد',
    telegramSupport: 'دعم تيليجرام',
    noPurchases: 'لا توجد طلبات بعد. تصفح الخدمات لطلب الدعم.',
    browseServices: 'تصفح الخدمات',
    requestService: 'طلب خدمة',
    profileLabel: 'الحساب',
    profileHeading: 'الملف الشخصي',
    phoneLabel: 'رقم الهاتف',
    saveChanges: 'حفظ التغييرات',
    signOut: 'تسجيل الخروج',
    aboutLabel: 'حول',
    aboutHeading: 'عن Zaun Tech',
    aboutText: 'Zaun Tech هي استوديو تطوير حديث يركز على بناء تطبيقات ومواقع ويب عالية الجودة. نتخصص في Flutter لتطوير تطبيقات الموبايل المتعددة المنصات وتقنيات الويب الحديثة بما في ذلك HTML و CSS و TypeScript. مهمتنا هي تقديم حلول نظيفة وعالية الأداء وقابلة للتوسع تساعد الشركات على النمو والنجاح في العالم الرقمي.',
    aboutValue1: 'الجودة أولاً',
    aboutValue2: 'التقنية الحديثة',
    aboutValue3: 'التركيز على العميل',
    missionLabel: 'المهمة',
    missionHeading: 'مهمتنا',
    missionText: 'تمكين الشركات بحلول تقنية متطورة تدفع النمو والابتكار. نؤمن ببناء شراكات طويلة الأمد مع عملائنا، وفهم احتياجاتهم الفريدة، وتقديم حلول تتجاوز التوقعات.',
    valuesLabel: 'القيم',
    valuesHeading: 'قيمنا',
    value1Title: 'الجودة أولاً',
    value1Text: 'لا نتنازل أبداً عن الجودة. كل سطر من الكود مكتوب بعناية واهتمام بالتفاصيل.',
    value2Title: 'التقنية الحديثة',
    value2Text: 'نواكب أحدث التقنيات وأفضل الممارسات لتقديم حلول حديثة.',
    value3Title: 'التركيز على العميل',
    value3Text: 'عملاؤنا في مركز كل ما نفعله. نستمع، نفهم، ونقدم.',
    faqLabel: 'الأسئلة الشائعة',
    faqHeading: 'الأسئلة المتكررة',
    faqQ1: 'ما هي التقنيات التي تستخدمونها؟',
    faqA1: 'نستخدم Flutter بشكل أساسي لتطوير تطبيقات الموبايل و HTML و CSS و TypeScript لتطوير الويب. نعمل أيضاً مع Python لمهام الأتمتة.',
    faqQ2: 'كم يستغرق المشروع عادة؟',
    faqA2: 'تختلف الجداول الزمنية للمشروع بناءً على التعقيد. المواقع البسيطة تستغرق عادة 2-6 أسابيع، بينما تطبيقات الموبايل قد تستغرق 4-10 أسابيع. نقدم تقديرات مفصلة خلال استشارتنا الأولية.',
    faqQ3: 'هل تقدمون دعماً مستمراً؟',
    faqA3: 'نعم، نقدم حزم الصيانة والدعم لضمان استمرار تطبيقك في العمل بسلاسة بعد الإطلاق. اتصل بنا للحصول على تفاصيل خطط الدعم الخاصة بنا.',
    faqQ4: 'كيف أبدأ؟',
    faqA4: 'ببساطة تواصل معنا عبر صفحة الاتصال أو ابدأ مشروعاً مباشرة. سنقوم بجدولة استشارة لمناقشة احتياجاتك وتقديم مقترح مفصل.',
    faqQ5: 'ما هو نموذج التسعير الخاص بكم؟',
    faqA5: 'نقدم تسعيراً مرناً بناءً على نطاق المشروع والمتطلبات. يمكننا العمل على مشاريع بسعر ثابت أو معدلات ساعية حسب تفضيلك. اتصل بنا للحصول على عرض سعر مخصص.',
    faqQ6: 'هل تعملون مع الشركات الناشئة؟',
    faqA6: 'بالتأكيد! نحب العمل مع الشركات الناشئة ومساعدتها على تحويل أفكارها إلى واقع. نقدم حزم خاصة للشركات الناشئة في المراحل الأولى لمساعدتها على البدء.',
    footerCompany: 'الشركة',
    footerAbout: 'عن الشركة',
    footerServices: 'الخدمات',
    footerContact: 'اتصل',
    footerResources: 'الموارد',
    footerFAQ: 'الأسئلة الشائعة',
    footerDashboard: 'مشروعي',
    footerProfile: 'الملف الشخصي',
    footerLegal: 'قانوني',
    footerPrivacy: 'سياسة الخصوصية',
    footerTerms: 'شروط الخدمة',
    portfolioLabel: 'معرض الأعمال',
    portfolioHeading: 'أعمالنا',
    portfolioText: 'استكشف مشاريعنا المنجزة التي تعرض تطبيقات Flutter وحلول الويب الحديثة.',
    project1Badge: 'مميز',
    project1Title: 'gov_guide',
    project1Description: 'تطبيق دليل حكومي يركز على المواطنين يساعد الناس في العثور على الخدمات وقراءة التعليمات وإتمام المهام بثقة.',
    project2Badge: 'موبايل',
    project2Title: 'تطبيق ShopEase',
    project2Description: 'تطبيق موبايل للتجارة الإلكترونية حديث مع دفع سلس، كتالوج منتجات، وميزات تتبع الطلبات.',
    project3Badge: 'ويب',
    project3Title: 'موقع TechCorp',
    project3Description: 'موقع شركة احترافي بتصميم حديث وتخطيط متجاوب وأداء محسن.',
    project4Badge: 'أتمتة',
    project4Title: 'نظام AutoFlow',
    project4Description: 'نظام أتمتة يعتمد على Python لمعالجة البيانات وتوليد التقارير وتحسين سير العمل.',
    project5Badge: 'صحة',
    project5Title: 'HealthTrack',
    project5Description: 'تطبيق موبايل لمراقبة الصحة مع تتبع النشاط وتذكيرات الأدوية والتقارير الصحية.',
    project6Badge: 'لوحة تحكم',
    project6Title: 'لوحة تحكم التحليلات',
    project6Description: 'لوحة تحكم ويب تفاعلية مع تصور البيانات في الوقت الفعلي والرسوم البيانية وأدوات التقارير.',
    viewProject: 'عرض التفاصيل',
    footerPortfolio: 'معرض الأعمال',
    backToPortfolio: '← العودة إلى معرض الأعمال',
    projectNotFound: 'المشروع غير موجود',
    projectNotFoundText: 'المشروع المطلوب غير موجود. يرجى العودة إلى معرض الأعمال.',
    projectGallery: 'معرض المشروع',
    projectOverview: 'نظرة عامة على المشروع',
    projectTechnologies: 'التقنيات المستخدمة',
    projectFeatures: 'الميزات الرئيسية',
    startSimilarProject: 'ابدأ مشروع مشابه',
    viewMoreProjects: 'عرض المزيد من المشاريع',
    loading: 'جاري التحميل...',
    saving: 'جاري الحفظ...',
    submitting: 'جاري الإرسال...',
    processing: 'جاري المعالجة...',
    pleaseWait: 'يرجى الانتظار',
  },
};

function applyTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  if (themeToggle) {
    themeToggle.checked = isDark;
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function updateLanguageMenuState(language) {
  if (languageToggle) {
    languageToggle.textContent = language === 'ar' ? 'AR' : 'EN';
    languageToggle.setAttribute('aria-expanded', 'false');
  }
  languageMenuOptions.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === language);
  });
}

function applyLanguage(language) {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  root.setAttribute('lang', language);
  root.setAttribute('dir', dir);
  updateLanguageMenuState(language);
  // Re-query elements to include dynamically added ones
  const i18nElements = document.querySelectorAll('[data-i18n-key]');
  i18nElements.forEach((element) => {
    const key = element.dataset.i18nKey;
    if (translations[language]?.[key]) {
      element.textContent = translations[language][key];
    }
  });
  const i18nPlaceholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  i18nPlaceholderElements.forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (translations[language]?.[key]) {
      element.placeholder = translations[language][key];
    }
  });
  const i18nAriaElements = document.querySelectorAll('[data-i18n-aria]');
  i18nAriaElements.forEach((element) => {
    const key = element.dataset.i18nAria;
    if (translations[language]?.[key]) {
      element.setAttribute('aria-label', translations[language][key]);
    }
  });
}

function toggleLanguageMenu() {
  if (!languageMenu || !languageToggle) return;
  const isOpen = languageMenu.classList.toggle('open');
  languageToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeLanguageMenu() {
  if (!languageMenu || !languageToggle) return;
  languageMenu.classList.remove('open');
  languageToggle.setAttribute('aria-expanded', 'false');
}

function getPreferredTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) return storedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getPreferredLanguage() {
  return localStorage.getItem('language') || 'en';
}

languageMenuOptions.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const selectedLanguage = button.dataset.lang;
    applyLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    closeLanguageMenu();
  });
});

if (languageToggle) {
  languageToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleLanguageMenu();
  });
}

document.addEventListener('click', () => {
  closeLanguageMenu();
});

if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    const nextTheme = themeToggle.checked ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  });
}

const services = [
  { id: 'flutter', titleKey: 'service1Title', descKey: 'service1Text', price: 1200 },
  { id: 'web', titleKey: 'service2Title', descKey: 'service2Text', price: 800 },
  { id: 'automation', titleKey: 'service4Title', descKey: 'service4Text', price: 500 },
];

function parseQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

function getPurchases() {
  try {
    const purchases = localStorage.getItem('purchases');
    if (purchases) {
      return JSON.parse(purchases);
    }
    return [];
  } catch (e) {
    console.error('Error parsing purchases from localStorage', e);
    return [];
  }
}

// Check if online
function isOnline() {
  return navigator.onLine;
}

// Sync purchases with Firestore when connection is restored
async function syncPurchasesWithFirestore() {
  if (!isOnline() || !firebase.firestore || !window.firebaseAuth || !window.firebaseAuth.currentUser) {
    return;
  }
  
  try {
    console.log('Syncing purchases with Firestore...');
    await getPurchasesFromFirestore();
    console.log('Purchases synced successfully');
  } catch (e) {
    console.error('Error syncing purchases:', e);
  }
}

async function getPurchasesFromFirestore() {
  try {
    if (!firebase.firestore || !window.firebaseAuth || !window.firebaseAuth.currentUser) {
      console.warn('Firestore or user not initialized, returning local purchases.');
      return getPurchases();
    }
    
    const db = firebase.firestore();
    const user = window.firebaseAuth.currentUser;
    const snapshot = await db.collection('users').doc(user.uid).collection('purchases').get();
    
    if (snapshot.empty) {
      return getPurchases();
    }
    
    const purchases = [];
    snapshot.forEach(doc => {
      purchases.push({ id: doc.id, ...doc.data() });
    });
    
    // Cache purchases in localStorage
    savePurchases(purchases);
    console.log('Purchases cached in localStorage');
    
    return purchases;
  } catch (e) {
    console.error('Error fetching purchases from Firestore:', e);
    return getPurchases();
  }
}

function savePurchases(list) {
  localStorage.setItem('purchases', JSON.stringify(list));
}

async function savePurchaseToFirestore(purchase) {
  try {
    if (!firebase.firestore || !window.firebaseAuth || !window.firebaseAuth.currentUser) {
      console.warn('Firestore or user not initialized, saving to localStorage only.');
      savePurchases([purchase]);
      return;
    }
    
    const db = firebase.firestore();
    const user = window.firebaseAuth.currentUser;
    
    // Add user UID to the purchase object
    const purchaseWithUser = { ...purchase, userId: user.uid };
    
    await db.collection('users').doc(user.uid).collection('purchases').add(purchaseWithUser);
    console.log('Purchase saved to Firestore for user:', user.uid);
    
    // Update local cache
    const currentPurchases = getPurchases();
    currentPurchases.push({ ...purchaseWithUser, id: purchaseWithUser.id || Date.now().toString() });
    savePurchases(currentPurchases);
    console.log('Local cache updated');
  } catch (e) {
    console.error('Error saving purchase to Firestore:', e);
    // Save to localStorage as fallback
    const currentPurchases = getPurchases();
    currentPurchases.push({ ...purchase, id: purchase.id || Date.now().toString() });
    savePurchases(currentPurchases);
  }
}

async function saveUserToFirestore(user) {
  try {
    if (!firebase.firestore) {
      console.warn('Firestore not initialized');
      return;
    }
    
    if (!user || !user.uid) {
      console.error('Cannot save user: User UID is missing');
      return;
    }
    
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);
    
    // Check if user already exists
    const doc = await userRef.get();
    if (doc.exists) {
      console.log('User already exists in Firestore');
      return;
    }
    
    // Save user data
    await userRef.set({
      email: user.email,
      displayName: user.displayName || user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified || false
    });
    
    console.log('User saved to Firestore');
  } catch (e) {
    console.error('Error saving user to Firestore:', e);
  }
}

function getStatusClass(status) {
  return status === 'Processing' ? 'badge-processing' : status === 'Done' ? 'badge-done' : 'badge-other';
}

async function renderPurchases() {
  const container = document.getElementById('purchasesList');
  if (!container) return;

  const purchases = await getPurchasesFromFirestore();
  container.innerHTML = '';

  if (!purchases.length) {
    const language = getPreferredLanguage();
    const noPurchasesText = translations[language]?.noPurchases || 'No purchases yet. Browse services to buy.';
    const browseServicesText = translations[language]?.browseServices || 'Browse services';
    container.innerHTML = `
      <div class="empty-state">
        <p>${noPurchasesText}</p>
        <a class="btn primary" href="services.html">${browseServicesText}</a>
      </div>
    `;
    return;
  }

  purchases.forEach((order) => {
    const card = document.createElement('article');
    card.className = 'project-card purchase-card';
    const statusClass = getStatusClass(order.status);
    card.innerHTML = `
      <div class="card-header">
        <h3>${order.title}</h3>
        <span class="status-badge ${statusClass}">${order.status}</span>
      </div>
      <p>Order: ${order.id}</p>
      <p style="color:var(--text-secondary)">Customer: ${order.buyerName || order.buyerEmail || '—'}</p>
      <div class="card-actions">
        <a class="btn" href="order-details.html?orderId=${order.id}" data-i18n-key="viewDetails">View details</a>
        <a class="btn" href="mailto:${order.buyerEmail || ''}?subject=Support%20for%20order%20${order.id}" target="_blank" data-i18n-key="emailSupport">Email support</a>
        <a class="btn" href="https://t.me/your_telegram" target="_blank">Telegram</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Update dashboard statistics based on user data
async function updateDashboardStats() {
  // First, display data from localStorage cache immediately
  const localPurchases = getPurchases();
  updateStatsDisplay(localPurchases);
  
  // Then, fetch from Firestore and update in background
  const purchases = await getPurchasesFromFirestore();
  updateStatsDisplay(purchases);
}

function updateStatsDisplay(purchases) {
  // Calculate statistics
  const totalProjects = purchases.length;
  const inProgress = purchases.filter(p => p.status === 'Processing').length;
  const completed = purchases.filter(p => p.status === 'Done').length;
  const avgRating = completed > 0 ? 4.8 : 0; // Placeholder for actual rating calculation
  
  // Update statistics cards
  const totalProjectsEl = document.getElementById('totalProjects');
  const inProgressEl = document.getElementById('inProgress');
  const completedEl = document.getElementById('completed');
  const avgRatingEl = document.getElementById('avgRating');
  
  if (totalProjectsEl) totalProjectsEl.textContent = totalProjects;
  if (inProgressEl) inProgressEl.textContent = inProgress;
  if (completedEl) completedEl.textContent = completed;
  if (avgRatingEl) avgRatingEl.textContent = avgRating > 0 ? avgRating.toFixed(1) : '—';
  
  // Update pie chart
  updatePieChart(inProgress, completed);
  
  // Update bar chart with monthly activity
  updateBarChart(purchases);
}

// Update pie chart based on project status
function updatePieChart(inProgress, completed) {
  const total = inProgress + completed;
  if (total === 0) return;
  
  const inProgressPercent = (inProgress / total) * 100;
  const completedPercent = (completed / total) * 100;
  
  // Calculate stroke-dasharray for SVG circles
  const circumference = 2 * Math.PI * 40; // r=40
  const inProgressDash = (inProgressPercent / 100) * circumference;
  const completedDash = (completedPercent / 100) * circumference;
  
  const pieChartSvg = document.querySelector('.pie-chart-svg');
  if (pieChartSvg) {
    const circles = pieChartSvg.querySelectorAll('circle');
    if (circles.length >= 3) {
      circles[1].setAttribute('stroke-dasharray', `${inProgressDash} ${circumference}`);
      circles[2].setAttribute('stroke-dasharray', `${completedDash} ${circumference}`);
      circles[2].setAttribute('stroke-dashoffset', `-${inProgressDash}`);
    }
  }
}

// Update bar chart with monthly activity
function updateBarChart(purchases) {
  const barChart = document.querySelector('.bar-chart');
  if (!barChart) return;
  
  // Calculate monthly activity from purchase dates
  const monthlyData = [0, 0, 0, 0, 0, 0]; // Jan-Jun
  const currentMonth = new Date().getMonth();
  
  purchases.forEach(purchase => {
    const purchaseDate = new Date(purchase.date || Date.now());
    const month = purchaseDate.getMonth();
    const monthIndex = (month - (currentMonth - 5) + 12) % 6; // Last 6 months
    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyData[monthIndex]++;
    }
  });
  
  // Find max value for scaling
  const maxValue = Math.max(...monthlyData, 1);
  
  // Update bar heights
  const bars = barChart.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    const value = monthlyData[index] || 0;
    const height = (value / maxValue) * 100;
    bar.style.height = `${Math.max(height, 5)}%`; // Minimum 5% height
  });
}


function getServiceById(id) {
  return services.find((service) => service.id === id);
}

function populatePurchasePage() {
  const purchaseTitle = document.getElementById('purchaseTitle');
  const purchaseService = document.getElementById('purchaseService');
  const purchaseDesc = document.getElementById('purchaseDesc');
  const purchasePrice = document.getElementById('purchasePrice');
  const purchaseForm = document.getElementById('purchaseForm');
  const purchaseSubtitle = document.getElementById('purchaseSubtitle');

  if (!purchaseForm || !purchaseTitle || !purchaseService || !purchaseDesc || !purchasePrice) return;

  const params = parseQueryParams();
  const service = getServiceById(params.serviceId);
  const language = getPreferredLanguage();

  if (!service) {
    purchaseTitle.textContent = 'Service not found';
    purchaseService.textContent = 'Unknown service';
    purchaseDesc.textContent = 'Please go back to services and select an available package.';
    purchasePrice.textContent = '—';
    purchaseForm.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  purchaseTitle.textContent = translations[language]?.[service.titleKey] || 'Buy service';
  purchaseService.textContent = translations[language]?.[service.titleKey] || service.id;
  purchaseDesc.textContent = translations[language]?.[service.descKey] || '';
  purchasePrice.textContent = `$${service.price}`;
  purchaseForm.dataset.serviceId = service.id;

  if (purchaseSubtitle && !purchaseSubtitle.dataset.i18nKey) {
    purchaseSubtitle.textContent = translations[language]?.purchaseSubtitle || 'Complete the form to start your project.';
  }
}

async function populateOrderDetailsPage() {
  const params = parseQueryParams();
  const orderId = params.orderId;
  
  if (!orderId) {
    console.error('No orderId found in URL');
    return;
  }
  
  // First, try to get from localStorage cache
  const localPurchases = getPurchases();
  const localOrder = localPurchases.find((item) => item.id === orderId);
  
  if (localOrder) {
    console.log('Displaying order from localStorage cache');
    displayOrderDetails(localOrder);
  }
  
  // Then, fetch from Firestore and update
  const purchases = await getPurchasesFromFirestore();
  const order = purchases.find((item) => item.id === orderId);
  
  if (order) {
    console.log('Updating order from Firestore');
    displayOrderDetails(order);
  } else if (!localOrder) {
    console.error('Order not found in Firestore or localStorage');
  }
}

function displayOrderDetails(order) {
  const detailTitle = document.getElementById('detailTitle');
  const detailService = document.getElementById('detailService');
  const detailStatus = document.getElementById('detailStatus');
  const detailOrderId = document.getElementById('detailOrderId');
  const detailMethod = document.getElementById('detailMethod');
  const detailBuyer = document.getElementById('detailBuyer');
  const detailEmail = document.getElementById('detailEmail');
  const detailSubtitle = document.getElementById('detailSubtitle');
  const detailProgressFill = document.getElementById('detailProgressFill');
  const detailProgressText = document.getElementById('detailProgressText');
  const detailWorkflow = document.getElementById('detailWorkflow');
  const detailEstimatedTime = document.getElementById('detailEstimatedTime');
  const detailDemo = document.getElementById('detailDemo');

  if (!detailTitle || !detailService || !detailStatus || !detailOrderId || !detailBuyer || !detailEmail) return;

  const language = getPreferredLanguage();

  if (!order) {
    detailTitle.textContent = 'Order not found';
    if (detailSubtitle) {
      detailSubtitle.textContent = 'We could not find that order. Please check your order link or return to your purchases.';
    }
    detailService.textContent = '—';
    detailStatus.textContent = 'Unknown';
    detailOrderId.textContent = orderId || '—';
    detailBuyer.textContent = '—';
    detailEmail.href = 'mailto:locas.hood.banshee@gmail.com?subject=Support%20request%20for%20unknown%20order';
    detailEmail.textContent = translations[language]?.emailSupport || 'Email support';
    return;
  }

  detailTitle.textContent = `Order ${order.id}`;
  if (detailSubtitle) {
    detailSubtitle.textContent = translations[language]?.orderDetailsSubtitle || 'Review your purchase and support options.';
  }
  detailService.textContent = order.title;
  detailStatus.textContent = order.status;
  detailOrderId.textContent = order.id;
  detailBuyer.textContent = order.buyerName || order.buyerEmail || '—';
  detailEmail.href = `mailto:${order.buyerEmail || 'locas.hood.banshee@gmail.com'}?subject=Support%20for%20order%20${order.id}`;
  detailEmail.textContent = translations[language]?.emailSupport || 'Email support';

  // Update project progress details
  const progress = order.progress !== undefined ? order.progress : 0;
  const progressText = order.progress !== undefined ? `${order.progress}%` : '0%';
  
  if (detailProgressFill) {
    detailProgressFill.style.width = `${progress}%`;
  }
  if (detailProgressText) {
    detailProgressText.textContent = progressText;
  }
  if (detailWorkflow) {
    detailWorkflow.textContent = order.status === 'Done' ? 
      (translations[language]?.workflowCompleted || 'Completed') : 
      order.status === 'Processing' ? 
      (translations[language]?.workflowInProgress || 'In Development') : 
      (translations[language]?.workflowPending || 'Pending');
  }
  if (detailEstimatedTime) {
    detailEstimatedTime.textContent = order.estimatedTime || '—';
  }
  if (detailDemo) {
    if (order.status === 'Done') {
      detailDemo.innerHTML = `<a class="btn primary" href="#" target="_blank">${translations[language]?.viewDemo || 'View Demo'}</a>`;
    } else {
      detailDemo.innerHTML = `<span>${translations[language]?.demoNotAvailable || 'Available upon completion'}</span>`;
    }
  }
}

function setActiveNavLink() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const targetFile = href.split('/').pop().split('?')[0];
    link.classList.toggle('active', targetFile === currentFile);
  });
}

function updateMobileNavButton() {
  if (!mobileNavButton) return;
  if (window.innerWidth > 640) {
    mobileNavButton.classList.remove('visible');
    return;
  }
  const show = window.pageYOffset > 0;
  mobileNavButton.classList.toggle('visible', show);
}

function closeMobileMenu() {
  if (!siteNav || !mobileNavButton) return;
  siteNav.classList.remove('open');
  mobileNavButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('mobile-menu-open');
}

async function handlePurchaseSubmit(event) {
  event.preventDefault();
  console.log('handlePurchaseSubmit called.');
  const form = event.target;
  const serviceId = form.dataset.serviceId;
  const service = getServiceById(serviceId);
  if (!service) {
    console.error('Service not found for serviceId:', serviceId);
    return;
  }

  const buyerName = document.getElementById('purchaseName').value.trim();
  const buyerEmail = document.getElementById('purchaseEmail').value.trim();
  const methodEl = document.getElementById('purchaseMethod');
  const method = methodEl ? methodEl.value : '';
  const purchaseMessage = document.getElementById('purchaseMessage').value.trim();

  if (!buyerName || !buyerEmail) {
    const lang = getPreferredLanguage();
    const msg = translations[lang]?.pleaseEnterNameEmail || 'Please enter name and email.';
    alert(msg);
    console.warn('Missing name or email.');
    return;
  }

  console.log('Form data collected, preparing order...');
  const order = {
    id: `ord_${Date.now()}`,
    serviceId: service.id,
    title: translations[getPreferredLanguage()]?.[service.titleKey] || service.id,
    buyerName,
    buyerEmail,
    method,
    message: purchaseMessage,
    status: 'Processing',
    createdAt: Date.now(),
  };

  try {
    console.log('Saving purchase to localStorage...');
    const purchases = getPurchases();
    purchases.unshift(order);
    savePurchases(purchases);

    console.log('Saving purchase to Firestore...');
    await savePurchaseToFirestore(order);
    console.log('Purchase saved to Firestore successfully.');
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Error during purchase submission:', error);
    alert('Failed to submit purchase. Please try again.');
  }
}

async function initializePage() {
  applyTheme(getPreferredTheme());
  applyLanguage(getPreferredLanguage());
  setActiveNavLink();

  // Wait for Firebase authentication state to be ready
  await new Promise(resolve => {
    if (window.firebaseAuth) {
      const unsubscribe = window.firebaseAuth.onAuthStateChanged(user => {
        unsubscribe();
        resolve();
      });
    } else {
      // Fallback if firebaseAuth is not yet defined
      console.warn('firebaseAuth not available. Proceeding without waiting for auth state.');
      resolve();
    }
  });

  await renderPurchases(); // Wait for purchases to render
  await updateDashboardStats(); // Wait for stats to update
  populatePurchasePage();
  populateOrderDetailsPage();

  const purchaseForm = document.getElementById('purchaseForm');
  if (purchaseForm) {
    console.log('Purchase form found, adding submit listener.');
    purchaseForm.addEventListener('submit', handlePurchaseSubmit);
  } else {
    console.log('Purchase form not found.');
  }

  const purchaseBack = document.getElementById('purchaseBack');
  if (purchaseBack) {
    console.log('Purchase back button found, adding click listener.');
    purchaseBack.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  } else {
    console.log('Purchase back button not found.');
  }

  const detailBack = document.getElementById('detailBack');
  if (detailBack) {
    console.log('Detail back button found, adding click listener.');
    detailBack.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  } else {
    console.log('Detail back button not found.');
  }

  if (navToggle && siteNav) {
    console.log('Nav toggle and site nav found, adding listeners.');
    navToggle.addEventListener('click', () => {
      const expanded = siteNav.classList.toggle('expanded');
      document.body.classList.toggle('nav-expanded', expanded);
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      localStorage.setItem('navExpanded', expanded ? '1' : '0');
    });

    const storedNavState = localStorage.getItem('navExpanded');
    if (storedNavState === '1') {
      siteNav.classList.add('expanded');
      document.body.classList.add('nav-expanded');
      navToggle.setAttribute('aria-expanded', 'true');
    }
  }

  if (mobileNavButton && siteNav) {
    mobileNavButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = siteNav.classList.toggle('open');
      mobileNavButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('mobile-menu-open', open);
    });

    document.addEventListener('click', (event) => {
      if (!siteNav.contains(event.target) && !mobileNavButton.contains(event.target)) {
        closeMobileMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    window.addEventListener('scroll', () => {
      updateMobileNavButton();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) {
        closeMobileMenu();
      }
      updateMobileNavButton();
    });

    // Online/Offline event listeners
    window.addEventListener('online', () => {
      console.log('Connection restored. Syncing data...');
      syncPurchasesWithFirestore();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost. Using local cache.');
    });

    updateMobileNavButton();
  }
}

function initializeProfilePage() {
  const profileForm = document.getElementById('profileForm');
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profilePhone = document.getElementById('profilePhone');
  const signOutBtn = document.getElementById('signOutBtn');

  if (!profileForm) return;

  if (window.firebaseAuth) {
    window.firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
      profileName.value = user.displayName || '';
      profileEmail.value = user.email || '';
      // Save user to Firestore
      await saveUserToFirestore(user);
      // Fetch phone or other data from Firestore if needed
      firebaseDB.collection('users').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.phone) profilePhone.value = data.phone;
          if (data.name && !user.displayName) profileName.value = data.name;
        }
      });
    } else {
      window.location.href = 'login.html';
    }
  });
  }

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = window.firebaseAuth ? window.firebaseAuth.currentUser : null;
    if (!user) return;

    const newName = profileName.value.trim();
    const newPhone = profilePhone.value.trim();

    const updateAuth = user.updateProfile({ displayName: newName });
    const updateDB = firebaseDB.collection('users').doc(user.uid).set({
      name: newName,
      phone: newPhone,
      email: user.email,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    Promise.all([updateAuth, updateDB]).then(() => {
      const lang = getPreferredLanguage();
      console.log(lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
    }).catch((err) => {
      console.error('Error:', err.message);
    });
  });

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      if (window.firebaseAuth) {
        window.firebaseAuth.signOut().then(() => {
          window.location.href = 'index.html';
        });
      }
    });
  }
}

document.addEventListener('firebaseInitialized', () => {
  console.log('Firebase has been initialized, calling initializePage...');
  initializePage();
  initializeProfilePage();
  initializePageTransitions();
});

// Fallback for DOMContentLoaded if firebaseInitialized somehow doesn't fire
document.addEventListener('DOMContentLoaded', () => {
  // Apply language immediately to prevent flash of English content
  applyLanguage(getPreferredLanguage());
  applyTheme(getPreferredTheme());
  
  if (!window.firebaseAuth) {
    console.warn('DOMContentLoaded fired but Firebase not yet initialized. Waiting for firebaseInitialized event.');
  }
});

// Page Transitions
function initializePageTransitions() {
  // Add loading overlay to body
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'page-loading';
  loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(loadingOverlay);
  
  // Add page transition class to main content only (not header/nav)
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-transition');
    
    // Trigger animation after a short delay
    setTimeout(() => {
      mainContent.classList.add('active');
    }, 50);
  }
  
  // Handle link clicks for page transitions
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    // Skip links that open in new tab, are anchors, or are special links
    if (link.target === '_blank' || 
        link.href.startsWith('#') || 
        link.href.startsWith('mailto:') || 
        link.href.startsWith('tel:') ||
        link.href.startsWith('javascript:')) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Check if it's a link to another page on the same site
      if (href && (href.startsWith('/') || href.startsWith('./') || href.includes('.html'))) {
        e.preventDefault();
        
        // Fade out current page
        if (mainContent) {
          mainContent.classList.remove('active');
          mainContent.classList.add('fade-out');
        }
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        
        // Navigate to new page after animation
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });
}

// Service details modal logic
function initializeServiceModal() {
  const infoButtons = document.querySelectorAll('.service-info');
  const modal = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('serviceModalTitle');
  const modalBody = document.getElementById('serviceModalBody');
  const modalCTA = document.getElementById('serviceModalCTA');

  if (!modal) return;

  // Prevent clicks inside modal content from bubbling (fixes theme toggle)
  const modalContentEl = modal.querySelector('.service-modal-content');
  if (modalContentEl) modalContentEl.addEventListener('click', (e) => e.stopPropagation());

  function openModalFromButton(btn) {
    const lang = getPreferredLanguage();
    const titleKey = btn.getAttribute('data-i18n-title');
    const detailKey = btn.getAttribute('data-i18n-detail');
    const title = titleKey ? (translations[lang]?.[titleKey] || btn.getAttribute('data-title')) : (btn.getAttribute('data-title') || btn.closest('.project-card')?.querySelector('h3')?.textContent || '');
    const detail = detailKey ? (translations[lang]?.[detailKey] || btn.getAttribute('data-detail')) : (btn.getAttribute('data-detail') || '');
    const serviceId = btn.getAttribute('data-service') || '';
    const delivery = btn.getAttribute('data-delivery') || '';
    const features = (btn.getAttribute('data-i18n-features') || '')
      .split(',')
      .map((key) => key.trim())
      .filter(Boolean)
      .map((key) => translations[lang]?.[key] || key);
    const fallbackFeatures = (btn.getAttribute('data-features') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const combinedFeatures = features.length ? features : fallbackFeatures;
    const card = btn.closest('.project-card');
    const iconHtml = card?.querySelector('.service-icon')?.innerHTML || '';

    // Build header with icon and title
    modalTitle.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'service-modal-header';
    const iconWrap = document.createElement('span');
    iconWrap.className = 'service-icon';
    iconWrap.innerHTML = iconHtml;
    const h = document.createElement('h3');
    h.className = 'service-modal-title';
    h.textContent = title;
    header.appendChild(iconWrap);
    header.appendChild(h);
    modalTitle.appendChild(header);

    // Body with description and features
    modalBody.innerHTML = '';
    const desc = document.createElement('p');
    desc.className = 'service-modal-body';
    desc.textContent = detail;
    modalBody.appendChild(desc);

    if (features.length) {
      const ul = document.createElement('ul');
      ul.className = 'service-modal-features';
      features.forEach((f) => {
        const li = document.createElement('li');
        li.textContent = f;
        ul.appendChild(li);
      });
      modalBody.appendChild(ul);
    }

    if (delivery) {
      const meta = document.createElement('div');
      meta.className = 'service-modal-meta';
      const deliveryLabel = translations[lang]?.typicalDelivery || 'Typical delivery';
      meta.textContent = `${deliveryLabel}: ${delivery}`;
      modalBody.appendChild(meta);
    }

    modalCTA.setAttribute('href', `service-purchase.html?serviceId=${encodeURIComponent(serviceId)}`);
    // ensure CTA label uses current language
    modalCTA.textContent = translations[lang]?.requestService || modalCTA.textContent || 'Request service';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  infoButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModalFromButton(btn);
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target.classList.contains('service-modal-close')) {
      closeModal();
    }
  });

  const closeButton = modal.querySelector('.service-modal-close');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

document.addEventListener('DOMContentLoaded', initializeServiceModal);

// --- Firebase initialization ---
// Firebase initialization moved to firebase-loader.js
// --- End Firebase initialization ---

// Helper: show login dialog if needed
function requireLogin(callback) {
  if (window.firebaseAuth && !window.firebaseAuth.currentUser) {
    // Simple email login prompt (replace with UI as needed)
    const email = prompt('Enter your email to sign in:');
    if (!email) return;
    window.firebaseAuth.signInWithEmailAndPassword(email, '123456')
      .then(callback)
      .catch((err) => alert('Login failed: ' + err.message));
  } else {
    callback();
  }
}

// --- FirebaseUI Auth advanced login modal ---
function showLoginUI(onSignedIn) {
  let container = document.getElementById('firebaseui-auth-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'firebaseui-auth-container';
    container.style = 'position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;';
    document.body.appendChild(container);
  }
  container.innerHTML = '<div id="firebaseui-auth" style="background:#fff;padding:2em;border-radius:12px;box-shadow:0 2px 24px #0002;"></div>';
  container.style.display = 'flex';
  const uiConfig = {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: async function(authResult) {
        container.style.display = 'none';
        if (onSignedIn) onSignedIn(authResult);
        
        // Save user to Firestore on account creation
        if (authResult && authResult.user) {
          await saveUserToFirestore(authResult.user);
        }
        
        return false;
      }
    }
  };
  if (!window.firebaseUiInstance) {
    window.firebaseUiInstance = new firebaseui.auth.AuthUI(firebase.auth());
  }
  window.firebaseUiInstance.start('#firebaseui-auth', uiConfig);
}

// Show login UI only on specific pages if not signed in
if (window.firebaseAuth) {
  window.firebaseAuth.onAuthStateChanged(function(user) {
    const protectedPages = ['dashboard.html', 'order-details.html', 'service-purchase.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (!user && protectedPages.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  });
}

// Bottom Navigation Hide/Show on Scroll (Pinterest-style)
let lastScrollTop = 0;
const bottomNav = document.querySelector('.bottom-nav');

if (bottomNav) {
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 50) {
      // Scrolling down - hide nav
      bottomNav.classList.add('hidden');
    } else {
      // Scrolling up - show nav
      bottomNav.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });
}
// --- End FirebaseUI Auth advanced login modal ---
