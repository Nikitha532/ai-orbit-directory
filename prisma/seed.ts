import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tools = [
  {
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "Conversational AI model for drafting, code, and problem solving",
    description:
      "ChatGPT by OpenAI is an AI-powered language model designed to understand and generate human-like text across conversational interfaces, coding tasks, creative ideation, and structured analysis.",
    category: "Productivity",
    pricing: "Freemium",
    websiteUrl: "https://chatgpt.com",
    features: ["Natural language conversation", "Code analysis", "Document upload", "Custom GPTs"],
    rating: 4.9,
    reviews: 2450,
    isFeatured: true,
  },
  {
    name: "Claude",
    slug: "claude",
    tagline: "Next-generation AI assistant built for nuanced, safety-focused reasoning",
    description:
      "Claude by Anthropic specializes in deep analytical reasoning, long-document context parsing, and natural, collaborative writing workflows.",
    category: "Productivity",
    pricing: "Freemium",
    websiteUrl: "https://claude.ai",
    features: ["200k+ token context window", "Code generation", "Artifacts sandbox", "Document parsing"],
    rating: 4.9,
    reviews: 1820,
    isFeatured: true,
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    tagline: "Generative AI system transforming text descriptions into visual art",
    description:
      "Midjourney generates high-fidelity visual assets, illustrations, and concept art from plain text natural language prompts via Discord and web interfaces.",
    category: "Design",
    pricing: "Paid",
    websiteUrl: "https://midjourney.com",
    features: ["Photorealistic image synthesis", "Style exploration", "Upscaling & outpainting", "Community feed"],
    rating: 4.8,
    reviews: 3100,
    isFeatured: true,
  },
  {
    name: "Cursor",
    slug: "cursor",
    tagline: "The AI-first code editor designed for pair programming",
    description:
      "An intelligent IDE built on VS Code that understands entire codebases, predicts next edits, and writes features from single prompts.",
    category: "Development",
    pricing: "Freemium",
    websiteUrl: "https://cursor.com",
    features: ["Full codebase indexing", "Multi-file edits", "Inline terminal debugging", "Chat with repo"],
    rating: 4.9,
    reviews: 950,
    isFeatured: true,
  },
  {
    name: "Perplexity AI",
    slug: "perplexity",
    tagline: "Where knowledge begins with conversational search engine answers",
    description:
      "Perplexity provides real-time web search combined with LLM syntheses, backed by cited sources and follow-up query suggestions.",
    category: "Research",
    pricing: "Freemium",
    websiteUrl: "https://perplexity.ai",
    features: ["Live source citations", "Pro web search mode", "File analysis", "Thread collections"],
    rating: 4.7,
    reviews: 1420,
    isFeatured: false,
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "Realistic voice generation and text-to-speech audio platform",
    description:
      "AI audio platform that produces lifelike voices, accents, and emotional inflections across dozens of languages.",
    category: "Audio",
    pricing: "Freemium",
    websiteUrl: "https://elevenlabs.io",
    features: ["Voice cloning", "Multi-language TTS", "Dubbing studio", "Sound effects generation"],
    rating: 4.8,
    reviews: 870,
    isFeatured: false,
  },
];

async function main() {
  await prisma.tool.deleteMany();

  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
  }

  console.log("Database successfully seeded with AI Orbit tools.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });