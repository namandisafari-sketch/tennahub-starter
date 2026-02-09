# TennaHub - Multi-Tenant Business Management Platform

## Project Overview
Build a comprehensive, multi-tenant SaaS business management platform tailored for the Ugandan market. The platform supports multiple business types including schools, retail shops, restaurants, healthcare facilities, rental properties, and service-based businesses.

---

## Core Platform Features

### 1. Multi-Tenancy & Authentication
- Multi-tenant architecture with complete data isolation per tenant
- Role-based access control (superadmin, admin, owner, staff, parent, renter)
- Staff permissions system with module-level access control
- Branch/location management for businesses with multiple sites
- Subscription packages with trial periods and expiry management
- Referral code system for tenant acquisition
- Admin invitation system for onboarding new platform administrators

### 2. User Portals
- **Admin Portal**: Platform-wide management for superadmins
- **Business Portal**: Full business operations management
- **Parent Portal**: View student info, fees, report cards, discipline cases
- **ECD Parent Portal**: Child-friendly design for early childhood parents
- **Renter Portal**: Property tenants can view leases, payments, maintenance

### 3. PWA & Mobile Features
- Progressive Web App with offline capabilities
- Install prompts for mobile devices
- Push notifications via Firebase
- Capacitor integration for Android builds
- Fullscreen mode toggle
- Keyboard shortcuts support
- Network status indicator

---

## School Management Module

### Academic Management
- **Classes**: Class management with levels (Nursery, Primary, O-Level, A-Level)
- **Subjects**: Subject management with teacher assignments
- **Academic Terms**: Term/semester configuration with date ranges
- **Timetable**: Class schedule management
- **School Holidays**: Holiday calendar management

### Student Management
- **Student Enrollment**: Comprehensive enrollment forms with photo upload
- **Student Lifecycle**: Track student status (active, graduated, transferred, expelled)
- **Returning Students**: Re-enrollment workflow for returning students
- **Student ID Cards**: Generate and print student ID cards with QR codes
- **UNEB Candidates**: Uganda National Examinations Board registration management
- **Boarding Status**: Day scholar vs boarder tracking

### Fees & Payments
- **Fee Structures**: Define fees by level, term, and type
- **Student Fees**: Assign and track individual student fees
- **Fee Payments**: Record payments with multiple payment methods
- **Payment Queue**: Bursar queue management system
- **Receipt Printing**: Thermal receipt generation
- **QR Code Payments**: Fee payment via QR code scanning
- **Bursar Rules**: Automated rules for fee-based access control
- **Red List System**: Students with outstanding balances flagged

### Report Cards
- **O-Level Report Cards**: Standard Ugandan O-Level format
- **A-Level Report Cards**: A-Level specific grading system
- **ECD Report Cards**: Early childhood development reports with activity ratings
- **Batch Export**: Export multiple report cards as PDFs
- **Rank Calculation**: Automatic class and stream ranking

### Marks & Grading
- **Marks Entry**: Teacher marks entry per subject/exam
- **Exam Sessions**: Configure exam periods (BOT, MOT, EOT)
- **Exam Results Import**: Bulk import from Excel/JSON
- **Blocked Exam Access**: Block students from viewing results based on fees

### Attendance & Gate Management
- **Gate Check-in**: QR code-based student arrival/departure tracking
- **Late Arrival Tracking**: Automatic flagging of late students
- **Visitor Register**: Track visitors to the school
- **Override Requests**: Staff can request access overrides for blocked students
- **Early Departure Requests**: Parent/staff requests for early pickup

### Communication
- **Letters**: Generate official school letters with templates
- **Letter Settings**: Customize letterhead, signatures, stamps
- **Parent Notifications**: Real-time notifications to parents
- **Discipline Cases**: Track and manage student discipline incidents

### Admissions
- **Admission Links**: Generate public admission forms
- **Self-Admission**: Public form for parent/guardian submissions
- **Admission Confirmations**: Review and approve admission applications
- **Admission Settings**: Configure required documents, fees

