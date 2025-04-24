// src/app/components/Navbar.js
import { headers } from 'next/headers';
import React from 'react';
export default function NavBar() {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-6">
                <li>
                    <a href="/" className="hover:text-gray-400">Home</a>
                </li>
                <li>
                    <a href="/todo" className="hover:text-gray-400">Todo</a>
                </li>
                <li>
                    <a href="/about" className="hover:text-gray-400">About</a>
                </li>
                <li>
                    <a href="/photos" className="hover:text-gray-400">Photos</a>
                </li>
                <li>
                    <a href="/contact" className="hover:text-gray-400">Contact</a>
                </li>
            </ul>
        </nav>
    );
}