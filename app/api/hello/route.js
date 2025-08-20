export async function GET() {
  return Response.json({ message: "Hello from ADMA!" });
}

export async function POST(req) {
  const data = await req.json(); // body data
  return Response.json({ received: data });
}
