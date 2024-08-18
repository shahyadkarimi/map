import connectDB from "../../../../configs/db";

export async function GET(req) {
  await connectDB();

  return Response.json({ message: "Success res :))" }, { statusL: 201 });
}
