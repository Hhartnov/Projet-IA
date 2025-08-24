import React, { useState } from 'react';
import { Search, User, AlertTriangle, Scale } from 'lucide-react';

const App = () => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedCrime, setSelectedCrime] = useState('');
  const [result, setResult] = useState(null);
  const [isInvestigating, setIsInvestigating] = useState(false);

  const persons = [
    { id: 'john', name: 'John' },
    { id: 'mary', name: 'Mary' },
    { id: 'alice', name: 'Alice' },
    { id: 'bruno', name: 'Bruno' },
    { id: 'sophie', name: 'Sophie' },
  ];

  const crimes = [
    { id: 'vol', name: 'Vol' },
    { id: 'assassinat', name: 'Assassinat' },
    { id: 'escroquerie', name: 'Escroquerie' },
  ];

  const handleInvestigate = async () => {
    if (!selectedPerson || !selectedCrime) return;
    setIsInvestigating(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/enquete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suspect: selectedPerson.toLowerCase(),
          crime: selectedCrime.toLowerCase()
        }),
      });

      if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Erreur fetch/JSON:', err);
      setResult({ error: err.message });
    } finally {
      setIsInvestigating(false);
    }
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center"
         style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)' }}>

      <header className="text-center mb-5 text-white">
        <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
          <Scale className="text-warning" size={50} />
          <h1 className="display-3 fw-bold text-warning">Enquête Criminelle</h1>
        </div>
        <p className="lead text-light">Analyse des suspects et détermination de culpabilité</p>
      </header>

      <section className="card shadow-lg rounded-5 p-4 p-md-5 w-100 mx-3 mx-md-0"
               style={{ maxWidth: '500px', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)' }}>

        <div className="mb-3">
          <label className="form-label text-info fw-bold d-flex align-items-center gap-2">
            <User /> Suspect
          </label>
          <select
            className="form-select bg-secondary text-white border-0 shadow-sm"
            aria-label="Sélectionner un suspect"
            value={selectedPerson}
            onChange={e => setSelectedPerson(e.target.value)}
          >
            <option value="">Sélectionner un suspect...</option>
            {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label text-danger fw-bold d-flex align-items-center gap-2">
            <AlertTriangle /> Crime
          </label>
          <select
            className="form-select bg-secondary text-white border-0 shadow-sm"
            aria-label="Sélectionner un crime"
            value={selectedCrime}
            onChange={e => setSelectedCrime(e.target.value)}
          >
            <option value="">Sélectionner un crime...</option>
            {crimes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <button
          className="btn btn-gradient w-100 fw-bold"
          onClick={handleInvestigate}
          disabled={!selectedPerson || !selectedCrime || isInvestigating}
        >
          <Search className="me-2" /> {isInvestigating ? '...' : 'Lancer l\'enquête'}
        </button>
      </section>

      {result && (
        <section className="card shadow-lg rounded-5 p-4 mt-4 w-100 mx-3 mx-md-0 text-center"
                 style={{ maxWidth: '400px', background: 'rgba(15,23,42,0.85)', color: '#fff' }}>
          <h3>
            {result.isguilty === 'guilty' ? 'Coupable' : 'Innocent'}
          </h3>
        </section>
      )}

      <style>{`
        .btn-gradient {
          background: linear-gradient(90deg, #facc15, #f97316);
          color: white;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn-gradient:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default App;
