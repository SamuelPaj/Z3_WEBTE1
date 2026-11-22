const CalendarView = {
  props:['todos','active'], emits:['open','create'],
  mounted(){
    this.cal = new FullCalendar.Calendar(this.$refs.el,{
      locale:'sk', firstDay:1, height:'auto', initialView:'dayGridMonth', selectable:true, nowIndicator:true, displayEventEnd:true,
      headerToolbar:{left:'prev,next today',center:'title',right:'dayGridMonth,timeGridWeek,timeGridDay'},
      select:i=>{ let s=new Date(i.start), e=new Date(i.end);
        if(i.allDay){ e=new Date(e.getTime()-864e5); s.setHours(9,0); e.setHours(10,0); }
        this.$emit('create',{start:s,end:e}); this.cal.unselect(); },
      eventClick:i=>this.$emit('open',i.event.id),
      events:this.events()
    });
    this.cal.render();
  },
  beforeUnmount(){ this.cal&&this.cal.destroy(); },
  methods:{
    events(){ return this.todos.map(t=>({id:String(t.id),title:(t.is_finished?'✓ ':'')+t.title,start:parseDate(t.date_from),end:parseDate(t.date_to),
      classNames:[t.is_finished?'ev-done':(isOverdue(t)?'ev-overdue':'ev-open')]})); }
  },
  watch:{ todos:{deep:true,handler(){ this.cal.removeAllEventSources(); this.cal.addEventSource(this.events()); }},
          active(v){ if(v) this.$nextTick(()=>this.cal.updateSize()); } },
  template:`<div class="card-box"><div ref="el"></div>
    <div class="small mt-2"><span class="badge bg-primary">Nedokončená</span> <span class="badge bg-success">Dokončená</span> <span class="badge bg-danger">Po termíne</span></div></div>`
};
