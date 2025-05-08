'use client';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} className="btn btn-sm btn-outline">
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
