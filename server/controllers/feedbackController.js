const asyncHandler = require("express-async-handler");
const Feedback = require("../models/Feedback")

const createFeedBack = asyncHandler(async (req, res) => {


    const { name, message, rating } = req.body;

    const feedback = await Feedback.create({
        name: req.user.name,
        message,
        rating,
    });

    res.status(200).json({ success: true });
})

const getFeedBack = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ approved: true })
        .sort({ createdAt: -1 })
        .limit(6);


    res.status(200).json({
        sucess: true,
        data: {
            feedbacks
        }
    });
})

const approveFeedBack = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
        res.status(404);
        throw new Error("Feedback not found");
    }

    feedback.approved = true;
    await feedback.save();
    return res.status(200).json({ success: true })
})
const getPendingFeedback = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ approved: false });

    res.status(200).json({ feedbacks });
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  await feedback.deleteOne();

  res.json({ success: true });
});

module.exports = {
    createFeedBack, getFeedBack,
    approveFeedBack, getPendingFeedback,
    deleteFeedback
}