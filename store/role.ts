import { create } from "zustand";

interface AdminRole {
  role: string;
  setRole: (newRole: string) => void;
}

const useAdminRole = create<AdminRole>((set) => ({
  role: "",
  setRole: (newRole) => set({ role: newRole }),
}));

export default useAdminRole;
