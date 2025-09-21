const mongoose = require("mongoose");

const learningContentSchema = new mongoose.Schema(
  {
    main_topic: {
      type: String,
      enum: [
        "supervised",
        "unsupervised",
        "reinforcement",
        "deep_learning",
        "transformers",
        "neural_networks",
        "nlp",
        "computer_vision",
        "generative_models",
      ],
      required: true,
    },
    sub_topic: {
      type: String,
      enum: [
        // Supervised
        "regression",
        "classification",

        // Unsupervised
        "clustering",
        "dimensionality_reduction",

        // Reinforcement
        "q_learning",
        "policy_gradients",
        "actor_critic",

        // Neural Networks
        "ann", // artificial neural networks
        "cnn", // convolutional
        "rnn", // recurrent
        "lstm",
        "gru",
        "gan", // generative adversarial networks
        "vae", // variational autoencoders

        // Transformers & Attention
        "transformer_encoder",
        "transformer_decoder",
        "encoder_decoder",
        "attention_mechanism",
        "bert",
        "gpt",
        "t5",

        // NLP
        "word_embeddings",
        "seq2seq",
        "language_modeling",

        // CV
        "image_classification",
        "object_detection",
        "segmentation",

        // Generative
        "diffusion_models",
        "style_transfer"
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    thumbnail_image: { type: String, default: "" }, // card display
    main_content: { type: String, required: true }, // article/markdown
    video_links: [{ type: String }],
    examples: [
      {
        text: { type: String, required: true },
        link: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const LearningContent = mongoose.model("LearningContent", learningContentSchema);

module.exports = LearningContent;
