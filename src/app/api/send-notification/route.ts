import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// import Twilio from 'twilio';
const Twilio = require('twilio');

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- FIX #1: Use your verified domain for the FROM email ---
const FROM_EMAIL = 'blue-veil.com'; 

// --- FIX #2: Use the official Twilio Sandbox number for the FROM WhatsApp ---
const FROM_WHATSAPP = 'whatsapp:+14155238886';

export async function POST(req: Request) {
  try {
    const { email, phone, orderId } = await req.json();

    if (!email || !phone || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- 1. SEND EMAIL ---
    await resend.emails.send({
      from: `Blue Veil <${FROM_EMAIL}>`, // This now uses your verified domain
      to: email,
      subject: `Your Blue Veil Order #${orderId} has been placed!`,
      html: `<p>Thank you for your order! Track it here: <a href="http://localhost:3000/orders/track?trackingId=${orderId}">Track Order</a></p>`
    });

    // --- 2. SEND WHATSAPP ---
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    await twilioClient.messages.create({
      from: FROM_WHATSAPP, // This now uses the correct Twilio number
      to: `whatsapp:${formattedPhone}`,
      body: `Thank you for your order from Blue Veil! Your order ID is #${orderId}.`,
    });

    return NextResponse.json({ success: true, message: 'Notifications sent successfully' });

  } catch (error: any) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
