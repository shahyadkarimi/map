import connectDB from "@/configsdb";
import MapModel from "@/models/MapModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { search } = body;

    const points = await MapModel.filter({ name: search, deletedAt: null });

    return Response.json(points);
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
