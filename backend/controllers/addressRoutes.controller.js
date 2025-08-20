import { User } from "../models/User.js";

export const fetchAdders= async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("address");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.address);
  } catch (err) {
    console.error("Fetch addresses error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
export const addAdders= async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body;
    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address.push({ street, city, state, zipCode, country });
    await user.save();

    // return only the newly added address (last element)
    res.status(201).json(user.address[user.address.length - 1]);
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ message: "Server error" });
  }
}