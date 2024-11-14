const UserModel= require("../models/user")
require("../models/db")

const getAllUsers = async (req, res) => {
    try{
        const users=await UserModel.find({},'name')
        res.json(users)
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports={getAllUsers}