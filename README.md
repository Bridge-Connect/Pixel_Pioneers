# 🌐 EduSign Platform – *Bridge Connect*  
> **Empowering the Deaf and Mute Community with Accessible Learning and Communication**

---

## 🧩 Problem Statement

Deaf and mute individuals face persistent challenges in accessing quality education and seamless communication due to a lack of inclusive tools.  
The absence of real-time, accessible platforms often leads to:
- ❌ Social isolation  
- ❌ Educational inaccessibility  
- ❌ Ineffective communication with the hearing world  

**Existing solutions are fragmented and fail to meet these specific, essential needs in a unified way.**

---

## ✅ Solution: *Bridge Connect – EduSign Platform*

A unified digital platform tailored to **empower the deaf and mute community** by removing key barriers to learning and communication.

### 🚀 Core Features

🔹 **Interactive Learning Paths**  
- **What**: Visually-enriched lessons with sign language avatars and interpreters  
- **Why**: To build fluency and provide accessible educational content for all levels  

🔹 **Live Connect Session**  
- **What**: Real-time Speech-to-Sign and Sign-to-Speech communication using ML APIs  
- **Why**: Enables spontaneous and natural interaction between deaf, mute, and hearing individuals  

🔹 **Sign Language Feature Dictionary**  
- **What**: Searchable dictionary showing sign gestures (video/image) for words or phrases  
- **Why**: Enhances vocabulary and daily communication clarity  

🔹 **Supportive Community Forum** *(Coming Soon)*  
- **What**: Safe space for signed video messaging, sharing, and practice  
- **Why**: Encourages community bonding and peer interaction  

---

## 🔁 Workflow

1. User accesses learning or communication module  
2. Sign language resources and tools are rendered using visual aids and video  
3. Real-time features bridge communication gaps using Web APIs and ML models  
4. Firebase handles auth, database, and storage  
5. Cloudinary manages fast video delivery  

---

## 🛠 Tech Stack

### 🧩 **Frontend Framework**
- **Next.js** – Server-side rendering and static generation  
- **TypeScript** – Type-safe JavaScript

### 🎨 **Styling**
- **Tailwind CSS** – Utility-first styling  
- **PostCSS** – CSS processor

### 🧱 **UI & Components**
- Custom reusable components  
- **Shadcn UI** library

### 🔐 **Authentication**
- **Firebase** – Client and Admin SDK  
- **AuthGuard** – Route protection

### 🗃 **Database & Storage**
- **Firebase Firestore** – Secure real-time database  
- **Cloudinary** – Video/image hosting

### 🧠 **APIs and Features**
- **Speech-to-Text / Text-to-Speech** – Web Speech API  
- **Video Dictionary** – ISLRTC Google Drive Clone

### 📦 **Package Manager**
- **npm** – Fast dependency management

---
## 🗂 Folder Structure

```bash
Pixel_Pioneers/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   ├── globals.css            # Global styles
│   │   ├── login/                 # Login/Register
│   │   ├── dashboard-home/        # User dashboard
│   │   ├── live-communication/    # Real-time chat
│   │   ├── learning-path/         # Lessons
│   │   ├── dictionary/            # Sign dictionary
│   │   └── community-space/       # Forum (coming soon)
│   ├── components/
│   │   ├── auth/                  # Auth UI
│   │   ├── layout/                # Layout elements
│   │   └── ui/                    # Buttons, Cards, etc.
│   └── lib/
│       ├── firebase-client.ts
│       ├── firebase-admin.ts
│       └── utils.ts
├── public/                        # Static files
├── components/                    # Shared UI
├── hooks/                         # Custom React Hooks
└── Configuration files
```


---

## 🌱 Impact

- **🎓 Empowerment** – Access to independent learning & communication  
- **🔗 Inclusion** – Bridging the hearing and non-hearing communities  
- **🌟 Growth & Confidence** – Promotes personal and social development  

---

## 🎥 Demo Video

📺 [Watch the Demo on YouTube](https://youtu.be/-BquolaH8m4)

---

## ⚙️ Setup Instructions
```bash
1️⃣ Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2️⃣ Install Dependencies
Using npm:
npm install
or
Using pnpm:
pnpm install

3️⃣ Configure Environment Variables
Create a .env.local file in the root directory:
env
# Example
NEXT_PUBLIC_API_URL=https://api.example.com
Replace with your actual keys and URLs

4️⃣ Run the Development Server
npm run dev
Visit: http://localhost:3000

5️⃣ Build for Production
npm run build
npm start
