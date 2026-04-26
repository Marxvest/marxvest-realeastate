"use client";

import { useState } from "react";

import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? <ChatWindow onClose={() => setIsOpen(false)} /> : null}
      {!isOpen ? (
        <ChatButton
          isOpen={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        />
      ) : null}
    </>
  );
}
