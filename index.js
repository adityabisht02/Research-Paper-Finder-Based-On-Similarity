require("dotenv").config()
const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const cors = require("cors");
const axios = require("axios");
const app = express();

app.use("/", express.static("public"));
app.use(fileUpload());
app.use(cors());
app.use(express.json());

var abstract = "";
var references = "";
var refs = [];
var abs1 = "";
var abs2 = "";

app.post("/extract-text", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }
  // if (req.files.pdfFile.name !="Research_Paper_on_Basic_of_Artificial_Neural_Network-with-cover-page-v2.pdf") {
  //   res.send("Please enter valid filename");
  // }
  //get the abstract and complete references section from pdf
  getAbstractAndReferences(req.files.pdfFile);
  refs[0] ="Bradshaw, J.A., Carden, K.J., Riordan, D., 1991.Ecological ―Applications Using a Novel Expert System Shell‖. Comp. Appl. Biosci. 7, 79-83";
  refs[1] ="Lippmann, R.P., 1987. An introduction to computing with neural nets. IEEE Accost. Speech Signal Process. Mag., April: 4-22";


  var url1 = `https://serpapi.com/search.json?engine=google_scholar&q=${refs[0]}&lgoogle_domain=google.com&gl=us&hl=en&device=desktop&api_key=${process.env.SERP_API_KEY}`;
  axios.get(url1).then((response) => {
    abs1 =  response;
    console.log(abs1)
      
    }).then(() => {
      var url2 = `https://serpapi.com/search.json?engine=google_scholar&q=${refs[1]}&lgoogle_domain=google.com&gl=us&hl=en&device=desktop&api_key=92b30b2e38891254577a44d9def411313e92153fd03400e2967945dc1b60980b`;
      axios.get(url2)
        .then((resp) => {
          abs2 = resp.data.organic_results[0].snippet;
        })
        .then(() => {
          const payload = { abs1, abs2 };
          axios.post("http://localhost:9000", payload).then((title) => {
            res.send(title.data);
          }); });});});




app.post("/getAbstract",(req,res)=>{
  console.log(req.files.pdfFile)
  getAbstractAndReferences(req.files.pdfFile);
  res.json(abstract);
})

app.post("/getSerpData",(req,res)=>{
  var searchWord = refs[0];
  console.log(searchWord);
  const url1 = `https://serpapi.com/search.json?engine=google_scholar&q=${searchWord}&lgoogle_domain=google.com&gl=us&hl=en&device=desktop&api_key=92b30b2e38891254577a44d9def411313e92153fd03400e2967945dc1b60980b`

     axios.get(url1).then((response)=>{
      if(response.status == 200){
        abs1=response.data;
        res.send(abs1);
    }
    })
})

app.post("/getReferences",(req,res)=>{
  res.send(refs);
})




app.post("/getModelData", (req, res) => {
  const payload = { ref1:refs[0], ref2:refs[1] };
  axios.post("http://localhost:9000", payload).then((title) => {
    res.send(title.data);
  });
});

app.listen(3000, function () {
  console.log("server listening on 3000");
});







function getReferenceLinks() {
  for (var i = 5; i < references.length; i++) {
    //for first ref link
    if (references[i] == "[" && references[i + 1] == "1") {
      var tempOne = "";
      while (true) {
        if (references[i] == "[" && references[i + 1] == "2") {
          break;
        }
        tempOne = tempOne + references[i];
        i++;
      }
      refs.push(tempOne);
    }

    if (references[i] == "[" && references[i + 1] == "2") {
      var tempTwo = "";
      while (i < references.length) {
        tempTwo = tempTwo + references[i];
        i++;
      }
      refs.push(tempTwo);
      console.log(refs);
      break;
    }
  }
}

function getAbstractAndReferences(pdfFile) {
  pdfParse(pdfFile).then((result) => {
    var textContent = result.text;
    //makes textContent an array of words in the pdf
    textContent.split(" ");
    for (var i = 0; i < textContent.length - 2; i++) {
      if (
        textContent[i] == "A" &&
        textContent[i + 1] == "b" &&
        textContent[i + 2] == "s"
      ) {
        while (true) {
          if (
            textContent[i] == "K" &&
            textContent[i + 1] == "e" &&
            textContent[i + 2] == "y" &&
            textContent[i + 3] == "w"
          ) {
            break;
          }
          abstract = abstract + textContent[i];
          i++;
        }
      }
      if (
        textContent[i] == "R" &&
        textContent[i + 1] == "E" &&
        textContent[i + 2] == "F" &&
        textContent[i + 3] == "E"
      ) {
        while (true) {
          if (
            textContent[i] == "[" &&
            textContent[i + 1] == "3" &&
            textContent[i + 2] == "]"
          ) {
            break;
          }
          references = references + textContent[i];
          i++;
        }
        break;
      }
    }
  });
  getReferenceLinks();

}
