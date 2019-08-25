
//TODO: ADD ADDITIONAL TABLE COLUMNS FOR PRIMARY/SECONDARY ROLE, AND PVP/PVE AND MAGIK/STAM
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
        

const Discord = require("discord.js")
var fs = require('fs')
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
const client = new Discord.Client()
const SQLite = require ("sqlite3").verbose();
var db = new SQLite.Database(dbFile);

var Armor_Id = 0
var Wep_Id = 0
var Res_Id = 0

var userlog = './user_log.txt'
var user_exists = fs.existsSync(userlog);

var notify_person_id = "222360371569229825"


app.get('/weapons', function(request, response){
  response.sendFile(__dirname + '/views/weapons.html')
})

app.get('/research', function(request, response){
  response.sendFile(__dirname + '/views/research.html')
})

app.get('/armor', function(request, response){
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/log', function(request, response){
  response.sendFile(__dirname + '/views/log.html')
})

app.get('/user_log.txt', function(request, response){
  response.sendFile(__dirname + '/user_log.txt')
})

app.get('/getArmor', function(request, response){
  //console.log("Entered the Retrieve")
    db.all('SELECT * from armor_requests', function(err, rows){
      //console.log(JSON.parse(JSON.stringify(rows)))
      response.send(JSON.stringify(rows))
    })
  })

app.get('/getWeps', function(request, response){
  console.log("Entered the Retrieve")
    db.all('SELECT * from weapon_requests', function(err, rows){
      //console.log(JSON.parse(JSON.stringify(rows)))
      response.send(JSON.stringify(rows))
    })
  })

app.get('/getRes', function(request, response){
  //console.log("Entered the Retrieve")
    db.all('SELECT * from research_requests', function(err, rows){
      //console.log(JSON.parse(JSON.stringify(rows)))
      response.send(JSON.stringify(rows))
    })
  })

db.serialize(function(){
    if (!exists){
      db.run("CREATE TABLE armor_requests(id TEXT, set_name TEXT, level TEXT, pieces TEXT, weights TEXT, traits TEXT, quality TEXT, style TEXT, mats TEXT, user TEXT)")
      console.log("Armor Requests Table Created")
          db.run("CREATE TABLE weapon_requests(id TEXT, set_name TEXT,type TEXT, level TEXT, trait TEXT, quality TEXT, style TEXT, mats TEXT, user TEXT)")
    console.log("Weapon Requests Table Created")
      
            db.run("CREATE TABLE research_requests(id TEXT, type TEXT, trait TEXT, user TEXT)")
      console.log("Research Requests Table Created")
    }
    else{
      console.log('Database Crafting Requests ready to go!')
      db.each ('SELECT * from armor_requests', function(err, row){
        if (err){
          throw err;
        }
        //console.log("Record:" + `${row.id} ${row.set_name} ${row.level} ${row.pieces} ${row.weights} ${row.traits} ${row.quality} ${row.style} ${row.mats} ${row.user}`)
        Armor_Id = parseInt(`${row.id}`, 10) + 1
      })
      db.each ('SELECT * from weapon_requests', function(err, row){
        if (err){
          throw err;
        }
        //console.log("Record:" + `${row.id} ${row.set_name} ${row.level} ${row.pieces} ${row.weights} ${row.traits} ${row.quality} ${row.style} ${row.mats} ${row.user}`)
        Wep_Id = parseInt(`${row.id}`, 10) + 1
      })
      db.each ('SELECT * from research_requests', function(err, row){
        if (err){
          throw err;
        }
        //console.log("Record:" + `${row.id} ${row.set_name} ${row.level} ${row.pieces} ${row.weights} ${row.traits} ${row.quality} ${row.style} ${row.mats} ${row.user}`)
        Res_Id = parseInt(`${row.id}`, 10) + 1
      })
    }
  })
  app.get('/', function(request, response){
    response.sendFile(__dirname + '/views/index.html')
  })

  var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
  })

client.on('ready', () => {
	console.log("Connected as " + client.user.tag)
	client.guilds.forEach((guild) => {
		console.log(" - " + guild.name)
	
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
	})
	
	var craft_channel = client.channels.get("589095882901815356")
  
  // UPDATE WITH MAJOR CHANGES!
	//craft_channel.send("Crafting Bot v2.0.0 Enabled.")
	
  
  client.user.setActivity("*help | *helpFulfill")
})


client.on('message', (receivedMessage) => {
  	var craft_channel = client.channels.get("589095882901815356")
    
  if (receivedMessage.channel.id == craft_channel.id){
    
    	if (receivedMessage.author == client.user){
		return
	}
	
	//receivedMessage.channel.send("Crafting Request Received From " + receivedMessage.author.toString())
	if (receivedMessage.content.startsWith("*")){
		processRequest(receivedMessage)
	}
  }
  else{
    //console.log(receivedMessage.channel.id)
    //console.log(craft_channel.id)
    return;
  }
	
})
  

