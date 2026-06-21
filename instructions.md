bomberman-dom

You certainly know bomberman right? Good good. You will make it. Relax, is not that hard, it is only a multiplayer version of it. Ah and forgot to mention that you will need to do it using the framework you created a while ago. Let me explain.
Objectives

For this project you have to create a bomberman alike game, where multiple players can join in and battle until one of them is the last man standing.
Instructions

In the beginning there are 4 players, and only one came out alive. Each player will have to start in the different corners of the map and only one will be victorious.

You will have to follow more or less the same principles of make-your-game project. But we will refresh one of the concepts you will have to respect and deal with:

    Performance, is one of the most important aspects while developing a game, so let's respect it.
    Just like make-your-game you will have to respect the policy of:
        Running the game at least at 60fps at all time
        No frame drops
        Proper use of requestAnimationFrame
        Measuring performance to know if your code is fast

You must not use canvas, neither Web-GL nor another framework. For this project you will use the framework you did on the mini-framework project.

You will also have to make a chat that enables the different players to talk to each other. You will have to use WebSockets. This chat can be considered as a "Hello World" of the multiplayer feature for the bomberman-dom.
Game Mechanics

    Players
        Nº of players: 2 - 4
        Each player must have 3 lives. Then you are out!!

    Map
        The map should be fixed so that every player sees the whole map.
        There will be two types of blocks, the ones that can be destroyed (blocks) and the ones that can not (walls).
            The walls will always be placed in the same place, while the blocks are meant to be generated randomly on the map. Tip: the optional project different maps can be useful for this part.
            In the starting positions the players need to be able to survive. For example: if the players place a bomb, they will need to have space to avoid the bomb explosion.
        The players should be placed in the corners as their starting positions.

    Power ups (each time a player destroys a block, a random power up may or may not appear):
        Bombs: Increases the amount of bombs dropped at a time by 1;
        Flames: Increases explosion range from the bomb in four directions by 1 block;
        Speed: Increases movement speed;

When the user opens the game, he/she should be presented to a page where he/she should enter a nickname to differentiate users. After selecting a nickname the user should be presented to a waiting page with a player counter that ends at 4. Once a user joins, the player counter will increment by 1.

If there are more than 2 players in the counter and it does not reach 4 players before 20 seconds, a 10 second timer starts, to players get ready to start the game.
If there are 4 players in the counter before 20 seconds, the 10 seconds timer starts and the game starts.
Bonus

Although this bomberman already is super cool, it can be always better. Here are some ideas you can implement into the game to make it super awesomely cool:

    Solo + Co-Op mode: You are supposed to develop an AI to play against the players. So once the AI is defeated all players involved win.
    More power ups:
        Bomb Push: Ability to throw a bomb after it has been placed;
        Bomb Pass: Ability to pass through bombs;
        Block Pass: Ability to pass through blocks (not walls);
        Detonator: Ability to choose when a bomb will explode on a key press;
        1 Up: Gives the player an extra life;
    Release power ups after death: When a player dies it drops one of it's power ups. If the player had no power ups, it drops a random power up.
    Team mode: Make games with 2v2 (two players versus two players).
    After death interaction: When a player dies, they can reappear as a ghost. If a ghost touches another player they come back to life. If a ghost is caught in a bomb explosion, the player controlling the ghost dies permanently.

This project will help you learn about:

    requestAnimationFrame
    Event loop
    FPS
    Animation performance and frame rate
    webSockets
    Synchronization
    Developer Tools
        Firefox
        Chrome
