const express = require('express');
const flatted = require('flatted');
const fs = require('fs');
const app = express();
var cors = require('cors');
const config = require('./config.js');
var jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(cors());
let codes = [];
let activities = [];
let users = [];

readDataFromFile();

function getUserFromUserId ( id ) {
  const userFound = users.find( user => user.userId == id );
  return userFound;
}

async function saveToken(token, tokenLife, userId) {
  fs.readFile(__dirname + '/api/token.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      reject(Error("error : " + err));
    } else {
      obj = JSON.parse(data);
      obj.push({
        userId: userId,
        token: token,
        tokenLife: tokenLife
      })
      json = JSON.stringify(obj);
      fs.writeFile(__dirname + '/api/token.json', json, 'utf8', err => {
        if (err) {
          reject(Error("error: " + err));
          return console.error(err);
        }
      });
    }
  })
}

async function isTokenPresent( token, tokenLife, userId ) {
  fs.readFile(__dirname + '/api/token.json', 'utf8', async function readFileCallback(err, data) {
    if (err) {
      return false;
    } else {
      obj = JSON.parse(data);
      obj.forEach( data => {
        if ( data.token == token && data.tokenLife == tokenLife && data.userId == userId ) {
          return true;
        }
      });
      return false;
    }
  })
}

var deleteCode = function ( req, res, next ) {
  const id = req.query.id || req.body.id;
  const type = req.query.type || req.body.type;
  const filePath = __dirname + '/api/' + type + '.json';

  if ( !id ) {
    return res.status(401).send("id is required");
  }
  if ( !type ) {
    return res.status(400).send("type is required");
  }

  fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
    if (err) {
      res.sendStatus(500);
      return;
    } else {
      let obj = JSON.parse(data);
      let idFound = false;
      for (let i = 0; i < obj.length; i++) {
        if (id == obj[i].id) {
          if ( obj[i].userId != req.user.userId ) {
            return res.status(401).send("Unauthorized access")
          }
          idFound = true;
          obj.splice(i, 1);
        }
      }
      if ( !idFound ) {
        return res.status(400).send("id not found");
      }
      let json = JSON.stringify(obj);
      fs.writeFile( filePath, json, 'utf8', ( err ) => {
        if (err) {
          reject(Error("error: " + err));
          console.error(err);
          return res.sendStatus(500);;
        }
        res.sendStatus(200);
      });
    }
  });
}

async function readDataFromFile() {
  try {
    const codesData = await readFileAsync(__dirname + '/api/codes.json');
    const usersData = await readFileAsync(__dirname + '/api/users.json');
    const activitiesData = await readFileAsync(__dirname + '/api/activities.json');

    codes = JSON.parse( codesData );
    users = JSON.parse( usersData );
    activities = JSON.parse( activitiesData );

    codes.forEach( ( code ) => {
      const user = getUserFromUserId(code.userId);
      code.author = user && user.username;
    });

    activities.forEach( ( activity ) => {
      const user = getUserFromUserId(activity.userId);
      activity.author = user && user.username;
    });

  } catch (err) {
    console.error(err);
  }
}

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function writeToFile( req, res, fileName ) {
  dataToUpdate = req.body;
  dataToUpdate.addTime = new Date();
  const filePath = __dirname + '/api/' + fileName + '.json';
  let obj = {};
  fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    } else {
      if ( !req.body.id ) {
        obj = JSON.parse(data);
        let testId = 0;

        let foundExisting;
        do {
          foundExisting = obj.find(x => {
            return x.id == testId;
          });
          if (foundExisting) {
            testId++;
          }
        } while (foundExisting);

        dataToUpdate.id = testId;
        dataToUpdate.userId = req.user.userId
        obj.push(dataToUpdate);
      } else {
        const indexToUpdate = activities.findIndex( ( data ) => {
          data.id == dataToUpdate.id
        });
        if ( indexToUpdate == -1 ) {
          return res.status(400).send("Id Not Found");
        }

        obj = JSON.parse(data);
        objIndex = obj.findIndex((obj => obj.id == indexToUpdate));
        if ( !objIndex ) {
          return res.status(400).send("Id Not Found");
        }
        obj[objIndex] = dataToUpdate;
        dataToUpdate.userId = req.user.userId
      }
      let json = JSON.stringify(obj);
      fs.writeFile(filePath, json, 'utf8', err => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
      });
      res.sendStatus(200);
    }
  });
  readDataFromFile();
}

