import graph from "../graph/graph.js";
import Interview from "../models/interview.model.js";

export const startInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { type, role, useResume = false, resume = {} } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required in headers",
      });
    }

    // Both type and role are required
    if (!type || !role) {
      return res.status(400).json({
        success: false,
        message: "Interview type and role are required",
      });
    }

    const result = await graph.invoke({
      action: "start",
      role,
      type,
      useResume,
      resume,
    });

    const questions = result?.questions;

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate interview questions",
      });
    }

    const interview = await Interview.create({
      userId,
      type,
      role,
      useResume,
      questions,
      currentQuestion: 0,
      status: "in-progress",
    });

    return res.status(200).json({
      success: true,
      interviewId: interview._id,
      totalQuestion: interview.questions.length,
      question: interview.questions[0],
    });
  } catch (error) {
    console.error("startInterview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { interviewId, answer } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required in headers",
      });
    }

    // Check if either is missing
    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Interview ID and Answer are required",
      });
    }

    // Standard MongoDB lookup uses _id
    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }

    const index = interview.currentQuestion;
    const currentQuestion = interview.questions[index];

    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    currentQuestion.userAnswer = answer;
    const isCompleted = index + 1 >= interview.questions.length;

    // Await the asynchronous graph invocation
    const result = await graph.invoke({
      action: "feedback",
      question: currentQuestion.question,
      answer,
      difficulty: currentQuestion.difficulty,
      completed: isCompleted,
      role: interview.role,
      type: interview.type,
      questions: interview.questions,
    });

    currentQuestion.feedback = result.feedback;
    interview.currentQuestion++;

    if (isCompleted) {
      interview.status = "completed";
      interview.summary = result.report?.summary;
      interview.strengths = result.report?.strengths;
      interview.weaknesses = result.report?.weaknesses;
      interview.recommendations = result.report?.recommendations;

      interview.markModified("questions");
      await interview.save();

      return res.status(200).json({
        success: true,
        completed: true,
        feedback: result.feedback,
        interview,
      });
    }

    interview.markModified("questions");
    await interview.save();

    return res.status(200).json({
      success: true,
      completed: false,
      currentQuestion: interview.currentQuestion,
      question: interview.questions[interview.currentQuestion],
      feedback: result.feedback,
    });
  } catch (error) {
    console.error("submitAnswer error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found!",
      });
    }
    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
