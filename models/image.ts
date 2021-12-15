import { model, Schema } from 'mongoose';

interface Image {
  base64: string,
  format: string
}

const schema: Schema = new Schema<Image>({
  base64: { type: String, required: [true, 'base64 is required'] },
  format: { type: String, required: [true, 'format is required'] }
});

const ImageModel = model<Image>('Image', schema);

export default ImageModel;