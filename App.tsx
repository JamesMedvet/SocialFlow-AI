
import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  LayoutDashboard, 
  Settings, 
  PlusCircle, 
  Share2, 
  LogOut, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle, 
  Github, 
  Facebook, 
  Instagram,
  Link as LinkIcon,
  Unlink,
  User,
  Camera,
  RefreshCw,
  Mail,
  Type as TypeIcon
} from 'lucide-react';
import { UserProfile, PostContent, NicheConfig, SocialIntegrations } from './types';
import { generatePostText, generatePostImage } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'settings' | 'profile'>('dashboard');
  const [configTab, setConfigTab] = useState<'niche' | 'profile'>('niche');
  
  const [niche, setNiche] = useState<NicheConfig>({
    name: 'Pets e Bem-estar',
    tone: 'Carinhoso e Informativo',
    targetAudience: 'Donos de cães e gatos'
  });
  
  const [posts, setPosts] = useState<PostContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<PostContent> | null>(null);

  // Estados temporários para edição de perfil
  const [tempProfile, setTempProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setTempProfile({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleLogin = () => {
    setUser({
      name: 'James Andrade',
      email: 'james@socialflow.ai',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      integrations: {
        facebook: false,
        instagram: false
      }
    });
    setActiveView('dashboard');
  };

  const syncFromSocial = (platform: 'google' | 'facebook' | 'instagram') => {
    if (!user) return;
    
    // Simulação de sincronização de dados
    const mockData = {
      google: { name: 'James Google User', email: 'james.google@gmail.com', pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google' },
      facebook: { name: 'James no Facebook', email: 'james.fb@facebook.com', pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FB' },
      instagram: { name: 'James Instagram', email: 'james.ig@insta.com', pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IG' }
    };

    const data = mockData[platform];
    setUser({
      ...user,
      name: data.name,
      email: data.email,
      picture: data.pic
    });
    alert(`Dados sincronizados com sucesso do ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
  };

  const saveProfile = () => {
    if (!user) return;
    setUser({
      ...user,
      name: tempProfile.name,
      email: tempProfile.email
    });
    alert("Perfil atualizado com sucesso!");
  };

  const toggleSocial = (platform: keyof SocialIntegrations) => {
    if (!user) return;
    setUser({
      ...user,
      integrations: {
        ...user.integrations,
        [platform]: !user.integrations[platform]
      }
    });
  };

  const createPost = async () => {
    setIsGenerating(true);
    try {
      const text = await generatePostText(niche.name, niche.tone, niche.targetAudience);
      const imageUrl = await generatePostImage(niche.name + " " + niche.tone);
      
      const newPost: PostContent = {
        id: Date.now().toString(),
        niche: niche.name,
        text,
        imageUrl,
        timestamp: Date.now(),
        status: 'draft'
      };
      
      setCurrentPost(newPost);
    } catch (error) {
      console.error("Erro na geração:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const publishPost = (id: string) => {
    if (!user?.integrations.facebook && !user?.integrations.instagram) {
      alert("Por favor, conecte pelo menos uma rede social antes de postar.");
      setActiveView('settings');
      return;
    }
    setPosts(prev => [{ ...currentPost as PostContent, status: 'posted' }, ...prev]);
    setCurrentPost(null);
    alert(`Publicado com sucesso no ${user.integrations.facebook ? 'Facebook' : ''} ${user.integrations.instagram ? 'e Instagram' : ''}!`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 relative overflow-hidden text-slate-100">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-12 border border-slate-800 shadow-2xl text-center space-y-10 relative z-10">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden p-2">
                <img 
                  src="https://i.postimg.cc/85zP3mXG/logo-pet.png" 
                  alt="Social Flow AI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Social Flow AI</h1>
            <p className="text-slate-400 text-lg">Inteligência que move suas redes.</p>
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 px-6 rounded-2xl font-bold hover:bg-slate-200 transition-all transform active:scale-95 shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>
          
          <div className="pt-8 border-t border-slate-800/50">
            <p className="text-sm text-slate-500 font-medium">
              Criado por <span className="text-cyan-400">James Andrade</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100">
      {/* Sidebar Navigation */}
      <nav className="w-full lg:w-72 bg-slate-900 border-r border-slate-800/50 p-8 flex flex-col gap-10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
            <img src="https://i.postimg.cc/85zP3mXG/logo-pet.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white leading-none">Social Flow</span>
            <span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mt-1">AI Automation</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-grow">
          <button 
            onClick={() => { setActiveView('dashboard'); setCurrentPost(null); }}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-medium ${activeView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => { setActiveView('settings'); setConfigTab('niche'); }}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-medium ${activeView === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <Settings size={20} /> Configuração
          </button>
          <button 
            onClick={() => { setActiveView('profile'); }}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-medium ${activeView === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <User size={20} /> Meu Perfil
          </button>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex items-center gap-4 group cursor-pointer" onClick={() => setActiveView('profile')}>
          <div className="relative">
            <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full border-2 border-slate-700 p-0.5 group-hover:border-cyan-500 transition-all" />
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setUser(null); }} className="text-slate-600 hover:text-red-400 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto">
        
        {/* VIEW: SETTINGS OR PROFILE */}
        {(activeView === 'settings' || activeView === 'profile') && (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white">{activeView === 'profile' ? 'Meu Perfil' : 'Configurações'}</h2>
                <p className="text-slate-500">Personalize sua experiência e integrações.</p>
              </div>
              
              {/* Tabs Switcher */}
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                <button 
                  onClick={() => { setConfigTab('niche'); setActiveView('settings'); }}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${configTab === 'niche' && activeView === 'settings' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Nicho e Redes
                </button>
                <button 
                  onClick={() => { setConfigTab('profile'); setActiveView('profile'); }}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'profile' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Meu Perfil
                </button>
              </div>
            </div>

            {activeView === 'profile' ? (
              /* PROFILE SECTION */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl relative">
                        <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="text-white" size={32} />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg">
                         <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user.name}</h3>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    
                    <div className="w-full pt-6 border-t border-slate-800 flex flex-col gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-left">Sincronizar de</p>
                      <div className="flex justify-between gap-2">
                         <button onClick={() => syncFromSocial('google')} className="flex-grow flex items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 transition-all text-slate-400">
                           <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                         </button>
                         <button onClick={() => syncFromSocial('facebook')} className="flex-grow flex items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-600 transition-all text-slate-400">
                           <Facebook size={18} className="text-blue-500" />
                         </button>
                         <button onClick={() => syncFromSocial('instagram')} className="flex-grow flex items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-600 transition-all text-slate-400">
                           <Instagram size={18} className="text-pink-500" />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                        <User size={18} className="text-cyan-400" />
                      </div>
                      Informações Básicas
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-widest font-black flex items-center gap-2">
                          <TypeIcon size={12} /> Nome de Exibição
                        </label>
                        <input 
                          type="text" 
                          value={tempProfile.name}
                          onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-widest font-black flex items-center gap-2">
                          <Mail size={12} /> E-mail de Contato
                        </label>
                        <input 
                          type="email" 
                          value={tempProfile.email}
                          onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-8">
                       <button 
                        onClick={saveProfile}
                        className="w-full bg-white text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                       >
                         <RefreshCw size={20} /> Salvar Alterações
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* NICHE & SOCIALS SECTION (Settings) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] space-y-8 backdrop-blur-sm">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <PlusCircle size={18} className="text-blue-400" />
                    </div>
                    Foco do Nicho
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Nome do Nicho</label>
                      <input 
                        type="text" 
                        value={niche.name}
                        onChange={e => setNiche({...niche, name: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Tom de Voz</label>
                      <input 
                        type="text" 
                        value={niche.tone}
                        onChange={e => setNiche({...niche, tone: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Público Alvo</label>
                      <textarea 
                        value={niche.targetAudience}
                        onChange={e => setNiche({...niche, targetAudience: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 h-28 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] space-y-8 backdrop-blur-sm">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <LinkIcon size={18} className="text-green-400" />
                    </div>
                    Redes Conectadas
                  </h3>
                  
                  <div className="space-y-4">
                    <div className={`group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${user.integrations.facebook ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${user.integrations.facebook ? 'bg-white/20' : 'bg-slate-900 text-slate-400'}`}>
                          <Facebook size={22} className={user.integrations.facebook ? 'text-white' : ''} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${user.integrations.facebook ? 'text-white' : 'text-slate-300'}`}>Facebook</p>
                          <p className={`text-[10px] uppercase font-black tracking-tighter ${user.integrations.facebook ? 'text-blue-100' : 'text-slate-600'}`}>
                            {user.integrations.facebook ? 'Sincronizado' : 'Desconectado'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => toggleSocial('facebook')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${user.integrations.facebook ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-400'}`}>
                        {user.integrations.facebook ? 'Sair' : 'Login'}
                      </button>
                    </div>

                    <div className={`group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${user.integrations.instagram ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-500 shadow-lg shadow-pink-900/20' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${user.integrations.instagram ? 'bg-white/20' : 'bg-slate-900 text-slate-400'}`}>
                          <Instagram size={22} className={user.integrations.instagram ? 'text-white' : ''} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${user.integrations.instagram ? 'text-white' : 'text-slate-300'}`}>Instagram</p>
                          <p className={`text-[10px] uppercase font-black tracking-tighter ${user.integrations.instagram ? 'text-pink-100' : 'text-slate-600'}`}>
                            {user.integrations.instagram ? 'Sincronizado' : 'Desconectado'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => toggleSocial('instagram')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${user.integrations.instagram ? 'bg-white text-pink-600' : 'bg-slate-800 text-slate-400'}`}>
                        {user.integrations.instagram ? 'Sair' : 'Login'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : currentPost ? (
          /* PREVIEW POST SECTION */
          <div className="max-w-5xl mx-auto space-y-10 animate-in zoom-in-95 duration-700">
             <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-white">Novo Conteúdo</h2>
                <p className="text-slate-500">Analise e aprove a geração da IA.</p>
              </div>
              <button onClick={() => setCurrentPost(null)} className="text-slate-500 hover:text-white font-bold transition-colors">Descartar</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
               <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl group">
                 {currentPost.imageUrl ? (
                   <img src={currentPost.imageUrl} alt="AI Generated" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                 ) : (
                   <div className="w-full aspect-square flex items-center justify-center bg-slate-800">
                     <ImageIcon className="w-16 h-16 text-slate-600 animate-pulse" />
                   </div>
                 )}
               </div>
               
               <div className="space-y-8">
                 <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-800 space-y-6 backdrop-blur-md">
                   <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sugestão de Legenda</span>
                   </div>
                   <p className="text-slate-200 text-lg whitespace-pre-line leading-relaxed italic">"{currentPost.text}"</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex gap-2 mb-2">
                      {user.integrations.facebook && <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full border border-blue-600/20"><Facebook size={12}/> FB Ativo</span>}
                      {user.integrations.instagram && <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-pink-600/10 text-pink-400 px-4 py-2 rounded-full border border-pink-600/20"><Instagram size={12}/> IG Ativo</span>}
                    </div>

                   <button 
                    onClick={() => publishPost(currentPost.id!)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-3xl font-black text-xl transition-all shadow-2xl shadow-blue-900/40"
                   >
                     <Share2 size={24} /> Publicar nas Redes
                   </button>
                   <button 
                    className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-4 rounded-3xl transition-all font-bold"
                    onClick={() => { 
                      navigator.clipboard.writeText(currentPost.text!);
                      alert("Copiado!");
                    }}
                   >
                     Copiar Texto da Legenda
                   </button>
                 </div>
               </div>
             </div>
          </div>
        ) : (
          /* DASHBOARD SECTION */
          <div className="space-y-12 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-5xl font-black text-white tracking-tighter">Dashboard</h2>
                <p className="text-slate-500 text-lg">Central de Inteligência: <span className="text-blue-400 font-bold">{niche.name}</span></p>
              </div>
              <button 
                disabled={isGenerating}
                onClick={createPost}
                className="flex items-center justify-center gap-3 bg-white hover:bg-blue-50 text-slate-950 py-5 px-10 rounded-[2rem] font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:scale-105 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <PlusCircle size={22} /> Gerar Post Viral
                  </>
                )}
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.length === 0 ? (
                <div className="col-span-full py-32 text-center border-4 border-dashed border-slate-900 rounded-[3rem] space-y-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Nenhum post no fluxo</h3>
                  <p className="text-slate-600 max-w-xs mx-auto">Sua IA está aguardando o primeiro comando para começar a criar conteúdo.</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800 overflow-hidden group hover:border-slate-600 transition-all duration-500 shadow-xl">
                    <div className="relative overflow-hidden">
                      <img src={post.imageUrl} alt="Post" className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10">
                        <CheckCircle size={14} className="text-green-400" /> Ativo
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <p className="text-slate-300 line-clamp-3 text-sm leading-relaxed italic">"{post.text}"</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(post.timestamp).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          {user.integrations.facebook && <Facebook size={14} className="text-slate-600" />}
                          {user.integrations.instagram && <Instagram size={14} className="text-slate-600" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="mt-32 py-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
              <img 
                src="https://i.postimg.cc/85zP3mXG/logo-pet.png" 
                alt="Mini Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">Social Flow AI © 2024</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Plataforma Desenvolvida por</span>
              <span className="text-sm text-slate-400 font-bold">James Andrade</span>
            </div>
            <a href="https://github.com" target="_blank" className="bg-slate-900 p-3 rounded-xl text-slate-600 hover:text-white hover:bg-slate-800 transition-all">
              <Github size={20} />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
