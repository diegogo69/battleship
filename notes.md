so we have a game instance
that controls the players
the turns
and check if a winner
updates the dom by calling external modules
everythings cool
but
how do I finish a game?

how do I start a new one
I have to have another logic other
than the game instance
wich creates new game instances
and end current ones

Index.js
  create players
  create game instance, wich is an obj
    obj cannot return
    but i use and object to store the internal state of the function
  if you make it a function, it can return
  Making the game finish

ohhhhhhh, it doesnt' call directly the game instance function
but an intermediary function within index
that calls the game instance function
then checks if the game is finished
yikesssssssssswe

index module
dom handler module
game instance module
