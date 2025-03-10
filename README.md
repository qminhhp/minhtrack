# MinhTrack - Website Visitor Tracking System

MinhTrack is a comprehensive website visitor tracking system that allows you to monitor user behavior and interactions across your websites. It provides detailed analytics and insights into your website visitors.

## Features

- **User Tracking**: Track visitor behavior, including page views, interactions, and more
- **Real-time Monitoring**: See active users and their current session data
- **Interaction Analytics**: Track click-through rates on all contact channels
- **User Profiles**: Detailed visitor data including IP, browser, location, and more
- **Website Management**: Add and manage multiple websites for tracking

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, PostgreSQL
- **Authentication**: JWT-based authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/minhtrack.git
   cd minhtrack
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   # PostgreSQL Database Configuration
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_HOST=your_postgres_host
   POSTGRES_PORT=5432
   POSTGRES_DATABASE=your_postgres_database
   POSTGRES_SSL=false  # Set to true for production

   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key

   # Email Configuration
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@yourdomain.com

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Set up the database:
   ```
   npm run setup-db
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses PostgreSQL for data storage. The database schema includes tables for:

- Users
- Websites
- Visitors
- Visits
- Pageviews
- Events

You can set up the database using the provided script:

```
npm run setup-db
```

This will create all the necessary tables in your PostgreSQL database.

## Authentication

The application uses JWT-based authentication. When a user signs in, a JWT token is generated and stored in an HTTP-only cookie. This token is used to authenticate subsequent requests.

## Deployment

To deploy the application to production:

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
