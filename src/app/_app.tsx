"use client";

import { SessionProvider} from "next-auth/react";
import '../app/globals.css'
import 'tailwindcss/tailwind.css'
export interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthContext({ 
  children
}: AuthContextProps) {
  return <SessionProvider> {children} </SessionProvider>;
}