let allowedUrls = [
  '/',
  '/login/',
  '/register/',
  'view',
  '/lab-activities/',
  '/loading/',
  '/codes/',
  '/activities/'
]

function readLogsFromFile() {
  const filePath = __dirname + '/api/logs.json';

  try {
    const data = fs.readFileSync(filePath, 'utf8');

    if (!data.trim()) {
      // File is empty
      return [];
    }

    const logs = JSON.parse(data);
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error('Error reading logs file:', error);
    return [];
  }
}


function writeLogsToFile(logs) {
  const filePath = __dirname + '/api/logs.json';
  const json = JSON.stringify(logs);

  fs.writeFile(filePath, json, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to logs file:', err);
    }
  });
}

function validatePassword(password) {
  return new Promise ( (resolve, reject ) => {
    if (password.length < 8) {
      return reject ("password must be at least 8 characters");
    }

    let hasUpperCase = false;
    let hasSpecialChar = false;
    let hasNumber = false;
  
    for (const char of password) {
      if (char >= 'A' && char <= 'Z') {
        hasUpperCase = true;
      } else if ('!@#$%^&*()_-+=<>?/[]{}|'.includes(char)) {
        hasSpecialChar = true;
      } else if (char >= '0' && char <= '9') {
        hasNumber = true;
      }
    }
    if ( !hasUpperCase ) {
      return reject ("password must contian an uppercase character");
    }
    if ( !hasSpecialChar ) {
      return reject ("password must contian a special character");
    }
    if ( !hasNumber ) {
      return reject ("password must contian a number");
    }
    resolve(true);
  })
} 

function log(req) {
  const logs = readLogsFromFile();

  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers,
  };

  if (req.user) {
    logEntry.user = req.user;
  }

  logs.push(logEntry);
  writeLogsToFile(logs);
}

app.use( async function ( req, res, next ) {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log ( clientIp + ' connected' );
  if( allowedUrls.find ( x => x.toLocaleLowerCase() == req.path.toLocaleLowerCase() ) && req.method.toLowerCase() == 'GET'.toLowerCase() ) {
      log(req)
      next();
    return;
  }
  if ( req.method.toLowerCase() == 'GET'.toLowerCase() ) {
    log(req)
    next();
    return;
  }

  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  if(!token){
    log(req)
    if(!allowedUrls.find(x=> x.toLocaleLowerCase() == req.path.toLocaleLowerCase())){
      res.sendStatus(403);
      return;
    }else{
      next();
      return;
    }
  }
  jwt.verify(token, config.secret, async function(err, decoded) {
    if (err) {
      log(req)
      if(!allowedUrls.find(x=> x.toLocaleLowerCase() == req.path.toLocaleLowerCase())){
        return res.status(401).send("Failed to authenticate token");
      }else{
        next();
      }
    } else {
      req.decoded = decoded;
      if( !decoded.userId ) {
        return res.status(401).send("Invalid token");
      }

      if(decoded.exp < (new Date().getTime()/1000)){
        return res.status(401).send("Exired token")
      }

      if ( !isTokenPresent( token, decoded.tokenLife, decoded.userId ) ) {
        return res.status(401).send("Invalid token");
      }
      req.user = getUserFromUserId(decoded.userId);
      log(req)
      next();
    }
  });
});

app.get('/', (req, res) => {
  readDataFromFile();
  res.sendFile(__dirname + '/public/home/index.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register/register.html');
});

