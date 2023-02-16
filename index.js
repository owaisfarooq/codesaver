const express = require('express');
const fs = require('fs');
const app = express();
var cors = require('cors');
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
// readActivitiesFromFile();

var deleteCode = function(id, type) {
  return new Promise(function(resolve, reject) {
    if (type == 'codes') {
      fs.readFile(__dirname + '/api/codes.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
          reject(Error("error : " + err));
        } else {
          obj = JSON.parse(data);
          for (let i = 0; i < obj.length; i++) {
            if (id == obj[i].id) {
              obj.splice(i, 1);
            }
          }
          json = JSON.stringify(obj);
          fs.writeFile(__dirname + '/api/codes.json', json, 'utf8', err => {
            if (err) {
              reject(Error("error: " + err));
              return console.log(err);
            }
          });
        }
      });
      resolve("success");
    } else if (type == 'activities') {
      fs.readFile(__dirname + '/api/activities.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
          reject(Error("error : " + err));
        } else {

          obj = JSON.parse(data);
          for (let i = 0; i < obj.length; i++) {
            if (id == obj[i].id) {
              obj.splice(i, 1);
            }
          }
          json = JSON.stringify(obj);
          fs.writeFile(__dirname + '/api/activities.json', json, 'utf8', err => {
            if (err) {
              reject(Error("error: " + err));
              return console.log(err);
            }
          });
        }
      });
      resolve("success");
    }
  });
}

// function deleteCode(id) {

//   fs.readFile(__dirname + '/api/codes.json', 'utf8', function readFileCallback(err, data) {
//     if (err) {
//       console.log(err);
//     } else {

//       obj = JSON.parse(data);
//       for (let i = 0; i < obj.length; i++) {
//         if (id == obj[i].id) {
//           obj.splice(i, 1);
//         }
//       }
//       json = JSON.stringify(obj);
//       fs.writeFile(__dirname + '/api/codes.json', json, 'utf8', err => {
//         if (err) {
//           return console.log(err);
//         }
//       });
//     }
//   });
// }

async function readDataFromFile() {
  fs.readFile(__dirname + '/api/codes.json', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }
    codes = JSON.parse(data);
  });
  fs.readFile(__dirname + '/api/users.json', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }
    users = JSON.parse(data);
  });
  fs.readFile(__dirname + '/api/activities.json', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }
    // console.log("activities" + activities);
    activities = JSON.parse(data);
  });
}

// async function readActivitiesFromFile() {
//   // console.log("readActivitiesFromFile called");
//   fs.readFile(__dirname + '/api/activities.json', 'utf8', function(err, data) {
//     if (err) {
//       console.log(err);
//     }
//     // console.log("activities" + activities);
//     activities = JSON.parse(data);
//   });
// }

// function writeDataToFile(dataToUpdate, isNew) {
//   if (isNew == true) {
//     fs.readFile(__dirname + '/api/codes.json', 'utf8', function readFileCallback(err, data) {
//       if (err) {
//         console.log(err);
//       } else {

//         // dataToUpdate.id = a;
//         // console.log("obj: " + data);
//         let obj = JSON.parse(data);
//         // let newIdValidated = false;
//         let testId = 0;
//         // let index = 0;

//         //obj.sort((a, b) => a.id-b.id).obj[obj.length-1].id+1;

//         let foundExisting;
//         do {
//           //let foundExisting = false;
//           // console.log("testing Id: " + testId);
//           // for (index = 0; index < obj.length; index++) {
//           //   if (obj[index].id == testId) {
//           //     console.log(`test Id already exists at obj[${index}].id: ` + obj[index].id);
//           //     foundExisting = true;
//           //     break;
//           //   }
//           // }

//           foundExisting = obj.find(x => {
//             return x.id == testId;
//           });
//           if (foundExisting) {
//             testId++;
//           }

//         } while (foundExisting)

//         dataToUpdate.id = testId;
//         // console.log(`id assigned is = ${testId}`);
//         obj.push(dataToUpdate);
//         json = JSON.stringify(obj);
//         fs.writeFile(__dirname + '/api/codes.json', json, 'utf8', err => {
//           if (err) {
//             return console.log(err);
//           }
//         });
//       }
//     });

