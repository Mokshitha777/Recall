## Product Write-Up

### 1. Problem and Target Users
Recall — Learn From Every Round is a personal, AI-powered interview preparation workspace for students and job seekers. Interview experiences, feedback, and learning goals are often scattered across notes and platforms, making it difficult to identify recurring mistakes and track improvement. Recall brings interview records, learning progress, and AI-assisted feedback into one place so users can turn every interview into a learning opportunity.

### 2. Key Product Decisions
- **A unified workspace:** Interview experiences and learning topics are managed in one application, helping users connect past performance with future preparation.
- **AI-powered coaching:** Recall includes an AI Coach that analyzes interview responses and provides feedback, helping users reflect on their answers and identify areas for improvement.
- **A focused, simple interface:** The application prioritizes essential workflows—recording experiences, tracking learning, and reviewing feedback—rather than overwhelming users with unnecessary features.

### 3. Scope and Future Improvements
To keep the first version focused, I left out advanced analytics, collaborative study groups, automated interview scheduling, and integrations with external job platforms. With more time, I would add progress visualizations, personalized study plans based on past interviews, mock interview simulations, and reminders for learning goals. I would also improve automated testing and monitoring for the deployed application.

### 4. Development Challenges and Learnings
Deploying a full-stack application introduced challenges beyond local development. The frontend initially continued to call `localhost` after deployment, preventing it from reaching the hosted backend. After updating the API base URL, browser CORS restrictions blocked cross-origin requests from Vercel. I updated the Spring Security CORS configuration to allow the deployed frontend and redeployed the backend. I also configured a hosted PostgreSQL database and environment variables for deployment. These issues reinforced the importance of testing the complete application in its production environment, not just on a local machine.
