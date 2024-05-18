import ClerkUser from "../models/ClerkUser.js";



export const addCompany = async (req, res) => {
    try {
        const compId = req.body.companyId; // Access the content from the request body
        const userId = req.body.user; // Access the user ID from the request body
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        // console.log(userId)
        // console.log(compId)
        // console.log(email)
        // console.log(firstName)

        const newListing = new ClerkUser({
            clerkUserId: userId,
            company_id: compId,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        await newListing.save();

        res.status(200).json("success");
    } catch (error) {
        console.log(req.body);
        res.status(404).json({ message: error.message });
    }
    
};