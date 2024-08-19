import User from "../models/User.js";
import Company from "../models/Company.js"; // Import the Company class

export const addCompany = async (req, res) => {
    try {
        const compId = req.body.company_id; // Access the content from the request body
        const companyName = req.body.company_name; // New field for company name
        const industryId = req.body.industry_id; // New field for industry ID
        const country = req.body.country; // New field for country
        const city = req.body.city; // New field for city
        const company = new Company();

        // Check if the company already exists
        const existingCompany = await company.fetchCompanyItemById(compId); // Assuming findById is a method to find a company by ID
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this ID already exists." });
        }

        // Create a new company instance
        
        await company.createCompany({ // Call the createCompany method
            company_id: { S: compId }, // Wrap in an object with type
            company_name: { S: companyName }, // Wrap in an object with type
            industry_id: { S: industryId }, // Wrap in an object with type
            country: { S: country }, // Wrap in an object with type
            city: { S: city }, // Wrap in an object with type
            date_joined: { S: new Date().toISOString() }, // Wrap in an object with type
            active: { BOOL: true } // Wrap in an object with type
        });

        res.status(200).json("Success!");
    } catch (error) {
        console.log(req.body);
        res.status(404).json({ message: error.message });
    }
};


export const addUser = async (req, res) => {
    try {
        const { company_id, user_id, email, first_name, last_name } = req.body;

        // Validate required fields
        if (!company_id || !user_id || !email || !first_name || !last_name) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const dynamouser = new User();
        const company = new Company();
        const existingCompany = await company.fetchCompanyItemById(company_id);
        if (!existingCompany) {
            return res.status(400).json({ message: "Company does not exist." });
        }

        // Check if the user already exists
        const existingUser = await dynamouser.fetchUserById(user_id, company_id); // Assuming fetchUserById is a method to find a user by ID
        if (existingUser) {
            return res.status(400).json({ message: "User with this ID already exists." });
        }

        await dynamouser.createUser({
            user_id: user_id , // Wrap in an object with type
            company_id: company_id , // Wrap in an object with type
            email: email , // Wrap in an object with type
            first_name: first_name, // Wrap in an object with type
            last_name: last_name, // Wrap in an object with type
        });

        res.status(200).json("User added successfully!");
    } catch (error) {
        console.log(req.body);
        res.status(404).json({ message: error.message });
    }
};