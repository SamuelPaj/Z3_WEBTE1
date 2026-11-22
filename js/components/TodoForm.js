const TodoForm = {
  props:['todo','preset','busy','error'], emits:['save','cancel'],
  data(){
    const t=this.todo, p=this.preset;
    return { f:{ title:t?t.title:'', description:t?(t.description||''):'',
      from:t?toInput(t.date_from):(p?toInput(p.start):''), to:t?toInput(t.date_to):(p?toInput(p.end):''),
      is_finished:t?!!t.is_finished:false }, errs:{} };
  },
  methods:{
    validate(){
      const e={}, f=this.f;
      if(!f.title.trim()) e.title='Názov je povinný.'; else if(f.title.length>200) e.title='Názov môže mať najviac 200 znakov.';
      if(f.description.length>1000) e.description='Popis môže mať najviac 1000 znakov.';
      if(!f.from) e.from='Zadajte začiatok.'; if(!f.to) e.to='Zadajte koniec.';
      if(f.from&&f.to&&new Date(f.from)>new Date(f.to)) e.to='Začiatok nesmie byť neskôr ako koniec.';
      this.errs=e; return !Object.keys(e).length;
    },
    submit(){
      if(this.busy||!this.validate()) return;
      this.$emit('save',{title:this.f.title.trim(),description:this.f.description,date_from:toIso(this.f.from),date_to:toIso(this.f.to),is_finished:this.f.is_finished});
    }
  },
  template:`<div class="modal d-block modal-bg"><div class="modal-dialog modal-dialog-centered"><form class="modal-content" @submit.prevent="submit" novalidate>
    <div class="modal-header"><h5 class="modal-title">{{todo?'Upraviť úlohu':'Nová úloha'}}</h5><button type="button" class="btn-close" @click="$emit('cancel')"></button></div>
    <div class="modal-body">
      <div v-if="error" class="alert alert-danger">{{error}} Údaje ostali zachované, skúste to znova.</div>
      <div class="mb-3"><label class="form-label">Názov *</label><input class="form-control" :class="{'is-invalid':errs.title}" v-model="f.title" maxlength="250"><div class="invalid-feedback">{{errs.title}}</div></div>
      <div class="mb-3"><label class="form-label">Popis</label><textarea rows="3" class="form-control" :class="{'is-invalid':errs.description}" v-model="f.description"></textarea><div class="invalid-feedback">{{errs.description}}</div></div>
      <div class="row"><div class="col-sm-6 mb-3"><label class="form-label">Začiatok *</label><input type="datetime-local" class="form-control" :class="{'is-invalid':errs.from}" v-model="f.from"><div class="invalid-feedback">{{errs.from}}</div></div>
      <div class="col-sm-6 mb-3"><label class="form-label">Koniec *</label><input type="datetime-local" class="form-control" :class="{'is-invalid':errs.to}" v-model="f.to"><div class="invalid-feedback">{{errs.to}}</div></div></div>
      <div v-if="todo" class="form-check"><input id="fin" type="checkbox" class="form-check-input" v-model="f.is_finished"><label for="fin" class="form-check-label">Dokončená</label></div>
    </div>
    <div class="modal-footer"><button type="button" class="btn btn-secondary" @click="$emit('cancel')">Zrušiť</button>
    <button class="btn btn-primary" :disabled="busy"><span v-if="busy" class="spinner-border spinner-border-sm me-1"></span>Uložiť</button></div>
  </form></div></div>`
};
