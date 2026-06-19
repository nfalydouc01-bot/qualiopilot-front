import React, { useState } from 'react';

function App() {
  // --- ÉTATS POUR LE CHAT ---
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Bonjour ! Je suis l\'assistant Qualiopilot. Déposez vos justificatifs à gauche ou posez-moi une question sur les critères Qualiopi.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- ÉTAT POUR LES FICHIERS ---
  const [files, setFiles] = useState([
    { id: 'initial-file-1', name: 'Big Sur Aerial.madesktop', size: '0.00 MB' }
  ]);

  // --- FONCTION DU BOUTON VERT ---
  const triggerBackendSimulation = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: "J'ai bien détecté votre demande d'analyse globale. Dès que mes collègues du Back-End auront branché l'API, Claude analysera l'intégralité de vos documents chargés par rapport au référentiel Qualiopi ! 🚀"
      }]);
      setIsLoading(false);
    }, 2000);
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
        text: `J'ai bien reçu votre message concernant : "${userQuestion}". Dès que le Back-End sera connecté, Claude analysera vos documents par rapport aux critères Qualiopi.`
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
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const deleteFile = (idToDelete) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.id !== idToDelete));
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-950 text-slate-100 p-6">
      
      {/* Titre principal */}
      <header className="text-center my-4">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 tracking-tight">
          Bienvenue sur Qualiopilot 🚀
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-medium">Assistant intelligent de conformité documentaire</p>
      </header>

      {/* Zone principale */}
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-start">
        
        {/* COLONNE GAUCHE */}
        <div className="flex flex-col gap-4 w-full">
          
          {/* LE BLOC GRIS (Preuves & Justificatifs) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col w-full">
            <h2 className="text-lg font-bold text-blue-400 mb-3">Preuves & Justificatifs</h2>
            
            {/* Zone d'upload */}
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900 transition-colors group mb-4">
              <div className="flex flex-col items-center justify-center text-center px-2">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📁</span>
                <p className="mb-0.5 text-xs text-slate-300 font-semibold">Cliquez pour ajouter un document</p>
                <p className="text-[10px] text-slate-500">PDF, Word, Images, Scans...</p>
              </div>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>

            {/* Titre de la liste */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Fichiers chargés ({files.length}) :
            </p>

            {/* Liste des fichiers */}
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

          {/* LE BOUTON VERT */}
          <button 
            onClick={triggerBackendSimulation}
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            <span></span> Lancer l'analyse de conformité
          </button>

        </div>

        {/* COLONNE DROITE : Fenêtre de Chat diminuée en épaisseur (h-[320px]) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[320px] w-full overflow-hidden">
          
          {/* Zone des messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-md ${
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

          {/* Formulaire de chat */}
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

      {/* Pied de page */}
      <footer className="w-full max-w-5xl text-right text-xs text-slate-600 my-4 font-medium pr-2">
        Qualiopilot MVP
      </footer>

    </div>
  );
}

export default App;