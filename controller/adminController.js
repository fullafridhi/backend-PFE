
const User = require("../model/userModel");


// Get data of user (students and teachers)

exports.getUserData = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "You don't have access to view user data" });
        }
        const users = await User.find(); // Récupérer tous les utilisateurs
        res.status(200).json({ msg: "User data retrieved successfully", users });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
};
// Description: Create user
// Method: POST
// Path: /admin/addUserData
// Access: Private
exports.addUserData = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the incoming request body

    // Check if the user has admin role
    if (req.body.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You don't have access to add user data" });
    }

    const { username, email, password,role } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(403).json({ message: "User Already Present" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
       
      role,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User Added", data: newUser });
  } catch (err) {
    console.error("Error:", err); 
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
};

// Description: Update user
// Method: PUT
// Path: /admin/updateUser/:id
// Access: Private
exports.updateUserData = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "You don't have access to update user data" });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ msg: "User not found" });
        res.status(200).json({ msg: "User updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
};



// Description: Delete user
// Method: DELETE
// Path: /admin/deleteUser/:id
// Access: Private
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "You don't have access to delete user data" });
        }
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ msg: "User not found" });
        res.status(200).json({ msg: "User deleted", user: deletedUserdUser })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
};












// const User = require("../model/userModel");




// // Get data of users (students and teachers)
// exports.getUserData = async (req, res) => {
//     try {
//         const users = await User.find(); // Retrieve all users (students and teachers)
//         res.status(200).json({ msg: "User data retrieved successfully", users });
//     } catch (error) {
//         res.status(500).json({ msg: "Something went wrong", error: error.message });
//     }
// };

// // Create user (for both students and teachers)
// exports.addUserData = async (req, res) => {
//     try {
//         const { username, email, password, passwordConfirm, role } = req.body;

//         // Check if the user already exists
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(403).json({ message: "User Already Present" });
//         }

//         // Create a new user
//         const newUser = new User({ username, email, password, passwordConfirm, role });
//         await newUser.save();
//         res.status(201).json({ message: "User Added", data: newUser });
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(400).json({ message: "Something Went Wrong", error: err.message });
//     }
// };

// // Update user (for both students and teachers)
// exports.updateUserData = async (req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedUser) return res.status(404).json({ msg: "User not found" });
//         res.status(200).json({ msg: "User updated", user: updatedUser });
//     } catch (error) {
//         res.status(500).json({ msg: "Something went wrong", error: error.message });
//     }
// };

// // Delete user (for both students and teachers)
// exports.deleteUser = async (req, res) => {
//     try {
//         const deletedUser = await User.findByIdAndDelete(req.params.id);
//         if (!deletedUser) return res.status(404).json({ msg: "User not found" });
//         res.status(204).send(); // No content
//     } catch (error) {
//         res.status(500).json({ msg: "Something went wrong", error: error.message });
//     }
// };




