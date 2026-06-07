document.addEventListener("DOMContentLoaded", () => {
  const THEME_KEY = "streak_theme";
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
      themeToggleBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      themeToggleBtn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch (err) {
      return "light";
    }
  }

  applyTheme(getSavedTheme());
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (err) { }
      applyTheme(theme);
    });
  }

  // ─── 1. SUPABASE CONFIGURATION ───────────────────────────────
  const SUPABASE_URL = "https://clgumelrpnqsxxdbsplk.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_hiIW37VsJADBrYwzYn1MCA_XTtF_0yC";

  // Create Supabase client
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ─── 2. CACHE KEY & STATE ────────────────────────────────────
  const CACHE_KEY = "habit_tracker_habits";
  const HABIT_EMOJI_CACHE_KEY = "habit_tracker_habit_emojis";
  const HABIT_EMOJI_COLUMNS = ["emoji", "icon", "habit_emoji", "habit_icon", "emoji_icon"];

  let localHabits = []; // Local cache of mapped habit objects
  let searchQuery = "";

  // Language State
  let currentLang = localStorage.getItem("streak_lang") || "en";
  let registeredEmail = "";
  const lastUndoState = {};

  // ─── 3. DOM REFERENCES ───────────────────────────────────────
  const authSection = document.getElementById("auth-section");
  const appSection = document.getElementById("app-section");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const registerPasswordInput = document.getElementById("register-password");
  const registerPasswordStrength = document.getElementById("register-password-strength");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const habitInput = document.getElementById("habit-input");
  const habitEmojiInput = null;

  const addHabitBtn = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");
  const emptyState = document.getElementById("empty-state");
  const spinner = document.getElementById("spinner");
  const toastContainer = document.getElementById("toast-container");
  const userEmailDisplay = document.getElementById("user-email");
  const legalModal = document.getElementById("legal-modal");
  const legalModalTitle = document.getElementById("legal-modal-title");
  const legalModalBody = document.getElementById("legal-modal-body");
  const settingsSection = document.getElementById("settings-section");
  const registerEmailInput = document.getElementById("register-email");
  const registerFirstNameInput = document.getElementById("register-first-name");
  const registerLastNameInput = document.getElementById("register-last-name");
  const registerNameInput = document.getElementById("register-name");
  const footerYear = document.getElementById("footer-year");
  const btnEmptyCta = document.getElementById("btn-empty-cta");
  const langToggle = document.getElementById("lang-toggle");

  const dashboardHeading = document.getElementById("dashboard-heading");
  const addHabitHeading = document.getElementById("add-habit-heading");
  const statTotal = document.getElementById("stat-total");
  const labelFirstName = document.getElementById("label-register-first-name");
  const labelLastName = document.getElementById("label-register-last-name");
  const verifyHeading = document.getElementById("verify-heading");
  const verifySubtitle = document.getElementById("verify-subtitle");
  const openEmailBtn = document.getElementById("open-email-btn");
  const resendOtpBtn = document.getElementById("resend-otp-btn");
  const topbarLogoutBtn = document.getElementById("topbar-logout-btn");
  const topbarAvatarBtn = document.getElementById("topbar-avatar");
  const openSettingsBtn = document.getElementById("open-settings-btn");
  const backToAppBtn = document.getElementById("back-to-app-btn");
  const settingsPageTitle = document.getElementById("settings-page-title");
  const settingsPageSubtitle = document.getElementById("settings-page-subtitle");
  const settingsPhotoHeading = document.getElementById("settings-photo-heading");
  const avatarUploadLabel = document.getElementById("avatar-upload-label");
  const avatarFormatHint = document.getElementById("avatar-format-hint");
  const settingsEmailHeading = document.getElementById("settings-email-heading");
  const settingsEmailLabel = document.getElementById("settings-email-label");
  const newEmailInput = document.getElementById("new-email-input");
  const changeEmailBtn = document.getElementById("change-email-btn");
  const settingsPasswordHeading = document.getElementById("settings-password-heading");
  const settingsPasswordLabel = document.getElementById("settings-password-label");
  const newPasswordInput = document.getElementById("new-password-input");
  const changePasswordBtn = document.getElementById("change-password-btn");
  const resetPasswordModal = document.getElementById("reset-password-modal");
  const resetHeading = document.getElementById("reset-heading");
  const labelResetNewPassword = document.getElementById("label-reset-new-password");
  const resetConfirmBtn = document.getElementById("reset-confirm-btn");
  const resetNewPasswordInput = document.getElementById("reset-new-password");
  const verifyBtn = document.getElementById("verify-btn");
  const verifyOtpInput = document.getElementById("verify-otp");
  const avatarPreview = document.getElementById("avatar-preview");
  const avatarUploadInput = document.getElementById("avatar-upload");
  const wordmarks = document.querySelectorAll(".wordmark");
  const authTaglines = document.querySelectorAll(".auth-tagline");
  const loginEmailLabel = document.querySelector("#panel-login .form-group:nth-of-type(1) .form-label");
  const loginPassLabel = document.querySelector("#panel-login .form-group:nth-of-type(2) .form-label");
  const authFootnote = document.querySelector("#panel-login .auth-footnote");
  const regNameLabel = document.querySelector("#panel-register .form-group:nth-of-type(1) .form-label");
  const regEmailLabel = document.querySelector("#panel-register .form-group:nth-of-type(2) .form-label");
  const regPassLabel = document.querySelector("#panel-register .form-group:nth-of-type(3) .form-label");
  const regFootnote = document.querySelector("#panel-register .auth-footnote");
  const pageSubtitle = document.querySelector(".page-hero .page-subtitle");
  const addNameLabel = document.querySelector(".habit-form__name .form-label");
  const statTotalLabel = document.querySelector(".stat-chip__label");
  const emptyHeading = document.querySelector(".empty-state__heading");
  const emptyBody = document.querySelector(".empty-state__body");
  const footerCopy = document.querySelector(".footer__copy");
  const footerLinks = document.querySelectorAll(".footer__link");
  const addHabitSection = document.querySelector(".add-habit-section");

  // Auth Panel DOM References
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const panelLogin = document.getElementById("panel-login");
  const panelRegister = document.getElementById("panel-register");
  const panelVerify = document.getElementById("panel-verify");

  // Search & Filter DOM References
  const habitSearchInput = document.getElementById("habit-search");

  const frame = (callback) => requestAnimationFrame(callback); // PERF: batch interaction-driven DOM work into the next paint.
  const debounce = (callback, delay = 250) => { // PERF: keep search render work off every keystroke.
    let timer = 0;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  };
  const staticElementsById = { // PERF: reuse DOM references instead of repeated selector lookups.
    "auth-section": authSection,
    "app-section": appSection,
    "settings-section": settingsSection,
    "tab-login": tabLogin,
    "tab-register": tabRegister,
    "login-btn": loginBtn,
    "register-btn": registerBtn,
    "logout-btn": logoutBtn,
    "email": emailInput,
    "password": passwordInput,
    "dashboard-heading": dashboardHeading,
    "add-habit-heading": addHabitHeading,
    "btn-empty-cta": btnEmptyCta,
    "register-name": registerNameInput,
    "register-email": registerEmailInput,
    "register-password": registerPasswordInput,
    "register-first-name": registerFirstNameInput,
    "register-last-name": registerLastNameInput,
    "habit-input": habitInput,

    "habit-search": habitSearchInput,
    "label-register-first-name": labelFirstName,
    "label-register-last-name": labelLastName,
    "verify-heading": verifyHeading,
    "verify-subtitle": verifySubtitle,
    "open-email-btn": openEmailBtn,
    "resend-otp-btn": resendOtpBtn,
    "topbar-logout-btn": topbarLogoutBtn,
    "topbar-avatar": topbarAvatarBtn,
    "settings-page-title": settingsPageTitle,
    "settings-page-subtitle": settingsPageSubtitle,
    "back-to-app-btn": backToAppBtn,
    "open-settings-btn": openSettingsBtn,
    "settings-photo-heading": settingsPhotoHeading,
    "avatar-upload-label": avatarUploadLabel,
    "avatar-format-hint": avatarFormatHint,
    "settings-email-heading": settingsEmailHeading,
    "settings-email-label": settingsEmailLabel,
    "new-email-input": newEmailInput,
    "change-email-btn": changeEmailBtn,
    "settings-password-heading": settingsPasswordHeading,
    "settings-password-label": settingsPasswordLabel,
    "new-password-input": newPasswordInput,
    "change-password-btn": changePasswordBtn,
    "reset-heading": resetHeading,
    "label-reset-new-password": labelResetNewPassword,
    "reset-new-password": resetNewPasswordInput,
    "reset-confirm-btn": resetConfirmBtn,
    "avatar-preview": avatarPreview,
    "avatar-upload": avatarUploadInput,
    "stat-total": statTotal,
    "add-habit-btn": addHabitBtn
  };
  // ─── 4. TRANSLATIONS DICTIONARY ──────────────────────────────
  const translations = {
    en: {
      langBtn: "العربية",
      wordmark: "Streak",
      tagline: "Build habits. Keep streaks.",
      tabLogin: "Sign in",
      tabRegister: "Create account",
      labelEmail: "Email",
      placeholderEmail: "you@example.com",
      labelPassword: "Password",
      placeholderPassword: "••••••••",
      btnShowPassword: "Show",
      btnHidePassword: "Hide",
      passwordWeak: "Weak password",
      passwordMedium: "Medium password",
      passwordStrong: "Strong password",
      toastWeakPassword: "Please use a medium or strong password.",
      btnLogin: "Sign in",
      footnoteForgot: "Forgot your password?",
      btnResetIt: "Reset it",
      labelName: "Full name",
      placeholderName: "Jane Smith",
      labelRegisterPassword: "Password",
      placeholderRegisterPassword: "Min. 8 characters",
      btnRegister: "Create account",
      footnoteAgree: "By signing up you agree to our Terms & Privacy Policy.",
      greeting: "Welcome, ",
      btnLogout: "Sign out",
      pageTitle: "My Habits",
      pageSubtitle: "Track what matters. Show up every day.",
      addHabitHeading: "Add a new habit",
      labelHabitName: "Habit name",
      placeholderHabitName: "e.g. Morning run",
      labelHabitEmoji: "Icon (emoji)",
      placeholderHabitEmoji: "🏃",
      emojiHint: "Optional",
      labelDescription: "Description (optional)",
      placeholderDescription: "A short note about this habit…",
      statMonthsLbl: "Months",
      statDoneLbl: "Done",
      statMissedLbl: "Missed",
      btnAddHabit: "Add habit",
      statTotal: "Total habits",
      statCompleted: "Done today",
      statStreak: "Best streak",
      placeholderSearch: "Search habits…",
      emptyHeading: "No habits yet",
      emptyBody: "Add your first habit above and start building your streak today.",
      emptyCta: "Add your first habit",
      footerRights: "Streak. All rights reserved.",
      footerPrivacy: "Privacy",
      footerTerms: "Terms",
      footerHelp: "Help",
      footerEmail: "sami.mikhail.2006@gmail.com",
      labelFirstName: "First name",
      labelLastName: "Last name",
      placeholderFirstName: "Jane",
      placeholderLastName: "Smith",
      toastNameRequired: "Please enter your first and last name.",
      verifyHeading: "Verify your email",
      verifySubtitle: "We sent a magic verification link to {email}. Click the link to confirm your account.",
      btnOpenEmail: "Open Email",
      btnResendCode: "Resend link",
      toastCodeResent: "Code resent! Check your inbox.",
      toastVerifySuccess: "Verification successful!",
      btnAccountSettings: "Account Settings",
      settingsHeading: "Account Settings",
      sectionTitleAvatar: "Profile Photo",
      labelAvatarUpload: "Upload photo",
      avatarFormatHint: "JPG, PNG or WebP · Max 2 MB",
      sectionTitleEmail: "Change Email",
      placeholderNewEmail: "New email address",
      btnUpdateEmail: "Update email",
      sectionTitlePassword: "Change Password",
      placeholderNewPassword: "New password (min. 8 chars)",
      btnUpdatePassword: "Update password",
      toastAvatarUpdated: "Profile photo updated! ✅",
      toastEmailUpdateSent: "Confirmation sent to your new email. Check your inbox.",
      toastPasswordUpdated: "Password updated successfully.",
      settingsPageTitle: "Account Settings",
      settingsPageSubtitle: "Manage your profile, email, and password.",
      btnBackToApp: "← Back to habits",
      btnOpenSettings: "Account Settings",
      toastPassLength8: "Password must be at least 8 characters.",
      resetHeading: "Set a new password",
      labelResetNewPassword: "New Password",
      placeholderResetNewPassword: "New password (min. 8 chars)",
      btnSaveNewPassword: "Save new password",
      toastPasswordResetSuccess: "Password updated! Please sign in.",

      // Dynamic JS strings
      confirmDelete: "Are you sure you want to delete this habit?",
      confirmReset: "Reset streak back to 0?",
      toastHabitName: "Please enter a habit name.",
      toastHabitLength: "Habit name must be 100 characters or fewer.",
      toastAdded: '"{name}" added! 🎉',
      toastFailedAdd: "Failed to add habit.",
      toastFailedFetch: "Failed to load habits.",
      toastDeleted: "Habit deleted.",
      toastFailedDelete: "Failed to delete habit.",
      toastIncrementSuccess: "Keep it up! 🔥",
      toastFailedUpdate: "Failed to update habit.",
      toastResetSuccess: "Counter reset.",
      toastFailedReset: "Failed to reset habit.",
      toastEnterAuth: "Please enter your email and password.",
      toastPassLength: "Password must be at least 6 characters.",
      toastConfirmEmail: "Check your email to confirm your account! 📧",
      toastLoggedOut: "You've been logged out.",
      toastFailedLogout: "Logout failed.",
      toastForgot: "Password reset email sent! Check your inbox.",

      // UI Card details
      days: "days",
      currentStreak: "Current Streak",
      plusOneDay: "+1 Day",
      resetTooltip: "Reset streak",
      completedDays: "Completed Days"
    },
    ar: {
      langBtn: "English",
      wordmark: "Streak",
      tagline: "كوّن عاداتك. واظب كل يوم.",
      tabLogin: "دخول",
      tabRegister: "حساب جديد",
      labelEmail: "الإيميل",
      placeholderEmail: "you@example.com",
      labelPassword: "كلمة السر",
      placeholderPassword: "••••••••",
      btnShowPassword: "أظهر",
      btnHidePassword: "اخفي",
      passwordWeak: "كلمة سر ضعيفة",
      passwordMedium: "كلمة سر متوسطة",
      passwordStrong: "كلمة سر قوية",
      toastWeakPassword: "استخدم كلمة سر متوسطة أو قوية.",
      btnLogin: "دخول",
      footnoteForgot: "نسيت كلمة السر؟",
      btnResetIt: "استرجعها",
      labelName: "الاسم الكامل",
      placeholderName: "محمد أحمد",
      labelRegisterPassword: "كلمة السر",
      placeholderRegisterPassword: "8 حروف على الأقل",
      btnRegister: "حساب جديد",
      footnoteAgree: "بالتسجيل بتوافق على الشروط وسياسة الخصوصية.",
      greeting: "أهلاً، ",
      btnLogout: "خروج",
      pageTitle: "عاداتي",
      pageSubtitle: "تابع اللي بيهمك. واظب كل يوم.",
      addHabitHeading: "ضيف عادة جديدة",
      labelHabitName: "اسم العادة",
      placeholderHabitName: "مثلاً: جري الصبح",
      labelHabitEmoji: "أيقونة",
      placeholderHabitEmoji: "🏃",
      emojiHint: "اختياري",
      labelDescription: "وصف (اختياري)",
      placeholderDescription: "ملاحظة قصيرة عن العادة دي…",
      statMonthsLbl: "شهور",
      statDoneLbl: "خلص",
      statMissedLbl: "فاته",
      btnAddHabit: "ضيف عادة",
      statTotal: "كل العادات",
      statCompleted: "خلص النهارده",
      statStreak: "أحسن سلسلة",
      placeholderSearch: "دور على عادة...",
      emptyHeading: "مفيش عادات لسه",
      emptyBody: "ضيف أول عادة وابدأ سلسلتك النهارده.",
      emptyCta: "ضيف أول عادة",
      footerRights: "Streak. كل الحقوق محفوظة.",
      footerPrivacy: "الخصوصية",
      footerTerms: "الشروط",
      footerHelp: "مساعدة",
      footerEmail: "sami.mikhail.2006@gmail.com",
      labelFirstName: "الاسم الأول",
      labelLastName: "الاسم الأخير",
      placeholderFirstName: "محمد",
      placeholderLastName: "أحمد",
      toastNameRequired: "ادخل اسمك الأول والأخير.",
      verifyHeading: "تأكيد الإيميل",
      verifySubtitle: "بعتنالك رابط تأكيد على {email}. اضغط الرابط عشان تفعّل حسابك.",
      btnOpenEmail: "افتح الإيميل",
      btnResendCode: "ابعت تاني",
      toastCodeResent: "تم إعادة الإرسال! اتفقد صندوق الوارد.",
      toastVerifySuccess: "تم التحقق بنجاح!",
      btnAccountSettings: "إعدادات الحساب",
      settingsHeading: "إعدادات الحساب",
      sectionTitleAvatar: "صورة الحساب",
      labelAvatarUpload: "رفع صورة",
      avatarFormatHint: "JPG أو PNG أو WebP · الحد الأقصى 2 MB",
      sectionTitleEmail: "تغيير الإيميل",
      placeholderNewEmail: "الإيميل الجديد",
      btnUpdateEmail: "حدّث الإيميل",
      sectionTitlePassword: "تغيير كلمة السر",
      placeholderNewPassword: "كلمة سر جديدة (8 حروف على الأقل)",
      btnUpdatePassword: "حدّث كلمة السر",
      toastAvatarUpdated: "اتحدثت صورة الحساب! ✅",
      toastEmailUpdateSent: "بعتنا تأكيد على إيميلك الجديد. اتفقد صندوق الوارد.",
      toastPasswordUpdated: "اتحدثت كلمة السر بنجاح.",
      settingsPageTitle: "إعدادات الحساب",
      settingsPageSubtitle: "ادير الملف الشخصي والإيميل وكلمة السر.",
      btnBackToApp: "→ رجوع للعادات",
      btnOpenSettings: "إعدادات الحساب",
      toastPassLength8: "كلمة السر لازم تكون 8 حروف على الأقل.",
      resetHeading: "حط كلمة سر جديدة",
      labelResetNewPassword: "كلمة السر الجديدة",
      placeholderResetNewPassword: "كلمة سر جديدة (8 حروف على الأقل)",
      btnSaveNewPassword: "احفظ كلمة السر",
      toastPasswordResetSuccess: "اتحدثت كلمة السر! ادخل تاني.",

      // Dynamic JS strings
      confirmDelete: "متأكد إنك عايز تمسح العادة دي؟",
      confirmReset: "ترجّع العداد لـ 0؟",
      toastHabitName: "ادخل اسم العادة.",
      toastHabitLength: "اسم العادة لازم يكون 100 حرف أو أقل.",
      toastAdded: 'اتضافت "{name}"! 🎉',
      toastFailedAdd: "فشل إضافة العادة.",
      toastFailedFetch: "فشل تحميل العادات.",
      toastDeleted: "اتمسحت العادة.",
      toastFailedDelete: "فشل مسح العادة.",
      toastIncrementSuccess: "كمّل كده! 🔥",
      toastFailedUpdate: "فشل تحديث العادة.",
      toastResetSuccess: "اتعمل ريست للعداد.",
      toastFailedReset: "فشل ريست العادة.",
      toastEnterAuth: "ادخل الإيميل وكلمة السر.",
      toastPassLength: "كلمة السر لازم تكون 6 حروف على الأقل.",
      toastConfirmEmail: "اتفقد إيميلك عشان تأكد الحساب! 📧",
      toastLoggedOut: "خرجت بنجاح.",
      toastFailedLogout: "فشل الخروج.",
      toastForgot: "اتبعت إيميل استرجاع كلمة السر! اتفقد صندوق الوارد.",

      // UI Card details
      days: "أيام",
      currentStreak: "السلسلة الحالية",
      plusOneDay: "+يوم",
      resetTooltip: "ريست السلسلة",
      completedDays: "الأيام اللي خلصتها"
    }
  };

  const legalContent = {
    en: {
      privacy: {
        title: "Privacy Policy",
        body: `
          <p>Streak is a habit tracking app that helps you save habits, view progress, and manage your account.</p>
          <h3>Information we use</h3>
          <p>We use your email address for sign in, account verification, password reset, and important account messages. Habits you create, optional descriptions, and profile details are stored so the app can show your dashboard.</p>
          <h3>How data is stored</h3>
          <p>Authentication and habit data are stored through Supabase. Some calendar check marks may also be saved in your browser storage so your device can remember completed days quickly.</p>
          <h3>Your choices</h3>
          <p>You can edit your profile, change your email or password, delete habits, or contact support at sami.mikhail.2006@gmail.com for privacy questions.</p>
        `
      },
      terms: {
        title: "Terms of Use",
        body: `
          <p>By using Streak, you agree to use the app for personal habit tracking and to provide accurate account information.</p>
          <h3>Account responsibility</h3>
          <p>You are responsible for keeping your password secure and for activity that happens through your account.</p>
          <h3>Acceptable use</h3>
          <p>Do not misuse the service, attempt to access another user's data, or interfere with the app or its connected services.</p>
          <h3>Service changes</h3>
          <p>Features may change over time as the app improves. For help, contact support through WhatsApp or email sami.mikhail.2006@gmail.com.</p>
        `
      }
    },
    ar: {
      privacy: {
        title: "سياسة الخصوصية",
        body: `
          <p>Streak هو تطبيق لمتابعة العادات بيساعدك تحفظ عاداتك وتشوف تقدمك وتدير حسابك.</p>
          <h3>المعلومات اللي بنستخدمها</h3>
          <p>بنستخدم إيميلك عشان تسجيل الدخول، تأكيد الحساب، استرجاع كلمة السر، والرسايل المهمة. العادات اللي بتضيفها وتفاصيل الحساب بتتحفظ عشان يظهر الداشبورد.</p>
          <h3>إزاي البيانات بتتحفظ</h3>
          <p>بيانات الحساب والعادات بتتحفظ عن طريق Supabase. بعض علامات التقدم في التقويم ممكن تتحفظ في المتصفح عشان جهازك يتذكر الأيام اللي خلصتها.</p>
          <h3>اختياراتك</h3>
          <p>تقدر تعدل الملف الشخصي، تغير الإيميل أو كلمة السر، تمسح عادات، أو تتواصل معانا على sami.mikhail.2006@gmail.com لأي سؤال عن الخصوصية.</p>
        `
      },
      terms: {
        title: "شروط الاستخدام",
        body: `
          <p>بإنك بتستخدم Streak، بتوافق تستخدم التطبيق لمتابعة عاداتك الشخصية وتدي معلومات حساب صح.</p>
          <h3>مسؤوليتك عن الحساب</h3>
          <p>إنت المسؤول عن أمان كلمة سرك وعن أي نشاط بيحصل من حسابك.</p>
          <h3>الاستخدام المقبول</h3>
          <p>متستخدمش الخدمة بشكل مسيء، ومتحاولش تدخل على بيانات حد تاني، أو تعطل التطبيق.</p>
          <h3>تغييرات الخدمة</h3>
          <p>الميزات ممكن تتغير مع تطوير التطبيق. للمساعدة تواصل معانا على WhatsApp أو إيميل sami.mikhail.2006@gmail.com.</p>
        `
      }
    }
  };

  // ─── 5. APPLY LANGUAGE & RTL TRANSLATION ─────────────────────
  async function sendPasswordReset() {
    const t = translations[currentLang];
    let email = emailInput ? emailInput.value.trim() : "";
    if (!email) {
      email = prompt(currentLang === "ar" ? "ادخل إيميلك:" : "Please enter your email:");
      if (email) email = email.trim();
    }
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href
      });
      if (error) throw error;
      showToast(t.toastForgot, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function renderLoginFootnote() {
    if (!authFootnote) return;
    authFootnote.textContent = `${translations[currentLang].footnoteForgot} `;
    const btnForgot = document.createElement("button");
    btnForgot.className = "link-btn";
    btnForgot.id = "btn-forgot";
    btnForgot.type = "button";
    btnForgot.textContent = translations[currentLang].btnResetIt;
    btnForgot.addEventListener("click", sendPasswordReset);
    authFootnote.appendChild(btnForgot); // PERF: avoid reparsing HTML for the localized reset action.
  }

  function renderRegisterFootnote() {
    if (!regFootnote) return;
    regFootnote.textContent = "";
    if (currentLang === "ar") {
      regFootnote.append(
        document.createTextNode("بالتسجيل بتوافق على "),
        createLegalLink("terms", "الشروط"),
        document.createTextNode(" و"),
        createLegalLink("privacy", "سياسة الخصوصية"),
        document.createTextNode(".")
      );
      return;
    }
    regFootnote.append(
      document.createTextNode("By signing up you agree to our "),
      createLegalLink("terms", "Terms"),
      document.createTextNode(" & "),
      createLegalLink("privacy", "Privacy Policy"),
      document.createTextNode(".")
    ); // PERF: build footnote links as nodes instead of HTML strings.
  }

  function createLegalLink(type, label) {
    const link = document.createElement("a");
    link.href = `#${type}`;
    link.className = "link";
    link.dataset.legalLink = type;
    link.textContent = label;
    return link;
  }

  function applyLanguage() {
    const t = translations[currentLang];

    // Direction & lang attribute
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;

    // Lang toggle button label
    if (langToggle) langToggle.textContent = t.langBtn;

    // Helper closures
    const setElText = (id, text) => {
      const el = staticElementsById[id];
      if (el) el.textContent = text;
    };
    const setElPlaceholder = (id, text) => {
      const el = staticElementsById[id];
      if (el) el.placeholder = text;
    };

    // Wordmark & Taglines
    wordmarks.forEach(el => el.textContent = t.wordmark);
    authTaglines.forEach(el => el.textContent = t.tagline);

    // Tabs
    setElText("tab-login", t.tabLogin);
    setElText("tab-register", t.tabRegister);

    // Login Form Labels & Placeholders
    if (loginEmailLabel) loginEmailLabel.textContent = t.labelEmail;
    setElPlaceholder("email", t.placeholderEmail);

    if (loginPassLabel) loginPassLabel.textContent = t.labelPassword;
    setElPlaceholder("password", t.placeholderPassword);

    setElText("login-btn", t.btnLogin);

    renderLoginFootnote();

    // Register Form Labels & Placeholders
    if (regNameLabel) regNameLabel.textContent = t.labelName;
    setElPlaceholder("register-name", t.placeholderName);

    if (regEmailLabel) regEmailLabel.textContent = t.labelEmail;
    setElPlaceholder("register-email", t.placeholderEmail);

    if (regPassLabel) regPassLabel.textContent = t.labelRegisterPassword;
    setElPlaceholder("register-password", t.placeholderRegisterPassword);

    setElText("register-btn", t.btnRegister);

    renderRegisterFootnote();

    // Topbar & Main Title
    setElText("logout-btn", t.btnLogout);
    setElText("dashboard-heading", t.pageTitle);

    if (pageSubtitle) pageSubtitle.textContent = t.pageSubtitle;

    // New Habit Card
    setElText("add-habit-heading", t.addHabitHeading);

    if (addNameLabel) addNameLabel.textContent = t.labelHabitName;
    setElPlaceholder("habit-input", t.placeholderHabitName);

    setElText("add-habit-btn", t.btnAddHabit);

    // Stats labels
    if (statTotalLabel) statTotalLabel.textContent = t.statTotal;

    // Search Toolbar
    setElPlaceholder("habit-search", t.placeholderSearch);

    // Empty state labels
    if (emptyHeading) emptyHeading.textContent = t.emptyHeading;
    if (emptyBody) emptyBody.textContent = t.emptyBody;
    setElText("btn-empty-cta", t.emptyCta);

    // Footer Rights
    if (footerCopy) {
      footerCopy.textContent = `© ${new Date().getFullYear()} ${t.footerRights} `;
      const emailSpan = document.createElement("span");
      emailSpan.className = "footer__email";
      emailSpan.textContent = t.footerEmail;
      footerCopy.appendChild(emailSpan); // PERF: avoid HTML parsing during language toggles.
    }
    if (footerLinks[0]) footerLinks[0].textContent = t.footerPrivacy;
    if (footerLinks[1]) footerLinks[1].textContent = t.footerTerms;
    if (footerLinks[2]) footerLinks[2].textContent = t.footerHelp;

    if (registerPasswordInput && registerPasswordInput.value) {
      updatePasswordStrengthUI(registerPasswordInput, registerPasswordStrength, true);
    }

    // Appended for First & Last Name
    if (labelFirstName) labelFirstName.textContent = t.labelFirstName;
    setElPlaceholder("register-first-name", t.placeholderFirstName);

    if (labelLastName) labelLastName.textContent = t.labelLastName;
    setElPlaceholder("register-last-name", t.placeholderLastName);

    // Appended for OTP Verification Panel
    setElText("verify-heading", t.verifyHeading);
    if (verifySubtitle) {
      verifySubtitle.textContent = t.verifySubtitle.replace("{email}", registeredEmail);
    }
    setElText("open-email-btn", t.btnOpenEmail);
    setElText("resend-otp-btn", t.btnResendCode);

    // Redesigned Topbar Tooltips & Titles
    if (topbarLogoutBtn) {
      topbarLogoutBtn.title = t.btnLogout || "Sign out";
    }
    if (topbarAvatarBtn) {
      topbarAvatarBtn.title = t.btnAccountSettings || "Account Settings";
    }

    // Appended for Account Settings (Full-Page view)
    setElText("settings-page-title", t.settingsPageTitle);
    setElText("settings-page-subtitle", t.settingsPageSubtitle);
    setElText("back-to-app-btn", t.btnBackToApp);
    setElText("open-settings-btn", t.btnOpenSettings);

    setElText("settings-photo-heading", t.sectionTitleAvatar);
    setElText("avatar-upload-label", t.labelAvatarUpload);
    setElText("avatar-format-hint", t.avatarFormatHint);
    setElText("settings-email-heading", t.sectionTitleEmail);
    setElText("settings-email-label", currentLang === "ar" ? "الإيميل الجديد" : "New email address");
    setElPlaceholder("new-email-input", t.placeholderNewEmail);
    setElText("change-email-btn", t.btnUpdateEmail);
    setElText("settings-password-heading", t.sectionTitlePassword);
    setElText("settings-password-label", currentLang === "ar" ? "كلمة السر الجديدة" : "New password");
    setElPlaceholder("new-password-input", t.placeholderNewPassword);
    setElText("change-password-btn", t.btnUpdatePassword);

    // Appended for Reset Password Modal
    setElText("reset-heading", t.resetHeading);
    if (labelResetNewPassword) labelResetNewPassword.textContent = t.labelResetNewPassword;
    setElPlaceholder("reset-new-password", t.placeholderResetNewPassword);
    setElText("reset-confirm-btn", t.btnSaveNewPassword);

    // Re-render cards so counterLabel text updates
    applyFiltersAndRender();
  }

  function toggleLanguage() {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("streak_lang", currentLang);
    applyLanguage();
  }



  // ─── TAB SWITCHING (login ↔ register) ────────────────────────
  function showPanel(panelToShow) {
    frame(() => {
      [panelLogin, panelRegister, panelVerify].forEach(p => {
        if (!p) return;
        p.hidden = true;
        p.style.display = "none";
        p.classList.add("auth-panel--hidden");
      });
      if (panelToShow) {
        panelToShow.hidden = false;
        panelToShow.style.display = "flex";
        panelToShow.classList.remove("auth-panel--hidden");
      }
    }); // PERF: group auth panel visibility writes.
  }

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener("click", () => {
      frame(() => {
        tabLogin.classList.add("auth-tab--active");
        tabLogin.setAttribute("aria-selected", "true");
        tabRegister.classList.remove("auth-tab--active");
        tabRegister.setAttribute("aria-selected", "false");
      }); // PERF: tab state writes are batched after the click.
      showPanel(panelLogin);
    });

    tabRegister.addEventListener("click", () => {
      frame(() => {
        tabRegister.classList.add("auth-tab--active");
        tabRegister.setAttribute("aria-selected", "true");
        tabLogin.classList.remove("auth-tab--active");
        tabLogin.setAttribute("aria-selected", "false");
      }); // PERF: tab state writes are batched after the click.
      showPanel(panelRegister);
    });
  }

  // ─── FOOTER YEAR ─────────────────────────────────────────────
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ─── EMPTY STATE CTA ─────────────────────────────────────────
  if (btnEmptyCta) {
    btnEmptyCta.addEventListener("click", () => {
      frame(() => {
        habitInput && habitInput.focus();
        if (addHabitSection) {
          /* MOTION REMOVED */
          addHabitSection.scrollIntoView();
        }
      }); // PERF: focus and scroll writes are batched.
    });
  }

  // ─── 6. TOAST NOTIFICATIONS ──────────────────────────────────
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      /* MOTION REMOVED */
      toast.remove();
    }, 3000);
  }

  // ─── 7. LOADING SPINNER ──────────────────────────────────────
  function setLoading(visible) {
    if (spinner) spinner.classList.toggle("hidden", !visible);
  }

  function getPasswordStrength(password) {
    if (!password) return { level: "empty", score: 0 };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score >= 4) return { level: "strong", score };
    if (score >= 2) return { level: "medium", score };
    return { level: "weak", score };
  }

  function updatePasswordStrengthUI(input, outputEl, showEmpty) {
    if (!input || !outputEl) return;

    const strength = getPasswordStrength(input.value);
    outputEl.classList.remove(
      "password-strength--weak",
      "password-strength--medium",
      "password-strength--strong"
    );

    if (strength.level === "empty") {
      outputEl.textContent = showEmpty ? translations.en.passwordWeak : "";
      if (showEmpty) outputEl.classList.add("password-strength--weak");
      return;
    }

    outputEl.classList.add(`password-strength--${strength.level}`);
    if (strength.level === "strong") outputEl.textContent = translations.en.passwordStrong;
    else if (strength.level === "medium") outputEl.textContent = translations.en.passwordMedium;
    else outputEl.textContent = translations.en.passwordWeak;
  }

  function isPasswordAcceptable(password) {
    return getPasswordStrength(password).level !== "weak";
  }

  function habitCount(habit) {
    return habit.counter ?? habit.count ?? 0;
  }

  function habitName(habit) {
    return String(habit.name ?? habit.habit_name ?? habit.title ?? habit.habit ?? habit.label ?? habit.task ?? "");
  }

  function habitEmoji(habit) {
    const savedEmoji = readHabitEmojiValue(habit);
    if (savedEmoji) return savedEmoji;

    const emojiCache = loadHabitEmojiCache();
    return emojiCache[habitEmojiCacheKey(habit)] || emojiCache[habitEmojiContentKey(habit)] || "🌱";
  }

  function habitDescription(habit) {
    return String(habit.description ?? habit.desc ?? habit.notes ?? habit.note ?? "");
  }

  function readHabitEmojiValue(habit) {
    for (const column of HABIT_EMOJI_COLUMNS) {
      const value = habit?.[column];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  }

  function normalizeHabitEmojiInput(value) {
    return String(value || "").trim() || "🌱";
  }

  function habitEmojiCacheKey(habit) {
    const id = habit?.id;
    return id ? `id:${String(id)}` : habitEmojiContentKey(habit);
  }

  function habitEmojiContentKey(habit) {
    return `content:${habitName(habit).trim().toLowerCase()}::${habitDescription(habit).trim().toLowerCase()}`;
  }

  function loadHabitEmojiCache() {
    try {
      const raw = localStorage.getItem(HABIT_EMOJI_CACHE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveHabitEmojiCache(cache) {
    localStorage.setItem(HABIT_EMOJI_CACHE_KEY, JSON.stringify(cache));
  }

  function rememberHabitEmoji(habit, emoji) {
    const normalizedEmoji = normalizeHabitEmojiInput(emoji);
    if (normalizedEmoji === "🌱") return;

    const cache = loadHabitEmojiCache();
    cache[habitEmojiContentKey(habit)] = normalizedEmoji;
    if (habit?.id) cache[habitEmojiCacheKey(habit)] = normalizedEmoji;
    saveHabitEmojiCache(cache);
  }

  function hydrateHabitEmojis(habits) {
    let changed = false;
    const hydrated = habits.map((habit) => {
      const savedEmoji = readHabitEmojiValue(habit);
      if (savedEmoji) {
        rememberHabitEmoji(habit, savedEmoji);
        return habit;
      }

      const emojiCache = loadHabitEmojiCache();
      const cachedEmoji = emojiCache[habitEmojiCacheKey(habit)] || emojiCache[habitEmojiContentKey(habit)];
      if (!cachedEmoji) return habit;

      rememberHabitEmoji(habit, cachedEmoji);
      changed = true;
      return { ...habit, emoji: cachedEmoji };
    });

    return changed ? hydrated : habits;
  }

  function openLegalModal(type) {
    const content = legalContent.en[type];
    if (!legalModal || !legalModalTitle || !legalModalBody || !content) return;

    frame(() => {
      legalModalTitle.textContent = content.title;
      legalModalBody.innerHTML = content.body;
      legalModal.hidden = false;
      document.body.style.overflow = "hidden";
    }); // PERF: modal text and visibility update in one frame.
  }

  function closeLegalModal() {
    if (!legalModal) return;
    frame(() => {
      legalModal.hidden = true;
      document.body.style.overflow = "";
    }); // PERF: modal close writes are batched.
  }

  // ─── 8. LOCALSTORAGE CACHE ───────────────────────────────────
  function saveToCache(habits) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(habits));
  }

  function loadFromCache() {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function clearCache() {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(HABIT_EMOJI_CACHE_KEY);
  }

  // ─── 9. UI VISIBILITY HELPERS ────────────────────────────────
  function setView(state) {
    if (authSection) authSection.hidden = (state !== "auth");
    if (appSection) appSection.hidden = (state !== "app");
    if (settingsSection) settingsSection.hidden = (state !== "settings");
    window.scrollTo(0, 0);
  }

  // ─── 10. DASHBOARD STATISTICS ────────────────────────────────
  function updateStatistics(habits) {
    frame(() => {
      if (statTotal) statTotal.textContent = habits.length;
    }); // PERF: stat text updates are paint-aligned.
  }

  // ─── 11. SEARCH & FILTERING APPLICATION ──────────────────────
  function applyFiltersAndRender() {
    let filtered = [...localHabits];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h => habitName(h).toLowerCase().includes(query));
    }

    renderHabits(filtered);
    updateStatistics(localHabits); // Statistics always based on total habits!
  }

  // ─── 12. RENDER HABITS ───────────────────────────────────────
  let selectedMonths = {}; // Cache for selected month per habit card

  function currentYYYYMM() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  function renderCalendarGrid(habitId, yearMonth) {
    const gridEl = document.getElementById(`grid-${habitId}`);
    if (!gridEl) return;

    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // 0-indexed

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const key = `habit_checks_${habitId}_${yearMonth}`;
    let checkedDays = [];
    try {
      checkedDays = JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) { }
    if (!Array.isArray(checkedDays)) checkedDays = [];

    const fragment = document.createDocumentFragment(); // PERF: render day cells off-DOM, then swap once.
    for (let day = 1; day <= daysInMonth; day++) {
      const dayButton = document.createElement("button");
      dayButton.className = checkedDays.includes(day) ? "day-btn day-btn--checked" : "day-btn";
      dayButton.dataset.day = String(day);
      dayButton.dataset.habitId = String(habitId);
      dayButton.type = "button";
      dayButton.textContent = String(day);
      fragment.appendChild(dayButton);
    }
    gridEl.replaceChildren(fragment);
  }

  function updateTotalCompleted(habitId) {
    let totalDone = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`habit_checks_${habitId}_`)) {
          let checked = [];
          try {
            checked = JSON.parse(localStorage.getItem(key)) || [];
          } catch (e) { }
          if (Array.isArray(checked)) {
            totalDone += checked.length;
          }
        }
      }
    } catch (e) {
      console.error("updateTotalCompleted error:", e);
    }
    const valEl = document.getElementById(`counter-val-${habitId}`);
    if (valEl) {
      valEl.textContent = totalDone;
    }

    const now = new Date();
    const currentYearMonth = selectedMonths[habitId] || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [pYear, pMonth] = currentYearMonth.split('-').map(Number);
    const daysInCurrentMonth = new Date(pYear, pMonth, 0).getDate();
    const currentMonthKey = `habit_checks_${habitId}_${currentYearMonth}`;
    let currentMonthDone = 0;
    try {
      const parsed = JSON.parse(localStorage.getItem(currentMonthKey)) || [];
      if (Array.isArray(parsed)) currentMonthDone = parsed.length;
    } catch (e) { }
    const pct = Math.round((currentMonthDone / daysInCurrentMonth) * 100);
    const fillEl = document.getElementById(`progress-fill-${habitId}`);
    const pctEl = document.getElementById(`progress-pct-${habitId}`);
    if (fillEl) fillEl.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";

    return totalDone;
  }

  function renderHabits(habits) {
    if (!habitList) return;

    const fragment = document.createDocumentFragment(); // PERF: append habit cards in one DOM operation.
    const hydrateQueue = [];

    habits.forEach((habit) => {
      const selectedMonth = selectedMonths[habit.id] || currentYYYYMM();
      fragment.appendChild(createHabitCard(habit, selectedMonth));
      hydrateQueue.push([habit.id, selectedMonth]);
    });

    frame(() => {
      habitList.replaceChildren(fragment);
      if (emptyState) {
        emptyState.hidden = habits.length > 0;
        emptyState.style.display = habits.length > 0 ? "none" : "";
      }
      habitList.hidden = habits.length === 0;

      hydrateQueue.forEach(([habitId, selectedMonth]) => {
        renderCalendarGrid(habitId, selectedMonth);
        updateTotalCompleted(habitId);
      });
    }); // PERF: coalesce list replacement, empty state, and derived counters into a single frame.
  }

  function createHabitCard(habit, selectedMonth) {
    const t = translations.en;
    const card = document.createElement("div");
    card.className = `habit-card ${habitCount(habit) > 0 ? 'completed' : ''}`;
    card.dataset.id = habit.id;

    const name = habitName(habit);
    const icon = habitEmoji(habit);
    const descriptionText = habitDescription(habit);

    const header = document.createElement("div");
    header.className = "habit-card__header";

    const iconWrap = document.createElement("div");
    iconWrap.className = "habit-card__icon-wrap";
    iconWrap.textContent = icon;

    const details = document.createElement("div");
    details.className = "habit-card__details";

    const title = document.createElement("h4");
    title.className = "habit-card__name";
    title.textContent = name;
    details.appendChild(title);

    if (descriptionText) {
      const description = document.createElement("p");
      description.className = "habit-card__description";
      description.textContent = descriptionText;
      details.appendChild(description);
    }

    const menu = document.createElement("div");
    menu.className = "habit-card__menu";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn--icon-sm btn--ghost";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = String(habit.id);
    deleteButton.title = t.confirmDelete;
    deleteButton.type = "button";
    deleteButton.textContent = "✕";
    menu.appendChild(deleteButton);

    header.append(iconWrap, details, menu);

    const calendarSection = document.createElement("div");
    calendarSection.className = "habit-calendar-section";

    const calendarHeader = document.createElement("div");
    calendarHeader.className = "calendar-header";

    const monthRow = document.createElement("div");
    monthRow.className = "calendar-header__month-row";

    const monthPicker = document.createElement("input");
    monthPicker.type = "month";
    monthPicker.className = "month-picker month-picker--pill";
    monthPicker.dataset.id = String(habit.id);
    monthPicker.value = selectedMonth;
    monthRow.appendChild(monthPicker);

    calendarHeader.append(monthRow);

    const calendarGrid = document.createElement("div");
    calendarGrid.className = "calendar-grid";
    calendarGrid.id = `grid-${habit.id}`;

    calendarSection.append(calendarHeader, calendarGrid);

    const counterSection = document.createElement("div");
    counterSection.className = "habit-counter-section";

    const counterValue = document.createElement("div");
    counterValue.className = "habit-counter-value";
    counterValue.id = `counter-val-${habit.id}`;
    counterValue.textContent = "0";

    const counterLabel = document.createElement("div");
    counterLabel.className = "habit-counter-label";
    counterLabel.textContent = translations[currentLang].completedDays || 'Completed Days';

    counterSection.append(counterValue, counterLabel);

    const progressSection = document.createElement("div");
    progressSection.className = "habit-progress-section";

    const progressLabel = document.createElement("div");
    progressLabel.className = "habit-progress-label";

    const progressLabelText = document.createElement("span");
    progressLabelText.className = "habit-progress-label__text";
    progressLabelText.textContent = currentLang === "ar" ? "إنجاز الشهر" : "Monthly Progress";

    const progressLabelPercent = document.createElement("span");
    progressLabelPercent.className = "habit-progress-label__percent";
    progressLabelPercent.id = `progress-pct-${habit.id}`;
    progressLabelPercent.textContent = "0%";

    progressLabel.append(progressLabelText, progressLabelPercent);

    const progressTrack = document.createElement("div");
    progressTrack.className = "habit-progress-track";

    const progressFill = document.createElement("div");
    progressFill.className = "habit-progress-fill";
    progressFill.id = `progress-fill-${habit.id}`;
    progressFill.style.width = "0%";

    progressTrack.appendChild(progressFill);
    progressSection.append(progressLabel, progressTrack);

    card.append(header, calendarSection, counterSection, progressSection);
    return card; // PERF: card is constructed without innerHTML so rendering avoids parser work.
  }

  function toggleDayButton(dayBtn) {
    const habitId = dayBtn.dataset.habitId;
    const day = parseInt(dayBtn.dataset.day, 10);
    const yearMonth = selectedMonths[habitId] || currentYYYYMM();
    const key = `habit_checks_${habitId}_${yearMonth}`;

    let checkedDays = [];
    try { checkedDays = JSON.parse(localStorage.getItem(key)) || []; } catch (err) { }
    if (!Array.isArray(checkedDays)) checkedDays = [];

    const isChecked = checkedDays.includes(day);
    const nextDays = isChecked ? checkedDays.filter(d => d !== day) : [...checkedDays, day].sort((a, b) => a - b);
    dayBtn.classList.toggle("day-btn--checked", !isChecked); // PERF: visual check state updates in the click microtask.
    localStorage.setItem(key, JSON.stringify(nextDays));

    frame(() => {
      updateTotalCompleted(habitId);
    });
  }

  // ─── 13. FETCH HABITS FROM SUPABASE ──────────────────────────
  async function fetchHabits() {
    const cached = loadFromCache();
    if (cached.length > 0) {
      localHabits = hydrateHabitEmojis(cached);
      applyFiltersAndRender();
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      localHabits = hydrateHabitEmojis(data || []);
      saveToCache(localHabits);
      applyFiltersAndRender();
    } catch (err) {
      showToast(translations.en.toastFailedFetch, "error");
      console.error("fetchHabits error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── 14. ADD NEW HABIT ───────────────────────────────────────
  async function insertHabitWithFallback({ name, emoji, description, userId }) {
    const nameColumns = ["habit_name", "title", "habit", "label", "task", "name"];
    const descriptionColumns = ["description", "desc", "notes", "note"];
    const countColumns = ["counter", "count"];
    const payloads = [];
    const normalizedEmoji = normalizeHabitEmojiInput(emoji);

    nameColumns.forEach((nameColumn) => {
      const baseWithUser = { [nameColumn]: name, user_id: userId };
      const baseOnly = { [nameColumn]: name };

      HABIT_EMOJI_COLUMNS.forEach((emojiColumn) => {
        payloads.push({
          ...baseWithUser,
          [emojiColumn]: normalizedEmoji,
          [descriptionColumns[0]]: description,
          [countColumns[0]]: 0
        });
        payloads.push({
          ...baseWithUser,
          [emojiColumn]: normalizedEmoji,
          [descriptionColumns[0]]: description,
          [countColumns[1]]: 0
        });
        payloads.push({ ...baseWithUser, [emojiColumn]: normalizedEmoji });
      });
      payloads.push({ ...baseWithUser, [descriptionColumns[0]]: description });
      payloads.push({ ...baseWithUser, [descriptionColumns[1]]: description });
      payloads.push({ ...baseWithUser, [countColumns[0]]: 0 });
      payloads.push({ ...baseWithUser, [countColumns[1]]: 0 });
      payloads.push(baseWithUser);
      payloads.push(baseOnly);
    });

    let lastError = null;
    const tried = new Set();

    for (const payload of payloads) {
      const signature = JSON.stringify(Object.keys(payload).sort());
      if (tried.has(signature)) continue;
      tried.add(signature);

      const { data: insertedData, error } = await supabase
        .from("habits")
        .insert([payload])
        .select()
        .single();

      if (!error) return insertedData || null;

      lastError = error;
      const message = `${error.message || ""} ${error.details || ""} ${error.hint || ""}`.toLowerCase();
      const canRetry =
        message.includes("column") ||
        message.includes("schema cache") ||
        message.includes("could not find") ||
        message.includes("null value") ||
        message.includes("not-null");

      if (!canRetry) break;
    }

    throw lastError || new Error("Failed to add habit.");
  }

  async function addHabit() {
    const name = habitInput ? habitInput.value.trim() : "";
    const emoji = "🌱";
    const description = "";

    const t = translations.en;

    if (!name) {
      showToast(t.toastHabitName, "error");
      return;
    }
    if (name.length > 100) {
      showToast(t.toastHabitLength, "error");
      return;
    }

    const previousHabits = [...localHabits];
    const optimisticHabit = {
      id: `tmp-${Date.now()}`,
      name,
      emoji,
      description,
      counter: 0
    };

    rememberHabitEmoji(optimisticHabit, emoji);
    localHabits = [...localHabits, optimisticHabit];
    saveToCache(localHabits);
    frame(() => {
      if (habitInput) habitInput.value = "";
      if (habitEmojiInput) habitEmojiInput.value = "";

      applyFiltersAndRender();
    }); // PERF: add-card UI updates before Supabase work starts.

    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No authenticated user");

      const insertedRow = await insertHabitWithFallback({
        name,
        emoji,
        description,
        userId: user.id
      });

      // Immediately bind emoji to the real DB id if row was returned
      if (insertedRow?.id) {
        const hydratedRow = { ...insertedRow, emoji };
        bindHabitEmojiToId(hydratedRow, emoji);
        rememberHabitEmoji(hydratedRow, emoji);
      }

      showToast(t.toastAdded.replace("{name}", name), "success");
      await fetchHabits();
    } catch (err) {
      localHabits = previousHabits;
      saveToCache(localHabits);
      applyFiltersAndRender();
      showToast(err?.message ? `${t.toastFailedAdd} ${err.message}` : t.toastFailedAdd, "error");
      console.error("addHabit error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ─── 15. DELETE HABIT ────────────────────────────────────────
  async function deleteHabit(id) {
    if (!confirm(translations.en.confirmDelete)) return;
    const previousHabits = [...localHabits];
    localHabits = localHabits.filter(habit => String(habit.id) !== String(id));
    saveToCache(localHabits);
    applyFiltersAndRender(); // PERF: remove-card UI updates before network confirmation.

    setLoading(true);
    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showToast(translations.en.toastDeleted, "info");
    } catch (err) {
      localHabits = previousHabits;
      saveToCache(localHabits);
      applyFiltersAndRender();
      showToast(translations.en.toastFailedDelete, "error");
      console.error("deleteHabit error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── 16. INCREMENT COUNTER ───────────────────────────────────
  async function incrementHabit(habitId) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${y}-${m}`;
    const day = today.getDate();
    const key = `habit_checks_${habitId}_${yearMonth}`;

    let checkedDays = [];
    try { checkedDays = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { }
    if (!Array.isArray(checkedDays)) checkedDays = [];

    if (checkedDays.includes(day)) {
      showToast('Today already logged ✓', 'info');
      return;
    }

    checkedDays.push(day);
    checkedDays.sort((a, b) => a - b);
    localStorage.setItem(key, JSON.stringify(checkedDays));

    try {
      const { data, error: fetchError } = await supabase
        .from("habits")
        .select("counter")
        .eq("id", habitId)
        .single();
      if (fetchError) throw fetchError;

      const newCount = (data.counter ?? 0) + 1;
      const { error: updateError } = await supabase.from("habits").update({ counter: newCount }).eq("id", habitId);
      if (updateError) throw updateError;
    } catch (e) {
      showToast(translations.en.toastFailedUpdate, "error");
      console.error("incrementHabit sync error:", e);
    }

    showToast(translations.en.toastIncrementSuccess, 'success');

    if (selectedMonths[habitId] === yearMonth || !selectedMonths[habitId]) {
      frame(() => renderCalendarGrid(habitId, yearMonth)); // PERF: defer calendar repaint to a frame after local state mutation.
    }
    frame(() => updateTotalCompleted(habitId));
  }

  // ─── 18. USER REGISTRATION ───────────────────────────────────
  async function register() {
    const email = registerEmailInput ? registerEmailInput.value.trim() : "";
    const password = registerPasswordInput ? registerPasswordInput.value : "";
    const firstName = registerFirstNameInput ? registerFirstNameInput.value.trim() : "";
    const lastName = registerLastNameInput ? registerLastNameInput.value.trim() : "";

    if (!firstName || !lastName) {
      showToast(translations.en.toastNameRequired, "error");
      return;
    }

    if (!email || !password) {
      showToast(translations.en.toastEnterAuth, "error");
      return;
    }
    if (password.length < 8) {
      showToast(translations.en.toastPassLength8, "error");
      return;
    }
    if (!isPasswordAcceptable(password)) {
      showToast(translations.en.toastWeakPassword, "error");
      return;
    }

    const fullName = firstName + " " + lastName;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;

      showToast(translations.en.toastConfirmEmail, "success");

      registeredEmail = email;
      if (verifySubtitle) {
        frame(() => {
          verifySubtitle.textContent = translations.en.verifySubtitle.replace("{email}", registeredEmail);
        }); // PERF: verification copy update is paint-aligned.
      }
      showPanel(panelVerify);
    } catch (err) {
      showToast(err.message || "Registration failed.", "error");
      console.error("register error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── 19. USER LOGIN ──────────────────────────────────────────
  async function login() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showToast(translations.en.toastEnterAuth, "error");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      handleAuthSuccess(data.user);
    } catch (err) {
      showToast(err.message || "Login failed.", "error");
      console.error("login error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── 20. LOGOUT ──────────────────────────────────────────────
  async function logout() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      clearCache();
      localHabits = [];
      if (habitList) habitList.replaceChildren(); // PERF: clear cards without HTML parsing.
      setView("auth");
      showToast(translations.en.toastLoggedOut, "info");
    } catch (err) {
      showToast(translations.en.toastFailedLogout, "error");
      console.error("logout error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── 21. AUTH SUCCESS HANDLER ────────────────────────────────
  function handleAuthSuccess(user) {
    if (userEmailDisplay) {
      const displayName = user.user_metadata?.full_name || user.email;
      userEmailDisplay.textContent = displayName;
    }
    renderTopbarAvatar(user);
    setView("app");
    fetchHabits();
  }

  // ─── 22. SESSION PERSISTENCE & LISTENER ───────────────────────
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      handleAuthSuccess(session.user);
    } else if (event === "SIGNED_OUT") {
      setView("auth");
    } else if (event === "PASSWORD_RECOVERY") {
      showPasswordResetPanel();
    }
  });

  // ─── 23. EVENT LISTENERS WIRING ──────────────────────────────

  // Event Delegation for Habit Actions
  if (habitList) {
    habitList.addEventListener("click", (e) => {
      const dayBtn = e.target.closest(".day-btn");
      if (dayBtn) {
        toggleDayButton(dayBtn);
        return;
      }

      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "increment") incrementHabit(id);
      else if (action === "delete") deleteHabit(id);
    });

    // Event Delegation for calendar picker changes
    habitList.addEventListener("change", (e) => {
      if (e.target.classList.contains("month-picker")) {
        const habitId = e.target.dataset.id;
        const newMonth = e.target.value;
        selectedMonths[habitId] = newMonth;
        frame(() => renderCalendarGrid(habitId, newMonth)); // PERF: month picker repaint is scheduled in one frame.
      }
    });
  }

  // Lang Toggle triggers


  // Submit Buttons
  if (loginBtn) loginBtn.addEventListener("click", login);
  if (registerBtn) registerBtn.addEventListener("click", register);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // Redesigned verification screen email opener
  if (openEmailBtn) {
    openEmailBtn.addEventListener("click", () => {
      window.location.href = "mailto:";
    });
  }

  // Redesigned Topbar logout/avatar actions
  if (topbarLogoutBtn) {
    topbarLogoutBtn.addEventListener("click", logout);
  }

  if (topbarAvatarBtn) {
    topbarAvatarBtn.addEventListener("click", () => {
      setView("settings");
      loadAvatarPreview();
    });
  }
  if (addHabitBtn) addHabitBtn.addEventListener("click", addHabit);

  // Search Input Handler
  if (habitSearchInput) {
    habitSearchInput.addEventListener("input", debounce((e) => {
      searchQuery = e.target.value;
      applyFiltersAndRender();
    }, 250)); // PERF: debounce search rendering to 250ms.
  }

  document.addEventListener("click", (e) => {
    const passwordToggle = e.target.closest("[data-password-toggle]");
    if (passwordToggle) {
      const input = staticElementsById[passwordToggle.dataset.passwordToggle];
      if (!input) return;

      const showIcon = passwordToggle.querySelector(".eye-icon--show");
      const hideIcon = passwordToggle.querySelector(".eye-icon--hide");
      frame(() => {
        input.type = input.type === "password" ? "text" : "password";
        if (showIcon) showIcon.style.display = input.type === "text" ? "none" : "";
        if (hideIcon) hideIcon.style.display = input.type === "text" ? "" : "none";
        passwordToggle.setAttribute("aria-label", input.type === "text" ? "Hide password" : "Show password");
        input.focus();
      }); // PERF: password-toggle DOM writes are paint-aligned.
      return;
    }

    const legalLink = e.target.closest("[data-legal-link]");
    if (legalLink) {
      e.preventDefault();
      openLegalModal(legalLink.dataset.legalLink);
      return;
    }

    if (e.target.closest("[data-legal-close]")) {
      closeLegalModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && legalModal && !legalModal.hidden) {
      closeLegalModal();
    }
  });

  if (registerPasswordInput) {
    registerPasswordInput.addEventListener("input", () => {
      if (registerPasswordStrength) registerPasswordStrength.style.display = "";
      updatePasswordStrengthUI(registerPasswordInput, registerPasswordStrength, true);
    });
  }

  // Keyboard Submissions
  if (habitInput) {
    habitInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addHabit();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") login();
    });
  }

  // Apply default localized texts on startup
  if (langToggle) langToggle.addEventListener("click", toggleLanguage);
  applyLanguage();

  // Show password reset modal inline
  function showPasswordResetPanel() {
    if (resetPasswordModal) {
      frame(() => {
        resetPasswordModal.style.display = "flex";
      }); // PERF: modal open write is scheduled to a frame.
    }
  }

  // OTP Verification logic
  if (verifyBtn && verifyOtpInput) {
    verifyBtn.addEventListener("click", async () => {
      const otpValue = verifyOtpInput.value.trim();
      if (!otpValue) return;

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: registeredEmail,
          token: otpValue,
          type: 'signup'
        });
        if (error) throw error;
        showToast(translations.en.toastVerifySuccess, "success");

        showPanel(panelLogin);

        handleAuthSuccess(data.user);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    });
  }

  if (resendOtpBtn) {
    resendOtpBtn.addEventListener("click", async () => {
      if (!registeredEmail) return;
      setLoading(true);
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: registeredEmail
        });
        if (error) throw error;
        showToast(translations.en.toastCodeResent, "success");
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    });
  }

  // Password Recovery Confirm Click Handler
  if (resetConfirmBtn && resetNewPasswordInput) {
    resetConfirmBtn.addEventListener("click", async () => {
      const password = resetNewPasswordInput.value;
      if (!password) return;

      if (password.length < 8) {
        showToast(translations.en.toastPassLength8, "error");
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        frame(() => {
          if (resetPasswordModal) resetPasswordModal.style.display = "none";
          resetNewPasswordInput.value = "";
        }); // PERF: reset modal close and input clearing are batched.

        showToast(translations.en.toastPasswordResetSuccess, "success");
        await supabase.auth.signOut();
        setView("auth");
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    });
  }

  // ─── Navigation wiring for Settings ───
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", () => {
      setView("settings");
      loadAvatarPreview();
    });
  }

  if (backToAppBtn) {
    backToAppBtn.addEventListener("click", () => setView("app"));
  }



  // ─── Avatar Upload & Updates System ───

  // IMPORTANT: For avatar upload to work you must:
  // 1. Create a Storage bucket named "avatars"
  // 2. Set the bucket to PUBLIC
  // 3. Add RLS policies:
  //    INSERT: auth.uid()::text = (storage.foldername(name))[1]
  //    SELECT: true

  function getInitials(name) {
    if (!name) return "?";
    return name.trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function renderAvatarPreview(url, displayName) {
    if (!avatarPreview) return;

    frame(() => {
      avatarPreview.replaceChildren();
      if (url) {
        const cacheBusted = url + "?t=" + Date.now();
        const image = document.createElement("img");
        image.src = cacheBusted;
        image.alt = "Avatar";
        image.loading = "lazy";
        image.decoding = "async";
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";
        image.style.borderRadius = "50%";
        image.addEventListener("error", () => {
          avatarPreview.textContent = getInitials(displayName);
        }, { once: true });
        avatarPreview.appendChild(image);
      } else {
        avatarPreview.textContent = getInitials(displayName);
      }
    }); // PERF: avatar preview is updated with nodes and lazy image decoding.
  }

  function renderTopbarAvatar(user) {
    if (!topbarAvatarBtn) return;

    frame(() => {
      topbarAvatarBtn.replaceChildren();

      if (!user) {
        topbarAvatarBtn.textContent = "?";
        return;
      }

      const avatarUrl = user.user_metadata?.avatar_url || null;
      const displayName = user.user_metadata?.full_name || user.email;

      if (avatarUrl) {
        const cacheBusted = avatarUrl + "?t=" + Date.now();
        const image = document.createElement("img");
        image.src = cacheBusted;
        image.alt = "Avatar";
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
          topbarAvatarBtn.replaceChildren(createInitialsSpan(displayName));
        }, { once: true });
        topbarAvatarBtn.appendChild(image);
      } else {
        topbarAvatarBtn.appendChild(createInitialsSpan(displayName));
      }
    }); // PERF: topbar avatar avoids innerHTML and decodes image asynchronously.
  }

  function createInitialsSpan(displayName) {
    const span = document.createElement("span");
    span.textContent = getInitials(displayName);
    return span;
  }

  async function loadAvatarPreview() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      const avatarUrl = user.user_metadata?.avatar_url || null;
      renderAvatarPreview(
        avatarUrl,
        user.user_metadata?.full_name || user.email
      );
    } catch (err) {
      console.error("loadAvatarPreview error:", err);
    }
  }

  async function handleAvatarUpload(file) {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      showToast("Only JPG, PNG, or WebP images are allowed.", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB.", "error");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      showToast("Not authenticated.", "error");
      return;
    }

    setLoading(true);

    try {
      const ext =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";

      const filePath = `${user.id}/avatar_${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
          });

      if (uploadError) throw uploadError;

      const { data: urlData } =
        supabase.storage
          .from("avatars")
          .getPublicUrl(uploadData.path);

      if (!urlData?.publicUrl) {
        throw new Error("Could not get public URL.");
      }

      const publicUrl = urlData.publicUrl;

      const { error: metaError } =
        await supabase.auth.updateUser({
          data: {
            avatar_url: publicUrl
          }
        });

      if (metaError) throw metaError;

      renderAvatarPreview(
        publicUrl,
        user.user_metadata?.full_name || user.email
      );

      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          avatar_url: publicUrl
        }
      };
      renderTopbarAvatar(updatedUser);

      showToast(
        translations.en.toastAvatarUpdated || "Profile photo updated! ✅",
        "success"
      );

    } catch (err) {
      console.error("Avatar upload failed:", err);

      showToast(
        err.message || "Upload failed. Check Supabase Storage bucket permissions.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  }

  if (avatarUploadInput) {
    avatarUploadInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];

      if (file) {
        handleAvatarUpload(file);
      }

      e.target.value = "";
    });
  }

  // ─── Change Email & Password Functions ───

  async function changeEmail() {
    const newEmail = newEmailInput?.value.trim();

    if (!newEmail) {
      showToast("Please enter a new email address.", "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      showToast(
        translations.en.toastEmailUpdateSent ||
        "Confirmation sent to your new email. Check your inbox.",
        "success"
      );

      frame(() => {
        if (newEmailInput) newEmailInput.value = "";
      }); // PERF: input clearing is paint-aligned after email update.

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function changePassword() {
    const newPass = newPasswordInput?.value;

    if (!newPass || newPass.length < 8) {
      showToast(
        translations.en.toastPassLength ||
        "Password must be at least 8 characters.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPass
      });

      if (error) throw error;

      showToast(
        translations.en.toastPasswordUpdated ||
        "Password updated successfully.",
        "success"
      );

      frame(() => {
        if (newPasswordInput) newPasswordInput.value = "";
      }); // PERF: input clearing is paint-aligned after password update.

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (changeEmailBtn) {
    changeEmailBtn.addEventListener("click", changeEmail);
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", changePassword);
  }

  // ─── 24. INITIAL SESSION CHECK ────────────────────────────────
  (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      handleAuthSuccess(session.user);
    } else {
      setView("auth");
    }
  })();
});
