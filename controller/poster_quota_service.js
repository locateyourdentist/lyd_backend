const postImagesuserModel = require('../model/post_images_user_model');
const postImagesmodel = require('../model/postImagesModel');
const uploadAdminImages = require('../model/post_images_admin_modes');
const SalePost = require('../model/create_sale_model');

function parseDDMMYYYY(dateStr) {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Shared quota consumed by BOTH post-image uploads and sale posts together.
// Mirrors plan_controller.js's getJobCounts pattern: a computed/derived
// remaining count re-read fresh each time, not an atomic decrement.
const getRemainingPosterQuota = async (userId) => {
  const activePlan = await postImagesuserModel.findOne({ userId, isActive: true });
  if (!activePlan) {
    return { planActive: false, remaining: 0, totalCount: 0, startDate: null, endDate: null };
  }

  const startDate = parseDDMMYYYY(activePlan.startDate);
  const endDate = parseDDMMYYYY(activePlan.endDate);
  endDate.setHours(23, 59, 59, 999);

  const planDoc = await postImagesmodel.findOne({ postImagesPlanId: activePlan.postImagesPlanId });
  const totalCount = parseInt(planDoc?.details?.count ?? 0, 10) || 0;

  const posterRecord = await uploadAdminImages.findOne({ userId });
  const imagesInWindow = (posterRecord?.posterImages || []).filter(
    (img) => img.uploadedAt >= startDate && img.uploadedAt <= endDate
  ).length;

  const salePostsInWindow = await SalePost.countDocuments({
    userId,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const remaining = totalCount - (imagesInWindow + salePostsInWindow);
  return {
    planActive: true,
    remaining,
    totalCount,
    startDate: activePlan.startDate,
    endDate: activePlan.endDate,
  };
};

module.exports = { getRemainingPosterQuota, parseDDMMYYYY };
