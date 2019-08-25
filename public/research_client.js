let research_requests=[];

const research_request_table = document.getElementById('research_requests');


const getListener = function() {
  // parse our response to convert to JSON
  research_requests= JSON.parse(this.responseText);

}

const res_request = new XMLHttpRequest();
res_request.onload = getListener;
res_request.open('get', '/getRes');
res_request.send();


res_request.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200){
    var entry = JSON.parse(this.responseText)
    entry.forEach(append)
  }
}

function append(item, index){
  var entry = JSON.parse(JSON.stringify(item))
  const newRow= research_request_table.insertRow()
  var id = newRow.insertCell(0)
  id.innerHTML = entry["id"]
  var wep_type = newRow.insertCell(1)
  wep_type.innerHTML = entry["type"]
  var trait = newRow.insertCell(2)
  trait.innerHTML = entry["trait"]
  var game_name = newRow.insertCell(3)
  game_name.innerHTML = "@" + entry["user"]
}


