import { createElement } from '../../mini-framework/dom.js';

const GameOverPopup = ({ title, buttons }) => {
    return (
        <div className="game-over-popup-overlay">
            <div className="game-over-popup">
                <h1>{title}</h1>
                <div className="game-over-buttons">
                    {buttons.map(button => (
                        <button onClick={button.onClick}>{button.text}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameOverPopup;
