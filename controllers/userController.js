import createToken from "@/helpers/helper";
import User from "@/models/User";
import bcrypt from "bcrypt";
import validator from "validator";

// ========= create user ======== //
export const createUser = async (req, res) => {
  try {
    const { username, email, password, image } = req.body;

    const user = await User.signup(username, email, password, image);

    const token = createToken(user._id);

    res.status(200).json({ user, token });

    return { user, token };
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ========= login user ======== //
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//======= Get All Users ========//
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//======= Get An User ========//
export const getAnUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ========= update user ======== //
export const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { username, email, password, image } = req.body;

    const updateData = { username, email, password, image };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//========= Delete user ========//
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//======= Get Current User Profile ========//
export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//======= Change Current User Password ========//
export const changeCurrentUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      req.user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        error:
          "New password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      });
    }

    if (await bcrypt.compare(newPassword, req.user.password)) {
      return res.status(400).json({
        error: "New password must be different from your current password",
      });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
