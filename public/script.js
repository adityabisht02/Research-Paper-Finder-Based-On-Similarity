const inpFile = document.getElementById("inpFile");
const btnUpload = document.getElementById("btnUpload");
const resultText = document.getElementById("resultText");

//buttons
const btnGetAbstract = document.getElementById("getAbstract");
const btnGetReferences = document.getElementById("getReferences");
const btnGetSerpApiAbstract1 = document.getElementById("getSerp1");
const btnGetSerpApiAbstract2 = document.getElementById("getSerp2");
const btnGetModelData=document.getElementById("getModelData");

//textareas
const textAreaDisplayAbstract = document.getElementById("displayAbstract");
const textAreaDisplayReferences = document.getElementById("displayReferences");
const textAreaDisplayModel=document.getElementById("displayModelData");
const displaySerpAbstract1=document.getElementById("displaySerpAbstract1");
const displaySerpAbstract2=document.getElementById("displaySerpAbstract2");

var refs = [];

var abstract = "";
var references = "";
var ref1 = "";
var ref2 = "";

//abstracts which will be retrieved from serp api
var abs1 = "",
  abs2 = "";

//getting abstract
btnGetAbstract.addEventListener("click", () => {
  const formData = new FormData();

  formData.append("pdfFile", inpFile.files[0]);

  fetch("/getAbstract", {
    method: "post",
    body: formData,
  })
    .then((response) => {
      return response.text();
    })
    .then((extractedText) => {

      abstract=extractedText.trim();
      textAreaDisplayAbstract.innerHTML = extractedText.trim();
    });
});

//getting refs array
btnGetReferences.addEventListener("click", () => {
  const formData = new FormData();

  formData.append("pdfFile", inpFile.files[0]);

  fetch("/getReferences", {
    method: "post",
    body: formData,
  })
    .then((response) => {
      return response.text();
    })
    .then((extractedText) => {
      references = extractedText.trim();
      console.log(references);
      //get individual references
      getReferenceLinks();
      console.log(refs)
      textAreaDisplayReferences.innerHTML = extractedText.trim();
    });
});

//get serp abstract 1
btnGetSerpApiAbstract1.addEventListener("click", () => {
  fetch("http://localhost:3001/search", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      search:refs[0]
       
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      abs1=data.organic_results[0].snippet;
      displaySerpAbstract1.innerHTML = data.organic_results[0].snippet;
    });
});



//get serp abstract 2
btnGetSerpApiAbstract2.addEventListener("click", () => {
  fetch("http://localhost:3001/search", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      search:refs[1]
       
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      abs2=data.organic_results[0].snippet;
      displaySerpAbstract2.innerHTML = data.organic_results[0].snippet;
    });
});

//get model data 
btnGetModelData.addEventListener("click", () => {
  fetch("http://localhost:9000/", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      abs1:abstract,abs2:abs1,abs3:abs2      
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      
      textAreaDisplayModel.innerHTML =data.trim();
    });
});








function getReferenceLinks() {
  for (var i = 0; i < references.length; i++) {
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
      break;
    }
  }
}
