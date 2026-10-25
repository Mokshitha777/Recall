import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, BrainCircuit, BriefcaseBusiness, Check, ChevronRight, CircleHelp, Clock3, LayoutDashboard, LogOut, Menu, Plus, Search, Send, Settings2, Sparkles, Target, Trash2, TrendingUp, X } from 'lucide-react'
import { api, apiBase } from './api'

const normalizeList = (x) => Array.isArray(x) ? x : (Array.isArray(x?.content) ? x.content : Array.isArray(x?.data) ? x.data : Array.isArray(x?.items) ? x.items : [])
const labelOutcome = (x) => x || 'Not set'

function App() {
  const [page, setPage] = useState('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [user, setUser] = useState(() => localStorage.getItem('recall_user') || '')
  const [token, setToken] = useState(() => localStorage.getItem('recall_token') || '')
  const [authMode, setAuthMode] = useState('login')
  const [auth, setAuth] = useState({ name: '', email: '', password: '' })
  const [experiences, setExperiences] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [showExperience, setShowExperience] = useState(false)
  const [showTopic, setShowTopic] = useState(false)
  const [experienceForm, setExperienceForm] = useState({ company: '', role: '', interviewDate: new Date().toISOString().slice(0,10), outcome: 'In progress', roundName: 'Technical', notes: '', questions: '', lessonsLearned: '' })
  const [topicForm, setTopicForm] = useState({ title: '', category: 'DSA', status: 'NOT_STARTED', progress: 0 })
  const [coachPrompt, setCoachPrompt] = useState('')
  const [coachAnswer, setCoachAnswer] = useState('')
  const [coachBusy, setCoachBusy] = useState(false)

  const refresh = async () => {
    if (!token) { setExperiences([]); setTopics([]); return }
    setLoading(true)
    try {
      const [e, t] = await Promise.allSettled([api.experiences(), api.topics()])
      if (e.status === 'fulfilled') setExperiences(normalizeList(e.value))
      else { setExperiences([]); setNotice(`Could not load interview experiences: ${e.reason.message}`) }
      if (t.status === 'fulfilled') setTopics(normalizeList(t.value))
      else { setTopics([]); setNotice(`Could not load learning topics: ${t.reason.message}`) }
    } finally { setLoading(false) }
  }
  useEffect(() => {
    const onExpired = () => { setToken(''); setUser(''); setExperiences([]); setTopics([]); setNotice('Your session expired. Please sign in again.') }
    window.addEventListener('recall:session-expired', onExpired)
    return () => window.removeEventListener('recall:session-expired', onExpired)
  }, [])
  useEffect(() => {
    let active = true
    async function load() {
      if (!token) { setExperiences([]); setTopics([]); return }
      try {
        const me = await api.me()
        if (!active) return
        const displayName = me?.name || localStorage.getItem('recall_user') || ''
        setUser(displayName)
        if (displayName) localStorage.setItem('recall_user', displayName)
        await refresh()
      } catch (err) {
        if (!active) return
        localStorage.removeItem('recall_token'); localStorage.removeItem('recall_user')
        setToken(''); setUser(''); setExperiences([]); setTopics([])
        setNotice('Please sign in again to load your own Recall data.')
      }
    }
    load()
    return () => { active = false }
  }, [token])
  const filteredExperiences = useMemo(() => experiences.filter(e => `${e.company || ''} ${e.role || ''} ${e.notes || ''} ${e.questions || ''}`.toLowerCase().includes(search.toLowerCase())), [experiences, search])
  const completed = topics.filter(t => String(t.status || '').toUpperCase() === 'COMPLETED' || Number(t.progress) >= 100).length
  const avgProgress = topics.length ? Math.round(topics.reduce((s,t) => s + Number(t.progress || 0), 0) / topics.length) : 0

  async function submitAuth(e) {
    e.preventDefault(); setNotice('')
    try {
      const result = authMode === 'login' ? await api.login({ email: auth.email, password: auth.password }) : await api.register({ name: auth.name, email: auth.email, password: auth.password })
      const newToken = result?.token || result?.accessToken || result?.jwt || result?.data?.token
      if (!newToken) throw new Error('The backend responded, but no token was found. Check the auth response format in src/App.jsx.')
      const displayName = result?.name || result?.user?.name || auth.name || auth.email.split('@')[0]
      localStorage.setItem('recall_token', newToken); localStorage.setItem('recall_user', displayName)
      setToken(newToken); setUser(displayName); setNotice('You are signed in.')
    } catch (err) { setNotice(err.message || 'Could not sign in. Check your details and try again.') }
  }
  function logout() { localStorage.removeItem('recall_token'); localStorage.removeItem('recall_user'); setToken(''); setUser(''); setNotice('Signed out.') }

  async function addExperience(e) {
    e.preventDefault()
    if (!token) { setNotice('Sign in to save interview experiences.'); setShowExperience(false); return }
    try { const payload = { ...experienceForm, roundName: experienceForm.roundName, questions: experienceForm.questions || '', lessonsLearned: experienceForm.lessonsLearned || '' }; const created = await api.createExperience(payload); setExperiences(old => [created || { ...experienceForm, id: Date.now() }, ...old]); setShowExperience(false); setNotice('Interview experience saved.'); setExperienceForm({ company:'',role:'',interviewDate:new Date().toISOString().slice(0,10),outcome:'In progress',roundName:'Technical',notes:'',questions:'',lessonsLearned:'' }); refresh() }
    catch(err) { setNotice(`${err.message}. Check the interview-experiences route and request fields in src/api.js.`) }
  }
  async function addTopic(e) {
    e.preventDefault()
    if (!token) { setNotice('Sign in to save learning topics.'); setShowTopic(false); return }
    try { const created = await api.createTopic(topicForm); setTopics(old => [created || { ...topicForm, id: Date.now() }, ...old]); setShowTopic(false); setNotice('Learning topic added.'); refresh() }
    catch(err) { setNotice(`${err.message}. Check the learning-topics route in src/api.js.`) }
  }
  async function updateProgress(topic, progress) {
    if (!token) { setTopics(old => old.map(t => t.id === topic.id ? {...t, progress, status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS'} : t)); return }
    const body = { title: topic.title || topic.name, category: topic.category || topic.tag || 'General', description: topic.description || '', notes: topic.notes || '', targetDate: topic.targetDate || null, progress, status: progress >= 100 ? 'COMPLETED' : progress <= 0 ? 'NOT_STARTED' : 'IN_PROGRESS' }
    try { const saved = await api.updateTopic(topic.id, body); setTopics(old => old.map(t => t.id === topic.id ? { ...topic, ...(saved || body) } : t)); setNotice('Learning progress saved.') }
    catch(err) { setNotice(`${err.message}. Could not update topic progress.`) }
  }
  async function deleteExperience(id) {
    if (!token) { setNotice('Sign in to manage your interview log.'); return }
    try { await api.deleteExperience(id); setExperiences(old => old.filter(e => e.id !== id)); setNotice('Experience deleted.') }
    catch(err) { setNotice(`${err.message}. Check the delete route in src/api.js.`) }
  }
  async function askCoach(e) {
    e.preventDefault(); if (!coachPrompt.trim()) return
    setCoachBusy(true); setCoachAnswer('')
    try {
      const result = await api.coach({ content: coachPrompt, company: '', role: '', roundName: 'Practice' })
      setCoachAnswer(result?.result || result?.answer || result?.content || result?.response || result?.message || JSON.stringify(result, null, 2))
    } catch (err) {
      setCoachAnswer(`The AI coach could not respond: ${err.message}\n\nCheck that AI_API_KEY is configured for the backend, then try again.`)
    } finally { setCoachBusy(false) }
  }

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Interview log', icon: BriefcaseBusiness },
    { name: 'Learning path', icon: BookOpen },
    { name: 'AI coach', icon: BrainCircuit },
  ]
  if (!token) return <AuthScreen auth={auth} setAuth={setAuth} mode={authMode} setMode={setAuthMode} submit={submitAuth} notice={notice} />

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><BrainCircuit size={21}/></div><div><strong>recall</strong><span>Learn from every round</span></div><button className="icon-btn mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{navItems.map(item => <button key={item.name} className={`nav-item ${page===item.name?'active':''}`} onClick={() => {setPage(item.name);setMobileNav(false)}}><item.icon size={18}/><span>{item.name}</span>{item.name==='AI coach' && <span className="nav-new">AI</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><strong>Keep getting better.</strong><p>Every interview is useful data. Turn it into your next win.</p></div><button className="nav-item" onClick={() => setNotice('API base URL: '+apiBase)}><Settings2 size={18}/><span>Connection info</span></button><button className="nav-item" onClick={logout}><LogOut size={18}/><span>Sign out</span></button></div>
    </aside>
    {mobileNav && <div className="nav-scrim" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><button className="icon-btn menu-btn" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{page}</strong></div><div className="top-actions"><div className="status-pill"><span/> API configured</div><div className="avatar">{(user || 'Y').slice(0,1).toUpperCase()}</div></div></header>
      <div className="content">
        {notice && <div className="notice"><span>{notice}</span><button onClick={() => setNotice('')}><X size={16}/></button></div>}
        {page === 'Overview' && <Overview user={user} experiences={experiences} topics={topics} completed={completed} avgProgress={avgProgress} setPage={setPage} loading={loading} />}
        {page === 'Interview log' && <section><div className="page-heading"><div><div className="eyebrow">REFLECT · LEARN · IMPROVE</div><h1>Interview log</h1><p>Capture what happened, then make your next attempt stronger.</p></div><button className="primary-btn" onClick={() => setShowExperience(true)}><Plus size={17}/> Log interview</button></div><div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, role, notes..." /></div><span className="muted">{filteredExperiences.length} records</span></div><div className="experience-list">{filteredExperiences.map((ex,i)=><ExperienceCard key={ex.id ?? i} ex={ex} onDelete={deleteExperience}/>) }{!filteredExperiences.length && <Empty title="No interviews yet" text="Log your first interview to start building your personal record."/>}</div></section>}
        {page === 'Learning path' && <section><div className="page-heading"><div><div className="eyebrow">BUILD YOUR EDGE</div><h1>Learning path</h1><p>Small, steady progress compounds into interview confidence.</p></div><button className="primary-btn" onClick={() => setShowTopic(true)}><Plus size={17}/> Add topic</button></div><div className="learning-summary"><div><span>Overall progress</span><strong>{avgProgress}%</strong><div className="progress-track"><div style={{width:`${avgProgress}%`}}/></div></div><div><span>Topics completed</span><strong>{completed}<small> / {topics.length}</small></strong><p>Keep your streak moving.</p></div><div><span>Focus areas</span><strong>{new Set(topics.map(t=>t.category).filter(Boolean)).size}</strong><p>Skills in your roadmap.</p></div></div><div className="topic-list">{topics.map((t,i)=><TopicCard key={t.id ?? i} topic={t} onProgress={updateProgress}/>)}</div>{!topics.length && <Empty title="Your learning path starts here" text="Add the topics you want to improve before your next interview."/>}</section>}
        {page === 'AI coach' && <section><div className="page-heading"><div><div className="eyebrow">PRACTICE WITH PURPOSE</div><h1>Your AI coach</h1><p>Get a structured practice plan or review a tricky interview question.</p></div><div className="coach-badge"><Sparkles size={16}/> Powered by your backend</div></div><div className="coach-layout"><div className="coach-intro"><div className="coach-orb"><BrainCircuit size={31}/></div><h2>Turn uncertainty into a plan.</h2><p>Ask for a mock interview, a study plan, a concept explanation, or feedback on an answer.</p><div className="prompt-chips">{['Give me a 7-day DSA plan','Mock interview: Java OOP','Explain BFS vs DFS','Review my project pitch'].map(x=><button key={x} onClick={()=>setCoachPrompt(x)}>{x}<ChevronRight size={14}/></button>)}</div></div><div className="coach-chat"><div className="chat-header"><div className="coach-avatar"><Sparkles size={17}/></div><div><strong>Recall Coach</strong><span><i/> Ready when you are</span></div></div><div className="chat-body">{coachAnswer ? <div className="coach-response"><div className="response-label"><Sparkles size={14}/> COACH RESPONSE</div><p>{coachAnswer}</p></div> : <div className="chat-empty"><div className="chat-spark"><Sparkles size={22}/></div><strong>What are we working on?</strong><p>Choose a suggestion or write your own prompt below.</p></div>}</div><form className="chat-input" onSubmit={askCoach}><textarea value={coachPrompt} onChange={e=>setCoachPrompt(e.target.value)} placeholder="e.g. Help me prepare for a Java backend interview..." rows={2}/><button className="send-btn" disabled={coachBusy || !coachPrompt.trim()}>{coachBusy ? 'Thinking…' : <Send size={17}/>}</button></form><div className="chat-foot">AI can make mistakes. Verify technical details before your interview.</div></div></div></section>}
      </div>
    </main>
    {showExperience && <Modal title="Log an interview" subtitle="Capture the details while they're fresh." close={()=>setShowExperience(false)}><form className="modal-form" onSubmit={addExperience}><div className="form-grid"><Field label="Company" required><input required value={experienceForm.company} onChange={e=>setExperienceForm({...experienceForm,company:e.target.value})} placeholder="e.g. Amazon"/></Field><Field label="Role"><input value={experienceForm.role} onChange={e=>setExperienceForm({...experienceForm,role:e.target.value})} placeholder="e.g. SDE Intern"/></Field><Field label="Interview date"><input type="date" value={experienceForm.interviewDate} onChange={e=>setExperienceForm({...experienceForm,interviewDate:e.target.value})}/></Field><Field label="Round"><select value={experienceForm.roundName} onChange={e=>setExperienceForm({...experienceForm,roundName:e.target.value})}><option>Technical</option><option>Online assessment</option><option>HR</option><option>Group discussion</option><option>Managerial</option></select></Field><Field label="Outcome"><select value={experienceForm.outcome} onChange={e=>setExperienceForm({...experienceForm,outcome:e.target.value})}><option>In progress</option><option>Selected</option><option>Rejected</option><option>On hold</option></select></Field></div><Field label="What happened?"><textarea rows="4" value={experienceForm.notes} onChange={e=>setExperienceForm({...experienceForm,notes:e.target.value})} placeholder="Questions asked, what went well, what to revise..."/></Field><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setShowExperience(false)}>Cancel</button><button className="primary-btn"><Check size={16}/> Save experience</button></div></form></Modal>}
    {showTopic && <Modal title="Add a learning topic" subtitle="Choose one focused area to work on." close={()=>setShowTopic(false)}><form className="modal-form" onSubmit={addTopic}><Field label="Topic name" required><input required value={topicForm.title} onChange={e=>setTopicForm({...topicForm,title:e.target.value})} placeholder="e.g. Spring Security"/></Field><Field label="Category"><select value={topicForm.category} onChange={e=>setTopicForm({...topicForm,category:e.target.value})}><option>DSA</option><option>Java</option><option>Backend</option><option>Database</option><option>System design</option><option>Behavioral</option><option>Other</option></select></Field><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setShowTopic(false)}>Cancel</button><button className="primary-btn"><Check size={16}/> Add topic</button></div></form></Modal>}
  </div>
}

function AuthScreen({auth,setAuth,mode,setMode,submit,notice}) {
  return <div className="auth-page"><div className="auth-art"><div className="auth-brand"><div className="brand-mark"><BrainCircuit size={22}/></div><strong>recall</strong></div><div className="art-content"><div className="eyebrow light">YOUR INTERVIEW JOURNEY, REIMAGINED</div><h1>Every round<br/>teaches you <em>something.</em></h1><p>Keep your experiences, learning goals and next steps in one thoughtful workspace.</p><div className="art-stats"><div><strong>Reflect</strong><span>Capture the details</span></div><div><strong>Improve</strong><span>Build your next plan</span></div><div><strong>Repeat</strong><span>Show up stronger</span></div></div></div><div className="art-footer">A little better after every round. <span>✳</span></div></div><div className="auth-panel"><div className="auth-mobile-brand"><div className="brand-mark"><BrainCircuit size={20}/></div><strong>recall</strong></div><div className="auth-card"><div className="eyebrow">WELCOME TO RECALL</div><h2>{mode==='login'?'Welcome back':'Create your account'}</h2><p className="auth-sub">{mode==='login'?'Pick up where your growth left off.':'Start turning every interview into progress.'}</p>{notice && <div className="notice auth-notice">{notice}</div>}<form onSubmit={submit}>{mode==='register' && <Field label="Your name" required><input required value={auth.name} onChange={e=>setAuth({...auth,name:e.target.value})} placeholder="Your name"/></Field>}<Field label="Email address" required><input type="email" required value={auth.email} onChange={e=>setAuth({...auth,email:e.target.value})} placeholder="you@example.com"/></Field><Field label="Password" required><input type="password" required minLength="8" value={auth.password} onChange={e=>setAuth({...auth,password:e.target.value})} placeholder="At least 8 characters"/></Field><button className="primary-btn auth-submit">{mode==='login'?'Sign in':'Create account'}<ChevronRight size={17}/></button></form><div className="auth-switch">{mode==='login'?"New to Recall?":"Already have an account?"} <button onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create an account':'Sign in'}</button></div><div className="auth-disclaimer"><CircleHelp size={14}/> Requires the Recall backend to expose the auth routes configured in <code>src/api.js</code>.</div></div><div className="auth-bottom">Made for the next version of you.</div></div></div>
}
function Overview({user,experiences,topics,completed,avgProgress,setPage,loading}) {
 const recent = [...experiences].sort((a,b)=>String(b.interviewDate||b.createdAt||'').localeCompare(String(a.interviewDate||a.createdAt||''))).slice(0,3)
 return <section><div className="welcome-row"><div><div className="eyebrow">YOUR GROWTH SPACE</div><h1>Keep moving forward{user ? `, ${user.split(' ')[0]}` : ''}.</h1><p>Every interview leaves a clue. Let's turn yours into momentum.</p></div><div className="daily-note"><div className="note-icon"><Sparkles size={17}/></div><div><strong>One step at a time</strong><span>Consistency beats cramming.</span></div></div></div><div className="stats-grid"><Stat icon={BriefcaseBusiness} label="Interviews logged" value={experiences.length} sub="Every round counts" tone="purple"/><Stat icon={BookOpen} label="Learning topics" value={topics.length} sub={`${completed} completed`} tone="blue"/><Stat icon={TrendingUp} label="Learning progress" value={`${avgProgress}%`} sub="Across all topics" tone="green"/><Stat icon={Target} label="Next goal" value={topics.length-completed} sub="Topics to keep building" tone="orange"/></div><div className="overview-grid"><div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent interviews</h2><p>Look back to move forward.</p></div><button className="text-btn" onClick={()=>setPage('Interview log')}>View all <ChevronRight size={15}/></button></div>{loading ? <div className="loading-line">Loading your data…</div> : recent.map((ex,i)=><div className="recent-item" key={ex.id ?? i}><div className="company-logo">{String(ex.company||'?').slice(0,1).toUpperCase()}</div><div className="recent-main"><strong>{ex.company || 'Interview'}</strong><span>{ex.role || ex.roundName || 'Interview experience'}</span></div><div className={`outcome ${String(ex.outcome).toLowerCase().includes('reject')?'bad':String(ex.outcome).toLowerCase().includes('select')?'good':'neutral'}`}>{labelOutcome(ex.outcome)}</div></div>)}{!recent.length && <Empty title="Your story starts here" text="Log your first interview to build a useful record."/>}<button className="outline-wide" onClick={()=>setPage('Interview log')}><Plus size={16}/> Add an interview</button></div><div className="panel learning-panel"><div className="panel-heading"><div><h2>Learning path</h2><p>Progress is built in small steps.</p></div><button className="round-arrow" onClick={()=>setPage('Learning path')}><ChevronRight size={17}/></button></div><div className="big-progress"><div className="progress-ring" style={{'--progress':`${avgProgress*3.6}deg`}}><div><strong>{avgProgress}%</strong><span>overall</span></div></div><div><strong>{completed} of {topics.length} topics</strong><p>Keep a steady pace and celebrate the small wins.</p></div></div><div className="mini-topics">{topics.slice(0,3).map((t,i)=><div className="mini-topic" key={t.id??i}><div className="mini-topic-top"><span>{t.title || t.name || 'Learning topic'}</span><strong>{Number(t.progress||0)}%</strong></div><div className="progress-track"><div style={{width:`${Number(t.progress||0)}%`}}/></div></div>)}</div><button className="outline-wide" onClick={()=>setPage('Learning path')}>Open learning path <ChevronRight size={16}/></button></div></div><div className="bottom-banner"><div className="banner-spark"><BrainCircuit size={24}/></div><div><strong>Need a little practice?</strong><span>Get a focused plan for your next interview with Recall Coach.</span></div><button className="primary-btn" onClick={()=>setPage('AI coach')}>Meet your AI coach <ChevronRight size={16}/></button></div></section>
}
function Stat({icon:Icon,label,value,sub,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18}/></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-sub">{sub}</span></div> }
function ExperienceCard({ex,onDelete}) { return <article className="experience-card"><div className="experience-top"><div className="company-logo large">{String(ex.company||'?').slice(0,1).toUpperCase()}</div><div className="experience-title"><h3>{ex.company || 'Interview'}</h3><p>{ex.role || 'Role not specified'} · {ex.roundName || 'Interview'}</p></div><span className={`outcome ${String(ex.outcome).toLowerCase().includes('reject')?'bad':String(ex.outcome).toLowerCase().includes('select')?'good':'neutral'}`}>{labelOutcome(ex.outcome)}</span><button className="icon-btn delete-btn" title="Delete record" onClick={()=>onDelete(ex.id)}><Trash2 size={16}/></button></div><div className="experience-notes">{ex.notes || 'No notes added yet.'}</div><div className="experience-meta"><span><Clock3 size={14}/>{ex.interviewDate || ex.createdAt || 'Date not set'}</span></div></article> }
function TopicCard({topic,onProgress}) { const progress = Math.min(100,Math.max(0,Number(topic.progress||0))); return <article className="topic-card"><div className="topic-symbol"><BookOpen size={19}/></div><div className="topic-content"><div className="topic-head"><div><h3>{topic.title || topic.name || 'Learning topic'}</h3><span>{topic.category || topic.tag || 'General'}</span></div><span className={`topic-status ${progress>=100?'done':''}`}>{progress>=100?'Completed':progress>0?'In progress':'Not started'}</span></div><div className="topic-progress-row"><div className="progress-track"><div style={{width:`${progress}%`}}/></div><strong>{progress}%</strong></div><div className="progress-actions"><span>Update progress</span><div>{[0,25,50,75,100].map(v=><button key={v} className={progress===v?'selected':''} onClick={()=>onProgress(topic,v)}>{v}%</button>)}</div></div></div></article> }
function Field({label,required,children}) { return <label className="field"><span>{label}{required && <i> *</i>}</span>{children}</label> }
function Modal({title,subtitle,close,children}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><div className="modal"><div className="modal-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-btn" onClick={close}><X size={18}/></button></div>{children}</div></div> }
function Empty({title,text}) { return <div className="empty-state"><div className="empty-icon"><BookOpen size={20}/></div><strong>{title}</strong><p>{text}</p></div> }

export default App