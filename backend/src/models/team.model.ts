import mongoose, { Document, Schema } from 'mongoose';

export interface TeamDocument extends Document {
  name: string;
  description?: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<TeamDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model<TeamDocument>('Team', TeamSchema);
