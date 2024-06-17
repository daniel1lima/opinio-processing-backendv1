
import Review from '../models/Review.js';
import ReviewSummary from '../models/ReviewSummary.js';


export const getAllReviews = async (req, res) => {
  try {

    const companyId = req.query.comp_id;

    const reviews = await Review.find().select("-bert_embeddings");

    console.log(reviews);
     

    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getReviewsByCompId = async (req, res) => {
  try {

    const companyId = req.query.comp_id;

    const reviews = await Review.find({ company_id: companyId }).select("-bert_embeddings");

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for the company ID provided." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSummariesByCompId = async (req, res) => {
  console.log("called")
  try {

    const companyId = req.query.comp_id;

    const reviews = await ReviewSummary.find({ company_id: companyId })

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No summaries found for the company ID provided." });
    }

    res.status(200).json(reviews);
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
