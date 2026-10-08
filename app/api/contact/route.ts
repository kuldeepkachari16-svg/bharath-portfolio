export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM)
    return Response.json(
      { error: "Email delivery is not configured" },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return Response.json({ error: "Message too long" }, { status: 413 });
  try {
    const raw = await request.text();
    if (raw.length > 20000)
      return Response.json({ error: "Message too long" }, { status: 413 });
    const { name, email, message, website } = JSON.parse(raw);
    if (website)
      return Response.json({ error: "Invalid submission" }, { status: 400 });
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 120 ||
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 5000
    )
      return Response.json({ error: "Invalid fields" }, { status: 400 });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM,
        to: [process.env.CONTACT_TO || "bharath_v@nid.edu"],
        reply_to: email,
        subject: "Portfolio enquiry",
        text: `${name}\n${email}\n\n${message}`,
      }),
    });
    if (!response.ok)
      return Response.json({ error: "Delivery failed" }, { status: 502 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Unable to send message" }, { status: 400 });
  }
}
