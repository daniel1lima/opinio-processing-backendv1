import ReviewSummary from '../models/ReviewSummary.js';
import Reviews from '../models/Reviews.js'; // Ensure to import the Reviews class

const reviewsModel = new Reviews(); // Create an instance of the Reviews class


export const getReviewsByCompId = async (req, res) => {
  try {
    const companyId = req.query.company_id;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const pageSize = parseInt(req.query.page_size) || 10; // Default to 10 items per page

    // Use the fetchAllReviewsByCompanyId method with pagination
    const reviews = await reviewsModel.fetchPaginatedReviewsByCompanyId(companyId, page, pageSize);
    
    if (reviews.length === 0 && page === 1) {
      return res.status(404).json({ error: "No reviews found for the company ID provided / the company ID is incorrect." });
    }

    // Get total count of reviews for pagination
    const totalReviews = await reviewsModel.countReviewsByCompanyId(companyId);

    res.status(200).json({
      totalReviews,
      page,
      pageSize,
      reviews,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFrequencyReviewsByCompId = async (req, res) => {
  try {
    const companyId = req.query.company_id;
    const reviews = await reviewsModel.fetchAllReviews(companyId);

    // Initialize frequency objects
    const allTime = {};
    const week = {};
    const month = {};
    const year = {};

    reviews.forEach(review => {
      const date = new Date(review.review_date); // Assuming review has a date field
      const yearKey = date.getFullYear();
      const monthKey = date.toLocaleString('default', { month: 'long' });
      const weekKey = Math.ceil(date.getDate() / 7);
      const dayKey = date.toLocaleString('default', { weekday: 'long' });

      // All Time: Yearly breakdown
      allTime[yearKey] = (allTime[yearKey] || 0) + 1;

      // Week: Monday through Sunday
      week[dayKey] = (week[dayKey] || 0) + 1;

      // Month: Week by week
      month[`Week ${weekKey}`] = (month[`week_${weekKey}`] || 0) + 1;

      // Year: Month by Month
      year[monthKey] = (year[monthKey] || 0) + 1;
    });

    res.status(200).json({
      allTime,
      week,
      month,
      year,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// export const getTransactions = async (req, res) => {
//     try {
//       // sort should look like this: { "field": "userId", "sort": "desc"}
//       const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
  
//       // formatted sort should look like { userId: -1 }
//       const generateSort = () => {
//         const sortParsed = JSON.parse(sort);
//         const sortFormatted = {
//           [sortParsed.field]: sortParsed.order = "asc" ? 1 : -1,
//         };
//         return sortFormatted;
//       }
//       const sortFormatted = Boolean(sort) ? generateSort() : {};
  
//       const transactions = await Transaction.find({
//         $or: [
//           { cost: { $regex: new RegExp(search, "i") } },
//           { userId: { $regex: new RegExp(search, "i") } },
//         ],
//       })
//         .sort(sortFormatted)
//         .skip(page * pageSize)
//         .limit(pageSize);
  
//         const total = await Transaction.countDocuments({
//           // name: { $regex: search, $options: "i" },
//           $or: [
//               {
//                   cost: { $regex: new RegExp(search, "i")}
//               },
//               {
//                   userId: { $regex: new RegExp(search, "i")}
//               },
//           ],
//       });
  
//       res.status(200).json({
//         transactions,
//         total,
//       });
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   };