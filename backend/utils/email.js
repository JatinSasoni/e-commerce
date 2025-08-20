import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "mnprt998877@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendOTPEmail = async (email, otp, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: "mnprt998877@gmail.com",
    to: email,
    subject: "Email Verification - Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with our e-commerce platform. Please use the following OTP to verify your email:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (email, name, order) => {
  const transporter = createTransporter();

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${
        item.product.name
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${Number(
        item.price
      ).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const mailOptions = {
    from: "mnprt998877@gmail.com",
    to: email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your order! Here are the details:</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p><strong>Total Amount: $${Number(order.totalAmount).toFixed(
          2
        )}</strong></p>
        <p>We'll send you another email when your order ships.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
