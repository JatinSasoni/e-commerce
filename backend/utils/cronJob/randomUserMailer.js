import cron from "node-cron";
import nodemailer from "nodemailer";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendRandomUserEmail = async () => {
  try {
    console.log("Sending...");

    const users = await User.aggregate([{ $sample: { size: 1 } }]);
    if (users.length === 0) return console.log(" No users in DB");

    const user = users[0];

    const products = await Product.find();
    if (products.length === 0) return console.log("⚠️ No products found");

    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 3);

    const productList = randomProducts
      .map((p) => `<li><b>${p.name}</b> - $${p.price}</li>`)
      .join("");

    const emailHtml = `
      <h2>🔥 Special Picks Just for You!</h2>
      <ul>${productList}</ul>
      <p>Visit our store to explore more products!</p>
    `;

    // 4. Send email
    await transporter.sendMail({
      from: `"eStore" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🎁 Your Exclusive Product Picks!",
      html: emailHtml,
    });

    console.log(` Email sent to random user: ${user.email}`);
  } catch (err) {
    console.log(err);

    console.error(" Error sending email:", err.message);
  }
};

console.log("RandomEmail Generator Initialized");

cron.schedule("* * * * *", sendRandomUserEmail);

export default sendRandomUserEmail;
