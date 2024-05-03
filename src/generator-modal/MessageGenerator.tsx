
import React, { useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import Generate_Icon from 'assets/modal-icons/generate-msg-icon.svg';
import Insert_Icon from 'assets/modal-icons/insert-msg-icon.svg';
import regen_icon from 'assets/modal-icons/regenerate-msg-icon.svg';

interface IPrompts {
    role: string,
    message: string,
}

const MsgGeneratorModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    // State for managing the array of message prompts displayed in the modal
    const [messagePrompts, setMessagePrompts] = useState<IPrompts[]>([]);
    // State for managing user input from the text field
    const [userInput, setUserInput] = useState<string>("");

    // Function to generate messages based on user input and a system response
    const handleGenerateMessage = () => {
        if (userInput && userInput.length > 0) {
            const data = [
                {
                    role: "user",
                    message: userInput
                },
                {
                    role: "system",
                    message: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
                }
            ]
            // Update the message prompts by appending new data
            setMessagePrompts(prev => [...prev, ...data]);
        }
        // Clear user input after generating messages
        setUserInput("");
    }

    // Function to insert the last generated message into a LinkedIn message box
    const handleInsertMessage = () => {
        // Finds the contenteditable element where messages are typed
        const textBox = document.querySelector(".msg-form__contenteditable");
        if (textBox) {
            const placeHolder = document.querySelector(".msg-form__placeholder");
            if (placeHolder) {
                // If a placeholder is present, remove it before inserting the message
                placeHolder.remove();
            }

            const existingText = textBox.textContent.trim(); // Get existing text and remove leading/trailing whitespace

            // If the text box is empty, overwrite the content
            if (existingText === "") {
                textBox.textContent = messagePrompts[messagePrompts.length - 1]?.message;
            } else {
                // If the text box is not empty, append the generated message
                textBox.textContent += "\n" + messagePrompts[messagePrompts.length - 1]?.message;
            }

            // Moves the cursor to the end of the text box
            const range = document.createRange();
            range.selectNodeContents(textBox);
            range.collapse(false);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        // Resets user input and message prompts, then closes the modal
        setUserInput("");
        setMessagePrompts([]);
        handleClose();
    }



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                {
                    // Maps each message prompt to a Typography component with appropriate styling
                    messagePrompts && messagePrompts.length > 0 && messagePrompts.map((prompt, index) =>
                        <Typography
                            key={index}
                            sx={{ maxWidth: "max-content", alignSelf: prompt.role === "user" ? 'end' : 'start', fontSize: "14px", fontWeight: '400', color: "#666D80", bgcolor: prompt.role === "user" ? "#DFE1E7" : "#DBEAFE", padding: 1, paddingX: 2, marginBottom: 2, borderRadius: 2 }}
                        >
                            {prompt.message}
                        </Typography>
                    )
                }
                <input
                    type="text"
                    placeholder="Your prompt"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    style={{ fontSize: "14px", borderRadius: "6px", marginBottom: 2 }}
                />
                {
                    // Renders buttons based on the presence of message prompts
                    messagePrompts && messagePrompts.length === 0 ?
                        <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={handleGenerateMessage}
                                style={{ backgroundColor: "#3B82F6", color: "#fff", fontSize: "14px", fontWeight: "600", borderRadius: 4, padding: 6, marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', width: "112px", cursor: "pointer" }}
                            >
                                <img src={Generate_Icon} alt="icon" style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                                <span style={{ textAlign: "center" }}>Generate</span>
                            </button>
                        </div> :
                        <div style={{ display: 'flex', justifyContent: "flex-end", gap: 4 }}>
                            <button
                                type="button"
                                onClick={handleInsertMessage}
                                style={{ color: "#666D80", border: "2px solid #666D80", fontSize: "14px", fontWeight: "600", borderRadius: 4, padding: 6, marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', width: "80px", cursor: "pointer", marginRight: 4 }}
                            >
                                <img src={Insert_Icon} alt="icon" style={{ width: "16px", height: "16px", marginRight: "6px" }} />
                                <span>Insert</span>
                            </button>
                            <button
                                type="button"
                                style={{ backgroundColor: "#3B82F6", color: "#fff", fontSize: "14px", fontWeight: "600", borderRadius: 4, padding: 6, marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', width: "112px", cursor: "pointer" }}
                            >
                                <img src={regen_icon} alt="icon" style={{ width: "16px", height: "16px", marginRight: "6px" }} />
                                <span>Regenerate</span>
                            </button>
                        </div>
                }
            </Box>
        </Modal>
    );
};

export default MsgGeneratorModal;
