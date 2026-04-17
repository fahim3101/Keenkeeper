import { createContext, useState } from "react";

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
  const [timelineEntries, setTimelineEntries] = useState([]);

  const addInteraction = (interactionType, friendName) => {
    const newEntry = {
      id: Date.now(),
      type: interactionType,
      title: `${interactionType} with ${friendName}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setTimelineEntries([newEntry, ...timelineEntries]);
  };

  return (
    <TimelineContext.Provider value={{ timelineEntries, addInteraction }}>
      {children}
    </TimelineContext.Provider>
  );
};