//   } else if (isNew == false) {

//     fs.readFile(__dirname + '/api/codes.json', 'utf8', function readFileCallback(err, data) {
//       if (err) {
//         console.log(err);
//       } else {
//         const indexToUpdate = getIndexByIdOfCodes(dataToUpdate.id);
//         obj = JSON.parse(data);

//         objIndex = obj.findIndex((obj => obj.id == indexToUpdate));
//         obj[objIndex] = dataToUpdate;

//         json = JSON.stringify(obj);
//         fs.writeFile(__dirname + '/api/codes.json', json, 'utf8', err => {
//           if (err) {
//             return console.log(err);
//           }
//         });
//       }
//     });
//   }
//   readDataFromFile();
// }
function writeCodesToFile(dataToUpdate, isNew) {
  if (isNew == 'true') {
    fs.readFile(__dirname + '/api/codes.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {

        // dataToUpdate.id = a;
        // console.log("obj: " + data);
        let obj = JSON.parse(data);
        // let newIdValidated = false;
        let testId = 0;
        // let index = 0;

        //obj.sort((a, b) => a.id-b.id).obj[obj.length-1].id+1;

        let foundExisting;
        do {
          //let foundExisting = false;
          // console.log("testing Id: " + testId);
          // for (index = 0; index < obj.length; index++) {
          //   if (obj[index].id == testId) {
          //     console.log(`test Id already exists at obj[${index}].id: ` + obj[index].id);
          //     foundExisting = true;
          //     break;
          //   }
          // }

          foundExisting = obj.find(x => {
            return x.id == testId;
          });
          if (foundExisting) {
            testId++;
          }

        } while (foundExisting)

        dataToUpdate.id = testId;
        // console.log(`id assigned is = ${testId}`);
        obj.push(dataToUpdate);
        json = JSON.stringify(obj);
        fs.writeFile(__dirname + '/api/codes.json', json, 'utf8', err => {
          if (err) {
            return console.log(err);
          }
        });
      }
    });

  } else if (isNew == 'false') {

    fs.readFile(__dirname + '/api/codes.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        const indexToUpdate = getIndexByIdOfCodes(dataToUpdate.id);
        obj = JSON.parse(data); //now it an object

        objIndex = obj.findIndex((obj => obj.id == indexToUpdate));
        obj[objIndex] = dataToUpdate;

        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(__dirname + '/api/codes.json', json, 'utf8', err => {
          if (err) {
            return console.log(err);
          }
        });
      }
    });
  }
  readDataFromFile();
}
function writeActivityToFile(dataToUpdate, isNew) {
  if (isNew == 'true') {
    fs.readFile(__dirname + '/api/activities.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {

        // dataToUpdate.id = a;
        // console.log("obj: " + data);
        let obj = JSON.parse(data);
        // let newIdValidated = false;
        let testId = 0;
        // let index = 0;

        //obj.sort((a, b) => a.id-b.id).obj[obj.length-1].id+1;

        let foundExisting;
        do {
          //let foundExisting = false;
          // console.log("testing Id: " + testId);
          // for (index = 0; index < obj.length; index++) {
          //   if (obj[index].id == testId) {
          //     console.log(`test Id already exists at obj[${index}].id: ` + obj[index].id);
          //     foundExisting = true;
          //     break;
          //   }
          // }

          foundExisting = obj.find(x => {
            return x.id == testId;
          });
          if (foundExisting) {
            testId++;
          }

        } while (foundExisting)

        dataToUpdate.id = testId;
        obj.push(dataToUpdate);
        json = JSON.stringify(obj);
        fs.writeFile(__dirname + '/api/activities.json', json, 'utf8', err => {
          if (err) {
            return console.log(err);
          }
        });
      }
    });

  }
  else if (isNew == 'false') {
    fs.readFile(__dirname + '/api/activities.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        const indexToUpdate = getIndexByIdOfActivities(dataToUpdate.id);
        obj = JSON.parse(data);

        objIndex = obj.findIndex((obj => obj.id == indexToUpdate));
        obj[objIndex] = dataToUpdate;
        json = JSON.stringify(obj);
        fs.writeFile(__dirname + '/api/activities.json', json, 'utf8', err => {
          if (err) {
            return console.log(err);
          }
        });
      }
    });
  }
  readDataFromFile();
}

