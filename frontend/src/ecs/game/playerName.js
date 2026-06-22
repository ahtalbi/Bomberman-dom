let currentLocalPlayerName = "";

export function setPlayerName(name) {
    currentLocalPlayerName = name;
    localStorage.setItem("bomberman_player_name", name);
    console.log("Player registered successfully", name);
}

export function getPlayerName() {
    return currentLocalPlayerName || localStorage.getItem("bomberman_player_name") || "Player";
}
