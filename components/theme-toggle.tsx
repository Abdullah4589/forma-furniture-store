"use client";

import { useEffect, useState } from 'react';
import { Laptop, Moon, Sun } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Theme = 'device' | 'light' | 'dark';
const themeKey = 'forma-theme-v1';

export function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
    const [theme, setTheme] = useState<Theme>('device');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Browser preference is unavailable during server rendering.
        /* eslint-disable react-hooks/set-state-in-effect */
        try {
            const stored = localStorage.getItem(themeKey);
            if (stored === 'light' || stored === 'dark') setTheme(stored);
        } catch { /* Device theme still works without storage. */ }
        setLoaded(true);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const preference = window.matchMedia('(prefers-color-scheme: dark)');
        const apply = () => {
            document.documentElement.dataset.theme = theme;
            document.documentElement.dataset.colorScheme = theme === 'device' ? (preference.matches ? 'dark' : 'light') : theme;
        };
        apply();
        preference.addEventListener('change', apply);
        try { localStorage.setItem(themeKey, theme); } catch { /* The choice remains active for this visit. */ }
        return () => preference.removeEventListener('change', apply);
    }, [theme, loaded]);

    useEffect(() => {
        const sync = (event: Event) => setTheme((event as CustomEvent<Theme>).detail);
        window.addEventListener('forma-theme-change', sync);
        return () => window.removeEventListener('forma-theme-change', sync);
    }, []);

    const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Laptop;
    return <DropdownMenu><DropdownMenuTrigger aria-label={`Theme: ${theme}. Choose appearance`} className={`theme-trigger ${mobile ? 'theme-trigger-mobile' : ''}`}><Icon size={20}/>{mobile && <span>Appearance · {theme}</span>}</DropdownMenuTrigger><DropdownMenuContent align={mobile ? 'start' : 'end'} className="theme-menu"><DropdownMenuLabel>Appearance</DropdownMenuLabel><DropdownMenuRadioGroup value={theme} onValueChange={value => { setTheme(value as Theme); window.dispatchEvent(new CustomEvent('forma-theme-change', { detail: value })); }}><DropdownMenuRadioItem value="device"><Laptop size={17}/> Device</DropdownMenuRadioItem><DropdownMenuRadioItem value="light"><Sun size={17}/> Light</DropdownMenuRadioItem><DropdownMenuRadioItem value="dark"><Moon size={17}/> Dark</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>;
}
