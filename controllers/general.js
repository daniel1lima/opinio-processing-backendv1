import User from "../models/User.js";
import Company from "../models/Company.js";
import Reviews from "../models/Reviews.js"


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const user = await ClerkUser.findOne({clerkUserId: id});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyId = async (req, res) => {
  try {
    const { comp_id } = req.params;

    const company = new Company();
    const result = await company.fetchCompanyItemById(comp_id);
    if (!result) {
      res.status(400).json({ message: "Company not found" });
    } else {
      console.log(result);
      res.status(200).json(result);
    }


  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getReviewData = async (req, res) => {
  try {
    const { comp_id, value} = req.params;

    // String I receive from mongo
    const dateString = "";
    const todaysDate = new Date();
    const boundaryDate = new Date(); // Initialize boundary date

    switch(caseNumber) {
      case 0: // Today
        boundaryDate.setHours(0, 0, 0, 0); // Set to beginning of the day
        break;
      case 1: // By week
        boundaryDate.setDate(currentDate.getDate() - currentDate.getDay()); // Set to beginning of the week
        boundaryDate.setHours(0, 0, 0, 0); // Set to beginning of the day
        break;
      case 2: // By month
        boundaryDate.setDate(1); // Set to beginning of the month
        boundaryDate.setHours(0, 0, 0, 0); // Set to beginning of the day
        break;
      case 3: // All time (no boundary)
        boundaryDate = null;
        break;
      default:
        throw new Error("Invalid case number");
    }


    const reviews = await Reviews.find({ company_id: comp_id, date: { $gt: boundaryDate } });
    console.log(company)
    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