app.post('/register/', async (req, res) => {
  const requiredFields = ['username', 'email', 'password'];

  for (const fieldName of requiredFields) {
    const field = req.body[fieldName];
    if (!field) {
      return res.status(400).send(`${fieldName} is a required field`);
    }
  }

  const { username, email, password } = req.body;

  try {
    await validatePassword(password);

    await readDataFromFile();

    for (const userFound of users) {
      if (userFound.username === username) {
        return res.status(400).send('Username already exists');
      }
      if (userFound.email === email) {
        return res.status(400).send('Email already exists');
      }
    }

    const filePath = __dirname + '/api/users.json';
    let obj = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));

    let testId = 0;
    let foundExisting;

    do {
      foundExisting = obj.find((x) => x.id === testId);
      if (foundExisting) {
        testId++;
      }
    } while (foundExisting);

    const dataToUpdate = { ...req.body, id: testId };
    obj.push(dataToUpdate);

    await fs.promises.writeFile(filePath, JSON.stringify(obj), 'utf8');
    res.sendStatus(200);
  } catch (error) {
    return res.status(400).json(error || 'Validation failed');
  }
  await readDataFromFile();
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login/login.html');
});

app.post('/login/', async (req, res) => {
  let username =  req.body.username;
  let password = req.body.password;
  await readDataFromFile();
  for (let index = 0; index < users.length; index++) {
    const userFound = users[index];
    if (userFound.username == username && userFound.password == password) {
      const payload = {
        username: userFound.username,
        userId: userFound.userId
      };

      let tokenLife = 86400; //86400; //1 day

      var token = jwt.sign(payload, config.secret, {
        expiresIn: tokenLife // expires in 24 hours
      });

      let tokenSaved = await saveToken(token, tokenLife, userFound.userId);
      var data = {
        token : token,
      };

      res.json(data);

      return;
    }
  }

  res.status(401).send({
    message: 'invalid username or password'
  });
});

app.get('/new', (req, res) => {
  res.sendFile(__dirname + '/public/new/new.html');
});

app.get('/view', (req, res) => {
  res.sendFile(__dirname + '/public/view/view.html');
});

app.get('/lab-activities/', (req, res) => {
  readDataFromFile();
  res.sendFile(__dirname + '/public/school/labActivities.html');

});

app.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/public/edit/edit.html');
});

app.get('/loading', (res) => {
  res.sendFile(__dirname + '/assets/loading.json');

});

app.get('/codes/:id', async (req, res) => {
  await readDataFromFile();
  const code = codes.find((c) => c.id === parseInt(req.params.id));
  if (!code) {
    res.status(404).send("Invalid id or the id was not found.");
  }
  const user = code && code.userId && getUserFromUserId(code.userId);
  code.author = user && user.username;
  res.send(code);
});

app.get('/codes', async (req, res) => {
  await readDataFromFile();
  res.send(codes);
});

app.get('/activities/:id', async (req, res) => {
  await readDataFromFile();
  const activity = activities.find((c) => c.id === parseInt(req.params.id));
  if (!activity) {
    res.status(404).send("Invalid id or the id was not found.");
  }
  res.send(activity);
});

app.get('/activities/', async (req, res) => {
  await readDataFromFile();
  res.send(activities);
});

app.post('/save/', (req, res) => {
  let isNew = req.query.new ? true : false;
  let type = req.query.type;

  if ( !req.user.userId ) {
    return res.status(201).send("Unauthorized access");
  }

  writeToFile(req, res, type)
});

app.delete('/delete/', async ( req, res, next ) => {
  // const id = req.query.id;
  // const type = req.query.type;
  if ( !req.user.userId ) {
    return res.status(401).send("Unauthorized access");
  }
  deleteCode( req, res, next );
  readDataFromFile();
});
app.use((req, res) => {
  res.sendFile(__dirname + '/public/404.html');
});
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});