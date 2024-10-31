# Assessything [WebApp](https://assessything.up.railway.app)

## Overview

**Assessything** is a peer assessment platform designed for students and teachers. Students can assess their peers, while teachers have access to the assessment results. The platform aims to simplify peer evaluations, making them straightforward and accessible in an educational setting. You can also visit the webbapp [here](https://assessything.up.railway.app).

## Features (Until now)

- **Student Login and Assessment**: Students can easily log in and evaluate their peers directly on the platform.
- **Teacher Access**: Teachers can log in to view assessment results, helping them gain insights into student performance and contributions.
- **Role-Based Login System**: Dedicated login pages for students and teachers provide tailored functionality for each role.
- **Google OAuth Login**: Users can conveniently log in using their Google accounts.
- **Student page**: When students log in to their pages, they see a list that includes the name of their teammates. By clicking on the names, they have the option to evaluate their teammates.
- **Evaluation page**: Divided into two pages. The first page is the evaluation of the teammates cooperation from 0 to 5. The second page is the evaluation of the teammates contributions in a project.
- **Confirmation page**: A page showing a message that your evaluation has been submitted.
- **Teacher page**: Once the teacher log in to his/her page he/she can create team, and assign students to specific groups.


## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (EJS for server-side rendering)
- **Styling**: A dark theme for a focused and simple user interface
- **Backend**: EJS templates handle the views and server-side logic

## Usage

- **Signup/Login**: Users can sign up or log in using an email and password or via Google OAuth.
- **Select Role**: Upon login, users select their role (student or teacher) to proceed to the appropriate portal.
- **Peer Assessment**: Students complete assessments for their peers. Teachers can access these results for their records and analysis.

## File Structure

- `index.ejs`: Homepage where users can choose their role.
- `signup.ejs`: Page for new users to create an account.
- `student-login.ejs` and `teacher-login.ejs`: Login pages for students and teachers.
- `script.js`: Client-side functionality for smooth animations and redirections.
- `styles.css`: Styling for a consistent dark-themed user experience.

## License

This project is licensed under the Concordia GinaCody Union License.

## Contact

For any questions, please reach out to [Assessything Team](mailto:p.hejazi@gmail.com).
