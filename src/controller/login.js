const { Users } = require("../db");

const login = async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(500).json({ message: "Missing dates" });
  }

  try {
    const user = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(494).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(403).json({ message: "Password incorrect" });
    }

    return res.json({ access: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
