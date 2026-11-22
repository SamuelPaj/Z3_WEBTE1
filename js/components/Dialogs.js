const ConfirmDialog = {
  props:['title','text','okLabel','busy'], emits:['ok','cancel'],
  template:`<div class="modal d-block modal-bg" @click.self="$emit('cancel')"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">{{title}}</h5></div>
    <div class="modal-body pre">{{text}}</div>
    <div class="modal-footer"><button class="btn btn-secondary" @click="$emit('cancel')" :disabled="busy">Zrušiť</button>
    <button class="btn btn-danger" @click="$emit('ok')" :disabled="busy"><span v-if="busy" class="spinner-border spinner-border-sm me-1"></span>{{okLabel}}</button></div></div></div></div>`
};
const TodoDetail = {
  props:['todo','busy'], emits:['close','edit','delete','toggle'],
  template:`<div class="modal d-block modal-bg" @click.self="$emit('close')"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title text-break">{{todo.title}}</h5><button class="btn-close" @click="$emit('close')"></button></div>
    <div class="modal-body">
      <span class="badge" :class="todo.is_finished?'bg-success':(overdue?'bg-danger':'bg-primary')">{{todo.is_finished?'Dokončená':(overdue?'Po termíne':'Nedokončená')}}</span>
      <p class="mt-3 mb-1"><b>Od:</b> {{fmt(todo.date_from)}}<br><b>Do:</b> {{fmt(todo.date_to)}}</p>
      <p class="pre mt-2">{{todo.description||'Bez popisu.'}}</p></div>
    <div class="modal-footer">
      <button class="btn btn-outline-success" :disabled="busy" @click="$emit('toggle',todo)">{{todo.is_finished?'Označiť ako nedokončenú':'Označiť ako dokončenú'}}</button>
      <button class="btn btn-primary" :disabled="busy" @click="$emit('edit',todo)">Upraviť</button>
      <button class="btn btn-danger" :disabled="busy" @click="$emit('delete',todo)">Odstrániť</button></div></div></div></div>`,
  computed:{overdue(){return isOverdue(this.todo)}}, methods:{fmt:fmtDate}
};
