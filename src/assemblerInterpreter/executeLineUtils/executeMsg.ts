import {
  ExecutionContext,
  FunctionCall,
  Dictionary,
} from "../assemblerUtils/assemblerTypes";

export function executeMsg(
  executionContext: ExecutionContext,
  currentLine: FunctionCall,
): void {
  if (currentLine.command !== "msg") {
    throw new Error("Unknown command: " + currentLine.command);
  }
  const { message } = currentLine;
  const translatedMessage: string = translateMessage(
    message,
    executionContext.dictionary,
  );
  executionContext.returnValue = translatedMessage;
  return;
}

export function translateMessage(
  message: string,
  dictionary: Dictionary,
): string {
  const splitMessage = cleanUpMessage(message);
  const translatedSplitMessage = splitMessage.map((part) => {
    if (part.includes("'")) {
      const strMsg = part.split("'").filter((char) => char !== "");
      return strMsg;
    }
    const registerKey: string = part.trim();

    if (dictionary[registerKey] !== undefined) {
      return dictionary[registerKey].toString();
    }
    throw new Error(part + " is not in dictionary: " + dictionary);
  });

  const translatedMessage = translatedSplitMessage.join("");
  return translatedMessage;
}

function cleanUpMessage(message: string): string[] {
  const splitMessage: string[] = [];
  let betweenTicks = false;
  let currentWord = "";
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    switch (betweenTicks) {
      case false:
        if (char !== "'" && char !== "" && char !== " " && char !== ",") {
          currentWord += char;
        } else if (char === "'" && currentWord !== "") {
          splitMessage.push(currentWord);
          currentWord = "'";
          betweenTicks = true;
        } else if (char === "'") {
          currentWord = "'";
          betweenTicks = true;
        }
        break;
      case true:
        if (char !== "'") {
          currentWord += char;
        } else {
          currentWord += "'";
          splitMessage.push(currentWord);
          currentWord = "";
          betweenTicks = false;
        }
        break;
    }
  }
  if (currentWord !== "") {
    splitMessage.push(currentWord);
  }
  return splitMessage;
}
