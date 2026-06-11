import { createElement } from "../../mini-framework/dom";
import wss from "../app/app";

function ChatPlayers() {
    function broadcastMessage(e) {
        e.preventDefault();

        let formData = new FormData(e.target);
        let message = formData.get("message").trim();

        if (!message || message.length > 20) return;

        wss.send(JSON.stringify({
            type: "chat_message",
            message: message,
        }));
    }

    return (
        <div class="chat" onSubmit={broadcastMessage}>
            <form>
                <input type="text" name="message" placeholder="type to the auther players ..."/>
                <button type="submit">send</button>
            </form>
        </div>
    )
}

export default ChatPlayers;
