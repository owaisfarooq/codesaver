export function writeCodesToFile(dataToUpdate, isNew) {
    if (isNew == 'true') {
        console.log("asdasdasd");
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
export function writeActivityToFile(dataToUpdate, isNew) {
    console.log("writeActivityToFile    isNew = " + isNew);
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
            console.log(`id assigned is = ${testId}`);
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
        console.log("dataToUpdate: " + JSON.stringify(dataToUpdate));

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
export async function readDataFromFile() {
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
    } else if(type == 'activities') {
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
  