import React, { useState } from 'react';

const TelaLogin = ({ aoLogar }) => {
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const manipularSubmissao = async (e) => {
    e.preventDefault();
    setErro('');

    const url = modo === 'login' ? '/auth/login' : '/auth/cadastro';
    const corpo = modo === 'login' ? { email, senha } : { nome, email, senha };

    try {
      const res = await fetch(`http://localhost:3001${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
      });

      const dados = await res.json();

      if (!res.ok) throw new Error(dados.erro);

      if (modo === 'login') {
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        aoLogar(dados.usuario);
      } else {
        setModo('login');
        alert('Cadastro realizado com sucesso! Agora faça o seu login.');
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
      <div className="flex gap-4 mb-8">
        <button 
          type="button"
          onClick={() => { setModo('login'); setErro(''); }}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${modo === 'login' ? 'bg-zinc-100 text-black' : 'bg-zinc-800 text-zinc-400'}`}
        >
          LOGIN
        </button>
        <button 
          type="button"
          onClick={() => { setModo('cadastro'); setErro(''); }}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${modo === 'cadastro' ? 'bg-zinc-100 text-black' : 'bg-zinc-800 text-zinc-400'}`}
        >
          CADASTRO
        </button>
      </div>

      <form onSubmit={manipularSubmissao} className="flex flex-col gap-4">
        {modo === 'cadastro' && (
          <input 
            type="text" 
            placeholder="Nome completo" 
            value={nome} 
            onChange={e => setNome(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-zinc-500"
            required
          />
        )}
        
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-zinc-500"
          required
        />
        
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={e => setSenha(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-zinc-500"
          required
        />

        {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

        <button 
          type="submit"
          className="bg-zinc-100 text-black py-4 rounded-2xl font-bold mt-4 hover:bg-white transition-all shadow-lg"
        >
          {modo === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
        </button>
      </form>
    </div>
  );
};

export default TelaLogin; 