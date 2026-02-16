require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function seedInterests() {
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");

    const db = client.db("portfolio");

    // Sample interests
    const sampleInterests = [
      {
        title: "Digital Design",
        icon: "Cpu",
        description: "ASIC/FPGA implementation, RTL design, RISC-V architectures, and hardware accelerator development",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Embedded Systems",
        icon: "Wrench",
        description: "IoT solutions, embedded systems design, firmware development, and real-time systems",
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "PCB Design",
        icon: "Code",
        description: "Advanced PCB design, high-speed circuit design, signal integrity, and hardware prototyping",
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Research & Development",
        icon: "Database",
        description: "Contributing to cutting-edge research in digital systems, hardware design, and embedded technologies",
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Innovation",
        icon: "Award",
        description: "Exploring emerging technologies, developing innovative solutions, and staying current with industry trends",
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Continuous Learning",
        icon: "User",
        description: "Always expanding knowledge in hardware systems, new tools, and methodologies in electronic engineering",
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Clear existing interests
    await db.collection("interests").deleteMany({});
    console.log("Cleared existing interests");

    // Insert sample interests
    const result = await db.collection("interests").insertMany(sampleInterests);
    console.log(`✅ Inserted ${result.insertedCount} interests`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seedInterests().catch(console.error);
