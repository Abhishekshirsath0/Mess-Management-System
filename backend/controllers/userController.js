import User from "../model/user.js";

export const postUserdata = async (req, res) => {
  try {
    const { Name, Mobile, Parent_Mob, Email, Address, Gender, Password } = req.body;

    const newUser = new User({
      Name,
      Mobile,
      Parent_Mob,
      Email,
      Address,
      Gender,
      Password,
    });

    const savedUser = await newUser.save();

    const { Password: _, ...userWithoutPassword } = savedUser.toObject();
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email or phone number already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getUserdata = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};