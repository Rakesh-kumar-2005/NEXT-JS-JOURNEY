# 🖼️ PIXXEL - AI Image Editor  

This project is an AI-powered Image Editor built with Next.js, combining essential editing tools with advanced AI enhancements for a modern web experience. Users can easily perform tasks like cropping, resizing, brightness/contrast adjustments, and applying filters, while pro users gain access to AI features such as background removal, touch-ups, and automated image enhancement.

The platform is powered by Convex for real-time database functions and Clerk for secure authentication. Media handling is optimized with ImageKit and enriched through the Unsplash API for stock image sourcing. At its core, Fabric.js manages the canvas, enabling flexible editing states and smooth interactions.

---

## 🚀 Live Demo  

[https://pixxel-azure.vercel.app](https://pixxel-azure.vercel.app)  

---

## 🛠️ Tech Stack  

- ▲ **Next.js** – React-based framework for full-stack apps with SSR/SSG...  
- 🔐 **Clerk** – Authentication & user management...
- 🗄️ **Convex** – Real-time database & backend functions...  
- 🖼️ **Fabric.js** – Canvas state management (resize, crop, adjust, filters)...  
- 📸 **Unsplash API** – Free stock images integration...
- 📦 **ImageKit** – Media optimization & delivery...
- 🤖 **AI Services** – Background remover, AI touch-up, image enhancement...  

---

## 📸 Screenshots

### 🗼 Hero Section Preview
![Heropage](https://raw.githubusercontent.com/Rakesh-kumar-2005/NEXT-JS-JOURNEY/main/PIXXEL/public/ss1.png)

### 🎮 Feature Section Preview
![Feature Section](https://raw.githubusercontent.com/Rakesh-kumar-2005/NEXT-JS-JOURNEY/main/PIXXEL/public/ss2.png)


### 🏙️ Dashboard Section View
![Dashboard View](https://raw.githubusercontent.com/Rakesh-kumar-2005/NEXT-JS-JOURNEY/main/PIXXEL/public/ss3.png)

### 🏙️ Editor Section View
![Mobile View](https://raw.githubusercontent.com/Rakesh-kumar-2005/NEXT-JS-JOURNEY/main/PIXXEL/public/ss4.png)

### 🏙️ AI Feature Section View
![Mobile View](https://raw.githubusercontent.com/Rakesh-kumar-2005/NEXT-JS-JOURNEY/main/PIXXEL/public/ss5.png)

---

## 📦 Features  

### 🆓 Free Features  
- Resize, crop, rotate, and flip images ✂️...
- Brightness, contrast, saturation adjustments 🎚️...  
- Add text, shapes, and stickers 📝...
- Drag-and-drop image uploads 📥...
- Fetch stock images via **Unsplash API** 📸...  

### 🌟 Pro Features (AI-Powered)  
- Background remover 🪄...
- AI touch-up for blemish removal ✨...  
- Image enhancement (clarity, sharpness, HDR effects) ⚡...  
- Smart object detection & auto-adjust 🎯...

---

## 📚 Getting Started  

To run this project locally:  

```bash
git clone https://github.com/Rakesh-kumar-2005/NEXT-JS-JOURNEY.git
cd NEXT-JS-JOURNEY/PIXXEL
npm install
npm run dev

# Deployment used by `npx convex dev`...
# Add this to your .env file and your secret keys...
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

CLERK_JWT_ISSUER_DOMAIN=

# Imagekit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=
