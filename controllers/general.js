import ClerkUser from "../models/ClerkUser.js";
import Company from "../models/Company.js";

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
    const company = await Company.findOne({ company_id: comp_id });
    console.log(company)
    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
