# Whisper Wall

Whisper Wall is an anonymous expression platform where people can share thoughts freely without revealing their identity.

The goal of Whisper Wall is to provide a simple and safe space for honest expression. Users can post messages anonymously and read thoughts shared by others without creating accounts or exposing personal information.

---

## Live Demo

https://whisper-wall-theta.vercel.app

---

## Problem

Many platforms require users to reveal their identity before sharing their thoughts. This often discourages honest expression and open communication.

Whisper Wall removes that barrier by allowing users to post messages anonymously while still maintaining a clean and structured experience.

---

## Features

* Anonymous message posting
* Clean and minimal user interface
* Responsive design for mobile and desktop
* Fast data storage and retrieval
* No account required to participate

---

## Tech Stack

Frontend

* Next.js
* TypeScript
* Tailwind CSS

Backend / Database

* Supabase

Deployment

* Vercel

---

## How It Works

1. A user writes a message.
2. The message is submitted anonymously.
3. The message is stored securely in Supabase.
4. Messages are displayed on the wall for others to read.

No user identity or authentication is required, keeping the experience simple and anonymous.

---

## Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/whisper-wall.git
```

Move into the project directory

```bash
cd whisper-wall
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

The project will run locally at

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

These keys allow the application to connect to the Supabase backend.

---

## Project Structure

```
app/
components/
lib/
public/
styles/
```

* **app** – application routes and pages
* **components** – reusable UI components
* **lib** – utility functions and Supabase configuration
* **public** – static assets and images
* **styles** – global styling

---

## Future Improvements

* Message moderation tools
* Reaction system (likes or hearts)
* Search or filtering
* Dark/light theme toggle
* Report inappropriate posts

---

## Author

Idowu Abdulquadri Olamide

Computer Science Student
Afe Babalola University

Email
[idowuabdulquadri7@gmail.com](mailto:idowuabdulquadri7@gmail.com)

---

## License

This project is open source and available under the MIT License.
