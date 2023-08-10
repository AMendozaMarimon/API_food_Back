const { Users } = require("../db");

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const newUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({ message: "Missing data!" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address!" });
  };

  if (password.length < 6 || password.length > 20) {
    return res.status(404).json({ message: "Invalid password address!" })
  }

  try {

    const existingUser = await Users.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    Users.create({
      email: email,
      password: password,
    });

    return res.json({ access: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { newUser };
