let armor_requests=[];

// define variables that reference elements on our page
const armor_request_table = document.getElementById('armor_requests');

const getListener = function() {
  // parse our response to convert to JSON
  armor_requests= JSON.parse(this.responseText);

}

const armor_request = new XMLHttpRequest();
armor_request.onload = getListener;
armor_request.open('get', '/getArmor');
armor_request.send();


armor_request.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200){
    var entry = JSON.parse(this.responseText)
    entry.forEach(append)
  }
}

function append(item, index){
  var entry = JSON.parse(JSON.stringify(item))
  const newRow= armor_request_table.insertRow()
  var id = newRow.insertCell(0)
  id.innerHTML = entry["id"]
  var set_name = newRow.insertCell(1)
  set_name.innerHTML = entry["set_name"]
  var level = newRow.insertCell(2)
  level.innerHTML =entry["level"]
  var peices = newRow.insertCell(3)
  peices.innerHTML = entry["pieces"]
  var weights = newRow.insertCell(4)
  weights.innerHTML = entry["weights"]
  var trait = newRow.insertCell(5)
  trait.innerHTML = entry["traits"]
  var quality = newRow.insertCell(6)
  quality.innerHTML = entry["quality"]
  var style = newRow.insertCell(7)
  style.innerHTML = entry["style"]
  var mats = newRow.insertCell(8)
  mats.innerHTML = entry["mats"]
  var game_name = newRow.insertCell(9)
  game_name.innerHTML = "@" + entry["user"]
}


