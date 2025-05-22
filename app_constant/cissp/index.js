import { IMAGES } from "../../lzapp_web_common_code/assets";

export const THEME_DARK = "#003326";
export const THEME_LIGHT = "#007054";
export const THEME_BORDER = "#004D39";
export const PREMIUM_BACKGROUND = "#FFEAE0";

export const PRACTICE_TEST = [
  {
    id: 1,
    test_name: "Assessment Test",
    num_questions: 40,
    topic_ids: [9],
    use_practice_test_id: true,
    practice_test_id: 5,
    icon: "memory",
    requires_subscription: false,
  },
  {
    id: 2,
    test_name: "Practice Test 1",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 1,
    icon: "roman-numeral-1",
    requires_subscription: true,
  },
  {
    id: 3,
    test_name: "Practice Test 2",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 2,
    icon: "roman-numeral-2",
    requires_subscription: true,
  },
  {
    id: 4,
    test_name: "Practice Test 3",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 3,
    icon: "roman-numeral-3",
    requires_subscription: true,
  },
  {
    id: 5,
    test_name: "Practice Test 4",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 4,
    icon: "roman-numeral-4",
    requires_subscription: true,
  },
  {
    id: 6,
    test_name: "Practice Test 5",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 6,
    icon: "roman-numeral-5",
    requires_subscription: true,
  },
  {
    id: 7,
    test_name: "Practice Test 6",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 7,
    icon: "roman-numeral-6",
    requires_subscription: true,
  },
  {
    id: 8,
    test_name: "Practice Test 7",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 8,
    icon: "roman-numeral-7",
    requires_subscription: true,
  },
  {
    id: 9,
    test_name: "Practice Test 8",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 9,
    icon: "roman-numeral-8",
    requires_subscription: true,
  },
];

export const APP_DOMAIN_LIST = [
  {
    id: 1,
    domain_name: "Security and Risk Management",
    chapters: [1, 2, 3, 4],
    show_proficiency: true,
    icon: "sitemap",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 2,
    domain_name: "Asset Security",
    chapters: [5],
    show_proficiency: true,
    icon: "safe",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 3,
    domain_name: "Security Architecture and Engineering",
    chapters: [6, 7, 8, 9, 10],
    show_proficiency: true,
    icon: "cogs",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 4,
    domain_name: "Communication and Network Security",
    chapters: [11, 12],
    show_proficiency: true,
    icon: "account-network",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 5,
    domain_name: "Identity and Access Management (IAM)",
    chapters: [13, 14],
    show_proficiency: true,
    icon: "fingerprint",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 6,
    domain_name: "Security Assessment and Testing",
    chapters: [15],
    show_proficiency: true,
    icon: "lock-open-check",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 7,
    domain_name: "Security Operations",
    chapters: [16, 17, 18, 19],
    show_proficiency: true,
    icon: "shield-account",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 8,
    domain_name: "Software Development Security",
    chapters: [20, 21],
    show_proficiency: true,
    icon: "monitor-lock",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
];

/** FLASH CARD MENU */
export const GET_FLASH_CARD_MENU = () => {
  return [
    {
      title: "Bookmark",
      icon_bg: "#FFEFED",
      image: IMAGES?.ic_flash_bookmark,
      menu: null,
      key: "bookmark",
      requires_subscription: false,
    },
    {
      title: "Quick Set (10)",
      icon_bg: "#E6FBFF",
      image: IMAGES?.ic_flash_quick_set,
      menu: null,
      key: "quick",
      requires_subscription: true,
    },
    {
      title: "Exam Essentials",
      icon_bg: "#FFF5E6",
      image: IMAGES?.ic_flash_exam,
      menu: null,
      key: "exam",
      topic_ids: [200],
      requires_subscription: true,
    },
    {
      title: 'By Topics (Free Plan)',
      icon_bg: '#F3FFD9',
      key: 'by_topic_free_model',
      image: IMAGES?.ic_flash_topic,
      free_model: 1,
      menu: APP_DOMAIN_LIST
  },
  {
      title: 'By Topics (Premium Plan)',
      icon_bg: '#F3FFD9',
      key: 'by_topic',
      image: IMAGES?.ic_flash_topic,
      menu: APP_DOMAIN_LIST
  },
  ];
};

export const GET_STUDY_QUESTION_MENU = () => {
  return [
    {
      title: "Bookmark",
      icon_bg: "#FFEFED",
      image: IMAGES?.ic_flash_bookmark,
      menu: null,
      key: "bookmark",
      menu: APP_DOMAIN_LIST
    },
    {
      title: "Quick Set (10)",
      icon_bg: "#E6FBFF",
      image: IMAGES?.ic_flash_quick_set,
      menu: null,
      key: "quick",
    },
    {
      title: 'By Topics (Free Plan)',
      icon_bg: '#F3FFD9',
      key: 'by_topic_free_model',
      image: IMAGES?.ic_flash_topic,
      free_model: 1,
      menu: APP_DOMAIN_LIST
  },
  {
      title: 'By Topics (Premium Plan)',
      icon_bg: '#F3FFD9',
      key: 'by_topic',
      image: IMAGES?.ic_flash_topic,
      menu: APP_DOMAIN_LIST
  },
  ];
};

export const QUESTION_VERSION_OF_JSON = 1;
