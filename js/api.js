// Samostatná servisná vrstva pre REST API
const ApiService = {
  BASE: 'https://wt1zadanie.iolab.sk/api',
  async request(name, path, method='GET', body){
    let res;
    try{
      res = await fetch(`${this.BASE}/${encodeURIComponent(name)}${path}`, {
        method, headers: body ? {'Content-Type':'application/json'} : {}, body: body ? JSON.stringify(body) : undefined });
    }catch(e){ throw new Error('Server je nedostupný alebo nastala chyba siete.'); }
    if(!res.ok){
      let d=''; try{ const j=await res.json(); d = typeof j.detail==='string' ? j.detail : JSON.stringify(j.detail||j); }catch{}
      throw new Error(`Server vrátil chybu ${res.status}. ${d}`);
    }
    if(res.status===204) return null;
    try{ return await res.json(); }catch{ return null; }
  },
  async list(n){ const r = await this.request(n,''); return Array.isArray(r)?r:(r.items||r.todos||[]); },
  create(n,t){ return this.request(n,'','POST',t); },
  update(n,id,t){ return this.request(n,`/${id}`,'PUT',t); },
  remove(n,id){ return this.request(n,`/${id}`,'DELETE'); },
  done(n,id){ return this.request(n,`/${id}/done`,'PATCH'); },
  undone(n,id){ return this.request(n,`/${id}/undone`,'PATCH'); },
  reset(n){ return this.request(n,'/reset','POST'); }
};
