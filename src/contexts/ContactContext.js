// ContactStatusContext.js
import React, { createContext, useContext, useState } from "react";

const ContactStatusContext = createContext();

export const useContactStatus = () => useContext(ContactStatusContext);

export const ContactProvider = ({ children }) => {
  const [contactDisabled, setContactDisabled] = useState({});

  const disableContact = (userId) => {
    setContactDisabled((prev) => ({ ...prev, [userId]: true }));
    console.log("contactDisabled state has changed:", contactDisabled);
  };

  const enableContact = (userId) => {
    setContactDisabled((prev) => ({ ...prev, [userId]: false }));
  };

  return (
    <ContactStatusContext.Provider
      value={{ contactDisabled, disableContact, enableContact }}
    >
      {children}
    </ContactStatusContext.Provider>
  );
};
