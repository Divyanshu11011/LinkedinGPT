import React, { useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import Generate_Icon from 'assets/modal-icons/generate-msg-icon.svg';
import Insert_Icon from 'assets/modal-icons/insert-msg-icon.svg';
import regen_icon from 'assets/modal-icons/regenerate-msg-icon.svg';
import { generateMessages } from "../utils/messageGenerator";

interface IPrompts {
  role: string;
  message: string;
}

const MsgGeneratorModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [messagePrompts, setMessagePrompts] = useState<IPrompts[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const handleGenerateMessage = () => {
    const newMessages = generateMessages(userInput);
    setMessagePrompts((prev) => [...prev, ...newMessages]);
    setUserInput("");
  };

  const handleInsertMessage = () => {
    const textBox = document.querySelector<HTMLElement>(".msg-form__contenteditable");
    if (textBox) {
      const placeHolder = document.querySelector(".msg-form__placeholder");
      if (placeHolder) {
        placeHolder.remove();
      }

      const existingText = textBox.textContent?.trim() || "";
      textBox.textContent = existingText ? `${existingText}\n${messagePrompts[messagePrompts.length - 1]?.message}` : messagePrompts[messagePrompts.length - 1]?.message;

      const range = document.createRange();
      range.selectNodeContents(textBox);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      setUserInput("");
      setMessagePrompts([]);
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messagePrompts.length > 0 && messagePrompts.map((prompt, index) => (
          <Typography
            key={index}
            sx={{
              maxWidth: 'max-content',
              alignSelf: prompt.role === 'user' ? 'end' : 'start',
              fontSize: '14px',
              fontWeight: '400',
              color: '#666D80',
              bgcolor: prompt.role === 'user' ? '#DFE1E7' : '#DBEAFE',
              padding: 1,
              paddingX: 2,
              marginBottom: 2,
              borderRadius: 2
            }}
          >
            {prompt.message}
          </Typography>
        ))}
        <input
          type="text"
          placeholder="Your prompt"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{
            fontSize: '14px',
            borderRadius: '6px',
            marginBottom: '8px',
            padding: '8px',
            border: '1px solid #ccc'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {messagePrompts.length === 0 ? (
            <button
              type="button"
              onClick={handleGenerateMessage}
              style={{
                backgroundColor: '#3B82F6',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '4px',
                padding: '6px',
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '112px',
                cursor: 'pointer'
              }}
            >
              <img src={Generate_Icon} alt="icon" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Generate
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleInsertMessage}
                style={{
                  color: '#666D80',
                  border: '2px solid #666D80',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  padding: '6px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80px',
                  cursor: 'pointer',
                  marginRight: '4px'
                }}
              >
                <img src={Insert_Icon} alt="icon" style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                Insert
              </button>
              <button
                type="button"
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  padding: '6px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '112px',
                  cursor: 'pointer'
                }}
              >
                <img src={regen_icon} alt="icon" style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                Regenerate
              </button>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default MsgGeneratorModal;
