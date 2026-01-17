interface ContactRequest {
  name: string;
  email: string;
  message: string;
  token: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, message, token } = (await request.json()) as ContactRequest;

    // Validate input
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify reCAPTCHA token
    const captchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    );

    if (!captchaRes.ok) {
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification failed" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const captchaData = await captchaRes.json();
    if (captchaData.score < 0.5) {
      return new Response(
        JSON.stringify({ error: "reCAPTCHA score too low" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message received" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
