const AppHeader = {
  props:['view','name','busy'], emits:['nav','new','reset','logout'],
  data(){ return {open:false}; },
  computed:{ items(){ return this.name ? [['calendar','Kalendár'],['list','Zoznam'],['about','O projekte']] : [['calendar','Úlohy'],['about','O projekte']]; } },
  methods:{ go(v){ this.open=false; this.$emit('nav',v); }, act(e){ this.open=false; this.$emit(e); } },
  template:`<header class="app-header bg-primary shadow-sm"><div class="container">
    <nav class="navbar navbar-expand-md navbar-dark px-0">
      <a href="#" class="navbar-brand fw-bold" @click.prevent="go('calendar')"><img src="favicon.svg" alt="" width="30" height="30" class="me-2 align-text-bottom">Môj TODO List</a>
      <button class="navbar-toggler" type="button" aria-label="Menu" @click="open=!open"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" :class="{show:open}">
        <ul class="navbar-nav me-auto">
          <li v-for="i in items" :key="i[0]" class="nav-item">
            <a href="#" class="nav-link" :class="{active:view===i[0]||(!name&&i[0]==='calendar'&&view!=='about')}" @click.prevent="go(i[0])">{{i[1]}}</a></li>
        </ul>
        <div v-if="name" class="d-flex flex-wrap gap-2 align-items-center py-2 py-md-0">
          <button class="btn btn-sm btn-success" @click="act('new')">+ Nová úloha</button>
          <button class="btn btn-sm btn-warning" :disabled="busy" @click="act('reset')">Obnoviť ukážkové dáta</button>
          <button class="btn btn-sm btn-outline-light" @click="act('logout')">👤 {{name}} · Zmeniť</button>
        </div>
      </div>
    </nav></div></header>`
};
