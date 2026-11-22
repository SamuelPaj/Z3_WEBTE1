const { createApp, ref, reactive, computed, onMounted } = Vue;
createApp({
  components:{AppHeader,ConfirmDialog,TodoDetail,TodoForm,TodoList,CalendarView},
  setup(){
    const name=ref(localStorage.getItem('todoName')||''), nameInput=ref(''), view=ref('calendar');
    const loginError=ref(''), todos=ref([]), loading=ref(false), busy=ref(false), formError=ref('');
    const toasts=ref([]), form=ref(null), detailId=ref(null), confirm=ref(null);
    const detail=computed(()=>todos.value.find(t=>String(t.id)===String(detailId.value)));
    let tid=0;
    function toast(text,type='success'){ const id=++tid; toasts.value.push({id,text,type}); setTimeout(()=>toasts.value=toasts.value.filter(t=>t.id!==id),4000); }
    async function load(){
      loading.value=true;
      try{ todos.value=await ApiService.list(name.value); return null; }
      catch(e){ toast(e.message,'danger'); return e.message; } finally{ loading.value=false; }
    }
    async function run(fn,okMsg){
      if(busy.value) return false; // ochrana proti duplicitnému odoslaniu
      busy.value=true;
      try{ await fn(); await load(); toast(okMsg); return true; }
      catch(e){ toast(e.message,'danger'); formError.value=e.message; return false; }
      finally{ busy.value=false; }
    }
    async function setName(){
      const n=nameInput.value.trim(); if(!n||loading.value) return;
      loginError.value=''; name.value=n;
      const err=await load();
      if(err){ name.value=''; loginError.value='Úlohy sa nepodarilo načítať. '+err; }
      else localStorage.setItem('todoName',n);
    }
    function logout(){ localStorage.removeItem('todoName'); name.value=''; todos.value=[]; view.value='calendar'; nameInput.value=''; }
    function openNew(preset){ formError.value=''; form.value={todo:null,preset:preset||{start:new Date(Date.now()+36e5),end:new Date(Date.now()+72e5)}}; }
    function openEdit(t){ formError.value=''; detailId.value=null; form.value={todo:t}; }
    async function save(p){
      formError.value=''; const t=form.value.todo;
      const ok=await run(()=>t?ApiService.update(name.value,t.id,p):ApiService.create(name.value,p), t?'Úloha bola upravená.':'Úloha bola vytvorená.');
      if(ok) form.value=null;
    }
    function toggle(t){ run(()=>t.is_finished?ApiService.undone(name.value,t.id):ApiService.done(name.value,t.id), t.is_finished?'Úloha znovu otvorená.':'Úloha dokončená.'); }
    function askDelete(t){ detailId.value=null; confirm.value={title:'Odstrániť úlohu',text:`Naozaj chcete odstrániť úlohu „${t.title}“?`,ok:'Odstrániť',fn:()=>ApiService.remove(name.value,t.id),msg:'Úloha bola odstránená.'}; }
    function askReset(){ confirm.value={title:'Obnoviť ukážkové úlohy',text:'Vaše aktuálne úlohy budú odstránené a nahradené piatimi ukážkovými úlohami.',ok:'Obnoviť',fn:()=>ApiService.reset(name.value),msg:'Ukážkové úlohy boli obnovené.'}; }
    async function doConfirm(){ const c=confirm.value; if(await run(c.fn,c.msg)) confirm.value=null; }
    onMounted(()=>{ if(name.value) load(); });
    return {loginError,name,nameInput,view,todos,loading,busy,formError,toasts,form,detail,detailId,confirm,setName,logout,openNew,openEdit,save,toggle,askDelete,askReset,doConfirm,load};
  },
  template:`
  <app-header :view="view" :name="name" :busy="busy" @nav="view=$event" @new="openNew()" @reset="askReset" @logout="logout"></app-header>
  <main class="container py-3">
    <div v-if="view==='about'" class="card-box"><h2 class="h4">O projekte</h2>
      <p>Aplikácia „Môj TODO List“ spravuje osobné úlohy uložené na serveri cez REST API (wt1zadanie.iolab.sk). Zoznam aj kalendár pracujú s jedným spoločným stavom, takže zmena v jednej časti sa hneď prejaví v druhej.</p>
      <ul><li>Vue 3 – používateľské rozhranie a komponenty</li><li>FullCalendar 6.1.15 – kalendár</li><li>Bootstrap 5.3.3 – štýlovanie</li><li>Fetch API – komunikácia so serverom</li></ul></div>
    <template v-else-if="!name">
      <div class="card-box mx-auto" style="max-width:520px"><form @submit.prevent="setName">
        <label class="form-label fw-semibold">Tvoj identifikátor</label>
        <div class="input-group"><input class="form-control" v-model="nameInput" placeholder="napr. priezvisko" autofocus>
        <button class="btn btn-primary" :disabled="loading||!nameInput.trim()"><span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>Načítaj úlohy</button></div></form></div>
      <div v-if="loginError" class="alert alert-danger mt-3">{{loginError}}</div>
    </template>
    <template v-else>
      <div v-if="loading||busy" class="text-primary mb-2"><span class="spinner-border spinner-border-sm me-2"></span>{{loading?'Načítavam údaje…':'Odosielam požiadavku…'}}</div>
      <calendar-view v-show="view==='calendar'" :todos="todos" :active="view==='calendar'" @open="detailId=$event" @create="openNew"></calendar-view>
      <todo-list v-if="view==='list'" :todos="todos" :busy="busy" @open="detailId=$event.id" @edit="openEdit" @delete="askDelete" @toggle="toggle"></todo-list>
    </template>
  </main>
  <footer class="text-center text-muted small py-3">© 2026 Samuel Piteľ · Použité knižnice:
    <a href="https://vuejs.org" target="_blank">Vue 3</a>, <a href="https://getbootstrap.com" target="_blank">Bootstrap 5.3.3</a>, <a href="https://fullcalendar.io" target="_blank">FullCalendar 6.1.15</a></footer>
  <todo-detail v-if="detail" :todo="detail" :busy="busy" @close="detailId=null" @edit="openEdit" @delete="askDelete" @toggle="toggle"></todo-detail>
  <todo-form v-if="form" :todo="form.todo" :preset="form.preset" :busy="busy" :error="formError" @save="save" @cancel="form=null"></todo-form>
  <confirm-dialog v-if="confirm" :title="confirm.title" :text="confirm.text" :ok-label="confirm.ok" :busy="busy" @ok="doConfirm" @cancel="confirm=null"></confirm-dialog>
  <div class="toasts"><div v-for="t in toasts" :key="t.id" class="alert shadow" :class="'alert-'+t.type">{{t.text}}</div></div>`
}).mount('#app');
