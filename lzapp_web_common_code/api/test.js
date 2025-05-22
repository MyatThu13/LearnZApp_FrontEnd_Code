import _ from "lodash";
import { STRING } from "../constant";

export function GET_CUSTOM_TEST_DETAILS(
  questions,
  timePerSecond,
  testDetails,
  profile,
  questionScrore
) {
  const attemptQuestions =
    (questionScrore?.all_questions_scrores ?? []).filter((e) =>
      testDetails.topic_ids.includes(e.topic_id)
    ) ?? [];
  const attemptIds = attemptQuestions.map((e) => e.question_id) ?? [];
  const incorrectQuestionIds =
    attemptQuestions
      .filter((item) => item.score == 0)
      .map((e) => e.question_id) ?? [];
  const bookmarkIds = profile?.question_bookmarks ?? [];

  const incorrectQuestions =
    questions?.filter(
      (item) =>
        incorrectQuestionIds.includes(item.id) &&
        testDetails.topic_ids.includes(item.topic_id)
    ) ?? [];
  const bookmarkedQuestions =
    questions?.filter(
      (item) =>
        bookmarkIds.includes(item.id) &&
        testDetails.topic_ids.includes(item.topic_id)
    ) ?? [];
  const unansweredQuestion =
    questions?.filter(
      (item) =>
        !attemptIds.includes(item.id) &&
        testDetails.topic_ids.includes(item.topic_id)
    ) ?? [];

  if (
    testDetails.priority == STRING.default ||
    testDetails.priority == STRING.unanswered
  ) {
    let filterQuestions = [];
    let randomQuestions = [];

    filterQuestions = unansweredQuestion.filter((item) =>
      testDetails.topic_ids.includes(item.topic_id)
    );
    randomQuestions = _.shuffle(filterQuestions);

    if (testDetails?.total_time > 0) {
      const attemptQuestionByScore = _.sortBy(attemptQuestions, (e) => e.score);
      const attemptQuestionIdByScore = attemptQuestionByScore.map((e) => {
        return { question_id: e.question_id, topic_id: e.topic_id };
      });
      const shuffleAttemptQuestion = _.shuffle(attemptQuestionIdByScore);

      randomQuestions = randomQuestions.concat(shuffleAttemptQuestion);
    } else if (unansweredQuestion.length > testDetails.num_questions) {
      filterQuestions = unansweredQuestion.filter((item) =>
        testDetails.topic_ids.includes(item.topic_id)
      );
      randomQuestions = _.shuffle(filterQuestions);
    } else {
      const attemptQuestionByScore = _.sortBy(attemptQuestions, (e) => e.score);
      const attemptQuestionIdByScore = attemptQuestionByScore.map((e) => {
        return { question_id: e.question_id, topic_id: e.topic_id };
      });
      const shuffleAttemptQuestion = _.shuffle(attemptQuestionIdByScore);

      const remainingQuestion =
        testDetails.num_questions - randomQuestions.length;
      const remainingFinalList = _.take(
        shuffleAttemptQuestion,
        remainingQuestion
      );
      randomQuestions = randomQuestions.concat(remainingFinalList);
    }

    const history = randomQuestions.map((obj) => {
      if (obj.id) {
        return {
          question_id: obj.id,
          response: STRING.unanswered_tag,
          selected_choice: "X",
          topic_id: obj.topic_id,
        };
      } else if (obj.question_id) {
        return {
          question_id: obj.question_id,
          response: STRING.unanswered_tag,
          selected_choice: "X",
          topic_id: obj.topic_id,
        };
      }
    });

    let array = [];
    let time = 0;

    if (testDetails.num_questions > 0) {
      array = _.take(history, testDetails.num_questions);
      time = array.length * timePerSecond;
    } else {
      const totalQuestions = testDetails.total_time * 10;
      if (totalQuestions < history.length) {
        array = _.take(history, testDetails.total_time * 10);
      } else {
        array = history;
      }
      time = testDetails.total_time * 60;
    }

    const redux = {
      test_name: testDetails.test_name,
      test_questions_meta_data: array,
      total: array.length,
      total_time: time,
      remaining_time: time,
      time_taken: 0,
    };

    return redux;
  } else if (testDetails.priority == STRING.bookmark) {
    let filterQuestions = [];
    let randomQuestions = [];

    filterQuestions = bookmarkedQuestions.filter((item) =>
      testDetails.topic_ids.includes(item.topic_id)
    );
    randomQuestions = _.shuffle(filterQuestions);

    if (testDetails?.total_time > 0) {
      const attemptQuestionByScore = _.sortBy(attemptQuestions, (e) => e.score);
      const attemptQuestionIdByScore = attemptQuestionByScore.map((e) => {
        return { question_id: e.question_id, topic_id: e.topic_id };
      });
      const shuffleAttemptQuestion = _.shuffle(attemptQuestionIdByScore);

      randomQuestions = randomQuestions.concat(shuffleAttemptQuestion);
      randomQuestions = randomQuestions.concat(unansweredQuestion);
    } else if (bookmarkedQuestions.length > testDetails.num_questions) {
      filterQuestions = bookmarkedQuestions.filter((item) =>
        testDetails.topic_ids.includes(item.topic_id)
      );
      randomQuestions = _.shuffle(filterQuestions);
    } else {
      const attemptQuestionByScore = _.sortBy(attemptQuestions, (e) => e.score);
      const attemptQuestionIdByScore = attemptQuestionByScore.map((e) => {
        const index = filterQuestions.findIndex(
          (item) => item.id == e.question_id
        );
        if (index == -1) {
          return { question_id: e.question_id, topic_id: e.topic_id };
        } else {
          return null;
        }
      });

      const attemptQuestionIdByScoreFilter = attemptQuestionIdByScore.filter(
        (e) => e != null
      );
      const shuffleAttemptQuestion = _.shuffle(attemptQuestionIdByScoreFilter);

      const remainingQuestion =
        testDetails.num_questions - randomQuestions.length;
      const remainingFinalList = _.take(
        shuffleAttemptQuestion,
        remainingQuestion
      );
      const remainingFinalListFilter = remainingFinalList.filter(
        (e) => e != null
      );
      randomQuestions = randomQuestions.concat(remainingFinalListFilter);
      randomQuestions = randomQuestions.concat(unansweredQuestion);
    }

    const history = randomQuestions.map((obj) => {
      if (obj.id) {
        return {
          question_id: obj.id,
          response: STRING.unanswered_tag,
          selected_choice: "X",
          topic_id: obj.topic_id,
        };
      } else if (obj.question_id) {
        return {
          question_id: obj.question_id,
          response: STRING.unanswered_tag,
          selected_choice: "X",
          topic_id: obj.topic_id,
        };
      }
    });

    let array = [];
    let time = 0;

    if (testDetails.num_questions > 0) {
      array = _.take(history, testDetails.num_questions);
      time = array.length * timePerSecond;
    } else {
      const totalQuestions = testDetails.total_time * 10;
      if (totalQuestions < history.length) {
        array = _.take(history, testDetails.total_time * 10);
      } else {
        array = history;
      }
      time = testDetails.total_time * 60;
    }

    const redux = {
      test_name: testDetails.test_name,
      test_questions_meta_data: array,
      total: array.length,
      total_time: time,
      remaining_time: time,
      time_taken: 0,
    };

    return redux;
  } else if (testDetails.priority == STRING.incorrect_tag) {
    let filterQuestions = [];
    let randomQuestions = [];

    filterQuestions = incorrectQuestions.filter((item) =>
      testDetails.topic_ids.includes(item.topic_id)
    );
    randomQuestions = _.shuffle(filterQuestions);

    if (testDetails?.total_time > 0) {
      const attemptQuestionByScore = _.sortBy(attemptQuestions, (e) => e.score);
      const attemptQuestionIdByScore = attemptQuestionByScore.map((e) => {
        return { question_id: e.question_id, topic_id: e.topic_id };
      });
      const shuffleAttemptQuestion = _.shuffle(attemptQuestionIdByScore);

      randomQuestions = randomQuestions.concat(shuffleAttemptQuestion);
      randomQuestions = randomQuestions.concat(unansweredQuestion);
    } else if (incorrectQuestions.length > testDetails.num_questions) {
      filterQuestions = incorrectQuestions.filter((item) =>
        testDetails.topic_ids.includes(item.topic_id)
      );
      randomQuestions = _.shuffle(filterQuestions);
    } else {
      const attemptQuestionByScore = _.sortBy(attemptQuestions, (e) => e.score);
      const attemptQuestionIdByScore = attemptQuestionByScore.map((e) => {
        const index = filterQuestions.findIndex(
          (item) => item.id == e.question_id
        );
        if (index == -1) {
          return { question_id: e.question_id, topic_id: e.topic_id };
        } else {
          return null;
        }
      });

      const attemptQuestionIdByScoreFilter = attemptQuestionIdByScore.filter(
        (e) => e != null
      );
      const shuffleAttemptQuestion = _.shuffle(attemptQuestionIdByScoreFilter);

      const remainingQuestion =
        testDetails.num_questions - randomQuestions.length;
      const remainingFinalList = _.take(
        shuffleAttemptQuestion,
        remainingQuestion
      );
      const remainingFinalListFilter = remainingFinalList.filter(
        (e) => e != null
      );
      randomQuestions = randomQuestions.concat(remainingFinalListFilter);
      randomQuestions = randomQuestions.concat(unansweredQuestion);
    }

    const history = randomQuestions.map((obj) => {
      if (obj.id) {
        return {
          question_id: obj.id,
          response: STRING.unanswered_tag,
          selected_choice: "X",
          topic_id: obj.topic_id,
        };
      } else if (obj.question_id) {
        return {
          question_id: obj.question_id,
          response: STRING.unanswered_tag,
          selected_choice: "X",
          topic_id: obj.topic_id,
        };
      }
    });

    let array = [];
    let time = 0;

    if (testDetails.num_questions > 0) {
      array = _.take(history, testDetails.num_questions);
      time = array.length * timePerSecond;
    } else {
      const totalQuestions = testDetails.total_time * 10;
      if (totalQuestions < history.length) {
        array = _.take(history, testDetails.total_time * 10);
      } else {
        array = history;
      }
      time = testDetails.total_time * 60;
    }

    const redux = {
      test_name: testDetails.test_name,
      test_questions_meta_data: array,
      total: array.length,
      total_time: time,
      remaining_time: time,
      time_taken: 0,
    };

    return redux;
  }
}

