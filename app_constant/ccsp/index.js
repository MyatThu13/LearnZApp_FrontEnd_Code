import { IMAGES } from "../../lzapp_web_common_code/assets";

export const PRACTICE_TEST = [
  {
    id: 1,
    test_name: "Assessment Test",
    num_questions: 40,
    topic_ids: [9],
    use_practice_test_id: true,
    practice_test_id: 1,
    icon: "memory",
    requires_subscription: false,
  },
  {
    id: 2,
    test_name: "Practice Test 1",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 2,
    icon: "numeric-1-circle-outline",
    requires_subscription: true,
  },
  {
    id: 3,
    test_name: "Practice Test 2",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 3,
    icon: "numeric-2-circle-outline",
    requires_subscription: true,
  },
  {
    id: 4,
    test_name: "Practice Test 3",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 4,
    icon: "numeric-3-circle-outline",
    requires_subscription: true,
  },
  {
    id: 5,
    test_name: "Practice Test 4",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 5,
    icon: "numeric-4-circle-outline",
    requires_subscription: true,
  },
  {
    id: 6,
    test_name: "Practice Test 5",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 6,
    icon: "numeric-5-circle-outline",
    requires_subscription: true,
  },
  {
    id: 7,
    test_name: "Practice Test 6",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 7,
    icon: "numeric-6-circle-outline",
    requires_subscription: true,
  },
  {
    id: 8,
    test_name: "Practice Test 7",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 8,
    icon: "numeric-7-circle-outline",
    requires_subscription: true,
  },
  {
    id: 9,
    test_name: "Practice Test 8",
    num_questions: 20,
    use_practice_test_id: true,
    practice_test_id: 9,
    icon: "numeric-8-circle-outline",
    requires_subscription: true,
  },
];

export const APP_DOMAIN_LIST = [
  {
    id: 1,
    domain_name: "Cloud Concepts, Architecture and Design",
    chapters: [1],
    exam_weightage: 10,
    show_proficiency: true,
    icon: "lock",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 2,
    domain_name: "Cloud Data Security",
    chapters: [2],
    exam_weightage: 10,
    show_proficiency: true,
    icon: "database-lock",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 3,
    domain_name: "Cloud Platform & Infrastructure Security",
    chapters: [3],
    exam_weightage: 10,
    show_proficiency: true,
    icon: "cloud-lock",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 4,
    domain_name: "Cloud Application Security",
    chapters: [4],
    exam_weightage: 10,
    show_proficiency: true,
    icon: "cloud-tags",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 5,
    domain_name: "Cloud Security Operations",
    chapters: [5],
    exam_weightage: 10,
    show_proficiency: true,
    icon: "tools",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
  {
    id: 6,
    domain_name: "Legal, Risk and Compliance",
    chapters: [6],
    exam_weightage: 10,
    show_proficiency: true,
    icon: "clipboard-list",
    requires_subscription: true,
    num_questions: 25,
    num_flashcards: 10,
  },
];

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
      requires_subscription: false,
    },
    {
      title: "All Flashcards",
      icon_bg: "#FFF5E6",
      image: IMAGES?.ic_flash_exam,
      menu: null,
      key: "all_cards",
      requires_subscription: true,
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
