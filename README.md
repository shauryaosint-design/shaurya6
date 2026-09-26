# MPGI Next-Gen ERP

**Intelligent Institute Automation System** for Maharana Pratap Group of Institutions (Kanpur).

A modern, multi-campus, multi-college college ERP built with Next.js 15, Prisma, SQLite (demo), JWT auth and Tailwind CSS.

## Features (v1.0 Foundation)

- **Multi-tenant ready**: Campuses (Mandhana, Bithoor) + Colleges (MPEC MPGI046, MPCP MPGI200, MIPS MPGI349)
- **Roles**: SUPER_ADMIN, COLLEGE_ADMIN, FACULTY, STUDENT, FINANCE, etc.
- **Modules**:
  - Dashboard with live KPIs
  - Student Information System
  - Admission Enquiries / CRM
  - Fee Structures & Payments
  - Attendance tracking
  - Announcements
- **Auth**: Secure JWT cookie sessions + bcrypt passwords
- **Data model**: Full schema for Programs, Departments, Subjects, Marks, Faculty, etc. (extendable)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client & create DB
npx prisma generate
npx prisma db push

# 3. Seed sample MPGI data
npm run db:seed

# 4. Run development server
npm run dev
```

Open http://localhost:3000

### Demo Logins

| Role          | Email                        | Password     |
|---------------|------------------------------|--------------|
| Super Admin   | admin@mpgi.edu.in            | admin123     |
| College Admin | principal@mpec.mpgi.edu.in   | principal123 |
| Student       | student@mpgi.edu.in          | student123   |

## Project Structure

```
mpgi-erp/
├── prisma/
│   ├── schema.prisma      # Full data model
│   └── seed.ts            # MPGI sample data
├── src/
│   ├── app/
│   │   ├── page.tsx       # Landing
│   │   ├── login/         # Auth
│   │   ├── dashboard/     # Main dashboard
│   │   ├── students/      # SIS
│   │   ├── fees/          # Finance
│   │   ├── attendance/    # Attendance
│   │   ├── admissions/    # Enquiry CRM
│   │   └── api/auth/      # Login/Logout APIs
│   ├── components/        # Sidebar, StatCard
│   └── lib/               # prisma.ts, auth.ts
├── package.json
└── README.md
```

## Roadmap to Production

1. Switch datasource to PostgreSQL (change provider + DATABASE_URL)
2. Add remaining modules: Exams, Timetable, Hostel, Library, Placement, HR
3. Mobile apps (React Native) sharing the same APIs
4. Payment gateway (Razorpay/UPI) integration
5. WhatsApp Business API notifications
6. Role-based UI permissions & audit logs
7. Deploy on AWS/GCP with Kubernetes or Railway/Vercel + managed Postgres

## Tech Stack

- Next.js 15 (App Router) + React 19
- Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- Tailwind CSS + Lucide icons
- jose (JWT) + bcryptjs
- TypeScript

## License

Built for MPGI · Internal use / educational purposes.

---
Maharana Pratap Group of Institutions · Kanpur
