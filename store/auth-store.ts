import { create } from "zustand";
import Cookies from "js-cookie";

export type Role = "student" | "clinic" | "parent" | "admin" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initialize: () => void;
}

// Mock Users for testing
export const MOCK_USERS: Record<string, User> = {
  student: {
    id: "stu_123",
    name: "Alex Johnson",
    email: "alex.j@school.edu",
    role: "student",
  },
  clinic: {
    id: "clin_123",
    name: "Nurse Sarah",
    email: "sarah.nurse@school.edu",
    role: "clinic",
  },
  parent: {
    id: "par_123",
    name: "Michael Johnson",
    email: "michael.j@email.com",
    role: "parent",
  },
  admin: {
    id: "adm_123",
    name: "Admin User",
    email: "admin@crosshere.com",
    role: "admin",
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true, // starts loading until initialized

  login: (user: User) => {
    // Set cookie for middleware
    Cookies.set("crosshere-session-role", user.role || "", { expires: 7 });
    
    set({
      user,
      role: user.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    Cookies.remove("crosshere-session-role");
    
    set({
      user: null,
      role: null,
      isAuthenticated: false,
    });
  },

  initialize: () => {
    // Read cookie to hydrate state
    const roleCookie = Cookies.get("crosshere-session-role") as Role;
    
    if (roleCookie && MOCK_USERS[roleCookie]) {
      set({
        user: MOCK_USERS[roleCookie],
        role: roleCookie,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
