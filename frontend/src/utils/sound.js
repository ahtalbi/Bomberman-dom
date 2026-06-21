class Sound {
    constructor(src) {
        this.music = new Audio(src);
        this.button = document.createElement("button");
        this.icon = document.createElement("i");

        this.music.loop = true;
        this.music.volume = 0.4;

        this.button.className = "sound-button";
        this.button.type = "button";
        this.button.setAttribute("aria-label", "Turn sound off");
        this.button.append(this.icon);
    }

    init() {
        this.button.addEventListener("click", () => this.toggle());

        document.body.append(this.button);

        this.updateButton();
    }

    play() {
        this.music.play()
            .then(() => this.updateButton())
            .catch(() => this.updateButton());
    }

    toggle() {
        if (this.music.paused || this.music.muted) {
            this.music.muted = false;
            this.button.setAttribute("aria-label", "Turn sound off");
            this.play();
        } else {
            this.music.muted = true;
            this.button.setAttribute("aria-label", "Turn sound on");
            this.updateButton();
        }
    }

    updateButton() {
        const isMuted = this.music.muted || this.music.paused;

        this.icon.className = isMuted ? "fa-solid fa-volume-off" : "fa-solid fa-volume-high";
        this.button.classList.toggle("is-muted", isMuted);
    }
}

export default Sound;
