const UPI_ID="6361914076@upi";
const PREMIUM_PRICE="10";
let currentInput="",expression="",history=[],memoryValue=0;

const display=document.getElementById("display");
const expressionBox=document.getElementById("expression");

function updateDisplay(){display.innerText=currentInput||"0";expressionBox.innerText=expression}
function inputNumber(n){if(n==="."&&currentInput.includes("."))return;currentInput+=n;updateDisplay()}
function inputOperator(op){if(!currentInput)return;expression+=currentInput+" "+op+" ";currentInput="";updateDisplay()}
function clearCalculator(){currentInput="";expression="";updateDisplay()}
function backspace(){currentInput=currentInput.slice(0,-1);updateDisplay()}
function percent(){if(!currentInput)return;currentInput=String(parseFloat(currentInput)/100);updateDisplay()}

function calculate(){
if(!currentInput&&!expression)return;
let fullExpression=expression+currentInput;
try{
let safe=fullExpression.replace(/×/g,"*").replace(/÷/g,"/");
let result=Function('"use strict"; return ('+safe+')')();
addHistory(fullExpression,result);
currentInput=String(result);expression="";updateDisplay();
}catch{currentInput="Error";expression="";updateDisplay()}
}

function scientific(type){
if(!currentInput)return;
let value=parseFloat(currentInput),result;
switch(type){
case"sin":result=Math.sin(value*Math.PI/180);break;
case"cos":result=Math.cos(value*Math.PI/180);break;
case"tan":result=Math.tan(value*Math.PI/180);break;
case"sqrt":result=Math.sqrt(value);break;
case"square":result=value*value;break;
case"log":result=Math.log10(value);break;
}
expression=type+"("+value+")";currentInput=String(result);updateDisplay()
}

function addHistory(exp,result){
history.unshift({expression:exp,result:result});
document.getElementById("historyCount").innerText=history.length;
renderHistory()
}
function renderHistory(){
const list=document.getElementById("historyList");
if(!history.length){list.innerHTML="No calculations yet.";return}
list.innerHTML=history.map(x=>`<div class="history-item"><div>${x.expression}</div><strong>= ${x.result}</strong></div>`).join("")
}

function showPage(page){
document.getElementById("calculatorPage").style.display=page==="calculator"?"block":"none";
document.getElementById("historyPage").style.display=page==="history"?"block":"none";
document.getElementById("premiumPage").style.display=page==="premium"?"block":"none";
document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
if(page==="calculator")document.querySelectorAll(".nav-item")[0].classList.add("active");
if(page==="history")document.querySelectorAll(".nav-item")[1].classList.add("active");
if(page==="premium")document.querySelectorAll(".nav-item")[2].classList.add("active")
}

function openPremium(){document.getElementById("premiumModal").classList.add("show")}
function closePremium(){document.getElementById("premiumModal").classList.remove("show")}

function getUPILink(){
  return "upi://pay"
    + "?pa=" + encodeURIComponent(UPI_ID)
    + "&pn=" + encodeURIComponent("ApexSujan")
    + "&am=" + encodeURIComponent(PREMIUM_PRICE)
    + "&cu=INR"
    + "&tn=" + encodeURIComponent("ApexSujan Premium Access");
}

function payUsingUPI(){
  const link = getUPILink();

  // UPI deep links work on compatible mobile devices with a UPI app.
  // On desktop, the QR code below should be scanned with a phone.
  window.location.href = link;
}

function copyUPI(){
navigator.clipboard.writeText(UPI_ID).then(()=>{
const el=document.getElementById("upiText"),old=el.innerText;
el.innerText="UPI ID Copied!";
setTimeout(()=>el.innerText=old,1500)
})
}

function generateQR(){
  const box=document.getElementById("qrcode");
  box.innerHTML="";
  const link=getUPILink();

  new QRCode(box,{
    text:link,
    width:150,
    height:150,
    correctLevel:QRCode.CorrectLevel.H
  });
}

function confirmPayment(){
document.getElementById("paymentMessage").style.display="block";
}

document.addEventListener("keydown",e=>{
const k=e.key;
if((k>="0"&&k<="9")||k===".")inputNumber(k);
if(["+","-","*","/"].includes(k))inputOperator(k);
if(k==="Enter"||k==="=")openPremium();
if(k==="Backspace")backspace();
if(k==="Escape")closePremium();
if(k==="%")percent();
});

updateDisplay();
generateQR();
