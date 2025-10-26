'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { MOCK_USERS } from '@/lib/data';

type Language = 'en' | 'es';

interface UserDataContextType {
  user: User | null;
  isLoading: boolean;
  language: Language;
  login: (email: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string) => void;
  toggleAllergy: (allergyId: string) => void;
  toggleDiet: (dietId: string) => void;
  setHealthGoal: (goalId: string) => void;
  toggleShoppingListItem: (productId: string) => void;
  addScanToHistory: (productId: string) => void;
  clearShoppingList: () => void;
  toggleLanguage: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      const initialUsers = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
      setUsers(initialUsers);

      const storedUserEmail = localStorage.getItem('currentUserEmail');
      if (storedUserEmail) {
        const user = initialUsers.find((u: User) => u.email === storedUserEmail) || null;
        setCurrentUser(user);
      }
      
      const storedLang = localStorage.getItem('language') as Language | null;
      if (storedLang) {
        setLanguage(storedLang);
      }

    } catch (error) {
      console.error("Could not access localStorage on initial load.", error);
      setUsers(MOCK_USERS);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error("Could not save users to localStorage.", error);
      }
    }
  }, [users, isLoading]);

  const updateUser = useCallback((userUpdater: (user: User) => User) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = userUpdater(prevUser);
      setUsers(currentUsers => currentUsers.map(u => u.email === updatedUser.email ? updatedUser : u));
      return updatedUser;
    });
  }, []);

  const login = (email: string): boolean => {
    const userToLogin = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userToLogin) {
      setCurrentUser(userToLogin);
      try {
        localStorage.setItem('currentUserEmail', userToLogin.email);
      } catch (error) {
        console.error("Could not access localStorage.", error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('currentUserEmail');
    } catch (error) {
      console.error("Could not access localStorage.", error);
    }
  };
  
  const signup = (name: string, email: string) => {
    const newUser: User = {
        name,
        email,
        avatarUrl: `https://picsum.photos/seed/${email}/100/100`,
        avatarHint: 'person',
        allergies: [],
        diet: [],
        healthGoals: [],
        shoppingList: [],
        scanHistory: [],
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    try {
        localStorage.setItem('currentUserEmail', newUser.email);
    } catch (error) {
        console.error("Could not access localStorage.", error);
    }
  };

  const toggleAllergy = (allergyId: string) => {
    updateUser(user => {
      const allergies = user.allergies.includes(allergyId)
        ? user.allergies.filter(id => id !== allergyId)
        : [...user.allergies, allergyId];
      return { ...user, allergies };
    });
  };
  
  const toggleDiet = (dietId: string) => {
    updateUser(user => {
      const diet = user.diet.includes(dietId)
        ? user.diet.filter(id => id !== dietId)
        : [...user.diet, dietId];
      return { ...user, diet };
    });
  };

  const setHealthGoal = (goalId: string) => {
    updateUser(user => {
      const healthGoals = user.healthGoals[0] === goalId ? [] : [goalId];
      return { ...user, healthGoals };
    });
  };

  const toggleShoppingListItem = (productId: string) => {
    updateUser(user => {
      const shoppingList = user.shoppingList.includes(productId)
        ? user.shoppingList.filter(id => id !== productId)
        : [...user.shoppingList, productId];
      return { ...user, shoppingList };
    });
  };
  
  const addScanToHistory = useCallback((productId: string) => {
    updateUser(user => {
        if (user.scanHistory[0] === productId) {
            return user;
        }
        const newHistory = [productId, ...user.scanHistory.filter(id => id !== productId)];
        return { ...user, scanHistory: newHistory };
    });
  }, [updateUser]);

  const clearShoppingList = () => {
    updateUser(user => ({...user, shoppingList: []}));
  }

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
     try {
        localStorage.setItem('language', newLang);
    } catch (error) {
        console.error("Could not access localStorage.", error);
    }
  }

  const value = { 
      user: currentUser, 
      isLoading,
      language,
      login, 
      logout, 
      signup, 
      toggleAllergy, 
      toggleDiet, 
      setHealthGoal,
      toggleShoppingListItem, 
      addScanToHistory, 
      clearShoppingList,
      toggleLanguage,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
