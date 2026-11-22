const TodoList = {
  props:['todos','busy'], emits:['open','edit','delete','toggle'],
  data(){ return {status:'all', q:'', sort:'date_from'}; },
  computed:{
    shown(){
      const q=this.q.trim().toLowerCase();
      return this.todos.filter(t=>(this.status==='all'||(this.status==='done')===!!t.is_finished)&&(!q||t.title.toLowerCase().includes(q)))
        .sort((a,b)=>parseDate(a[this.sort])-parseDate(b[this.sort]));
    }
  },
  methods:{fmt:fmtDate, over:isOverdue},
  template:`<div>
    <div class="card-box mb-3"><div class="row g-2">
      <div class="col-md-4"><input class="form-control" v-model="q" placeholder="Hľadať podľa názvu…"></div>
      <div class="col-6 col-md-4"><select class="form-select" v-model="status"><option value="all">Všetky</option><option value="open">Nedokončené</option><option value="done">Dokončené</option></select></div>
      <div class="col-6 col-md-4"><select class="form-select" v-model="sort"><option value="date_from">Zoradiť podľa začiatku</option><option value="date_to">Zoradiť podľa ukončenia</option></select></div></div></div>
    <div v-if="!todos.length" class="alert alert-info">Zatiaľ nemáte žiadne úlohy. Vytvorte novú alebo obnovte ukážkové dáta.</div>
    <div v-else-if="!shown.length" class="alert alert-warning">Filtrovaniu nezodpovedá žiadna úloha.</div>
    <div v-for="t in shown" :key="t.id" class="card-box todo-item mb-2" :class="{done:t.is_finished,overdue:over(t)}">
      <div class="d-flex flex-wrap justify-content-between gap-2">
        <div><a href="#" class="t-title fw-bold text-decoration-none" @click.prevent="$emit('open',t)">{{t.title}}</a>
          <span class="badge ms-2" :class="t.is_finished?'bg-success':(over(t)?'bg-danger':'bg-primary')">{{t.is_finished?'Dokončená':(over(t)?'Po termíne':'Nedokončená')}}</span>
          <div class="small text-muted">{{fmt(t.date_from)}} – {{fmt(t.date_to)}}</div></div>
        <div class="btn-group btn-group-sm align-self-start">
          <button class="btn btn-outline-success" :disabled="busy" @click="$emit('toggle',t)">{{t.is_finished?'Znovu otvoriť':'Dokončiť'}}</button>
          <button class="btn btn-outline-primary" :disabled="busy" @click="$emit('edit',t)">Upraviť</button>
          <button class="btn btn-outline-danger" :disabled="busy" @click="$emit('delete',t)">Odstrániť</button></div></div></div></div>`
};
