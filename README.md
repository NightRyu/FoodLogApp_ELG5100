# Personal Food Log App

**Course:** ELG5100 – Software Project Management  
**University of Ottawa**

---

## Overview

This project, developed as part of the **ELG5100 course**, is a full-stack web application designed to help users log, analyze, and visualize their daily food intake using **AI-powered food recognition**.  

By uploading a photo of a meal, the app automatically identifies the food items, estimates their nutritional values (calories and macronutrients), and records them in the user’s meal history.  

The system integrates **React (frontend)**, **Node.js + Express (backend)**, and **OpenAI API** for intelligent food recognition.

---

## Key Features

- **AI Food Recognition:**  
  Upload a food image and get automatic analysis of ingredients, calories, and macros.

- **Nutritional Analytics Dashboard:**  
  Visualize daily, weekly, and total calorie consumption through interactive charts.

- **Meal History Tracking:**  
  Stores each user’s meal history for progress and health tracking.

- **Cloud Integration:**  
  Uses AWS (or other cloud services) for image storage and data persistence.

- **User Profiles (Future Implementation):**  
  Personalized dashboards and authentication to separate user data.

- **Modern Architecture:**  
  Built with **React + Vite** on the frontend and **Express + OpenAI SDK** on the backend.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React, TypeScript, Vite | User interface, image upload, results display |
| **Backend** | Node.js, Express | API server for image and AI inference handling |
| **AI Layer** | OpenAI Vision Model | Food recognition and nutritional estimation |
| **Database / Storage** | AWS S3 (planned) | Store user images and logs |
| **Dev Tools** | ESLint, Prettier, TypeScript | Code quality and static checking |

---