# 🌐 EduSign Platform 
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

## ✅ Solution: *EduSign Platform*
<img width="972" height="931" alt="image" src="https://github.com/user-attachments/assets/603030d5-6a72-427e-a65a-44274316ca88" />


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

## 🔄 Workflow & User Journey
<img width="940" height="534" alt="image" src="https://github.com/user-attachments/assets/743a726f-caec-42a8-953c-68e5af0c3cec" />


### User Registration Flow

1. User visits landing page
2. Clicks "Login" button
3. Chooses "Sign Up" option
4. Enters email and password
5. Firebase creates user account
6. User profile created in Firestore
7. Redirected to dashboard

### Communication Workflow

For Hearing Users:
1. Click microphone button
2. Speak into microphone
3. Voice converted to text
4. Text appears in chat
5. Deaf user reads message

For Deaf/Mute Users:
1. Type message in text input
2. Click "Send & Speak"
3. Text converted to speech
4. Hearing user hears message
5. Message saved to database

### Learning Workflow

1. User selects learning category
2. Chooses specific lesson
3. Watches instructional video
4. Completes interactive exercises
5. Progress marked as complete
6. Analytics updated in database

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
