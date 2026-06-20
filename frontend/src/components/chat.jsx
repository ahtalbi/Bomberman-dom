import { createElement } from "../../mini-framework/dom";
import { createSignal, createEffect } from "../../mini-framework/reactivity";
import wss from "../app/app";

const [messages, setMessages] = createSignal([]);
export { setMessages };

function ChatPlayers() {
    const messagesContainer = <div class="messages"></div>;

    createEffect(() => {
        const msgs = messages();
        messagesContainer.innerHTML = "";

        for (let msg of msgs) {
            const p = document.createElement("p");
            if (typeof msg === "string") {
                p.textContent = msg;
            } else {
                p.textContent = `${msg.nickname}: ${msg.message}`;
            }
            messagesContainer.appendChild(p);
            if (messagesContainer.children.length > 20) {
                messagesContainer.removeChild(messagesContainer.firstElementChild);
                msgs.unshift();
            };
            
        };
    });

    function broadcastMessage(e) {
        e.preventDefault();

        let formData = new FormData(e.target);
        let message = formData.get("message").trim();

        if (!message || message.length > 20) {
            e.target.reset();
            return;
        };

        wss.send(JSON.stringify({
            type: "chat_message",
            message: message,
        }));
        e.target.reset();
    }

    return (
        <div class="chat" onSubmit={broadcastMessage}>
            {messagesContainer}
            <form>
                <input type="text" name="message" placeholder="type to the other players ..." maxlength="20"/>
                <button type="submit">send</button>
            </form>
        </div>
    )
}

export default ChatPlayers;
