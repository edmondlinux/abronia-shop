
import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = createTransporter();
    
    const { address, items, amount, orderId } = orderData;
    
    // Create items list for email
    const itemsList = items.map(item => 
      `• ${item.product.name} x ${item.quantity} - $${(item.product.offerPrice * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: address.email,
      subject: `Order Confirmation - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Order Confirmation</h2>
          
          <p>Dear <strong>${address.fullName}</strong>,</p>
          
          <p>Thank you for your order! Your order has been placed successfully.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${amount.toFixed(2)}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Items Ordered:</h3>
            <pre style="background-color: #f9fafb; padding: 15px; border-radius: 4px;">${itemsList}</pre>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>
              <strong>${address.fullName}</strong><br>
              ${address.area}<br>
              ${address.city}, ${address.state} - ${address.pincode}<br>
              Phone: ${address.phoneNumber}
            </p>
          </div>
          
          <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
          <p><strong>Payment Status:</strong> Pending</p>
          
          <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
          
          <p>Thank you for shopping with us!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions about your order, please contact our customer service team.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update email
export const sendOrderStatusEmail = async (orderData, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const { address, orderId } = orderData;
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: address.email,
      subject: `Order Update - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Order Status Update</h2>
          
          <p>Dear <strong>${address.fullName}</strong>,</p>
          
          <p>Your order status has been updated.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>New Status:</strong> <span style="color: #ea580c; font-weight: bold;">${newStatus}</span></p>
            <p><strong>Updated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Thank you for your patience!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions about your order, please contact our customer service team.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Order status email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending order status email:', error);
    return { success: false, error: error.message };
  }
};
