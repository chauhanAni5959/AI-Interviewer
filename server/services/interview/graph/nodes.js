import { feedbackAgent } from "../agent/feedback.agent";
import { interviewAgent } from "../agent/interview.agent";
import { summaryAgent } from "../agent/summary.agent";

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
    questions: state.questions,
    answer: state.answer,
    difficulty: state.difficulty,
  })

  return {
    feedback
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
