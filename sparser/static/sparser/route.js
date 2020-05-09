var dp = [];


function printMousePos(event){
  console.log("hi");
  var x = event.clientX;
  var y = event.clientY;
  var i;
  if (x < 250){
    return 0;
  }
  console.log("The length of dp array is " + dp.length)
  for (i = 0; i < dp.length; i++){
    console.log("[" + dp[i][0] + ", " + dp[i][1] + "]");
  }
  document.body.textContent = "clientX: " + x + " - clientY: " + y;
  dp.push([x, y]);
}

document.addEventListener("click", printMousePos);