### ECD (Early Childhood Development)
- **ECD Pupils**: Manage nursery/kindergarten students
- **Learning Areas**: Curriculum areas for early childhood
- **Learning Activities**: Track developmental activities
- **Rating Scales**: Age-appropriate grading (Excellent, Good, Needs Improvement)
- **ECD Report Cards**: Visual, child-friendly progress reports
- **Skills Assessment**: Track developmental milestones
- **Monthly Attendance**: Calendar-based attendance for young children

### Staff Management
- **Staff Profiles**: Employee records with roles and departments
- **Teacher Assignments**: Link teachers to subjects and classes
- **Staff Permissions**: Granular module access control
- **Staff Import**: Bulk import from Excel

### Requirements & Assets
- **Term Requirements**: Items students need per term
- **School Assets**: Track school property and equipment

---

## Retail & POS Module

### Point of Sale
- **POS Interface**: Fast checkout with barcode scanning
- **Product Search**: Quick product lookup
- **Cart Management**: Add, remove, adjust quantities
- **Split Payments**: Multiple payment methods per transaction
- **Layaway**: Deposit-based purchase holds
- **Returns & Exchanges**: Process product returns

### Inventory
- **Products**: Product catalog with variants
- **Categories**: Product categorization
- **Barcode Support**: Generate and scan barcodes
- **Stock Alerts**: Low stock notifications
- **Stock Levels**: Track inventory quantities
- **Internal Usage**: Record items used internally

### Sales & Customers
- **Sales Records**: Complete transaction history
- **Customer Profiles**: Customer database with credit management
- **Customer Payments**: Track credit account payments
- **Customer Favorites**: Quick reorder for repeat customers
- **Credit Limits**: Control customer credit exposure

### Receipts
- **Print Receipts**: Thermal and A4 receipt printing
- **Digital Receipts**: WhatsApp/SMS receipt sharing
- **Receipt Settings**: Customize receipt format and branding
- **QR Codes**: Payment and receipt QR codes

---

## Restaurant Module

### Table Management
- **Tables**: Configure restaurant tables/seating
- **Table Status**: Track occupied, reserved, available
- **QR Ordering**: Customers scan table QR to order

### Menu & Orders
- **Menu Items**: Food and beverage catalog
- **Menu Categories**: Organize by food type
- **Order Types**: Dine-in, takeaway, delivery
- **Order Cart**: Build customer orders
- **Kitchen Display System**: Real-time order queue for kitchen
- **Order Status**: Track pending, preparing, ready, served

### Kitchen Operations
- **Kitchen Tickets**: Print/display kitchen orders
- **Preparation Timers**: Track order preparation time
- **Order Priority**: Urgent order flagging

---

## Rental Property Module

### Property Management
- **Properties**: Building/property records
- **Units**: Individual rentable units
- **Unit Types**: Categorize by size, amenities

### Tenant Management
- **Rental Tenants**: Tenant profiles and contacts
- **Leases**: Lease agreements with terms
- **Tenant ID Cards**: Generate tenant identification

### Payments & Maintenance
- **Rental Payments**: Track rent payments
- **Payment Proofs**: Upload payment evidence
- **Payment Reminders**: Automated payment notifications
- **Maintenance Requests**: Track repair requests
- **Rental Tax Dashboard**: Tax reporting for landlords

---

## Healthcare Module

### Patient Management
- **Patients**: Patient records and history
- **Prescriptions**: Medical prescriptions
- **Pharmacy Integration**: Link to inventory for medications

---

## Repair/Service Module

### Job Management
- **Jobs**: Service/repair job tracking
- **Job Tickets**: Printable job receipts
- **Spare Parts**: Parts inventory for repairs
- **Job Status**: Track repair progress

---

## Hotel Module

### Room Management
- **Hotel Rooms**: Room inventory and types
- **Room Bookings**: Reservation system
- **Booking Status**: Track check-in/out

---

## Accounting Module