function processRequest(receivedMessage){
	let fullCommand = receivedMessage.content.substr(1)
	let splitCommand = fullCommand.split("\n")
	let primaryCommand = splitCommand[0]
	let details = splitCommand.slice(1)
	
	console.log("Command Received " + primaryCommand)
  console.log("Details " + details.length)
	
	if ((primaryCommand == "Armor" || primaryCommand == "armor") && details.length == 9){
		appendLog(receivedMessage, Armor_Id, "request_armor")
    armorRequest(details, receivedMessage)
    client.users.get(notify_person_id).send("An armor request has been recieved.")

	}
	else if ((primaryCommand == "Weapon" || primaryCommand == "weapon") && details.length == 8){
    appendLog(receivedMessage, Wep_Id, "request_weapon")
		weaponRequest(details, receivedMessage)
    client.users.get(notify_person_id).send("A weapon request has been recieved.")

	}
	else if ((primaryCommand == "Research" || primaryCommand == "research") && details.length == 3){
		appendLog(receivedMessage, Res_Id, "request_research")
    researchRequest(details, receivedMessage)
    client.users.get(notify_person_id).send("A research request has been recieved.")
	}
	else if (primaryCommand == "help"){
		helpRequest(receivedMessage)
	}
  else if(primaryCommand == "fulfill"){
    if((details[0] == "armor" || details[0] == "Armor") && details.length == 2){
      delete_armor(details[1])
      if (details[1] < Armor_Id){
        appendLog(receivedMessage, details[1], "fulfill_armor")
      }
    }
    else if ((details[0] == "weapon" || details[0] == "Weapon") && details.length == 2){
      delete_weapon(details[1])
      if (details[1] < Wep_Id){
        appendLog(receivedMessage, details[1], "fulfill_weapon")
      }
    }
    else if ((details[0] == "research" || details[0] == "Research") && details.length == 2){
      delete_research(details[1])
      if (details[1] < Res_Id){
        appendLog(receivedMessage, details[1], "fulfill_research")
      }
    }
    else{
      receivedMessage.channel.send(receivedMessage.author.toString() + " your request to mark a request as fufilled could not be processed. Please type *helpFulfill for me details.")
    }
  }
  else if (primaryCommand == "helpFulfill"){
    helpFulfill(receivedMessage)
  }
	else{
		receivedMessage.channel.send(receivedMessage.author.toString() + " your request broke the bot. Make sure you start your request with *Armor, *Weapon, or *Research, and that you have included the proper details. \nFor more information type *help.")
	}
}

function armorRequest(details, receivedMessage){
	receivedMessage.channel.send("Armor Request Processed.")
    var stmt = db.prepare("INSERT INTO armor_requests VALUES (?,?,?,?,?,?,?,?,?,?)")
  stmt.run(Armor_Id, details[0],details[1],details[2],details[3],details[4],details[5],details[6],details[7], details[8])
  Armor_Id++;
}

function weaponRequest(details, receivedMessage){
	receivedMessage.channel.send("Weapon Request Processed.")
      var stmt = db.prepare("INSERT INTO weapon_requests VALUES (?,?,?,?,?,?,?,?,?)")
  stmt.run(Wep_Id, details[0],details[1],details[2],details[3],details[4],details[5],details[6],details[7])
  Wep_Id++
}

function researchRequest(details, receivedMessage){
	receivedMessage.channel.send("Research Request Processed.")
        var stmt = db.prepare("INSERT INTO research_requests VALUES (?,?,?,?)")
  stmt.run(Res_Id, details[0],details[1],details[2],details[3],details[4])
  Res_Id++
}

function appendLog(receivedMessage, idNum, typeReq){
  var d = new Date();
  var entry;
  if (typeReq == "fulfill_armor"){
    entry = d + " - " + receivedMessage.author.username + " fulfilled armor request number " + idNum
  }
  else if (typeReq == "fulfill_weapon"){
        entry = d + " - " + receivedMessage.author.username  + " fulfilled weapon request number " + idNum
  }
  else if (typeReq == "fulfill_research"){
        entry = d + " - " + receivedMessage.author.username  + " fulfilled research request number " + idNum
  }
  else if (typeReq == "request_armor"){
        entry = d + " - " + receivedMessage.author.username  + " created armor request number " + idNum
  }
  else if (typeReq == "request_weapon"){
            entry = d + " - " + receivedMessage.author.username  + " created weapon request number " + idNum
  }
  else if (typeReq == "request_research"){
            entry = d + " - " + receivedMessage.author.username  + " created research request number " + idNum
  }
  else{
    return;
  }
  entry += "\n"
  fs.appendFile('user_log.txt', entry, function(err){
    if (err) throw err;
  })
}

function helpRequest(receivedMessage){
	receivedMessage.channel.send("You have asked for help, and I am here to provide. \nWhen makeing a crafting request please make sure to follow the input guidlines below. \n\n\nFor armor set requests:\n*Armor \nJulianos\nLevel 36\nChest, Legs, Boots, Gloves, Belt \nWeight: Chest Heavy, Legs Heavy, Boots, gloves, and belt light \nTrait: Chest and Legs infused, all others divines \nQuality: Purple,\nAny style, something cheap \nMaterials Avilable \nIn Game Username without the @ \n\n\nFor Weapon Set Requests:\n*Weapon \nCold Harbor's Favorite \nRestoration Stave \nLevel CP160 \nTrait: Powered \nQuality: Blue \nStyle: Elder Argonian \nI need help with materials \nIn Game Username without the @ \n\n\nFor a Research Item Request \n*Research \nItem: Battleaxe \nTrait: Sharpened \nIn Game Username without the @ \n\n\nPlease make sure all of this information is in one message and formated this way. Shift + Enter allows you to create a new line while remaining in the same message. \n\n\n Current Requests can be found at: https://eso-craft-bot.glitch.me/")
}

function helpFulfill(receivedMessage){
  receivedMessage.channel.send("To mark a quest as fufilled on the website, please make sure to follow the below format: \n\nFulfill Armor: \n *fulfill \nArmor \nRequest_ID \n\nFulfill Weapon: \n *fulfill \nWeapon \nRequest_ID \n\nFulfill Research: \n *fulfill \nResearch \nRequest_ID")
}

function delete_armor(request_id){
  db.run('DELETE FROM armor_requests WHERE id=?', request_id)
}

function delete_weapon(request_id){
  db.run('DELETE FROM weapon_requests WHERE id=?', request_id)
}

function delete_research(request_id){
  db.run('DELETE FROM research_requests WHERE id=?', request_id)
}

client.login(process.env.TOKEN)