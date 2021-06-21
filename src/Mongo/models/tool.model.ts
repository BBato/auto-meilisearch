import { Document, Model, model, Types, Schema, Query } from 'mongoose';

const ToolSchema = new Schema<any>(
  {
    companyName: { type: String, required: false },
    website: { type: String, required: false },
    categories: { type: Array, required: false },
    shortDescription: { type: String, required: false },
    longDescription: { type: String, required: false },
    githubURL: { type: String, required: false },
    twitterURL: { type: String, required: false },
    linkedinURL: { type: String, required: false },
    docsURL: { type: String, required: false },
    logoURL: { type: String, required: false },
    stars: { type: Number, required: false },
    funding: { type: Number, required: false },
    marketCap: { type: Number, required: false },
    other: { type: String, required: false },
    stage: { type: String, required: false },
    permalink: { type: String, required: false },
    newTool: { type: Boolean, required: false }, // cannot use 'new' keyword!
    githubRepositories: { type: Array, required: false },
    updateId: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

let tool_model: Model<any>;
try {
  tool_model = model('Tool');
} catch (error) {
  tool_model = model('Tool', ToolSchema);
}

export const ToolMongooseModel = tool_model;
