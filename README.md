# Personal Food Log App

**Group 1** Yifei Xie, Zongkai Tong, Peihan Li  
**Course:** ELG5100 – Software Project Management  
**University of Ottawa**

---

## Overview

This project, developed as part of the **ELG5100 course**, is a full-stack web application designed to help users log, analyze, and visualize their daily food intake using **AI-powered food recognition**.  

By uploading a photo of a meal, the app automatically identifies the food items, estimates their nutritional values (calories and macronutrients), and records them in the user’s meal history.  

The system integrates **React (frontend)**, **Node.js + Express (backend)**, and **OpenAI API** for intelligent food recognition.

---

## Prerequisites

Before running the demo, ensure you have:

| Requirement | Version |
|--------------|----------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| OpenAI API Key | Required |
| Git | (optional, for cloning) |

---

## 1. Download the Project

### Option 1 – Clone from GitHub
```bash
git clone https://github.com/NightRyu/FoodLogApp_ELG5100.git
cd FoodLogApp_ELG5100
```

### Option 2 – Manual Download

Go to the GitHub repository page.


Click Code → Download ZIP.  


Extract the ZIP file and open the folder in your terminal or VS Code.  


## 2. Install Dependencies

After downloading or cloning the repository, open a terminal inside the project root directory and run:  

```bash
npm install  
```

---

## 3. Configure Environment Variables

Before running the application, you must provide your **OpenAI API Key**.  
Create a `.env` file in the project root directory (same level as `package.json`):

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## 4. Run the Application

This project includes both a backend server (API) and a frontend client (React app).  
Execute the command in the terminal:  
```bash
npm run dev
```

## 5. Run the Demo

1. Open your browser and visit [http://localhost:5173](http://localhost:5173).  
2. Click the AI Scanning Button.
3. Upload a food image.  
4. Wait for the AI to analyze the picture and return the food name, ingredients, and nutrition information.  
5. Review the results and history logs in the dashboard.  
6. (Optional) add them into your meal list.
