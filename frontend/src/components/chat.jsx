import { createElement } from "../../mini-framework/dom";
import { createSignal, createEffect } from "../../mini-framework/reactivity";
import wss from "../app/app";
import { debounce } from "../utils/debounce.js";

const [messages, setMessages] = createSignal([]);
const [chatError, setChatError] = createSignal("");
export { setMessages, setChatError };

function ChatPlayers() {
    const messagesContainer = <div class="messages"></div>;
    const errorChat = <p></p>;

    createEffect(() => {
        const err = chatError();
        errorChat.textContent = err;
    });

    createEffect(() => {
        const msgs = messages();
        messagesContainer.innerHTML = "";

        for (let msg of msgs) {
            const p = document.createElement("p");
            p.textContent = msg;
            messagesContainer.appendChild(p);
            if (messagesContainer.children.length > 20) {
                messagesContainer.removeChild(messagesContainer.firstElementChild);
                msgs.unshift();
            }
        }
    });

    function broadcastMessage(e) {
        e.preventDefault();

        let fn = debounce(() => {
            let formData = new FormData(e.target);
            let message = formData.get("message").trim();

            if (!message || message.length > 20) {
                e.target.reset();
                return;
            }

            wss.send(
                JSON.stringify({
                    type: "chat_message",
                    message: message,
                }),
            );
            e.target.reset();
        }, 1000);
        fn();
    }

    return (
        <div class="chat" onSubmit={broadcastMessage}>
            {errorChat}
            {messagesContainer}
            <form>
                <input
                    type="text"
                    name="message"
                    placeholder="type to the other players ..."
                    maxlength="20"
                />
                <button type="submit">send</button>
            </form>
        </div>
    );
}

export default ChatPlayers;
