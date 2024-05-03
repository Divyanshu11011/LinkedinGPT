import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState, useRef } from "react";
import MessageGeneratorModal from "~generator-modal/MessageGenerator";
import TextBoxIcon from "assets/modal-icons/text-box-icon.svg";
import BackgroundTextBoxIcon from "assets/modal-icons/background-blur.svg";

// Define Plasmo configuration
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

// Content component definition
const Content = () => {
  // State variables to track modal and textbox activity
  const [isMessageGeneratorOpen, setIsMessageGeneratorOpen] = useState(false);
  const [isTextBoxActive, setIsTextBoxActive] = useState(false); // Track textbox activity

  // Refs for icon container and image element
  const iconContainerRef = useRef<HTMLDivElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Effect hook to initialize icon container and observe mutations
  useEffect(() => {
    if (!iconContainerRef.current) {
      createIconContainer();
    }

    // Mutation observer to detect changes in the DOM
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

    // Start observing changes in the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup function to disconnect the observer
    return () => {
      observer.disconnect();
      iconContainerRef.current?.remove();
    };
  }, []);

  // Function to create the icon container
  const createIconContainer = () => {
    const container = document.createElement("div");
    container.className = "ai-icon absolute bottom-0 right-0 hidden";
    const imgElement = document.createElement("img");
    imgElement.src = TextBoxIcon;
    imgElement.alt = "ai-icon";
    imgElement.className = "w-8 h-8 cursor-pointer";

    // Event listener to open message generator modal and update icon
    imgElement.addEventListener("click", () => {
      setIsMessageGeneratorOpen(true);
      imgElement.src = BackgroundTextBoxIcon;
      iconContainerRef.current?.classList.remove("hidden");
    });

    // Append image element to the container
    container.appendChild(imgElement);
    imgElementRef.current = imgElement;

    // Set container's position
    container.style.position = 'absolute';
    container.style.bottom = '0';
    container.style.right = '0';

    // Set icon container reference
    iconContainerRef.current = container;
  };

  // Function to setup textbox event listeners
  const setupTextBox = (textBox: HTMLElement) => {
    // Event listener for textbox focus
    textBox.addEventListener("focus", () => {
      setIsTextBoxActive(true);
      if (iconContainerRef.current && imgElementRef.current) {
        textBox.appendChild(iconContainerRef.current);
        imgElementRef.current.src = TextBoxIcon;
        iconContainerRef.current.classList.remove("hidden");
      }
    });

    // Event listener for textbox blur
    textBox.addEventListener("blur", () => {
      setIsTextBoxActive(false);
      if (iconContainerRef.current && imgElementRef.current && !isMessageGeneratorOpen) {
        iconContainerRef.current.classList.add("hidden");
      }
    });
  };

  // Effect hook to handle icon visibility based on modal and textbox state
  useEffect(() => {
    if (isMessageGeneratorOpen && iconContainerRef.current && imgElementRef.current) {
      if (!isTextBoxActive) {
        imgElementRef.current.src = BackgroundTextBoxIcon;
      }
      iconContainerRef.current.classList.remove("hidden");
    }
  }, [isMessageGeneratorOpen, isTextBoxActive]);

  // JSX to render the message generator modal
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

// Export the Content component as default
export default Content;
