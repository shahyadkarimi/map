import connectDB from "@/configsdb";
import MapModel from "@/models/MapModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = body;

    const point = await MapModel.findOne({ _id: id });

    await MapModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: point.status === "active" ? "disable" : "active",
        },
      }
    );

    return Response.json({ message: "Point status updated !" });
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
