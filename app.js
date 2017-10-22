const express = require("express");
const app     = express();
const fs      = require("fs");

let users = JSON.parse(fs.readFileSync("data/data.json", "utf8"));
//console.log(data);

//Removes duplicates
let uniqueArray = (arr) =>{
  return arr.filter((el, i, self)=>{
     return self.indexOf(el)===i;
  })
}
let futureFriends = (arr) =>{
  return arr.filter((el, i, self)=>{
     return self.indexOf(el)!=i;
  })
}
// Returns user object+
let getUser = (id) =>{
  return users.find((user)=>{
    return user.id == id;
  })
}
//Returns array with users friends objects for given ID
//e.g[
// {...},
// {...}...
// ]+
let getFriendsFor = (id) =>{
  let friends = getUser(id).friends;
  let userFriends=[];
    friends.forEach((friendId)=>{
    userFriends.push(getUser(friendId));
  })
  return userFriends;
}
//Returns array with users friends IDs
//  e.g.[1,3,5,6...]+
let friendsIds = (id)=>{
  return getFriendsFor(id).map((friend)=>{
          return friend.id;
        })
}
//Returns array with FOF IDs(no user id or users friends IDs)
//  e.g.[2,3,5,8...]+
let fofIds = (id)=>{
  let fofs =[];
  let usersFriends = getFriendsFor(id);
  usersFriends.forEach((friend)=>{
    fofs=fofs.concat(friend.friends)
  })
     return fofs.filter((val)=>val!=id);//TO DO - REMOVE FRIENDS IDs
}

//Returns array with objects from IDs array+
let getFromIds = (ids) =>{
  let users = [];
  ids.forEach((id)=>{
    users.push(getUser(id));
  })
  return users;
}
//Returns array with FOF objects+
let fof = (id) =>{
  return getFromIds(uniqueArray(fofIds(id)));
}
let sugestedFriends = (id) =>{
  return getFromIds(futureFriends(fofIds(id)));
}

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));



//ROUTES

app.get("/", (req, res)=>{
  res.render("landing");
});

app.get("/users", (req, res)=>{
  res.render("users/index",{users:users});
});

app.get("/users/:id", (req, res)=>{
  let user = getUser(req.params.id);
  let friendsOfFrends = fof(req.params.id);
  let sugested = sugestedFriends(req.params.id);
  let friends = getFriendsFor(req.params.id);

  res.render("users/show", {friends:friends, friendsOfFrends:friendsOfFrends, sugested:sugested, user:user});
});






app.listen(3000, ()=>{
  console.log("===================");
  console.log("SERVER IS UP");
  console.log("===================");
})
