const express = require('express');
const mongoose = require('mongoose')
const User = require('./model/user')
const jwt = require("jsonwebtoken");

const app = express()

app.use(express.json());

//middleware
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //res.setHeader('Upgrade','websocket');

    // Pass to next layer of middleware
    next();
});


const PORT = process.env.PORT || 5000

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/codevian';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const SECRET_KEY = "secretkey"

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

//test route
app.get('/', (req, res) => {
    res.send(`test route`);
});

//Register a user
app.post('/register', (req, res) => {

    const { name, email, password, phone, address } = req.body;

    const user = new User({ name, email, password, phone, address });

    user.save(err => {
        if (err) {
            res.send(err);
        }
        res.send(`${user.name} added as user successfully`);
    })
});

//Login route
app.post('/login', async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) throw Error('User does not exist');

        const isMatch = password == user.password;
        if (!isMatch) throw Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');

        res.status(200).json({
            token,
            // user: {
            //     id: user._id,
            //     name: user.name,
            //     email: user.email
            // }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//user info
app.get('/userinfo/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            await User.findOne({ _id: req.params.id }, (err, user) => {
                if (err) return res.json(400, {
                    message: `user ${id} not found.`
                });
                res.json({ name: user.name, email: user.email, phone: user.phone, address: user.address, authData });
            })
        }
    });
});

//get all users
app.get('/allusers', verifyToken, (req, res) => {
    result = []
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            await User.find({}, (err, users) => {
                if (err) {
                    res.send(err);
                }
                users.map(user => {
                    result.push({ name: user.name, email: user.email, phone: user.phone, address: user.address })
                })
            })
            res.send(result);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});