function getIndexByIdOfActivities(id) {
  for (let index = 0; index < activities.length; index++) {
    if (index == id) {
      return index;
    }

  }
}

function getIndexByIdOfCodes(id) {
  for (let index = 0; index < codes.length; index++) {
    if (index == id) {
      return index;
    }

  }
}

app.get('/', (req, res) => {
  readDataFromFile();
  res.sendFile(__dirname + '/public/home/index.html');
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(clientIp);
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login/login.html');
});
app.post('/login/', (req, res) => {
  let username = req.query.username;
  let password = req.query.password;
  // console.log("username: " + username + "\npassword: " + password);
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    if (element.username == username && element.password == password) {
      res.send("approved");
    }
  }
  res.send("declined");
});

// app.post('/login', (req, res) => {
//   let username = req.query.username;
//   let password = req.query.password;
//   for (let index = 0; index < users.length; index++) {
//     const element = users[index];
//     if (element.username == username && element.password == password) {
//       res.send("approved");
//     }    
//   }
//   res.send("declined");
//   // res.sendFile(__dirname + '/public/login/login.html');
// });

app.get('/new', (req, res) => {
  res.sendFile(__dirname + '/public/new/new.html');
  // let password = req.query.auth;
  // if (password == "true") {
  //   res.sendFile(__dirname + '/public/new/new.html');
  // }else{
  //   res.sendFile(__dirname + '/public/new/new.html');
  // }
});

app.get('/view', (req, res) => {
  res.sendFile(__dirname + '/public/view/view.html');
});

app.get('/lab-activities/', (req, res) => {
  // console.log("lab-activities");
  // console.log("req: " + req);
  readDataFromFile();
  res.sendFile(__dirname + '/public/school/labActivities.html');

});

app.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/public/edit/edit.html');
});

app.get('/loading', (res) => {
  res.sendFile(__dirname + '/assets/loading.json');

});

app.get('/codes/:id', (req, res) => {
  readDataFromFile()
    .then(() => {
      const code = codes.find(c => c.id === parseInt(req.params.id))
      if (!code) {
        res.status(404).send("Invalid id or the id was not found.");
      }
      res.send(code);
    });
});

app.get('/codes', (req, res) => {
  readDataFromFile()
    .then(res.send(codes));
});

app.get('/activities/:id', (req, res) => {
  // console.log("activities:id");
  readDataFromFile()
    .then(() => {
      const activity = activities.find(c => c.id === parseInt(req.params.id))
      if (!activity) {
        res.status(404).send("Invalid id or the id was not found.");
      }
      res.send(activity);
    });
});

app.get('/activities/', (req, res) => {
  readDataFromFile()
    .then(res.send(activities));
});

app.post('/save/', (req, res) => {
  let isNew = req.query.new;
  let type = req.query.type;
  // console.log("type: " + type);

  if (type == "codes") {
    writeCodesToFile(req.body, isNew);
  }
  else if (type == "activities") {
    writeActivityToFile(req.body, isNew);
  }
  res.sendStatus(200);
  // console.log("save req called with req: " + JSON.stringify(req.body));
});

// app.post('/save/', urlencodedParser, function (req, res) {  

//   response = {  
//       first_name:req.body.first_name,  
//       last_name:req.body.last_name  
//   };  
//   console.log(response);  
//   res.end(JSON.stringify(response));  
// })  


// app.get('/delete/:id', (req, res) => {
//   res.send(200);
//   console.log(req + req.params.id);

// });
app.delete('/delete/', (req, res) => {
  type = req.query.type;

  deleteCode(req.query.id, type)
    .then(function(result) {
      if (result == "success") {

        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });

  readDataFromFile();
});
app.use((req, res) => {
  res.sendFile(__dirname + '/public/404.html');
});
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});