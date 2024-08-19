import connectDB from "@/configs/db";
import SettingsModel from "@/models/SettingsModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { lat, lng, zoom } = body;

    const settings = await SettingsModel.findOneAndUpdate(
      { _id: "66c3774a9757762530e4bfd1" },
      {
        $set: {
          lat,
          lng,
          zoom,
        },
      }
    );

    return Response.json(
      { message: "Point updated successfully !" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const settings = await SettingsModel.findOne(
      { _id: "66c3774a9757762530e4bfd1" },
      "-__v"
    );

    return Response.json(settings);
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
