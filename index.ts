const express = require('express');
const fs = require('fs');
const app = express();
var cors = require('cors');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
import { NextFunction, Response } from 'express';
import { AppError, ErrorCode } from './src/AppError';
import { User } from './src/User';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(cors());

/**
 * Gets a user from the user ID
 *
 * @param id - The user ID
 * @param users - The list of users
 * @returns Promise<User | undefined>
 */
async function getUserFromUserId ( id: number, users: User[] ): Promise<User | undefined> {
  return users.find( user => user.userid == id );
}

/**
 * Saves a token to the token.json file
 * 
 * @param token - The token to save
 * @param tokenLife - The life of the token
 * @param userId - The user ID associated with the token
 * @returns Promise<void>
 */
async function saveToken(token: string, tokenLife: number, userId: number): Promise<void> {
  const filePath = __dirname + '/api/token.json';
  const data = (await readFileAsync(filePath)) as string;
  const obj = JSON.parse(data);

  obj.push({ userId, token, tokenLife })
  await writeFileAsync(filePath, JSON.stringify(obj));
}

/**
 * Checks if a token is present in the token.json file
 * 
 * @param token - The token to check
 * @param tokenLife - The life of the token
 * @param userId - The user ID associated with the token
 * @returns Promise<boolean>
 */
async function isTokenPresent( token: string, tokenLife: number, userId: number ): Promise<boolean> {
  const filePath = __dirname + '/api/token.json';
  const data = (await readFileAsync(filePath)) as string;
  const obj = JSON.parse(data);

  for (let i = 0; i < obj.length; i++) {
    if (obj[i].token == token && obj[i].tokenLife == tokenLife && obj[i].userId == userId) {
      return true;
    }
  }

  return false;
}

/**
 * Deletes an entity from a JSON file
 * 
 * @param obj - The object containing id, type and user information
 * @param userId - The user ID to check permission against
 * @returns Promise<void>
 */
async function deleteCode(obj: any, userId: number): Promise<void> {
  const id = obj.id;
  const type = obj.type;
  
  // Validate input parameters
  if (!id) {
    throw new AppError("id is missing", ErrorCode.INCOMPLETE_INPUT, "Id is required to delete the entity");
  }
  if (!type) {
    throw new AppError("type is missing", ErrorCode.INCOMPLETE_INPUT, "type of entity is required to delete it");
  }
  
  const filePath = __dirname + '/api/' + type + '.json';
  
  try {
    // Read file contents
    const data = (await readFileAsync(filePath)) as string;
    const entities = JSON.parse(data);
    
    // Find entity to delete
    const entityIndex = entities.findIndex((entity: any) => entity.id == id);
    
    // Check if entity exists
    if (entityIndex === -1) {
      throw new AppError("id not found", ErrorCode.NOT_FOUND, "No entity found with the given id");
    }
    
    // Check if user has permission
    if (entities[entityIndex].userId != userId) {
      throw new AppError("Unauthorized", ErrorCode.UNAUTHORIZED, "You are not authorized to delete this entity");
    }
    
    // Remove entity from array
    entities.splice(entityIndex, 1);
    
    // Write updated data back to file
    const json = JSON.stringify(entities);
    await writeFileAsync(filePath, json);
    
    return;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Error", ErrorCode.SERVER_ERROR, "Error processing delete request");
  }
}

/**
 * Promise-based wrapper for fs.writeFile
 * 
 * @param filePath - Path to the file
 * @param data - Data to write
 * @returns Promise<void>
 */
function writeFileAsync(filePath: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(new AppError("Error", ErrorCode.SERVER_ERROR, "Error writing file"));
      } else {
        resolve();
      }
    });
  });
}

