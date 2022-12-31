const express = require('express');
const fs = require('fs');
const app = express();
var cors = require('cors')
const PORT = process.env.PORT || 3001;


app.use(cors())
let codes = [];
readFile();
async function readFile() {
  fs.readFile('./api/codes.json', 'utf8', function (err, data) {
    codes = JSON.parse(data);

  });

}

app.get('/', (req, res) => {
  res.send();
});

app.get('/codes/:id', (req, res) => {
  readFile()
    .then(() => {
      const code = codes.find(c => c.id === parseInt(req.params.id))
      if (!code) {
        res.status(404).send("Invalid id or the id was not found.");
      }
      res.send(code);
    })
    .then(() => console.log(codes));

});

app.get('/codes', (req, res) => {
  readFile()
    .then(res.send(codes))
    .then(console.log(codes))

});

app.get('/codes', (req, res) => {
  readFile()
    .then(res.send(codes))
    .then(console.log(codes))

});

// app.get('/delete/:id', (req, res) => {
//   res.send(200);
//   console.log(req + req.params.id);

// });
function deleteCode(id) {

  fs.readFile('./api/codes.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {

      obj = JSON.parse(data); //now it an object
      for (let i = 0; i < obj.length; i++) {
        if (id == obj[i].id) {
          obj.splice(i, 1);
        }
      }
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('../codes.json', json, 'utf8', err => {
        if (err) {
          return console.log(err);
        }
      });
    }
  });

}
app.delete('/:id', (req, res) => {
  res.sendStatus(200);
  console.log("DELETE Request Called " + req.params.id);
  deleteCode(req.params.id);
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
