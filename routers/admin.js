const express = require("express");
const {getAccessToRoute,getAdminAccess }= require("../middlewares/authorization/auth");
const checkUserExist = require("../middlewares/database/databaseErrorHelpers");
const {blockUser,deleteUser} = require("../controllers/admin");

const router = express.Router();

// Once bu iki ara katmandan gececek
router.use([getAccessToRoute,getAdminAccess]);

// Daha sonra bir sikinti yoksa buraya gelecek
router.get("/block/:id",checkUserExist,blockUser);
router.delete("/user/:id",checkUserExist,deleteUser);

module.exports = router;