### Chart of Accounts
- **Account Types**: Assets, Liabilities, Equity, Revenue, Expenses
- **Sub-accounts**: Hierarchical account structure
- **Account Balances**: Track account balances

### Financial Operations
- **Expenses**: Record business expenses
- **Transaction Recording**: Double-entry bookkeeping
- **Payroll**: Employee salary management
- **Financial Statements**: Generate P&L, Balance Sheet
- **Tax Calculator**: Uganda tax calculations

### Requisitions
- **Requisition Forms**: Internal purchase requests
- **Approval Workflow**: Multi-level approval process
- **Requisition Settings**: Configure approval rules

---

## Admin Portal Features

### Tenant Management
- **Tenant List**: View all registered businesses
- **Tenant Details**: Deep dive into tenant data
- **Create Business**: Admin-initiated tenant creation
- **Subscription Management**: Manage tenant subscriptions

### Platform Configuration
- **Packages**: Subscription package management
- **School Packages**: Education-specific pricing
- **Rental Packages**: Property management pricing
- **Feature Flags**: Toggle platform features

### Monitoring & Maintenance
- **System Health**: Platform status monitoring
- **Audit Logs**: Track admin actions
- **Storage Management**: File storage overview
- **Backups**: Database backup management
- **Sponsors**: Platform sponsor management

---

## Import/Export Features

### Excel Import System
- **Smart Column Matching**: AI-assisted column mapping
- **Students Import**: Bulk student enrollment
- **Staff Import**: Bulk staff creation
- **Fees Import**: Bulk fee structure setup
- **Classes Import**: Bulk class creation
- **Subjects Import**: Bulk subject setup
- **Attendance Import**: Historical attendance data
- **Parents Import**: Guardian information
- **Inventory Import**: Product catalog import
- **Exam Results Import**: UNEB and internal exam results

### Export Features
- **Data Backup**: Full tenant data export
- **Report Cards PDF**: Bulk PDF generation
- **Receipts**: PDF receipt generation

---

## UI/UX Features

### Design System
- **Dark/Light Mode**: Theme toggle with system preference
- **Responsive Design**: Mobile-first approach
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui Components**: Consistent component library
- **Lucide Icons**: Modern icon set

### Navigation
- **Sidebar Navigation**: Collapsible business sidebar
- **Mobile Bottom Nav**: Touch-friendly mobile navigation
- **Breadcrumbs**: Navigation context
- **Scroll Progress**: Page progress indicator

### Interactions
- **Toast Notifications**: Action feedback
- **Loading States**: Skeleton loaders
- **Form Validation**: Zod-based validation
- **Keyboard Shortcuts**: Power user shortcuts
- **Fullscreen Mode**: Distraction-free interface

---

## Technical Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS
- Shadcn/ui component library
- TanStack Query for data fetching
- React Router for navigation
- React Hook Form with Zod validation
- Recharts for data visualization

### Backend (Lovable Cloud/Supabase)
- PostgreSQL database
- Row Level Security (RLS) for multi-tenancy
- Edge Functions for custom logic
- Real-time subscriptions
- File storage for documents and images

### Mobile
- Capacitor for native Android builds
- PWA support with service workers
- Firebase for push notifications

---

## Business Types Supported

1. **Schools** (Primary, Secondary, ECD)
2. **Retail Shops** (General merchandise, electronics)
3. **Restaurants** (Dine-in, takeaway)
4. **Pharmacies** (Healthcare + inventory)
5. **Hardware Stores** (With repair services)
6. **Rental Properties** (Landlord management)
7. **Hotels** (Room bookings)
8. **Clinics** (Patient management)
9. **Service Centers** (Repair shops)

---

## Localization

- **Currency**: Uganda Shillings (UGX) formatting
- **Date Formats**: East African conventions
- **Phone Numbers**: Uganda phone format validation
- **Tax Compliance**: URA tax integration ready
- **UNEB Integration**: National exam board compatibility

---

## Security Features

- Row Level Security on all tables
- Tenant data isolation
- Role-based access control
- Audit logging
- Secure authentication flows
- API key management for integrations
