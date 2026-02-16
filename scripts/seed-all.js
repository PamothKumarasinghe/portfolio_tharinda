require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

async function seedAll() {
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    console.log("🚀 Starting complete database setup...\n");
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully!\n");

    const db = client.db("portfolio");

    // 1. Create Admin User
    console.log("1️⃣  Setting up admin user...");
    const username = process.env.ADMIN_USERNAME || "admin";
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "changeme123";

    await db.collection("admins").deleteMany({});
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("admins").insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log("   ✅ Admin user created");
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}\n`);

    // 2. Seed Projects
    console.log("2️⃣  Seeding projects...");
    const projects = [
      {
        title: "Smart Home Automation System",
        description:
          "An IoT-based home automation system using Arduino and Raspberry Pi, enabling remote control of home appliances via a mobile app.",
        tags: ["Arduino", "Raspberry Pi", "Python", "MQTT"],
        image: "/projects/project1.jpg",
        githubUrl: "https://github.com",
        liveUrl: "",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Signal Processing Toolkit",
        description:
          "A MATLAB-based toolkit for digital signal processing, including filters, FFT analysis, and real-time signal visualization.",
        tags: ["MATLAB", "Signal Processing", "GUI"],
        image: "/projects/project2.jpg",
        githubUrl: "",
        liveUrl: "",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Wireless Sensor Network",
        description:
          "Designed and implemented a wireless sensor network for environmental monitoring with low power consumption.",
        tags: ["C++", "LoRa", "PCB Design", "ESP32"],
        image: "/projects/project3.jpg",
        githubUrl: "",
        liveUrl: "",
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "FPGA-based Image Processor",
        description:
          "Real-time image processing implementation on FPGA for edge detection and image enhancement algorithms.",
        tags: ["Verilog", "FPGA", "Image Processing"],
        image: "/projects/project4.jpg",
        githubUrl: "",
        liveUrl: "",
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection("projects").deleteMany({});
    await db.collection("projects").insertMany(projects);
    console.log(`   ✅ Inserted ${projects.length} projects\n`);

    // 3. Seed Experiences
    console.log("3️⃣  Seeding experiences...");
    const experiences = [
      {
        title: "Embedded Systems Intern",
        company: "Tech Innovations Ltd",
        description:
          "Worked on developing firmware for IoT devices, participated in PCB design reviews, and assisted in testing embedded systems.",
        date: "Jun 2024 - Aug 2024",
        location: "Colombo, Sri Lanka",
        current: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Research Assistant",
        company: "University Research Lab",
        description:
          "Conducting research on wireless communication systems, implementing signal processing algorithms, and publishing research papers.",
        date: "Jan 2024 - Present",
        location: "Moratuwa, Sri Lanka",
        current: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection("experiences").deleteMany({});
    await db.collection("experiences").insertMany(experiences);
    console.log(`   ✅ Inserted ${experiences.length} experiences\n`);

    // 4. Seed Education
    console.log("4️⃣  Seeding education...");
    const education = [
      {
        degree: "Bachelor of Science in Engineering",
        field: "Electronic & Telecommunication Engineering",
        institution: "University of Moratuwa",
        achievements:
          "Dean's List 2022, 2023 • Member of IEEE Student Branch • Active participant in robotics competitions",
        date: "2021 - Present",
        location: "Moratuwa, Sri Lanka",
        current: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        degree: "G.C.E. Advanced Level",
        field: "Physical Science Stream",
        institution: "Royal College",
        achievements:
          "District Rank: Top 50 • Science Olympiad Medalist • School Colors for Science",
        date: "2018 - 2020",
        location: "Colombo, Sri Lanka",
        current: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection("education").deleteMany({});
    await db.collection("education").insertMany(education);
    console.log(`   ✅ Inserted ${education.length} education records\n`);

    // 5. Seed Skills
    console.log("5️⃣  Seeding skills...");
    const skills = [
      {
        title: "Programming",
        icon: "Code",
        skills: [
          { name: "Python", percentage: 85 },
          { name: "C/C++", percentage: 80 },
          { name: "JavaScript", percentage: 75 },
          { name: "MATLAB", percentage: 70 },
        ],
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Hardware",
        icon: "Cpu",
        skills: [
          { name: "Arduino", percentage: 90 },
          { name: "Raspberry Pi", percentage: 85 },
          { name: "FPGA", percentage: 70 },
          { name: "PCB Design", percentage: 75 },
        ],
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Tools",
        icon: "Wrench",
        skills: [
          { name: "Git", percentage: 80 },
          { name: "Linux", percentage: 75 },
          { name: "VS Code", percentage: 85 },
          { name: "Docker", percentage: 65 },
        ],
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Technologies",
        icon: "Database",
        skills: [
          { name: "IoT", percentage: 85 },
          { name: "Signal Processing", percentage: 80 },
          { name: "Machine Learning", percentage: 70 },
          { name: "Embedded Systems", percentage: 90 },
        ],
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection("skills").deleteMany({});
    await db.collection("skills").insertMany(skills);
    console.log(`   ✅ Inserted ${skills.length} skill categories\n`);

    // 6. Seed Interests
    console.log("6️⃣  Seeding interests...");
    const interests = [
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
    await db.collection("interests").deleteMany({});
    await db.collection("interests").insertMany(interests);
    console.log(`   ✅ Inserted ${interests.length} interests\n`);

    console.log("═══════════════════════════════════════════════");
    console.log("🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════════");
    console.log("\n📊 Summary:");
    console.log(`   • Admin users: 1`);
    console.log(`   • Projects: ${projects.length}`);
    console.log(`   • Experiences: ${experiences.length}`);
    console.log(`   • Education: ${education.length}`);
    console.log(`   • Skill categories: ${skills.length}`);
    console.log(`   • Interests: ${interests.length}`);
    console.log("\n🔐 Admin Login:");
    console.log(`   URL: http://localhost:3000/admin/login`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log("\n🚀 Next steps:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Visit: http://localhost:3000");
    console.log("   3. Check admin panel: http://localhost:3000/admin");
    console.log("═══════════════════════════════════════════════\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seedAll().catch(console.error);
