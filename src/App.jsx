import React, { useState } from 'react';

// URL du Back-End : utilise la variable d'environnement en production,
// et retombe sur localhost si elle n'est pas définie (développement local)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:9257";

function App() {
  // --- ÉTATS POUR LE CHAT ---
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Bonjour ! Je suis l\'assistant Qualiopilot. Déposez vos justificatifs à gauche ou posez-moi une question sur les critères Qualiopi.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- ÉTAT POUR LES FICHIERS ---
  const [files, setFiles] = useState([]);

  // --- FONCTION DE CONNEXION AU BACK-END ---
  const triggerBackendSimulation = async () => {
    if (isLoading) return;

    if (files.length === 0) {
      setMessages((prev) => [...prev, {
