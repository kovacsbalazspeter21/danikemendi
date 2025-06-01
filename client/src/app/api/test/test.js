export async function GET() {
  return Response.json({ message: 'Teszt API működik!' });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ 
    message: 'POST működik!', 
    received: body 
  });
}