export function GET_RETAKE_TEST_DETAILS(testDetails) {
  const history = testDetails?.test_questions_meta_data?.map((obj) => {
    return {
      question_id: obj.question_id,
      response: STRING.unanswered_tag,
      selected_choice: "X",
      topic_id: obj.topic_id,
    };
  });

  const array = _.take(history, testDetails.num_questions);

  const redux = {
    test_name: testDetails.test_name,
    test_questions_meta_data: array,
    total: array.length,
    total_time: array.length * 60,
    remaining_time: array.length * 60,
    time_taken: 0,
  };

  return redux;
}

export function GET_QUESTION_FROM_ID(questions, id) {
  const question = _.find(questions, function (o) {
    return o.id == id;
  });

  var choices = [];
  if (question) {
    choices = [
      question?.choice_a ?? '',
      question?.choice_b ?? '',
      question?.choice_c ?? '',
      question?.choice_d ?? '',
      question?.choice_e ?? '',
      question?.choice_f ?? '',
      question?.choice_g ?? '',
      question?.choice_h ?? '',
      question?.choice_i ?? '',
      question?.choice_j ?? '',
      question?.choice_k ?? '',
      question?.choice_l ?? '',
      question?.choice_m ?? '',
      question?.choice_n ?? '',
      question?.choice_o ?? '',

    ];
    choices = choices.filter((item) => item != "");
  }

  const result = { question: question, choices: choices };
  return result;
}

export function GET_PRACTICE_TEST_DETAILS(
  questions,
  timePerSecond,
  testDetails,
  numberOfQuestion
) {
  const filterQuestions = questions?.filter(
    (item) => item?.practice_test_id == testDetails?.practice_test_id
  );
  const randomQuestions = _.shuffle(filterQuestions);

  const history = randomQuestions.map((obj) => {
    return {
      question_id: obj.id,
      response: STRING.unanswered_tag,
      selected_choice: "X",
      topic_id: obj.topic_id,
    };
  });

  if (numberOfQuestion) {
    const array = _.take(history, numberOfQuestion);

    const redux = {
      test_name: testDetails.test_name,
      test_questions_meta_data: array,
      total: array.length,
      total_time: array.length * timePerSecond,
      remaining_time: array.length * timePerSecond,
      time_taken: 0,
    };

    return redux;
  }

  const redux = {
    test_name: testDetails.test_name,
    test_questions_meta_data: history,
    total: history.length,
    total_time: history.length * timePerSecond,
    remaining_time: history.length * timePerSecond,
    time_taken: 0,
  };

  return redux;
}
