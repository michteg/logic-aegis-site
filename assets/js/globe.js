/* Logic Aegis — globe en points (canvas). Repris du site v4 ; exposé via window.LAGlobe. */
(function(){
const continents=[[[-17,37],[-5,36],[10,37],[25,32],[33,30],[35,20],[43,12],[51,11],[43,-1],[40,-12],[35,-20],[30,-30],[18,-35],[11,-22],[8,-5],[-1,5],[-15,11],[-17,21]],[[-10,36],[-9,43],[-1,49],[8,54],[5,60],[15,70],[30,70],[42,60],[35,50],[25,40],[15,36]],[[30,40],[35,55],[50,69],[90,77],[140,65],[180,65],[170,52],[140,45],[145,35],[125,25],[120,5],[105,-5],[95,8],[85,22],[75,8],[65,25],[48,30]],[[-168,65],[-130,72],[-105,72],[-80,60],[-52,48],[-67,44],[-80,25],[-87,15],[-105,20],[-118,32],[-135,50],[-160,55]],[[-81,12],[-60,8],[-35,-7],[-40,-20],[-55,-35],[-67,-55],[-75,-42],[-77,-10]],[[112,-12],[135,-11],[153,-25],[145,-40],[115,-34]],[[-52,60],[-25,68],[-20,82],[-45,84],[-60,74]],[[47,-13],[50,-16],[49,-25],[44,-24]]];
const offices=[[30.06,-1.95],[-13.23,8.48],[25.91,-24.65],[-13.68,9.64]];
const projects=[[32.3,1.4],[38.7,9],[36.8,-1.3],[28.3,-15.4],[33.8,-13.9],[2.1,13.5],[31,-17.8],[11.5,3.9],[-10.8,6.3],[121,14.6],[-77,38.9]];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');

function inside(x,y,p){let v=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])v=!v}return v}
const R2D=Math.PI/180,dots=[];
for(let lat=-65;lat<82;lat+=2.4){const st=2.6/Math.cos(lat*R2D);for(let lon=-180;lon<180;lon+=st)if(continents.some(p=>inside(lon,lat,p)))dots.push([lon*R2D,lat*R2D])}
function makeGlobe(canvas,opt){
 const ctx=canvas.getContext('2d');let w=0,h=0,angle=opt.start,tick=0,last=0,visible=true;const st={paused:reduced.matches};
 const proj=(lon,lat)=>{const x=Math.cos(lat)*Math.sin(lon+angle),z=Math.cos(lat)*Math.cos(lon+angle),y=-Math.sin(lat),t=opt.tilt;return{x,y:y*Math.cos(t)-z*Math.sin(t),z:y*Math.sin(t)+z*Math.cos(t)}};
 function slerp(a,b,t){const [l1,p1]=[a[0]*R2D,a[1]*R2D],[l2,p2]=[b[0]*R2D,b[1]*R2D];const A=[Math.cos(p1)*Math.cos(l1),Math.cos(p1)*Math.sin(l1),Math.sin(p1)],B=[Math.cos(p2)*Math.cos(l2),Math.cos(p2)*Math.sin(l2),Math.sin(p2)];const d=Math.acos(Math.min(1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2]))||1e-6;const s1=Math.sin((1-t)*d)/Math.sin(d),s2=Math.sin(t*d)/Math.sin(d);const v=[A[0]*s1+B[0]*s2,A[1]*s1+B[1]*s2,A[2]*s1+B[2]*s2];return[Math.atan2(v[1],v[0]),Math.asin(v[2]),d]}
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw(performance.now(),true)}
 new ResizeObserver(resize).observe(canvas);
 function draw(now,force){const dt=Math.min((now-last)/1000,.05)||0;last=now;if(!st.paused&&visible&&!document.hidden&&!force){angle+=dt*opt.speed;tick+=dt}
  const R=Math.min(w*opt.rw,h*opt.rh),cx=w*opt.cx,cy=h*.5;ctx.clearRect(0,0,w,h);
  const g=ctx.createRadialGradient(cx,cy,R*.4,cx,cy,R*1.5);g.addColorStop(0,'rgba(94,175,200,.12)');g.addColorStop(1,'rgba(80,165,192,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const s=ctx.createRadialGradient(cx-R*.4,cy-R*.35,0,cx,cy,R);s.addColorStop(0,'rgba(33,76,96,.8)');s.addColorStop(.8,'rgba(11,36,54,.65)');s.addColorStop(1,'rgba(4,17,31,.9)');ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fillStyle=s;ctx.fill();ctx.strokeStyle='#9ddcec44';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle='#8dd9ef14';ctx.lineWidth=.6;
  for(const lat of [-60,-30,0,30,60]){ctx.beginPath();let on=false;for(let l=-180;l<=180;l+=4){const p=proj(l*R2D,lat*R2D);if(p.z<0){on=false;continue}on?ctx.lineTo(cx+p.x*R,cy+p.y*R):ctx.moveTo(cx+p.x*R,cy+p.y*R);on=true}ctx.stroke()}
  for(let lon=-180;lon<180;lon+=30){ctx.beginPath();let on=false;for(let lat=-90;lat<=90;lat+=4){const p=proj(lon*R2D,lat*R2D);if(p.z<0){on=false;continue}on?ctx.lineTo(cx+p.x*R,cy+p.y*R):ctx.moveTo(cx+p.x*R,cy+p.y*R);on=true}ctx.stroke()}
  for(const d of dots){const p=proj(d[0],d[1]);if(p.z<0)continue;ctx.fillStyle=`rgba(164,215,232,${.18+p.z*.72})`;ctx.beginPath();ctx.arc(cx+p.x*R,cy+p.y*R,(.6+p.z*.75)*opt.dot,0,7);ctx.fill()}
  if(opt.orbit){ctx.save();ctx.translate(cx,cy);ctx.rotate(-.37);ctx.beginPath();ctx.ellipse(0,0,R*1.23,R*.43,0,0,7);ctx.strokeStyle='#9ddcec38';ctx.lineWidth=.8;ctx.stroke();const a=tick*.22;ctx.beginPath();ctx.ellipse(0,0,R*1.23,R*.43,0,a,a+.5);ctx.strokeStyle='#e34e65';ctx.lineWidth=2;ctx.shadowColor='#e34e65';ctx.shadowBlur=12;ctx.stroke();ctx.restore()}
  /* arcs */
  const hub=offices[0];const arcsTo=opt.arcs;
  arcsTo.forEach((t,k)=>{const phase=((tick*.35+k*.27)%1.6);const lift=opt.lift;ctx.beginPath();let on=false;const N=40;const head=Math.min(phase,1);
   for(let i=0;i<=N*head;i++){const u=i/N;const [lo,la,d]=slerp(hub,t,u);const p=proj(lo,la);const e=1+Math.sin(u*Math.PI)*d*lift;if(p.z<-.05){on=false;continue}const X=cx+p.x*R*e,Y=cy+p.y*R*e;on?ctx.lineTo(X,Y):ctx.moveTo(X,Y);on=true}
   const fade=phase>1?1-(phase-1)/.6:1;ctx.strokeStyle=`rgba(232,90,110,${.75*fade})`;ctx.lineWidth=1.4;ctx.stroke()});
  const pin=(pts,col,rr)=>{for(const [lon,lat] of pts){const p=proj(lon*R2D,lat*R2D);if(p.z<0)continue;const x=cx+p.x*R,y=cy+p.y*R;ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;if(rr>2.5){ctx.beginPath();ctx.arc(x,y,rr*2.2+Math.sin(tick*1.8)*2,0,7);ctx.strokeStyle=col+'70';ctx.stroke()}}};
  if(opt.projects)pin(projects,'#9fd0e0',2.2);
  pin(offices,'#f67988',2.8)}
 function loop(now){if(!st.paused&&visible&&!document.hidden&&now-last>30)draw(now);requestAnimationFrame(loop)}requestAnimationFrame(loop);
 new IntersectionObserver(e=>{visible=e[0].isIntersecting},{threshold:0}).observe(canvas);
 document.addEventListener('visibilitychange',()=>last=performance.now());
 return{st,redraw:()=>draw(performance.now(),true),state:()=>({angle,paused:st.paused,visible})};
}

window.LAGlobe={makeGlobe,offices,projects,reduced};
})();
