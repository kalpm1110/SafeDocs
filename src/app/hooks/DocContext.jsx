
"use client"
import { createContext, useContext } from "react";

export const DocContext=createContext(null);
export const useDoc=()=>useContext(DocContext);