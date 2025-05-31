import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import nodemailer from "nodemailer";

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// Function to generate order confirmation email HTML
const generateOrderEmailHTML = (order, userDetails) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.product.name}</strong><br>
        <small>Quantity: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.product.offerPrice * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50; text-align: center;">Order Confirmation</h1>

        <p>Dear ${userDetails.name},</p>

        <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #2c3e50;">Order Details</h2>
          <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.amount.toFixed(2)}</p>
        </div>

        <h3 style="color: #2c3e50;">Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f9fa; font-weight: bold;">
              <td style="padding: 10px; border-top: 2px solid #dee2e6;">Total</td>
              <td style="padding: 10px; border-top: 2px solid #dee2e6; text-align: right;">$${order.amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2c3e50;">Shipping Address</h3>
          <p>
            ${order.address.fullName}<br>
            ${order.address.area}<br>
            ${order.address.city}, ${order.address.state}<br>
            Phone: ${order.address.phoneNumber}
          </p>
        </div>

        <p>We'll send you another email with tracking information once your order ships.</p>

        <p>If you have any questions about your order, please don't hesitate to contact us.</p>

        <p>Thank you for choosing QuickCart!</p>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #6c757d; font-size: 14px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to generate admin notification email HTML
const generateAdminEmailHTML = (order, userDetails) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.product.name}</strong><br>
        <small>Quantity: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.product.offerPrice * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e74c3c; text-align: center;">🚨 New Order Received</h1>

        <div style="background-color: #f39c12; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0;">ADMIN NOTIFICATION</h2>
          <p style="margin: 5px 0;">A new order has been placed and requires your attention.</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #2c3e50;">Order Details</h2>
          <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.amount.toFixed(2)}</p>
          <p><strong>Customer:</strong> ${userDetails.name}</p>
          <p><strong>Customer Email:</strong> ${userDetails.email}</p>
        </div>

        <h3 style="color: #2c3e50;">Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f9fa; font-weight: bold;">
              <td style="padding: 10px; border-top: 2px solid #dee2e6;">Total</td>
              <td style="padding: 10px; border-top: 2px solid #dee2e6; text-align: right;">$${order.amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2c3e50;">Shipping Address</h3>
          <p>
            ${order.address.fullName}<br>
            ${order.address.area}<br>
            ${order.address.city}, ${order.address.state}<br>
            Phone: ${order.address.phoneNumber}<br>
            Email: ${order.address.email}
          </p>
        </div>

        <div style="background-color: #e74c3c; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Action Required</h3>
          <p style="margin-bottom: 0;">Please process this order and prepare it for shipment.</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #6c757d; font-size: 14px;">
            This is an automated admin notification from Abronia Lizards.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send order confirmation email to user
const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  try {
    const transporter = createEmailTransporter();
    const secEmailAddress = order.address.email

    const mailOptions = {
      from: {
        name: 'Abronia Lizards',
        address: process.env.GMAIL_USER
      },
      to: [userEmail, secEmailAddress],
      subject: 'Order Confirmation - Thank you for your purchase!',
      html: generateOrderEmailHTML(order, { name: userName, email: userEmail }),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send admin notification email
const sendAdminNotificationEmail = async (order, userEmail, userName) => {
  try {
    const transporter = createEmailTransporter();
    const adminEmailAddress = process.env.ADMIN_EMAIL;

    if (!adminEmailAddress) {
      console.log('Admin email not configured, skipping admin notification');
      return { success: true, messageId: null };
    }

    const mailOptions = {
      from: {
        name: 'Abronia Lizards',
        address: process.env.GMAIL_USER
      },
      to: adminEmailAddress,
      subject: '🚨 New Order Alert - Admin Notification',
      html: generateAdminEmailHTML(order, { name: userName, email: userEmail }),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        await connectDB();

        // Import Address model
        const Address = (await import("@/models/Address")).default;

        // Get user details first
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        // Get address details
        const addressDetails = await Address.findById(address);
        if (!addressDetails) {
            return NextResponse.json({ success: false, message: 'Address not found' });
        }

        // Validate products and calculate amount
        let amount = 0;
        const validatedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product with ID ${item.product} not found`);
                }
                amount += product.offerPrice * item.quantity;
                return {
                    product: item.product,
                    quantity: item.quantity
                };
            })
        );

        const finalAmount = amount + Math.floor(amount * 0.02);

        // Prepare order data
        const orderData = {
            userId,
            items: validatedItems,
            amount: finalAmount,
            address,
            date: Date.now()
        };

        // Get product details for email
        const emailOrderData = {
            ...orderData,
            address: addressDetails, // Use the actual address details
            items: await Promise.all(
                validatedItems.map(async (item) => {
                    const product = await Product.findById(item.product);
                    return {
                        product: {
                            name: product.name,
                            offerPrice: product.offerPrice
                        },
                        quantity: item.quantity
                    };
                })
            )
        };

        // Determine the best name and email to use
        const userName = user.name || addressDetails.fullName || 'Customer';
        const userEmail = user.email || addressDetails.email;

        // Send confirmation email to user and admin notification email
        console.log('Attempting to send confirmation emails...');

        const [userEmailResult, adminEmailResult] = await Promise.all([
            sendOrderConfirmationEmail(emailOrderData, userEmail, userName),
            sendAdminNotificationEmail(emailOrderData, userEmail, userName)
        ]);

        if (!userEmailResult.success) {
            console.error('User email sending failed:', userEmailResult.error);
            return NextResponse.json({ 
                success: false, 
                message: `Order creation failed: Unable to send confirmation email. ${userEmailResult.error}` 
            });
        }

        if (!adminEmailResult.success) {
            console.warn('Admin email sending failed:', adminEmailResult.error);
            // Don't fail the order if admin email fails, just log it
        }

        // Only create order if email was sent successfully
        const createdOrder = await Order.create(orderData);
        console.log('Order created successfully:', createdOrder._id);

        // Clear user cart only after successful order creation
        user.cartItems = {}
        await user.save()

        return NextResponse.json({ 
            success: true, 
            message: 'Order Placed and confirmation email sent',
            orderId: createdOrder._id,
            emailSent: true
        })

    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json({ 
            success: false, 
            message: `Order creation failed: ${error.message}` 
        })
    }
}