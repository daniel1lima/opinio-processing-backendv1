import mongoose from "mongoose";


const CompanySchema = new mongoose.Schema(
    {
        company_id:{
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        company_name: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        industry_id: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        date_joined: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        }

    },
    { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);

export default Company;