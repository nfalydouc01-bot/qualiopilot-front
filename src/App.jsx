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
        id: Date.now(),
        sender: 'ai',
        text: "❌ Aucun document trouvé. Veuillez ajouter un justificatif à gauche avant de lancer l'analyse."
      }]);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fichier", files[0].raw);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur de réponse du serveur");
      }

      const data = await response.json();

      const resultat = data.analyse;
      let texteAffiche = `✅ Analyse réussie pour "${data.fichier}" !\n\n`;

      if (resultat.erreur) {
        texteAffiche += `❌ ${resultat.erreur}`;
      } else if (resultat.reponse_brute) {
        texteAffiche += resultat.reponse_brute;
      } else {
        texteAffiche += `📊 Score de conformité : ${resultat.score_conformite}/100\n\n`;
        texteAffiche += `✔️ Preuves trouvées :\n${resultat.preuves_trouvees.map(p => `  • ${p}`).join('\n')}\n\n`;
        texteAffiche += `⚠️ Éléments manquants :\n${resultat.elements_manquants.map(e => `  • ${e}`).join('\n')}\n\n`;
        texteAffiche += `💬 Commentaire : ${resultat.commentaire}`;
      }

      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: texteAffiche
      }]);

    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `⚠️ Impossible de joindre le Back-End (${API_URL}). Assurez-vous que l'API est bien démarrée ou vérifiez vos clés API dans le script Python.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- GESTION DU CHAT ---
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    const userQuestion = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `J'ai bien reçu votre message concernant : "${userQuestion}". Dès que le Back-End sera connecté globalement, Claude pourra répondre à vos questions spécifiques.`
      }]);
      setIsLoading(false);
    }, 2000);
  };

  // --- GESTION DES FICHIERS ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: 'file-' + Date.now() + '-' + Math.random(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        raw: file
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const deleteFile = (idToDelete) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.id !== idToDelete));
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-950 text-slate-100 p-6">

      <header className="text-center my-4">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 tracking-tight">
          Bienvenue sur Qualiopilot 🚀
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-medium">Assistant intelligent de conformité documentaire</p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-start">

        <div className="flex flex-col gap-4 w-full">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col w-full">
            <h2 className="text-lg font-bold text-blue-400 mb-3">Preuves & Justificatifs</h2>

            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900 transition-colors group mb-4">
              <div className="flex flex-col items-center justify-center text-center px-2">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📁</span>
                <p className="mb-0.5 text-xs text-slate-300 font-semibold">Cliquez pour ajouter un document</p>
                <p className="text-[10px] text-slate-500">PDF, Word, Images, Scans...</p>
              </div>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Fichiers chargés ({files.length}) :
            </p>

            <div className="space-y-2 w-full">
              {files.length === 0 ? (
                <p className="text-sm text-slate-500 italic pt-1">Aucun document pour le moment.</p>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm w-full">
                    <div className="flex flex-col min-w-0 flex-1 pr-4">
                      <span className="text-slate-200 truncate font-medium">{file.name}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{file.size}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteFile(file.id)}
                      className="text-xs bg-red-950 hover:bg-red-900 text-red-400 px-3 py-1.5 rounded-md border border-red-900 transition-colors flex-shrink-0 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={triggerBackendSimulation}
            disabled={isLoading}
            className="w-fit mx-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            Lancer l'analyse de conformité
          </button>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[320px] w-full overflow-hidden">

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-md whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-center gap-2 text-slate-400 text-sm italic animate-pulse">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span>Qualiopilot analyse votre demande...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Posez une question à Claude sur votre audit..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors text-sm shadow-lg"
            >
              Envoyer🔎
            </button>
          </form>

        </div>

      </main>

      <footer className="w-full max-w-5xl text-right text-xs text-slate-600 my-4 font-medium pr-2">
        Qualiopilot MVP
      </footer>

    </div>
  );
}

export default App;