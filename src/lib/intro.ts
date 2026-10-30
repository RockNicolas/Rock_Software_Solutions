import { createContext, useContext } from 'react';

/** False while the opening intro is on screen, so entrance animations can wait for it. */
export const IntroContext = createContext(true);

export const useIntroDone = () => useContext(IntroContext);
