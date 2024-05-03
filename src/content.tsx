import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState, useRef } from "react";
import MessageGeneratorModal from "~generator-modal/MessageGenerator";
import TextBoxIcon from "assets/modal-icons/text-box-icon.svg";
import BackgroundTextBoxIcon from "assets/modal-icons/background-blur.svg";

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

const Content = () => {
  const [isMessageGeneratorOpen, setIsMessageGeneratorOpen] = useState(false);
  const [isTextBoxActive, setIsTextBoxActive] = useState(false); // Track textbox activity
  const iconContainerRef = useRef<HTMLDivElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!iconContainerRef.current) {
      createIconContainer();
    }

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement && node.matches(".msg-form__contenteditable")) {
              setupTextBox(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      iconContainerRef.current?.remove();
    };
  }, []);

  const createIconContainer = () => {
    const container = document.createElement("div");
    container.className = "ai-icon absolute bottom-0 right-0 hidden";
    const imgElement = document.createElement("img");
    imgElement.src = TextBoxIcon;
    imgElement.alt = "ai-icon";
    imgElement.className = "w-8 h-8 cursor-pointer";
    imgElement.addEventListener("click", () => {
      setIsMessageGeneratorOpen(true);
      imgElement.src = BackgroundTextBoxIcon;
      iconContainerRef.current?.classList.remove("hidden");
    });
    container.appendChild(imgElement);
    imgElementRef.current = imgElement;

    container.style.position = 'absolute';
    container.style.bottom = '0';
    container.style.right = '0';

    iconContainerRef.current = container;
  };

  const setupTextBox = (textBox: HTMLElement) => {
    textBox.addEventListener("focus", () => {
      setIsTextBoxActive(true);
      if (iconContainerRef.current && imgElementRef.current) {
        textBox.appendChild(iconContainerRef.current);
        imgElementRef.current.src = TextBoxIcon;
        iconContainerRef.current.classList.remove("hidden");
      }
    });

    textBox.addEventListener("blur", () => {
      setIsTextBoxActive(false);
      if (iconContainerRef.current && imgElementRef.current && !isMessageGeneratorOpen) {
        iconContainerRef.current.classList.add("hidden");
      }
    });
  };

  useEffect(() => {
    if (isMessageGeneratorOpen && iconContainerRef.current && imgElementRef.current) {
      if (!isTextBoxActive) {
        imgElementRef.current.src = BackgroundTextBoxIcon;
      }
      iconContainerRef.current.classList.remove("hidden");
    }
  }, [isMessageGeneratorOpen, isTextBoxActive]);

  return (
    <div>
      <MessageGeneratorModal 
        open={isMessageGeneratorOpen} 
        handleClose={() => {
          setIsMessageGeneratorOpen(false);
          if (!isTextBoxActive && iconContainerRef.current && imgElementRef.current) {
            imgElementRef.current.src = TextBoxIcon;
            iconContainerRef.current.classList.add("hidden");
          }
        }} 
      />
    </div>
  );
};

export default Content;
