import { UserProfile } from '../types';

export interface UserAccount extends UserProfile {
  id: string;
  email: string;
  password?: string;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'insta_fresh_auth_user';
const USERS_STORAGE_KEY = 'insta_fresh_registered_users';

export const authService = {
  getCurrentUser(): UserAccount | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  getAllUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUserToRegistry(user: UserAccount): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(
      u => u.username.toLowerCase() === user.username.toLowerCase() || u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  login(usernameOrEmail: string, password?: string): UserAccount {
    const users = this.getAllUsers();
    const cleanIdentifier = usernameOrEmail.trim().toLowerCase();

    const found = users.find(
      u => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier
    );

    if (!found) {
      throw new Error('Account not found. Please create an account first.');
    }

    if (found.password && password && found.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    this.setCurrentUser(found);
    return found;
  },

  signup(email: string, fullName: string, username: string, password?: string): UserAccount {
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    const users = this.getAllUsers();
    const exists = users.some(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      throw new Error('An account with this username or email already exists. Please log in.');
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: fullName.trim(),
      email: cleanEmail,
      password: password || '',
      bio: '',
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`,
      createdAt: new Date().toISOString()
    };

    this.saveUserToRegistry(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  deleteAccount(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const users = this.getAllUsers().filter(u => u.id !== currentUser.id);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    // Wipe current user's session and all stored content
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('insta_fresh_memories');
    localStorage.removeItem('insta_fresh_stories');
    localStorage.removeItem('insta_fresh_highlights');
    localStorage.removeItem('insta_fresh_archives');
  }
};
