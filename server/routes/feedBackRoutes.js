const express = require("express")
const { protect, adminOnly } = require("../middleware/authMiddleware.js")
const { getFeedBack, createFeedBack, approveFeedBack, getPendingFeedback, deleteFeedback } = require("../controllers/feedbackController.js")

const router = express.Router()


router.route("/").get(getFeedBack).post(protect, createFeedBack)
router.patch("/admin/approve/:id", protect, adminOnly, approveFeedBack);
router.get("/admin/pending", protect, adminOnly, getPendingFeedback);
router.delete("/:id", protect, adminOnly, deleteFeedback);

module.exports = router