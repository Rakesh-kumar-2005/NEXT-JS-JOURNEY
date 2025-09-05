import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
  try {
    const { userId } = await auth();

    // If user is not logged in
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName") || file.name;

    // If file is not found
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Basic validation...
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", 'image/jpg', 'image/gif'];
    const maxSizeBytes = 20 * 1024 * 1024; // 20MB

    // if unsupported file type...
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    // If file size is greater than 20MB...
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timeStamp = Date.now();
    const sanitizedFileName =
      fileName.replace(/[^a-zA-Z0-9]/g, "_") || "upload";

    const uniqueFileName = `${userId}/${timeStamp}_${sanitizedFileName}`;

    // Uploading to imageKit...
    const uploadResponse = await imageKit.upload({
      file: buffer,
      fileName: uniqueFileName,
      folder: "glazrr",
    });

    // Thumbnail url...
    const thumbnailUrl = imageKit.url({
      src: uploadResponse.url,
      transformation: [
        {
          width: 400,
          height: 300,
          cropMode: "maintain_ar",
          quality: 80,
        },
      ],
    });

    // returning the response...
    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      thumbnailUrl: thumbnailUrl,
      fileId: uploadResponse.fileId,
      width: uploadResponse.width,
      height: uploadResponse.height,
      size: uploadResponse.size,
      name: uploadResponse.name,
    });
  } catch (error) {
    console.log("ImageKit Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload image",
        details: error.message,
      },
      { status: 500 }
    );
  }
}