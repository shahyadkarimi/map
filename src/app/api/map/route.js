import connectDB from "@/configsdb";
import MapModel from "@/models/MapModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { lat, lng, date, deletedAt, name, frequency } = body;

    const points = await MapModel.create({
      lat,
      lng,
      date,
      name,
      frequency,
      deletedAt,
    });

    return Response.json(
      { message: "Point created successfully !", points },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const points = await MapModel.find({ deletedAt: null }, "-__v");

    return Response.json(points);
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = body;

    await MapModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          deletedAt: new Date(),
        },
      }
    );

    return Response.json({ message: "Point deleted successfully !" });
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
