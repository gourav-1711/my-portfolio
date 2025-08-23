import nodemailer from "nodemailer";
import { NextResponse } from "next/server";


export async function POST(req, res) {
    console.log("route hit");
    
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  console.log(body);

  if (!body.name || !body.subject || !body.email || !body.message) {
    return NextResponse.json({ error: "Please fill all fields" });
  }

  try {
    // transporter setup (Gmail example — App Password needed!)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or custom SMTP host
      auth: {
        user: process.env.MY_GMAIL, // your Gmail
        pass: process.env.MY_GMAIL_PASSWORD, // your Gmail App Password
      },
    });

    // email details
    await transporter.sendMail({
      from: `"${body.name}" <${body.email}>`,
      to: process.env.MY_GMAIL, 
      subject: `Portfolio Contact Form: ${body.name} - ${body.subject}`,
      text: body.message,
      html: `<p><strong>Name:</strong> ${body.name}</p>
             <p><strong>Email:</strong> ${body.email}</p>
             <p><strong>Subject:</strong> ${body.subject}</p>
             <p><strong>Message:</strong></p>
             <p>${body.message}</p>`,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully!"  });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ success: false, error: "Email failed to send" });
  }
}
