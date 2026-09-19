import { feedbackAgent } from "../agent/feedback.agent.js";
import { interviewAgent } from "../agent/interview.agent.js";
import { summaryAgent } from "../agent/summary.agent.js";

export async function interviewNode(state) {
  const questions = await interviewAgent({
    role: state.role,
    type: state.type,
    useResume: state.useResume,
    resume: state.resume,
  })

  return {
    questions
  }
}

export async function feedbackNode(state) {
  const feedback = await feedbackAgent({
    question: state.question,
    answer: state.answer,
    difficulty: state.difficulty,
  })

  return {
    feedback,
    questions: Array.isArray(state.questions)
      ? state.questions.map((question, index) => {
        const questionData = typeof question?.toObject === "function"
          ? question.toObject()
          : question;

        return index === state.questionIndex
          ? { ...questionData, feedback }
          : questionData;
      })
      : state.questions,
  }
}

export async function summaryNode(state) {
  const report = await summaryAgent({
    role: state.role,
    type: state.type,
    questions: state.questions,
  });

  return {
    report
  }
}
