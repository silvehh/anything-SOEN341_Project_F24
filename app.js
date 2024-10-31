const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const csv = require('fast-csv');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Set up view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'veeeerrrryyyyyyyy_secure_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Utility functions
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    if (!fs.existsSync(filePath)) {
      return resolve(data);
    }

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true, trim: true }))
      .on('error', error => reject(error))
      .on('data', row => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      });
  });
}

function appendToCSV(filePath, data, headers) {
  return new Promise((resolve, reject) => {
    let writeHeaders = false;

    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
      writeHeaders = true; // File doesn't exist or is empty
    }

    const ws = fs.createWriteStream(filePath, { flags: 'a' });

    const csvStream = csv.format({
      headers: writeHeaders ? headers : false,
      includeEndRowDelimiter: true,
    });

    csvStream
      .pipe(ws)
      .on('finish', resolve)
      .on('error', error => {
        console.error('Error writing to CSV file:', error);
        reject(error);
      });

    csvStream.write(data);
    csvStream.end();
  });
}

// Routes
app.get('/', (req, res) => {
  const signup = req.query.signup;
  res.render('index', { signup });
});

app.get('/signup', (req, res) => {
  const error = req.query.error;
  res.render('signup', { error });
});

app.post('/signup-process', async (req, res) => {
  const { name, email, password, role } = req.body;
  const filePath = path.join(__dirname, 'data', role === 'teacher' ? 'teachers.csv' : 'students.csv');

  try {
    const users = fs.existsSync(filePath) ? await readCSV(filePath) : [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
      return res.redirect('/signup?error=exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { name, email, password: hashedPassword };
    const headers = ['name', 'email', 'password'];

    await appendToCSV(filePath, newUser, headers);

    res.redirect('/?signup=success');
  } catch (error) {
    console.error('Error during signup:', error.stack);
    res.status(500).send('Error signing up, please try again.');
  }
});

app.get('/student-login', (req, res) => {
  const error = req.query.error;
  res.render('student-login', { error });
});

app.get('/teacher-login', (req, res) => {
  const error = req.query.error;
  res.render('teacher-login', { error });
});

app.post('/student-login', async (req, res) => {
  const { email, password } = req.body;
  const filePath = path.join(__dirname, 'data', 'students.csv');

  try {
    const users = await readCSV(filePath);
    const user = users.find(user => user.email === email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.student = { name: user.name, email: user.email };
        return res.redirect('/teammates');
      }
    }

    res.redirect('/student-login?error=invalid_credentials');
  } catch (error) {
    console.error('Error during student login:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.post('/teacher-login', async (req, res) => {
  const { email, password } = req.body;
  const filePath = path.join(__dirname, 'data', 'teachers.csv');

  try {
    const users = await readCSV(filePath);
    const user = users.find(user => user.email === email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.teacher = { name: user.name, email: user.email };
        return res.redirect('/teacher-dashboard');
      }
    }

    res.redirect('/teacher-login?error=invalid_credentials');
  } catch (error) {
    console.error('Error during teacher login:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

// Middleware for authentication
function requireStudentLogin(req, res, next) {
  if (req.session.student) {
    next();
  } else {
    res.redirect('/student-login');
  }
}

function requireTeacherLogin(req, res, next) {
  if (req.session.teacher) {
    next();
  } else {
    res.redirect('/teacher-login');
  }
}

// Student routes
app.get('/teammates', requireStudentLogin, async (req, res) => {
  try {
    const studentEmail = req.session.student.email;
    const groupMembers = await readCSV(path.join(__dirname, 'data', 'GroupMembers.csv'));
    const studentGroups = groupMembers.filter(member => member.StudentEmail === studentEmail);

    if (studentGroups.length === 0) {
      return res.send('You are not assigned to any group.');
    }

    const groupID = studentGroups[0].GroupID;

    const groupMembersInSameGroup = groupMembers.filter(member => member.GroupID === groupID);

    const students = await readCSV(path.join(__dirname, 'data', 'students.csv'));

    const teammates = groupMembersInSameGroup
      .map(member => students.find(student => student.email === member.StudentEmail))
      .filter(student => student && student.email !== studentEmail); // Exclude current student

    res.render('teammates', { user: req.session.student, teammates });
  } catch (error) {
    console.error('Error fetching teammates:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.get('/evaluate', requireStudentLogin, async (req, res) => {
  const evaluateeEmail = req.query.evaluateeEmail;

  try {
    const students = await readCSV(path.join(__dirname, 'data', 'students.csv'));
    const evaluatee = students.find(student => student.email === evaluateeEmail);

    if (!evaluatee) {
      return res.status(404).send('Teammate not found.');
    }

    res.render('Evaluation', { evaluatee });
  } catch (error) {
    console.error('Error during evaluation:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.post('/submit-feedback', requireStudentLogin, (req, res) => {
  const { evaluateeEmail, rating } = req.body;

  req.session.evaluation = {
    evaluateeEmail,
    rating,
  };

  res.redirect('/student_Dimen_As');
});

app.get('/student_Dimen_As', requireStudentLogin, async (req, res) => {
  if (!req.session.evaluation) {
    return res.redirect('/teammates');
  }

  const evaluateeEmail = req.session.evaluation.evaluateeEmail;

  try {
    const students = await readCSV(path.join(__dirname, 'data', 'students.csv'));
    const evaluatee = students.find(student => student.email === evaluateeEmail);

    if (!evaluatee) {
      return res.status(404).send('Teammate not found.');
    }

    res.render('student_Dimen_As', { evaluatee });
  } catch (error) {
    console.error('Error during dimension assessment:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.post('/submit-dimensions', requireStudentLogin, async (req, res) => {
  if (!req.session.evaluation) {
    return res.redirect('/teammates');
  }

  const { q1, q2, q3 } = req.body;
  const { evaluateeEmail, rating } = req.session.evaluation;
  const evaluatorEmail = req.session.student.email;

  try {
    const groupMembers = await readCSV(path.join(__dirname, 'data', 'GroupMembers.csv'));

    const evaluatorGroups = groupMembers.filter(member => member.StudentEmail === evaluatorEmail);
    const evaluateeGroups = groupMembers.filter(member => member.StudentEmail === evaluateeEmail);

    const evaluatorGroupIDs = evaluatorGroups.map(member => member.GroupID);
    const evaluateeGroupIDs = evaluateeGroups.map(member => member.GroupID);

    const commonGroupIDs = evaluatorGroupIDs.filter(id => evaluateeGroupIDs.includes(id));

    if (commonGroupIDs.length === 0) {
      return res.status(400).send('You and the evaluatee are not in the same group.');
    }

    const groupID = commonGroupIDs[0];

    const evaluationData = {
      EvaluatorEmail: evaluatorEmail,
      EvaluateeEmail: evaluateeEmail,
      GroupID: groupID,
      Rating: rating,
      Q1Answer: q1,
      Q2Answer: q2,
      Q3Answer: q3,
      Timestamp: new Date().toISOString(),
    };

    const headers = [
      'EvaluatorEmail',
      'EvaluateeEmail',
      'GroupID',
      'Rating',
      'Q1Answer',
      'Q2Answer',
      'Q3Answer',
      'Timestamp',
    ];

    await appendToCSV(path.join(__dirname, 'data', 'Evaluations.csv'), evaluationData, headers);

    delete req.session.evaluation;
    res.redirect('/Confirmation_Page');
  } catch (error) {
    console.error('Error submitting evaluation:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.get('/Confirmation_Page', requireStudentLogin, (req, res) => {
  res.render('Confirmation_Page');
});

// Teacher routes
app.get('/teacher-dashboard', requireTeacherLogin, async (req, res) => {
  try {
    const teacherEmail = req.session.teacher.email;
    const groups = await readCSV(path.join(__dirname, 'data', 'Groups.csv'));
    const groupMembers = await readCSV(path.join(__dirname, 'data', 'GroupMembers.csv'));
    const students = await readCSV(path.join(__dirname, 'data', 'students.csv'));
    const evaluations = await readCSV(path.join(__dirname, 'data', 'Evaluations.csv'));

    const teacherGroups = groups.filter(group => group.TeacherEmail === teacherEmail);

    // For each group, get the students and their evaluations
    const groupsWithDetails = teacherGroups.map(group => {
      const members = groupMembers.filter(member => member.GroupID === group.GroupID);
      const studentsInGroup = members.map(member => {
        const student = students.find(s => s.email === member.StudentEmail);
        if (student) {
          // Get evaluations for this student in this group
          const studentEvaluations = evaluations.filter(evaluation =>
            evaluation.EvaluateeEmail === student.email && evaluation.GroupID === group.GroupID
          );

          // Calculate average rating
          const ratings = studentEvaluations.map(evaluation => parseFloat(evaluation.Rating));
          const averageRating =
            ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 'N/A';

          return {
            ...student,
            evaluations: studentEvaluations,
            averageRating: averageRating,
          };
        }
      }).filter(Boolean); // Remove undefined entries

      return {
        ...group,
        students: studentsInGroup,
      };
    });

    res.render('teacher-dashboard', { teacher: req.session.teacher, groups: groupsWithDetails });
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

// Route to fetch student evaluations via AJAX
app.get('/student-evaluations', requireTeacherLogin, async (req, res) => {
  const { groupID, studentEmail } = req.query;

  try {
    const evaluations = await readCSV(path.join(__dirname, 'data', 'Evaluations.csv'));
    const students = await readCSV(path.join(__dirname, 'data', 'students.csv'));

    const student = students.find(s => s.email === studentEmail);

    if (!student) {
      return res.status(404).send('Student not found.');
    }

    const studentEvaluations = evaluations.filter(
      evaluation => evaluation.EvaluateeEmail === studentEmail && evaluation.GroupID === groupID
    );

    res.render('partials/student-evaluations', { evaluations: studentEvaluations });
  } catch (error) {
    console.error('Error fetching student evaluations:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.post('/create-group', requireTeacherLogin, async (req, res) => {
  const { groupName } = req.body;
  const teacherEmail = req.session.teacher.email;

  try {
    const groupID = Date.now().toString();

    const newGroup = {
      GroupID: groupID,
      GroupName: groupName,
      TeacherEmail: teacherEmail,
    };

    const headers = ['GroupID', 'GroupName', 'TeacherEmail'];

    await appendToCSV(path.join(__dirname, 'data', 'Groups.csv'), newGroup, headers);

    res.redirect('/teacher-dashboard');
  } catch (error) {
    console.error('Error creating group:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

app.post('/assign-students', requireTeacherLogin, async (req, res) => {
  const { groupID, studentEmails } = req.body; // studentEmails is a comma-separated string

  try {
    const emailsArray = studentEmails.split(',').map(email => email.trim());
    const entries = emailsArray.map(email => ({ GroupID: groupID, StudentEmail: email }));

    const headers = ['GroupID', 'StudentEmail'];

    const appendPromises = entries.map(entry =>
      appendToCSV(path.join(__dirname, 'data', 'GroupMembers.csv'), entry, headers)
    );

    await Promise.all(appendPromises);

    res.redirect('/teacher-dashboard');
  } catch (error) {
    console.error('Error assigning students to group:', error.stack);
    res.status(500).send('An error occurred, please try again.');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out.');
    }
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});