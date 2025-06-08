"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, boolean] {
  const [isLoading, setIsLoading] = useState(true);

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    } finally {
      setIsLoading(false);
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    setStoredValue(readValue());
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const setValue: SetValue<T> = useCallback(value => {
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      // Optional: dispatch event to sync tabs
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          if (event.newValue) {
            setStoredValue(JSON.parse(event.newValue) as T);
          } else {
            setStoredValue(initialValue);
          }
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
           setStoredValue(initialValue);
        }
      }
    };
    
    const handleCustomEvent = () => {
      setStoredValue(readValue());
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener("local-storage", handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener("local-storage", handleCustomEvent);
    };
  }, [key, initialValue, readValue]);

  return [storedValue, setValue, isLoading];
}
