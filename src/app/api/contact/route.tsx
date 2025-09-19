import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "neelimasingh0820@gmail.com";
const FROM_EMAIL = "onboarding@resend.dev";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    await resend.emails.send({
      from: `Contact Form <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      subject: `New Message from ${name} via Blue Veil`,
      replyTo: email, 
      html: `
        <p>You have received a new message from your website's contact form.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}