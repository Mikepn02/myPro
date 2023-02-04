const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer')
const mysql2 = require('mysql2');
const { diskStorage } = require('multer');
const port = 7000;

const storage = diskStorage({
  destination: function(req,file,cb){
    cb(null,'public/images/uploaded_image')
  },
  filename: function(req,file,cb){
    cb(null,`${file.originalname}`)
  }
})
const upload = multer({storage})
// Use EJS as the view engine
app.set('view engine', 'ejs');

// Use the body parser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + '/public'));
app.post('/profile',(req,res) => {
  res.redirect('./public/images/uploaded_image')
})

// Routes
app.get('/', (req, res) => {
  res.render('register.ejs');
});

app.get('/login', (req, res) => {
  res.render('login1.ejs');
});

app.post('/login', async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    try {
        // Fetch the user from the database
        const [rows, fields] = await connection.query('SELECT * FROM user_table WHERE email = ?', [email]);

        // Check if the password matches
        const isPasswordCorrect = await bcrypt.compare(password, rows[0].password);
        if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
        }

        res.render('profile.ejs',{});
    } catch (error) {
        console.error(error);
        res.send('Error');
    }
});
app.post('/register', upload.single('profile_pic'),(req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  let pwd = req.body.password;

  let sql = 'INSERT INTO user_table (email, password, name) VALUES (?, ?, ?)';
  connection.query(sql, [email, pwd, username], (err, result) => {
    if (err) console.log(err);
    console.log('Data entered successfully!');
    res.redirect('/login');
  });
});
// Create a database connection
const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
});

connection.connect((err) => {
  if (err) console.log('Error found:', err);

  console.log('Connected to the database!');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
