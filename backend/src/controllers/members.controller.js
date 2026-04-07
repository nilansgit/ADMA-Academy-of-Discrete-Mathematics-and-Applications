import { getMembers } from "../models/members.model.js";

export const getMemberscontroller = async (req, res) => {
    console.log("ddfd")
    try {
        const {
        page = 1,
        limit = 50,
        membership,
        name,
        } = req.query;

        const result = await getMembers({
        page: Number(page),
        limit: Number(limit),
        membership,
        name
        });

        return res.json({
        success: true,
        ...result,
        });

    } catch (error) {
        console.error("Error fetching members:", error);

        return res.status(500).json({
        success: false,
        message: "Failed to fetch members",
        });
    }
};