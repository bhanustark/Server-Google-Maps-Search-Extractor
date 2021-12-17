const PORT = process.env.PORT || 4000;
const express = require("express");
const bodyParser = require("body-parser");
const scrape = require("./scrape");


const app = express();

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", function (req,res) {
  res.send("Working fine");
})

app.post("/", async function (req, res) {
  const mapURL = req.body.mapURL
  const noOfPages = req.body.noOfPages
  console.log(mapURL);
  try {
    const result = await scrape(mapURL, noOfPages)
    res.send(result);
  } catch (err) {
    next(err);
  }
})

app.listen(PORT, () => {console.log("Server is running at port 4000")});
