const Owner = require('../models/owner');
const Supplier = require('../models/supplier');

  //התחברות במידה ולא קיים יועבר לרישום
exports.Login = async (req, res) => {
  
  const { username, password } = req.body;

  try {
    // בדיקה אצל מנהל חנות
    const owner = await Owner.findOne({
      first_name: username,
      password: password,
    });

    if (owner) {
       res.status(200).json({role:'owner',user:owner})
    }

    // בדיקה אצל ספק
    const supplier = await Supplier.findOne({
      Representative_name: username,
      password: password,
    });

    if (supplier) {
      console.log("hi");
       res.status(200).json({role:'supplier',user:supplier})

    }

    res.status(401).json({ message: 'User not found' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
