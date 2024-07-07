interface IPrompts {
    role: string;
    message: string;
  }
  
  export const generateMessages = (userInput: string): IPrompts[] => {
    if (!userInput || userInput.length === 0) {
      return [];
    }
  
    return [
      { role: "user", message: userInput },
      { role: "system", message: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask." },
    ];
  };
  