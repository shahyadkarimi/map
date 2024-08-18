import connectDB from "@/configsdb";
import MapModel from "@/models/MapModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { lat, lng, date } = body;

    const points = await MapModel.create({ lat, lng, date });

    return Response.json(
      { message: "point created successfully !", points },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    const points = await MapModel.find({}, "-__v");

    return Response.json(points);
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
