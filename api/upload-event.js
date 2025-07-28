// api/upload-event.js
import supabase from '../lib/supabaseClient.js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: 'File parsing failed' });
    }

    const file = files.eventImage;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileStream = fs.createReadStream(file.filepath);
    const fileExt = file.originalFilename.split('.').pop();
    const fileName = `event-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('event-images') // your bucket name
      .upload(fileName, fileStream, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: 'Upload to Supabase Storage failed' });
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/event-images/${fileName}`;

    // (Optional) Insert into DB
    const insertResult = await supabase
      .from('event_images')
      .insert([
        { file_name: fileName, url: publicUrl }
      ]);

    if (insertResult.error) {
      console.error("DB insert error:", insertResult.error);
      return res.status(500).json({ error: 'Failed to insert into DB' });
    }

    res.status(200).json({
      message: 'Upload successful',
      imageUrl: publicUrl,
    });
  });
}