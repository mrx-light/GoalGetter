
# How to start the server 

First of all go to folder `./back` and run this command `npx json-server db.json`  
If everything was done correct then when you go to this url `http://localhost:3000/` you should see a server

### This server is not a real server with all functionalities

It's just a copy, a mocking server. 

# Front

In terminal go to this path `./front` and run this line `ng serve`

# Before you try to use this website!

I should warn you that this website is using an API that is limited. It has only 100 request per day and only `get ` requests. 
So be very accurate with what you want to ,(To be fair you can in 5-10 min to use all those request, After that you need to wait another day to properly use the website again)

Most of the request will not work because I don't have premium. Example: get players from a season in 1998. it will not work

# Do not introduce your real data

Even if I can't see that, but don't do that


# Pages

### 1.Login 
Set user and Log in

### 2.Registration 
Register user and create an object saved for a user

### 3.Main 
A glance of what you can find in this website
### 4.Leagues 
All leagues and a modal with all about one league

### 5.Teams 
All teams and a modal with all about one team

### 6.Venues 
All venues and a modal with all about one venue

### 7.Players
All players

### 8.Players/by id
All about one player
### 9.Coaches 
All coaches
### 9.Coaches/by id 
All about one coach
### 10.Profile
Here you can remove liked leagues, teams...and all, You can here change name , email password , but not username, you cant do that because you cant change the id in server. 


