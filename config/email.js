
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email template for admin notification
const adminEmailTemplate = (orderData) => {
  const { orderId, userId, items, amount, address, date } = orderData;
  
  return {
    subject: `New Order Received - Order #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">New Order Notification</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer ID:</strong> ${userId}</p>
          <p><strong>Order Date:</strong> ${new Date(date).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> $${amount.toFixed(2)}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Items Ordered:</h3>
          ${items.map(item => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>Product:</strong> ${item.product}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
            </div>
          `).join('')}
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Address:</h3>
          <p>${address}</p>
        </div>
      </div>
    `
  };
};

// Email template for customer confirmation
const customerEmailTemplate = (orderData, customerEmail) => {
  const { orderId, items, amount, address, date } = orderData;
  
  return {
    subject: `Order Confirmation - Order #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Thank you for your order!</h2>
        <p>Dear Customer,</p>
        <p>We've received your order and it's being processed. Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Summary:</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(date).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> $${amount.toFixed(2)}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Items Ordered:</h3>
          ${items.map(item => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>Product:</strong> ${item.product}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
            </div>
          `).join('')}
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Address:</h3>
          <p>${address}</p>
        </div>
        
        <p>We'll send you another email with tracking information once your order ships.</p>
        <p>Thank you for shopping with us!</p>
        
        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>QuickCart Team</p>
        </div>
      </div>
    `
  };
};

// Function to send admin notification email
export const sendAdminNotification = async (orderData) => {
  try {
    const transporter = createTransporter();
    const emailContent = adminEmailTemplate(orderData);
    
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send customer confirmation email
export const sendCustomerConfirmation = async (orderData, customerEmail) => {
  try {
    const transporter = createTransporter();
    const emailContent = customerEmailTemplate(orderData, customerEmail);
    
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return { success: false, error: error.message };
  }
};
