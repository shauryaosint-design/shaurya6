import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MPGI ERP database...");

  // Campuses
  const mandhana = await prisma.campus.upsert({
    where: { code: "MANDHANA" },
    update: {},
    create: {
      code: "MANDHANA",
      name: "Mandhana Campus",
      address: "Kothi, Mandhana",
      city: "Kanpur",
      state: "Uttar Pradesh",
    },
  });

  const bithoor = await prisma.campus.upsert({
    where: { code: "BITHOOR" },
    update: {},
    create: {
      code: "BITHOOR",
      name: "Bithoor Campus",
      address: "Baikunthpur, Bithoor Road",
      city: "Kanpur",
      state: "Uttar Pradesh",
    },
  });

  // Colleges
  const mpec = await prisma.college.upsert({
    where: { code: "MPGI046" },
    update: {},
    create: {
      code: "MPGI046",
      name: "Maharana Pratap Engineering College",
      shortName: "MPEC",
      aktuCode: "046",
      campusId: mandhana.id,
    },
  });

  const mpcp = await prisma.college.upsert({
    where: { code: "MPGI200" },
    update: {},
    create: {
      code: "MPGI200",
      name: "Maharana Pratap College of Pharmacy",
      shortName: "MPCP",
      aktuCode: "200",
      bteCode: "3381",
      campusId: mandhana.id,
    },
  });

  const mips = await prisma.college.upsert({
    where: { code: "MPGI349" },
    update: {},
    create: {
      code: "MPGI349",
      name: "Maharana Institute of Professional Studies",
      shortName: "MIPS",
      aktuCode: "349",
      campusId: bithoor.id,
    },
  });

  // Departments & Programs for MPEC
  const cse = await prisma.department.create({
    data: {
      code: "CSE",
      name: "Computer Science & Engineering",
      collegeId: mpec.id,
    },
  });

  const btechCse = await prisma.program.create({
    data: {
      code: "BTECH-CSE",
      name: "B.Tech Computer Science & Engineering",
      level: "UG",
      durationYrs: 4,
      totalSeats: 180,
      collegeId: mpec.id,
      departmentId: cse.id,
    },
  });

  const btechAiml = await prisma.program.create({
    data: {
      code: "BTECH-AIML",
      name: "B.Tech Artificial Intelligence & Machine Learning",
      level: "UG",
      durationYrs: 4,
      totalSeats: 120,
      collegeId: mpec.id,
      departmentId: cse.id,
    },
  });

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mpgi.edu.in" },
    update: {},
    create: {
      email: "admin@mpgi.edu.in",
      passwordHash,
      firstName: "System",
      lastName: "Administrator",
      role: "SUPER_ADMIN",
      campusId: mandhana.id,
    },
  });

  // College admin
  await prisma.user.upsert({
    where: { email: "principal@mpec.mpgi.edu.in" },
    update: {},
    create: {
      email: "principal@mpec.mpgi.edu.in",
      passwordHash: await bcrypt.hash("principal123", 12),
      firstName: "Principal",
      lastName: "MPEC",
      role: "COLLEGE_ADMIN",
      collegeId: mpec.id,
      campusId: mandhana.id,
    },
  });

  // Sample student
  const studentUser = await prisma.user.create({
    data: {
      email: "student@mpgi.edu.in",
      passwordHash: await bcrypt.hash("student123", 12),
      firstName: "Rahul",
      lastName: "Sharma",
      role: "STUDENT",
      collegeId: mpec.id,
      campusId: mandhana.id,
    },
  });

  const student = await prisma.student.create({
    data: {
      enrollmentNo: "MPEC2024CSE001",
      userId: studentUser.id,
      collegeId: mpec.id,
      programId: btechCse.id,
      admissionYear: 2024,
      currentSem: 3,
      gender: "MALE",
      category: "GEN",
      guardianName: "Suresh Sharma",
      guardianPhone: "9876543210",
    },
  });

  // Fee structure
  const feeStruct = await prisma.feeStructure.create({
    data: {
      name: "B.Tech CSE 2025-26 Odd Semester",
      collegeId: mpec.id,
      programId: btechCse.id,
      academicYear: "2025-26",
      semester: 3,
      tuitionFee: 85000,
      developmentFee: 10000,
      examFee: 5000,
      otherFee: 5000,
      totalFee: 105000,
    },
  });

  // Sample payment
  await prisma.feePayment.create({
    data: {
      receiptNo: "RCP-2025-0001",
      studentId: student.id,
      feeStructureId: feeStruct.id,
      amount: 105000,
      paidAmount: 105000,
      dueAmount: 0,
      paymentMode: "UPI",
      transactionId: "UPI123456789",
      status: "PAID",
    },
  });

  // Attendance samples
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    await prisma.attendance.create({
      data: {
        studentId: student.id,
        date: d,
        status: i % 5 === 0 ? "ABSENT" : "PRESENT",
        subjectCode: "CSE301",
        period: 1,
      },
    });
  }

  // Enquiry
  await prisma.admissionEnquiry.create({
    data: {
      fullName: "Priya Verma",
      email: "priya@example.com",
      phone: "9123456789",
      programInterest: "B.Tech CSE",
      collegeCode: "MPGI046",
      source: "WEBSITE",
      status: "NEW",
    },
  });

  // Announcement
  await prisma.announcement.create({
    data: {
      title: "Welcome to MPGI Next-Gen ERP",
      content:
        "This is the new Intelligent ERP system for Maharana Pratap Group of Institutions. Login with the demo credentials provided.",
      targetRole: "ALL",
      isPinned: true,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("");
  console.log("Demo Logins:");
  console.log("  SUPER_ADMIN : admin@mpgi.edu.in / admin123");
  console.log("  COLLEGE_ADMIN: principal@mpec.mpgi.edu.in / principal123");
  console.log("  STUDENT     : student@mpgi.edu.in / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
