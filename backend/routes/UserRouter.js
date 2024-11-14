const {getAllUsers} = require("../controllers/UserController")
const router=require('express').Router()


router.get('/all',getAllUsers)

module.exports= router;