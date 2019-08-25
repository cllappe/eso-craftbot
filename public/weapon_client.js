let weapon_requests=[];

const weapon_request_table = document.getElementById('weapon_requests');


const getListener = function() {
  // parse our response to convert to JSON
  weapon_requests= JSON.parse(this.responseText);

}

const weapon_request = new XMLHttpRequest();
weapon_request.onload = getListener;
weapon_request.open('get', '/getWeps');
weapon_request.send();


weapon_request.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200){
    var entry = JSON.parse(this.responseText)
    entry.forEach(append)
  }
}

function append(item, index){
  var entry = JSON.parse(JSON.stringify(item))
  const newRow= weapon_request_table.insertRow()
  var id = newRow.insertCell(0)
  id.innerHTML = entry["id"]
  var set_name = newRow.insertCell(1)
  set_name.innerHTML = entry["set_name"]
  var wep_type = newRow.insertCell(2)
  wep_type.innerHTML = entry["type"]
  var level = newRow.insertCell(3)
  level.innerHTML =entry["level"]
  var trait = newRow.insertCell(4)
  trait.innerHTML = entry["trait"]
  var quality = newRow.insertCell(5)
  quality.innerHTML = entry["quality"]
  var style = newRow.insertCell(6)
  style.innerHTML = entry["style"]
  var mats = newRow.insertCell(7)
  mats.innerHTML = entry["mats"]
  var game_name = newRow.insertCell(8)
  game_name.innerHTML = "@" + entry["user"]
}