async function readDataFromFile() {
  try {
    const codesData = (await readFileAsync(__dirname + '/api/codes.json')) as string;
    const usersData = (await readFileAsync(__dirname + '/api/users.json')) as string;

    const codes = JSON.parse( codesData );
    const users = JSON.parse( usersData );

    for (const code of codes) {
      const user = getUserFromUserId(code.userId, users);
      if (user instanceof User) {
        code.author = user && user.username;
      }
    }

    return [codes, users];
  } catch (err) {
    console.error(err);
    return [[], [], []];
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

/**
 * Writes data to a JSON file
 * 
 * @param req - The request object
 * @param fileName - The name of the file to write to
 * @param dataToUpdate - The data to write
 * @returns Promise<void>
 */
async function writeToFile(req: any, fileName: string, dataToUpdate: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      dataToUpdate.addTime = new Date(); // add timestamp
      const filePath = __dirname + '/api/' + fileName + '.json';
      
      // Read file contents
      const data = (await readFileAsync(filePath)) as string;
      let entities = JSON.parse(data);
      
      if (!dataToUpdate.id) {
        // Saving new data - generate a new ID
        let existingIds = entities.map((x: any) => x.id);
        let newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 0;
        
        dataToUpdate.id = newId;
        dataToUpdate.userId = req.user.userId;
        entities.push(dataToUpdate);
      } else {
        // Updating existing data
        const entityIndex = entities.findIndex((entity: any) => entity.id === dataToUpdate.id);
        
        if (entityIndex === -1) {
          reject(new AppError("Invalid Id", ErrorCode.NOT_FOUND, "No entity found with the given id"));
          return;
        }
        
        // Check if user has permission
        if (entities[entityIndex].userId !== req.user.userId) {
          reject(new AppError("Unauthorized", ErrorCode.UNAUTHORIZED, "You are not authorized to update this entity"));
          return;
        }
        
        entities[entityIndex] = { ...dataToUpdate, userId: req.user.userId };
      }
      
      // Write updated data back to file
      const json = JSON.stringify(entities);
      await writeFileAsync(filePath, json);
      
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

let allowedUrls = [
  '/',
  '/login/',
  '/register/',
  'view',
  '/loading/',
  '/codes/'
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

function validatePassword(password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
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
    user: undefined
  };

  if (req.user) {
    logEntry.user = req.user;
  }

  logs.push(logEntry);
  writeLogsToFile(logs);
}

app.use( async function ( req, res: Response, next: NextFunction ) {
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
  jwt.verify(token, process.env.SECRET, async function(err, decoded) {
    if (err) {
      log(req)
      if(!allowedUrls.find(x=> x.toLocaleLowerCase() == req.path.toLocaleLowerCase())){
        return res.status(401).send("Failed to authenticate token");
      }else{
        next();
      }
    } else {
      if( !decoded.userId ) {
        return res.status(401).send("Invalid token");
      }

      if(decoded.exp < (new Date().getTime()/1000)){
        return res.status(401).send("Exired token")
      }

      if ( !isTokenPresent( token, decoded.tokenLife, decoded.userId ) ) {
        return res.status(401).send("Invalid token");
      }

      const [_, users, __] = await readDataFromFile();
      req.user = getUserFromUserId(decoded.userId, users);

      log(req)
      next();
    }
  });
});

app.get('/', (req, res) => {
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
    const [users] = await readDataFromFile();
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

});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login/login.html');
});

app.post('/login/', async (req, res) => {
  let username =  req.body.username;
  let password = req.body.password;
  const [_, users, __] = await readDataFromFile();

  for (let index = 0; index < users.length; index++) {
    const userFound = users[index];
    if (userFound.username == username && userFound.password == password) {
      const payload = {
        username: userFound.username,
        userId: userFound.userId
      };

      let tokenLife = 86400; //86400; //1 day

      var token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: tokenLife // expires in 24 hours
      });

      await saveToken(token, tokenLife, userFound.userId);
      var data = { token };

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

app.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/public/edit/edit.html');
});

app.get('/loading', (res) => {
  res.sendFile(__dirname + '/assets/loading.json');
});

app.get('/codes/:id', async (req, res) => {
  const [codes, users] = await readDataFromFile();
  const code = codes.find((c) => c.id === parseInt(req.params.id));
  if (!code) {
    res.status(404).send("Invalid id or the id was not found.");
  }
  const user = code && code.userId && await getUserFromUserId(code.userId, users);
  code.author = user && user.username;
  res.send(code);
});

app.get('/codes', async (req, res) => {
  const [codes] = await readDataFromFile();
  res.send(codes);
});

app.post('/save/', async (req, res) => {
  let type = req.query.type as string;

  if (!req.user || !req.user.userId) {
    return res.status(401).send("Unauthorized access");
  }

  try {
    await writeToFile(req, type, req.body);
    res.status(200).send("Data saved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send("Error saving data");
  }
});

app.delete('/delete/', async ( req, res, next ) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).send("Unauthorized access");
  }

  try {
    const deleteParams = {
      id: req.query.id || req.body.id,
      type: req.query.type || req.body.type
    };
    
    await deleteCode(deleteParams, req.user.userId);
    res.status(200).send("Entity deleted successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send("Internal server error");
  }
});

app.use((req, res) => {
  res.sendFile(__dirname + '/public/404.html');
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});