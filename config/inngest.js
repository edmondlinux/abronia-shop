import { Inngest } from "inngest";
import User from "@/models/User";
import connectDB from "./db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or 'smtp.gmail.com'
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
    },
  });
};

// Function to generate order confirmation email HTML
const generateOrderEmailHTML = (order, userDetails) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small>Quantity: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
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
            ${order.address.firstName} ${order.address.lastName}<br>
            ${order.address.street}<br>
            ${order.address.city}, ${order.address.state} ${order.address.zipCode}<br>
            ${order.address.country}<br>
            Phone: ${order.address.phone}
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

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: {
        name: 'QuickCart',
        address: process.env.GMAIL_USER
      },
      to: userEmail,
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

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

// Inngest Function to update user data in database 
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated' },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)
    }
)

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({event}) => {

        const {id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

// Inngest Function to create user's order in database and send confirmation emails
export const createUserOrder = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    {event: 'order/created'},
    async ({events}) => {

        const orders = events.map((event)=> {
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date : event.data.date
            }
        })

        await connectDB()
        const createdOrders = await Order.insertMany(orders)

        // Send confirmation emails for each order
        const emailResults = [];

        for (let i = 0; i < createdOrders.length; i++) {
            const order = createdOrders[i];
            const originalEvent = events[i];

            try {
                // Get user details from database
                const user = await User.findById(order.userId);

                if (user && user.email) {
                    const emailResult = await sendOrderConfirmationEmail(
                        order, 
                        user.email, 
                        user.name
                    );

                    emailResults.push({
                        orderId: order._id,
                        email: user.email,
                        emailSent: emailResult.success,
                        error: emailResult.error || null
                    });
                } else {
                    // Fallback to email from address if user not found
                    const emailResult = await sendOrderConfirmationEmail(
                        order, 
                        order.address.email, 
                        `${order.address.firstName} ${order.address.lastName}`
                    );

                    emailResults.push({
                        orderId: order._id,
                        email: order.address.email,
                        emailSent: emailResult.success,
                        error: emailResult.error || null
                    });
                }
            } catch (error) {
                console.error(`Error processing email for order ${order._id}:`, error);
                emailResults.push({
                    orderId: order._id,
                    emailSent: false,
                    error: error.message
                });
            }
        }

        return { 
            success: true, 
            processed: orders.length,
            emailResults: emailResults
        };
    }
)