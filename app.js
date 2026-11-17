/* MineGuard Assembly Lab. All robot geometry is authored procedurally below.
 * User-authorized exception: only the CHX-3 arm uses the supplied local CAD data.
 * All other components are procedural. No online assets, image maps or frameworks.
 * Model scale: 1 world unit = 100 mm (display estimate, not measured dimensions).
 */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 if(!window.THREE){$('render-error').hidden=false;$('render-error').textContent='本地 Three.js 运行库未载入，请保持 vendor 文件夹与 index.html 在同一目录。';return;}
 const icon = n => `<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;
 const V = (x=0,y=0,z=0) => new THREE.Vector3(x,y,z);
 const fmt = n => new Intl.NumberFormat('zh-CN').format(n);
 const PARTS = [
  {id:'base',no:'01',name:'履带行走平台',en:'TRACKED MOBILITY',icon:'track',tag:'实拍结构 / 方案选型',description:'双侧履带与六轮支撑结构，承载多模态感知和执行模块。独立履带节、轮毂开孔和销轴呈现行走机构的装配关系。',params:[['底盘选型','L150 履带式底盘','项目技术方案'],['轮组结构','每侧六轮','实拍外观参考'],['运动控制','速度—位置双环 PID','方案控制架构']],flow:['驱动指令','左右履带','状态反馈'],offset:[0,0,0],material:'金属轮毂 / 橡胶履带'},
  {id:'frame',no:'02',name:'机身框架与舱壳',en:'ENCLOSURE & STRUCTURE',icon:'layers',tag:'实拍框架 / 外壳优化设计',description:'四柱骨架承接上层感知平台，新增可拆卸侧护板、散热格栅、检修盖与密封边条，将内部器件组织为设备舱。双层青色灯带保留实物辨识度。',params:[['承载骨架','四柱 / 双层设备板','实拍外观参考'],['舱壳结构','开孔侧护板 / 独立检修盖','外壳优化设计，非实物现状'],['维护方式','逐件拆解 / 舱壳透视','交互结构展示']],flow:['骨架承载','舱壳防护','检修维护'],offset:[.35,1.15,0],material:'金属舱壳 / 密封边条 / 连接件'},
  {id:'vision',no:'03',name:'视觉与定位感知',en:'VISION & POSITIONING',icon:'eye',tag:'实拍结构 / 方案选型',description:'顶部圆形感知组件、二自由度云台与视觉相机共同构成观察单元。镜头、关节轴、支架孔位和柔性线束全部由几何体生成。',params:[['视觉选型','野火 K210 AI 视觉相机','项目技术方案'],['云台结构','二自由度','项目技术方案'],['定位信息','激光雷达 / SLAM','方案功能；型号未提供']],flow:['图像采集','增强与识别','目标信息'],offset:[.35,3.1,0],material:'黑色金属 / 程序化光学材质'},
  {id:'environment',no:'04',name:'环境传感单元',en:'ENVIRONMENT SENSING',icon:'signal',tag:'方案参数 / 实拍外观',description:'传感板、金属传感罐和通风外壳形成外露采集单元。五类环境参数按技术方案列出，板卡布线与封装细节为程序化外观示意。',params:[['气体与烟雾','CO / CH₄ / 烟雾','项目技术方案'],['其他参数','温度 / 气压','项目技术方案'],['数据处理','采样、调理与数字滤波','方案数据链路']],flow:['环境采样','信号调理','趋势分析'],offset:[.4,.85,2.25],material:'FR4 板 / 金属传感外壳'},
  {id:'arm',no:'05',name:'六轴机械臂与执行',en:'CHX-3 / SIX-AXIS MANIPULATOR',icon:'arm',tag:'用户原始 CAD / 99 个零件实例',description:'使用原文件包 CHX-3 装配的真实显示网格，保留回转底座、大臂、并行连杆、腕部齿轮箱及末端结构。机械臂底座位于车头中线的下层平台，朝车头作业；安装托板与上部舱壳分层布置，保留原始 CAD 零件关系。',params:[['结构来源','CHX-3 原装配文件','98 个独立源件实例 + 1 个缓存件'],['关节结构','J1–J6 六轴结构定位','未仿真关节约束或可达空间'],['安装形式','车头中线 / 下层前置','用户确认布局 / 安装托板优化']],flow:['目标与指令','六轴执行','动作反馈'],offset:[-2.35,.65,0],material:'原始 CAD 网格 / 展示材质'},
  {id:'control',no:'06',name:'主控与通信电路',en:'CONTROL & COMMUNICATION',icon:'chip',tag:'方案选型 / 板卡外观示意',description:'主控板、功率器件、通信屏蔽罩、排针和线束连接感知与执行。芯片、引脚、板上走线均为几何结构，未使用图片贴图。',params:[['主控芯片','STM32F103RCT6','项目技术方案'],['控制接口','传感采集 / PWM / 串口','项目技术方案'],['通信方式','工业级无线串口 / CRC','项目技术方案']],flow:['多源输入','主控协调','指令与回传'],offset:[2.15,1.0,.8],material:'FR4 板 / 铜走线 / 元件封装'},
  {id:'alarm',no:'07',name:'声光提示与照明',en:'WARNING & ILLUMINATION',icon:'signal',tag:'实拍外观 / 方案功能',description:'红色警示灯、提示器外壳与前部照明形成可辨识的现场提示单元。灯罩棱纹、扩散体和安装底座以程序化几何表现。',params:[['预警架构','分区三级预警','项目技术方案'],['现场提示','声光与远程语音联动','项目技术方案'],['红色灯罩','棱纹壳体与安装底座','实拍外观参考']],flow:['风险判定','分级提示','人工复核'],offset:[1.8,2.35,-1.75],material:'聚合物灯罩 / 发光材质'},
  {id:'power',no:'08',name:'供电与电源管理',en:'POWER & DISTRIBUTION',icon:'power',tag:'集成事实 / 封装示意',description:'展示底盘内部的电源封装、固定带、接插件与配电线束。技术方案未提供电池型号、容量和续航，页面保留这些信息边界。',params:[['电源管理','已集成于控制电路','项目技术方案'],['电池规格','型号 / 容量未提供','不填入推测的额定数值'],['供电封装','结构与接口示意','程序化建模估计']],flow:['电源输入','配电与管理','模块供电'],offset:[1.4,.2,-2.25],material:'电源封装 / 固定带 / 接插件'},
  {id:'fire',no:'09',name:'后置灭火器与管路',en:'REAR FIRE SUPPRESSION',icon:'fire',tag:'用户确认后置 / 方案干粉灭火',description:'灭火器位于车尾，与前置机械臂分区布置。压力瓶体、阀头、压把、保险销、压力表、固定箍、承载背架和连续软管分别建模，可按完整元件或单个零件隔离。',params:[['安装位置','机器人车尾','用户明确确认'],['灭火形式','干粉灭火装置','项目技术方案'],['展示细节','瓶体 / 阀组 / 仪表 / 管路','结构与封装为程序化还原'],['额定参数','容量与工作压力未提供','压力表为静态几何，无实时读数']],flow:['火情确认','报警与定位','定点处置'],offset:[2.45,.65,-.65],material:'喷涂瓶体 / 黄铜阀 / 橡胶软管 / 金属背架'}
 ];
 const partMap=new Map(PARTS.map(p=>[p.id,p]));
 const state={selected:null,leaf:null,explode:0,targetExplode:0,detailPart:null,detailExplode:0,targetDetail:0,shellTransparent:false,showAxes:true,isolated:false,preserveAssembly:true,wireframe:false,labels:true,grid:true,autoRotate:false,demo:false,manualHidden:new Set(),view:'iso'};
 let renderer,scene,camera,robot,ground,grid,ring,raycaster,clock,frameId,ready=false;
 const pickables=[],geoCache=new Map(),allMaterials=new Set(),assemblies=new Map();
 const roots=new Map(),guides=new Map(),labels=new Map();
 let currentGroup,materialSet,prevTime=0,toastTimer,dirty=true;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const mobileView=()=>matchMedia('(pointer: coarse)').matches||Math.min(innerWidth,innerHeight)<580;
 const highQuality=new URLSearchParams(location.search).get('quality')==='high';
 const orbit={yaw:-.73,pitch:.35,radius:11.6,target:V(-.1,2.3,0),desiredTarget:V(-.1,2.3,0),desiredRadius:11.6,desiredYaw:-.73,desiredPitch:.35,tween:0};

 function makeMaterials(){
  const m=(name,color,metalness=.3,roughness=.4,extra={})=>{const mat=new THREE.MeshStandardMaterial({name,color,metalness,roughness,...extra});if(name==='警示灯罩'){mat.transparent=true;mat.opacity=.68;mat.metalness=.06;mat.depthWrite=false;mat.side=THREE.DoubleSide;}allMaterials.add(mat);return mat;};
  return {body:m('阳极氧化车体',0x23333e,.5,.34),shell:m('精细金属舱壳',0x263a48,.5,.31),dark:m('黑色机构外壳',0x111c25,.35,.32),rubber:m('履带橡胶',0x101820,.05,.82),silver:m('机加工铝',0xa6b4bc,.65,.28),steel:m('钢制传动件',0x627f8b,.7,.24),amber:m('机械臂橙色饰面',0xd69750,.4,.32),copper:m('PCB 铜走线',0xb49558,.55,.4),gold:m('镀金接点',0xe0b766,.6,.3),pcb:m('绿色阻焊层',0x194c40,.22,.45),blue:m('传感器蓝色板',0x194660,.25,.4),ivory:m('接插件',0xc4d2ce,.06,.44),fireRed:m('灭火器深红色烤漆',0xb32332,.38,.27),red:m('警示灯罩',0x9f2439,.23,.25),wireRed:m('红色线束',0x9d3e34,.05,.6),wireGold:m('黄色线束',0xb59442,.05,.6),cyan:m('青色灯带',0x53d8dd,.1,.25,{emissive:0x2ed9e4,emissiveIntensity:1.25,toneMapped:false}),light:m('照明扩散体',0xffd7a3,.03,.3,{emissive:0xffc46d,emissiveIntensity:1.1}),redLight:m('红色指示灯',0xe43b50,.1,.3,{emissive:0xe43b50,emissiveIntensity:1.8}),glass:m('镜头镀膜',0x12374b,.35,.12),smoke:m('设备层板',0x294553,.38,.28)};
 }
 function geometry(key,create){if(!geoCache.has(key))geoCache.set(key,create());return geoCache.get(key);}
 function component(name,build){const parent=currentGroup,g=new THREE.Group();g.name=name;g.userData.partId=parent.userData.partId;g.userData.componentId='component-'+(assemblies.size+1);parent.add(g);assemblies.set(g.userData.componentId,{name,group:g,leaves:[]});currentGroup=g;try{return build(g);}finally{currentGroup=parent;}}
 function bevelBox(pos,size,mat=materialSet.body,name='倒角封装',radius=.025){const [w,h,d]=size,s=roundedPath(-w/2,-h/2,w,h,Math.min(radius,w*.18,h*.18));return mesh(extrude(s,d,Math.min(radius*.2,d*.2)),mat,pos,[0,0,0],name);}
 function via(pos,r=.012){const ring=new THREE.Shape();ring.absarc(0,0,r,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(0,0,r*.48,0,Math.PI*2,true);ring.holes.push(h);return mesh(geometry('via-'+r,()=>extrude(ring,.003,0)),materialSet.gold,pos,[-Math.PI/2,0,0],'镀铜通孔与焊盘');}
 function mesh(geo,mat,pos=[0,0,0],rotation=[0,0,0],name='程序化部件'){
  const o=new THREE.Mesh(geo,mat);o.name=name;o.position.set(...pos);o.rotation.set(...rotation);o.castShadow=true;o.receiveShadow=true;currentGroup.add(o);o.userData.partId=currentGroup.userData.partId;pickables.push(o);return o;
 }
 function box(pos,size,mat=materialSet.body,name='结构件'){return mesh(geometry('b'+size.join(','),()=>new THREE.BoxGeometry(...size)),mat,pos,[0,0,0],name);}
 function cylinder(pos,r,h,mat=materialSet.silver,axis='y',segments=32,r2=r,name='轴体'){
  const rot=axis==='z'?[Math.PI/2,0,0]:axis==='x'?[0,0,Math.PI/2]:[0,0,0];
  return mesh(geometry(`c${r}/${r2}/${h}/${segments}`,()=>new THREE.CylinderGeometry(r2,r,h,segments)),mat,pos,rot,name);
 }
 function torus(pos,r,t,mat=materialSet.silver,axis='z',name='环件'){
  const rot=axis==='y'?[Math.PI/2,0,0]:axis==='x'?[0,Math.PI/2,0]:[0,0,0];
  return mesh(geometry(`t${r}/${t}`,()=>new THREE.TorusGeometry(r,t,8,48)),mat,pos,rot,name);
 }
 function tube(points,r,mat=materialSet.dark,name='线束',closed=false){
  const c=new THREE.CatmullRomCurve3(points.map(p=>V(...p)),closed,'centripetal');return mesh(new THREE.TubeGeometry(c,Math.max(16,points.length*5),r,6,closed),mat,[0,0,0],[0,0,0],name);
 }
 function roundedPath(x,y,w,h,r,Path=THREE.Shape){
  const s=new Path();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
 }
 function extrude(shape,depth,bevel=.015){const g=new THREE.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,curveSegments:12});g.translate(0,0,-depth/2);return g;}
 function plate(pos,w,d,h,mat=materialSet.body,vents=false){
  const s=roundedPath(-w/2,-d/2,w,d,.08);
  for(const x of [-w/2+.14,w/2-.14])for(const y of [-d/2+.14,d/2-.14]){const q=new THREE.Path();q.absarc(x,y,.033,0,Math.PI*2,true);s.holes.push(q);}
  if(vents)for(let i=0;i<6;i++)s.holes.push(roundedPath(-.67+i*.24,-d/2+.05,.13,.045,.02,THREE.Path));
  return mesh(extrude(s,h,.008),mat,pos,[-Math.PI/2,0,0],'开孔设备板');
 }
 function bolt(pos,r=.027,axis='y'){
  const g=geometry('socket-bolt-'+r,()=>{
   const s=new THREE.Shape(),hole=new THREE.Path();for(let i=0;i<6;i++){let a=i*Math.PI/3;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r);}s.closePath();for(let i=0;i<6;i++){let a=-i*Math.PI/3;i?hole.lineTo(Math.cos(a)*r*.35,Math.sin(a)*r*.35):hole.moveTo(Math.cos(a)*r*.35,Math.sin(a)*r*.35);}hole.closePath();s.holes.push(hole);
   const head=extrude(s,r*.65,r*.035),shaft=new THREE.CylinderGeometry(r*.45,r*.45,r*1.7,16);shaft.rotateX(Math.PI/2);shaft.translate(0,0,-r*1.10);
   const helix=new THREE.Curve();helix.getPoint=(t,target=new THREE.Vector3())=>target.set(Math.cos(t*Math.PI*8)*r*.49,Math.sin(t*Math.PI*8)*r*.49,-r*.31-t*r*1.59);
   const thread=new THREE.TubeGeometry(helix,56,r*.055,5,false),items=[head,shaft,thread].map(g=>g.index?g.toNonIndexed():g),merged=new THREE.BufferGeometry();
   for(const attr of ['position','normal']){const a=new Float32Array(items.reduce((n,g)=>n+g.attributes[attr].array.length,0));let k=0;items.forEach(g=>{a.set(g.attributes[attr].array,k);k+=g.attributes[attr].array.length;});merged.setAttribute(attr,new THREE.BufferAttribute(a,3));}items.forEach(g=>g.dispose());head.dispose();shaft.dispose();thread.dispose();return merged;
  });
  const rot=axis==='y'?[-Math.PI/2,0,0]:axis==='x'?[0,-Math.PI/2,0]:axis==='z-'?[0,Math.PI,0]:[0,0,0];return mesh(g,materialSet.silver,pos,rot,'内六角螺钉（含螺杆与螺纹）');
 }
 function instances(geo,mat,transforms,name){const o=new THREE.InstancedMesh(geo,mat,transforms.length),dummy=new THREE.Object3D();
  transforms.forEach((t,i)=>{dummy.position.set(...t.p);dummy.rotation.set(...(t.r||[0,0,0]));dummy.scale.set(1,1,1);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);});o.name=name;o.castShadow=true;o.receiveShadow=true;o.userData.partId=currentGroup.userData.partId;currentGroup.add(o);pickables.push(o);return o;}
 function flange(pos,r=.24,axis='z'){
  cylinder(pos,r,.075,materialSet.silver,axis);torus(pos,r*.78,.015,materialSet.steel,axis);
  for(let i=0;i<8;i++){let a=i*Math.PI/4,p=pos.slice();if(axis==='z'){p[0]+=Math.cos(a)*r*.81;p[1]+=Math.sin(a)*r*.81;p[2]+=.05;}else{p[0]+=.05;p[1]+=Math.cos(a)*r*.81;p[2]+=Math.sin(a)*r*.81;}bolt(p,.018,axis);}
 }
 function gear(pos,r=.28,mat=materialSet.steel){const s=new THREE.Shape();for(let i=0;i<72;i++){let a=i*Math.PI*2/72,rr=r*(i%3===0?.88:1);i?s.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):s.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}s.closePath();const hole=new THREE.Path();hole.absarc(0,0,r*.28,0,Math.PI*2,true);s.holes.push(hole);return mesh(extrude(s,.07,.003),mat,pos,[0,0,0],'齿轮');}
 function buildBase(){
  box([0,.72,0],[3.12,.62,1.8],materialSet.body,'底盘承载箱');plate([0,1.06,0],3.55,2.18,.09,materialSet.body,true);box([0,.37,0],[2.8,.1,1.68],materialSet.dark,'下部护板');
  const pads=[],ribs=[],pins=[],a=1.48,r=.37,L=4*a+2*Math.PI*r;
  for(const z of [-1.25,1.25]){
   box([0,.52,z],[2.95,.15,.12],materialSet.steel,'轮组支撑梁');
   for(let i=0;i<6;i++){
    const x=[-1.48,-.9,-.3,.3,.9,1.48][i],cy=i===0||i===5?.5:.44,rr=i===0||i===5?.32:.285;component((z>0?'左':'右')+'履带轮 '+(i+1)+' 总成',()=>{
    cylinder([x,cy,z],rr,.44,materialSet.rubber,'z');
    const face=new THREE.Shape();face.absarc(0,0,rr*.85,0,Math.PI*2,false);
    for(let k=0;k<5;k++){const hole=new THREE.Path(),q=k*Math.PI*2/5;hole.absarc(Math.cos(q)*rr*.53,Math.sin(q)*rr*.53,rr*.155,0,Math.PI*2,true);face.holes.push(hole);}
    for(const sign of [-1,1]){mesh(extrude(face,.027,.004),materialSet.silver,[x,cy,z+sign*.238],[0,0,0],'五孔机加工轮毂');cylinder([x,cy,z+sign*.26],.07,.045,materialSet.steel,'z');bolt([x,cy,z+sign*.29],.035,'z');torus([x,cy,z+sign*.243],rr*.75,.009,materialSet.steel,'z','轮毂端面车削止口');}
   });}
   for(let i=0;i<68;i++){
    let s=L*i/68,x,y,ang;
    if(s<2*a){x=-a+s;y=.5+r;ang=0;}else if(s<2*a+Math.PI*r){let t=(s-2*a)/r;x=a+r*Math.sin(t);y=.5+r*Math.cos(t);ang=-t;}else if(s<4*a+Math.PI*r){x=a-(s-2*a-Math.PI*r);y=.5-r;ang=Math.PI;}else{let t=(s-4*a-Math.PI*r)/r;x=-a-r*Math.sin(t);y=.5-r*Math.cos(t);ang=Math.PI-t;}
    pads.push({p:[x,y,z],r:[0,0,ang]});ribs.push({p:[x-Math.sin(ang)*.045,y+Math.cos(ang)*.045,z],r:[0,0,ang]});for(const sign of [-1,1])pins.push({p:[x,y,z+sign*.29],r:[Math.PI/2,0,0]});
   }
  }
  const trackShape=roundedPath(-.0525,-.28,.105,.56,.012);for(const z of [-.17,0,.17])trackShape.holes.push(roundedPath(-.018,z-.033,.036,.066,.009,THREE.Path));const trackGeo=extrude(trackShape,.065,.002);trackGeo.rotateX(-Math.PI/2);instances(trackGeo,materialSet.rubber,pads,'开孔履带链块');instances(new THREE.BoxGeometry(.035,.025,.57),materialSet.body,ribs,'履带横向抓地纹');instances(new THREE.CylinderGeometry(.021,.021,.025,10),materialSet.steel,pins,'履带销轴');
  for(const x of [-1.5,1.5])for(const z of [-.86,.86])bolt([x,1.12,z],.035);
 }
 function buildFrame(){
  for(const x of [-.93,.93])for(const z of [-.80,.80]){const tag=(x<0?'前':'后')+(z>0?'左':'右');cylinder([x,1.95,z],.038,1.73,materialSet.silver).name=tag+'承载立柱';for(const y of [1.14,1.91,2.80]){cylinder([x,y,z],.061,.07,materialSet.steel).name=tag+'层板隔套';bolt([x,y+.05,z],.025);}}
  plate([0,1.90,0],2.34,1.91,.055,materialSet.smoke);plate([0,2.80,0],2.54,2.12,.06,materialSet.body,true);
  const path=roundedPath(-1.27,-1.06,2.54,2.12,.14),pts=path.getPoints(80);
  for(const y of [2.67,2.91])tube(pts.map(p=>[p.x,y,p.y]),.015,materialSet.cyan,'双层青色 LED 灯带',true);
  const light=new THREE.PointLight(0x42d5e2,.8,4,2);light.position.set(0,2.55,0);currentGroup.add(light);
  buildEnclosure();
  // User-confirmed layout: front-centre lower arm mount, not a side cantilever.
  component('车头机械臂安装平台',()=>{plate([-1.98,1.10,0],1.65,1.45,.07,materialSet.body).name='六轴机械臂车头下层安装托板';
   for(const z of [-.58,.58]){box([-1.69,1.015,z],[2.05,.10,.12],materialSet.steel,'车头机械臂平台纵向加强梁');for(const x of [-2.56,-.83])bolt([x,x> -1.2?1.09:1.15,z],.035);}
   for(const x of [-2.71,-1.24])box([x,1.055,0],[.045,.07,1.28],materialSet.amber,'机械臂安装平台边缘加强件');
   for(const x of [-2.35,-1.58])for(const z of [-.47,.47])bolt([x,1.16,z],.032);
  });
 }
 function buildEnclosure(){
  function panel(pos,w,h,depth,rot,name,slots=true){return component(name+'总成',()=>{const s=roundedPath(-w/2,-h/2,w,h,.055);
   for(const x of [-w/2+.085,w/2-.085])for(const y of [-h/2+.075,h/2-.075]){const q=new THREE.Path();q.absarc(x,y,.024,0,Math.PI*2,true);s.holes.push(q);}
   if(slots)for(let k=0;k<7;k++)s.holes.push(roundedPath(-w*.31+k*w*.09,-h*.22,w*.042,h*.44,.018,THREE.Path));
   const o=mesh(extrude(s,depth,.008),materialSet.shell,pos,rot,name);o.userData.isShell=true;
   const seal=new THREE.Group();seal.position.set(...pos);seal.rotation.set(...rot);currentGroup.add(seal);const old=currentGroup;seal.userData.partId='frame';currentGroup=seal;
   const path=roundedPath(-w/2+.045,-h/2+.035,w-.09,h-.07,.04).getPoints(48);tube(path.map(v=>[v.x,v.y,-depth*.6]),.012,materialSet.rubber,name+'密封边条',true);
   for(const x of [-w/2+.085,w/2-.085])for(const y of [-h/2+.075,h/2-.075])bolt([x,y,depth*.8],.026,'z');currentGroup=old;
   return o;});
  }
  for(const z of [-.89,.89])panel([0,2.34,z],1.76,.69,.035,[0,z<0?Math.PI:0,0],(z<0?'右':'左')+'上舱散热侧护板');
  panel([1.02,2.34,0],1.68,.69,.04,[0,Math.PI/2,0],'后舱检修盖',false);
  panel([-1.02,2.34,0],1.68,.69,.04,[0,-Math.PI/2,0],'前舱设备安装面板',false);
  for(const z of [-1.05,1.05])panel([0,1.39,z],2.70,.42,.045,[0,z<0?Math.PI:0,0],(z<0?'右':'左')+'下舱可拆卸护板');
  for(const x of [-1.39,1.39]){panel([x,1.39,0],1.91,.42,.045,[0,x<0?-Math.PI/2:Math.PI/2,0],x<0?'前部电源舱护盖':'后部接口舱盖',x>0);}
  // Panel seams, individual corner guards and service fittings, rather than a monolithic hull.
  for(const x of [-1.13,1.13])for(const z of [-.99,.99]){const q=box([x,2.36,z],[.15,.76,.12],materialSet.dark,'舱角防护件');q.userData.isShell=true;for(const y of [2.06,2.64])bolt([x,y,z+(z>0?.075:-.075)],.024,'z');}
  for(const z of [-1.075,1.075]){box([0,1.60,z],[2.75,.035,.035],materialSet.amber,'侧护板识别饰条');for(const x of [-.68,.68]){box([x,1.42,z+(z>0?.04:-.04)],[.20,.075,.035],materialSet.body,'检修盖锁扣');bolt([x,1.42,z+(z>0?.063:-.063)],.018,'z');}}
  for(const x of [-1.71,1.71])for(const z of [-.90,.90]){const bumper=box([x,1.18,z],[.20,.25,.27],materialSet.rubber,'底盘防撞护角');bumper.rotation.y=z*x>0?.18:-.18;bolt([x,1.32,z],.03);}
  for(const z of [-.46,0,.46]){cylinder([1.445,1.37,z],.075,.07,materialSet.steel,'x').name='后舱圆形防护接口';cylinder([1.49,1.37,z],.053,.025,materialSet.dark,'x').name='接口密封防尘盖';}
  for(const x of [-.24,.72])for(const z of [0,.50])cylinder([x,1.95,z],.025,.10,materialSet.silver).name='主控板安装隔柱';
 }
 function buildVision(){
  component('顶部感知回转平台',()=>{
   const profile=[[0,0],[.54,0],[.64,.025],[.64,.11],[.60,.13],[.60,.43],[.56,.46],[.56,.5],[.08,.5],[0,.5]].map(p=>new THREE.Vector2(...p));
   mesh(new THREE.LatheGeometry(profile,64),materialSet.dark,[.42,2.91,0],[0,0,0],'顶部感知组件车削壳体');cylinder([.42,3.42,0],.57,.035,materialSet.body).name='回转平台上盖';torus([.42,3.447,0],.47,.014,materialSet.silver,'y').name='回转平台密封压圈';
   for(let i=0;i<10;i++){const a=i*Math.PI*2/10;bolt([.42+.54*Math.cos(a),3.45,.54*Math.sin(a)],.021);let w=bevelBox([.42+.601*Math.cos(a),3.18,.601*Math.sin(a)],[.022,.10,.105],materialSet.glass,'感知壳体分段窗口',.005);w.rotation.y=-a;}
   torus([.42,2.99,0],.625,.008,materialSet.steel,'y').name='回转壳上下分模缝';for(let i=0;i<36;i++){const a=i*Math.PI*2/36;const q=box([.42+.574*Math.cos(a),3.41,.574*Math.sin(a)],[.025,.018,.040],materialSet.steel,'回转平台细齿纹');q.rotation.y=-a;}
  });
  component('相机云台完整总成',()=>{
   cylinder([.42,3.56,0],.25,.21,materialSet.dark).name='云台水平回转轴壳';torus([.42,3.57,0],.252,.006,materialSet.steel,'y').name='回转轴壳接缝';plate([.42,3.68,0],.58,.68,.045,materialSet.body).name='云台驱动安装座';
   for(const z of [-.25,.25]){const s=roundedPath(-.14,-.41,.28,.82,.025);for(let j=0;j<3;j++)s.holes.push(roundedPath(-.055,-.30+j*.20,.11,.12,.028,THREE.Path));mesh(extrude(s,.045,.007),materialSet.dark,[.42,4.10,z],[0,0,0],(z<0?'右':'左')+'云台开槽加强支架');
    for(const x of [.31,.53])bevelBox([x,4.09,z+(z>0?.028:-.028)],[.025,.68,.022],materialSet.steel,'支架加强边筋',.006);for(const y of [3.77,4.40])bolt([.42,y,z+(z>0?.037:-.037)],.020,'z');
    cylinder([.42,4.43,z],.101,.075,materialSet.silver,'z',40).name='俯仰轴承座';torus([.42,4.43,z+(z>0?.045:-.045)],.077,.010,materialSet.steel,'z').name='轴承防尘密封圈';bolt([.42,4.43,z+(z>0?.058:-.058)],.031,'z');
   }
   // Drive housings fill the structural volume with functional-looking mechanical detail.
   component('俯仰伺服与减速器',()=>{bevelBox([.42,4.25,-.37],[.29,.40,.19],materialSet.body,'俯仰伺服带倒角壳体',.03);bevelBox([.42,4.25,-.474],[.26,.34,.025],materialSet.dark,'俯仰伺服检修盖',.018);for(const x of [.32,.52])for(const y of [4.12,4.38])bolt([x,y,-.494],.014,'z-');for(let i=0;i<5;i++)box([.34+i*.04,4.20,-.49],[.018,.13,.006],materialSet.steel,'伺服背盖散热筋');cylinder([.42,4.43,-.29],.12,.10,materialSet.dark,'z',40).name='俯仰输出减速盘';torus([.42,4.43,-.35],.10,.007,materialSet.silver).name='减速盘端面止口';});
   component('水平回转驱动与限位',()=>{bevelBox([.74,3.79,0],[.22,.20,.30],materialSet.body,'水平回转伺服外壳',.022);for(let k=0;k<4;k++)box([.85,3.72+k*.04,0],[.01,.016,.22],materialSet.steel,'水平驱动散热筋');cylinder([.65,3.75,0],.085,.10,materialSet.steel,'x').name='水平驱动输出轴盖';bevelBox([.15,3.76,.15],[.12,.10,.10],materialSet.dark,'回转限位开关',.009);box([.19,3.82,.12],[.07,.018,.035],materialSet.silver,'限位触片');for(const z of [-.22,.22])bolt([.42,3.72,z],.020);});
   // Rear brace and cable comb give depth without obscuring the camera front.
   const brace=roundedPath(-.15,-.23,.30,.46,.028);brace.holes.push(roundedPath(-.084,-.12,.168,.24,.03,THREE.Path));mesh(extrude(brace,.035,.006),materialSet.body,[.56,4.06,0],[0,Math.PI/2,0],'云台后部镂空横撑');for(const y of [3.89,4.23])bolt([.59,y,0],.017,'x');
   component('K210 视觉相机完整元件',()=>{
    bevelBox([.32,4.66,0],[.34,.43,.49],materialSet.dark,'相机精细倒角外壳',.022);bevelBox([.13,4.66,0],[.04,.43,.49],materialSet.body,'相机前面板',.012);bevelBox([.502,4.66,0],[.026,.39,.45],materialSet.body,'相机后检修盖',.012);
    cylinder([.06,4.66,0],.142,.15,materialSet.dark,'x',48).name='镜头调焦筒';for(let k=0;k<5;k++)torus([-.013+k*.018,4.66,0],.142,.0035,materialSet.steel,'x','镜头调焦环滚花分圈');torus([-.025,4.66,0],.133,.014,materialSet.silver,'x').name='镜头前压圈';cylinder([-.034,4.66,0],.119,.008,materialSet.glass,'x').name='镜头玻璃基面';
    const lens=new THREE.ShaderMaterial({uniforms:{},vertexShader:'varying vec2 p; void main(){p=uv*2.0-1.0; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 p;void main(){float r=length(p);vec3 c=mix(vec3(.012,.04,.07),vec3(.025,.18,.23),smoothstep(.8,.0,r));float rim=pow(max(0.,1.-abs(r-.78)*22.),2.);float shine=exp(-length(p-vec2(-.27,.32))*12.);gl_FragColor=vec4(c+vec3(.13,.44,.5)*rim*.22+vec3(.25,.52,.55)*shine,.99);}'});allMaterials.add(lens);mesh(new THREE.CircleGeometry(.112,48),lens,[-.04,4.66,0],[0,-Math.PI/2,0],'程序化镜头镀膜');
    for(const z of [-.19,.19])for(const y of [4.50,4.82]){bolt([.10,y,z],.017,'x');bolt([.522,y,z],.014,'x');}
    for(const z of [-.252,.252])for(let k=0;k<6;k++)box([.25+k*.032,4.68,z],[.012,.16,.005],materialSet.steel,'相机侧面导热散热筋');
    bevelBox([.527,4.64,.10],[.033,.082,.10],materialSet.steel,'相机数据接口金属座',.008);box([.547,4.64,.10],[.003,.047,.073],materialSet.dark,'相机数据接口插腔');for(let i=0;i<4;i++)box([.550,4.64,.076+i*.015],[.005,.016,.006],materialSet.gold,'相机接口金属触点');cylinder([.54,4.77,-.10],.022,.045,materialSet.dark,'x').name='相机线缆防水接头';for(let i=0;i<4;i++)torus([.55+i*.01,4.77,-.10],.022,.002,materialSet.rubber,'x','接头防折护套');
    plate([.34,4.422,0],.32,.34,.025,materialSet.steel).name='相机俯仰安装底托';for(const z of [-.11,.11])bolt([.34,4.444,z],.014);cylinder([.526,4.54,-.12],.009,.005,materialSet.redLight,'x').name='相机状态指示灯';
   });
   tube([[.58,4.77,-.10],[.69,4.66,-.12],[.72,4.24,-.20],[.68,3.90,-.26],[.63,3.72,-.22]],.018,materialSet.dark,'云台柔性蛇形线束');for(const y of [3.90,4.16]){bevelBox([.63,y,-.24],[.10,.036,.08],materialSet.steel,'云台线束固定夹',.006);bolt([.65,y+.022,-.24],.012);}
   tube([[.54,4.22,-.46],[.67,4.11,-.45],[.68,3.73,-.27],[.78,3.56,-.25]],.009,materialSet.wireRed,'云台俯仰电机控制线');
  });
  tube([[.63,3.72,-.22],[.80,3.3,.32],[.91,2.84,.54]],.017,materialSet.dark,'视觉组件主线束');
 }
 function board(pos,w,d,mat=materialSet.pcb,name='开孔电路板'){
  const shape=roundedPath(-w/2,-d/2,w,d,Math.min(.035,w*.1)),inset=Math.min(.055,w*.16,d*.16),hr=Math.min(.022,w*.06);
  for(const x of [-w/2+inset,w/2-inset])for(const z of [-d/2+inset,d/2-inset]){const h=new THREE.Path();h.absarc(x,z,hr,0,Math.PI*2,true);shape.holes.push(h);}
  const o=mesh(extrude(shape,.025,.0015),mat,pos,[-Math.PI/2,0,0],name+' / FR4 基板');
  for(const x of [-w/2+inset,w/2-inset])for(const z of [-d/2+inset,d/2-inset]){const s=new THREE.Shape();s.absarc(0,0,hr*1.6,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(0,0,hr,0,Math.PI*2,true);s.holes.push(h);mesh(extrude(s,.0025,0),materialSet.gold,[pos[0]+x,pos[1]+.014,pos[2]+z],[-Math.PI/2,0,0],'安装孔金属化焊环');}
  // Physical geometry on both faces: mask openings, via barrels, edge glass-fibre layers.
  for(const side of [-1,1]){const path=roundedPath(-w/2+.018,-d/2+.018,w-.036,d-.036,Math.min(.025,w*.08)).getPoints(28);tube(path.map(p=>[p.x+pos[0],pos[1]+side*.008,p.y+pos[2]]),.0015,materialSet.copper,'FR4 板边铜层轮廓',true);}
  const pads=[],padCount=Math.max(3,Math.floor(w*.72/.065));for(let i=0;i<padCount;i++)for(const s of [-1,1])pads.push({p:[pos[0]-w*.36+i*w*.72/(padCount-1),pos[1]+.015,pos[2]+s*d*.36]});instances(new THREE.BoxGeometry(.024,.003,.015),materialSet.gold,pads,'板边测试焊盘');
  for(let i=0;i<Math.max(3,Math.floor(w/.15));i++)via([pos[0]-w*.32+i*.15,pos[1]+.015,pos[2]-d*.18],Math.min(.011,w*.025));
  return o;
 }
 function smd(pos,size=[.04,.025,.022],name='贴片阻容'){
  component(name,()=>{bevelBox(pos,size,materialSet.ivory,name+' 陶瓷封装',.004);for(const sign of [-1,1]){box([pos[0]+sign*size[0]*.4,pos[1],pos[2]],[size[0]*.23,size[1]*1.02,size[2]*1.08],materialSet.silver,name+' 金属端电极');box([pos[0]+sign*size[0]*.52,pos[1]-size[1]*.47,pos[2]],[size[0]*.3,.004,size[2]*1.35],materialSet.gold,name+' 焊盘');}});
 }
 function qfp(pos,size=.22,count=12,name='STM32F103RCT6 主控芯片'){
  component(name,()=>{bevelBox(pos,[size,.045,size],materialSet.dark,name+' 细倒角本体',.008);cylinder([pos[0]-size*.30,pos[1]+.025,pos[2]-size*.30],size*.044,.002,materialSet.silver,'y',16).name='IC 一脚定位凹点';
   const leads=[],pads=[];for(let i=0;i<count;i++)for(const sign of [-1,1])for(const side of [0,1]){const n=(i-(count-1)/2)*size*.75/count,x=side?sign*size*.58:n,z=side?n:sign*size*.58;leads.push({p:[pos[0]+x,pos[1]-.009,pos[2]+z],r:[0,side?sign*Math.PI/2:(sign<0?Math.PI:0),0]});pads.push({p:[pos[0]+x*1.06,pos[1]-.022,pos[2]+z*1.06],r:[0,side?sign*Math.PI/2:(sign<0?Math.PI:0),0]});}
   const profile=new THREE.Shape();profile.moveTo(-.018,.012);for(const q of [[-.006,.012],[.004,.003],[.008,-.012],[.027,-.012],[.027,-.018],[.002,-.018],[-.003,-.005],[-.010,.005],[-.018,.005]])profile.lineTo(...q);profile.closePath();const lead=extrude(profile,size*.75/count*.52,0);lead.rotateY(-Math.PI/2);instances(lead,materialSet.silver,leads,name+' 鸥翼引脚');instances(new THREE.BoxGeometry(.010,.003,.032),materialSet.gold,pads,name+' 独立焊盘');
   for(let i=0;i<3;i++)box([pos[0],pos[1]+.025,pos[2]+(i-1)*size*.14],[size*(i===0?.55:.38),.0015,.005],materialSet.silver,name+' 几何封装刻线');
  });
 }
 function capacitor(x,y,z,r=.042,h=.11){component('铝电解电容',()=>{cylinder([x,y+h/2,z],r,h,materialSet.dark,'y',32).name='电容套管';cylinder([x,y+h+.005,z],r*.94,.009,materialSet.silver,'y',32).name='电容铝顶盖';for(const a of [-Math.PI/4,Math.PI/4]){const p=box([x,y+h+.011,z],[r*1.35,.002,.003],materialSet.steel,'电容防爆压痕');p.rotation.y=a;}box([x+r*.95,y+h/2,z],[.003,h*.8,r*.45],materialSet.ivory,'电容极性识别条');for(const s of [-1,1]){cylinder([x+s*r*.48,y-.014,z],.008,.035,materialSet.silver).name='电容引线';via([x+s*r*.48,y-.024,z],.014);}});}
 function headerPins(x,y,z,count=10,along='z'){
  component('带插孔排针连接器',()=>{const horizontal=along==='x',ts=[],holes=[];bevelBox([x,y,z],horizontal?[count*.037,.055,.065]:[.065,.055,count*.037],materialSet.dark,'连接器绝缘座',.007);
   for(let i=0;i<count;i++){const px=x+(horizontal?(i-(count-1)/2)*.037:0),pz=z+(horizontal?0:(i-(count-1)/2)*.037);ts.push({p:[px,y+.045,pz]});holes.push({p:[px,y+.028,pz]});}instances(new THREE.BoxGeometry(.024,.002,.024),materialSet.steel,holes,'连接器触点座孔');instances(new THREE.BoxGeometry(.010,.073,.010),materialSet.gold,ts,'连接器金属触点');
  });
 }
 function terminal(pos,count=3){component('螺钉接线端子',()=>{bevelBox(pos,[count*.075,.10,.12],materialSet.blue,'接线端子绝缘外壳',.007);for(let i=0;i<count;i++){const x=pos[0]+(i-(count-1)/2)*.075;cylinder([x,pos[1]+.052,pos[2]],.024,.006,materialSet.silver).name='端子压线螺钉';box([x,pos[1]+.056,pos[2]],[.031,.002,.004],materialSet.dark,'端子螺钉一字槽');box([x,pos[1]-.005,pos[2]+.061],[.038,.045,.002],materialSet.dark,'端子进线孔');cylinder([x,pos[1]-.005,pos[2]+.064],.011,.003,materialSet.copper,'z',12).name='端子铜压线套';}});}
 function buildEnvironment(){
  component('多传感器采集母板',()=>{board([.04,1.68,1.13],1.24,.74,materialSet.pcb,'环境采集母板');qfp([-.22,1.722,.96],.16,8,'采集调理芯片');headerPins(-.49,1.73,1.15,8);terminal([.44,1.75,.96],3);for(let i=0;i<7;i++){smd([-.45+i*.09,1.712,1.11],[.035,.018,.021],'信号调理贴片阻容');tube([[-.45+i*.09,1.695,1.15],[-.45+i*.09,1.695,1.26],[-.28+i*.06,1.695,1.30]],.003,materialSet.copper,'采集板折线铜箔');}cylinder([.55,1.72,1.13],.015,.018,materialSet.redLight).name='采集板状态 LED';});
  for(const [i,x] of [-.27,.08].entries())component((i?'CH₄':'CO')+' 气体传感器组件',()=>{board([x,1.73,1.43],.28,.39,materialSet.blue,(i?'CH₄':'CO')+' 传感板');
   const cap=new THREE.Shape();cap.absarc(0,0,.089,0,Math.PI*2,false);for(let row=-3;row<=3;row++)for(let col=-3;col<=3;col++){if(Math.hypot(row,col)>3.5)continue;const h=new THREE.Path();h.absarc(col*.021,row*.021,.006,0,Math.PI*2,true);cap.holes.push(h);}
   cylinder([x,1.81,1.47],.093,.14,materialSet.silver,'y',48).name='气体传感金属罐壁';cylinder([x,1.882,1.47],.084,.003,materialSet.dark).name='传感罐内部防尘滤层';mesh(extrude(cap,.004,0),materialSet.steel,[x,1.890,1.47],[-Math.PI/2,0,0],'真实开孔传感罐网盖');torus([x,1.89,1.47],.087,.005,materialSet.silver,'y').name='传感罐卷边';
   bevelBox([x,1.785,1.30],[.064,.056,.064],materialSet.blue,'调节电位器壳',.005);cylinder([x,1.817,1.30],.018,.007,materialSet.silver).name='电位器调整螺钉';box([x,1.822,1.30],[.026,.001,.004],materialSet.dark,'电位器一字槽');for(const s of [-1,1])smd([x+s*.085,1.76,1.34],[.032,.019,.018]);headerPins(x,1.76,1.58,4,'x');
  });
  component('温度与气压通风组件',()=>{board([.44,1.74,1.43],.24,.31,materialSet.blue,'环境传感板');const s=roundedPath(-.085,-.08,.17,.16,.01);for(let i=0;i<4;i++)s.holes.push(roundedPath(-.062+i*.036,-.05,.018,.10,.006,THREE.Path));mesh(extrude(s,.13,.003),materialSet.ivory,[.44,1.83,1.46],[0,0,0],'开孔通风传感封装');box([.44,1.83,1.40],[.12,.12,.003],materialSet.dark,'通风传感器内部滤网');headerPins(.44,1.78,1.33,4,'x');});
  component('传感显示与驱动模块',()=>{board([.32,1.73,.91],.33,.25,materialSet.blue,'显示模块基板');bevelBox([.32,1.755,.91],[.28,.02,.17],materialSet.dark,'显示窗口框',.008);box([.32,1.767,.91],[.25,.006,.14],materialSet.glass,'显示玻璃');for(let j=0;j<3;j++)for(let i=0;i<7;i++)box([.22+i*.033,1.772,.87+j*.04],[.020,.002,.004],materialSet.cyan,'显示窗口几何刻线');headerPins(.32,1.76,.81,4,'x');});
  for(let i=0;i<3;i++)tube([[-.4+i*.03,1.73,1.1],[-.7,1.9,.9],[-.65,2.35,.67],[.1,2.7,.5]],.009,[materialSet.wireRed,materialSet.dark,materialSet.wireGold][i],'环境传感线束');
 }
 function buildControl(){
  component('STM32 主控板总成',()=>{board([.25,1.99,.25],1.13,.67,materialSet.pcb,'STM32 主控板');qfp([.14,2.027,.22]);
   for(const x of [-.13,.12,.38])capacitor(x,2.008,.48);for(const x of [-.09,.20])component('屏蔽功率电感',()=>{bevelBox([x,2.05,.02],[.13,.09,.13],materialSet.steel,'电感铁氧体封装',.013);for(let i=0;i<4;i++)torus([x,2.055+i*.008,.02],.043,.003,materialSet.copper,'y','电感绕线纹');for(const s of [-1,1])box([x+s*.065,2.02,.02],[.024,.013,.06],materialSet.silver,'电感引脚');});
   for(let i=0;i<12;i++){let x=-.22+i*.075;tube([[x,2.004,.42],[x,2.004,.32],[x+.035,2.004,.285],[x+.035,2.004,.11]],.0025,materialSet.copper,'主控板折线铜箔');if(i%2===0)smd([x,2.024,.11],[.044,.022,.025],'主控旁路电容');}headerPins(-.24,2.05,.25,13);headerPins(.74,2.05,.25,13);
   component('主控数据插座',()=>{bevelBox([.60,2.07,.06],[.26,.12,.2],materialSet.ivory,'带锁扣数据插座',.008);box([.60,2.077,-.043],[.21,.075,.002],materialSet.dark,'数据插座插腔');for(let i=0;i<6;i++)box([.51+i*.036,2.077,-.046],[.009,.045,.010],materialSet.gold,'数据插座内部针脚');box([.60,2.14,.06],[.08,.018,.075],materialSet.ivory,'数据插座防脱锁扣');});
   component('晶体振荡器',()=>{bevelBox([.40,2.025,.31],[.13,.027,.055],materialSet.silver,'金属晶振壳',.018);for(const s of [-1,1])box([.40+s*.061,2.012,.31],[.02,.008,.045],materialSet.gold,'晶振焊盘');});terminal([.58,2.063,.47],3);
   for(const x of [-.20,.69])for(const z of [-.03,.53]){cylinder([x,1.94,z],.022,.085,materialSet.silver).name='主控 PCB 安装隔柱';bolt([x,2.016,z],.021);}
  });
  component('工业无线通信模块',()=>{board([.65,2.02,-.33],.62,.39,materialSet.blue,'通信模块基板');bevelBox([.65,2.09,-.34],[.37,.12,.24],materialSet.silver,'射频金属屏蔽罩',.016);const p=roundedPath(-.17,-.105,.34,.21,.012).getPoints(28);tube(p.map(v=>[v.x+.65,2.156,v.y-.34]),.0025,materialSet.steel,'屏蔽罩冲压接缝',true);for(let i=0;i<7;i++)box([.50+i*.047,2.158,-.34],[.025,.002,.003],materialSet.steel,'屏蔽罩几何刻线');headerPins(.40,2.05,-.33,7);cylinder([.89,2.08,-.45],.038,.06,materialSet.gold).name='天线螺纹接座';torus([.89,2.115,-.45],.032,.006,materialSet.silver,'y');cylinder([.89,2.32,-.45],.022,.40,materialSet.dark,'y',24,.017).name='柔性天线';for(let i=0;i<3;i++)torus([.89,2.16+i*.017,-.45],.024,.003,materialSet.rubber,'y','天线根部防折波纹');});
  component('电机驱动与散热组件',()=>{board([-.37,1.99,-.28],.43,.47,materialSet.pcb,'电机驱动板');bevelBox([-.37,2.03,-.28],[.35,.10,.35],materialSet.dark,'驱动器散热底座',.014);for(let k=0;k<8;k++)bevelBox([-.52+k*.043,2.13,-.28],[.016,.17,.35],materialSet.steel,'驱动器散热翅片',.004);for(const x of [-.52,-.22])bolt([x,2.10,-.42],.016);terminal([-.37,2.05,-.51],3);});
  for(let i=0;i<4;i++)tube([[.70,2.05,.38+i*.03],[.91,1.78,.56],[.95,1.26,.48],[.34,1.12,.40]],.012,[materialSet.wireRed,materialSet.dark,materialSet.wireGold,materialSet.dark][i],'主控配线');
 }
 function link(a,b,width,depth,z,mat,slot=true){
  const len=Math.hypot(b[0]-a[0],b[1]-a[1]),s=new THREE.Shape(),r=width/2;s.absarc(0,-len/2,r,Math.PI,Math.PI*2,false);s.lineTo(r,len/2);s.absarc(0,len/2,r,0,Math.PI,false);s.lineTo(-r,-len/2);
  for(const yy of [-len/2,len/2]){const q=new THREE.Path();q.absarc(0,yy,width*.19,0,Math.PI*2,true);s.holes.push(q);}
  if(slot&&len>.7)s.holes.push(roundedPath(-width*.16,-len/2+.22,width*.32,len-.44,width*.12,THREE.Path));
  return mesh(extrude(s,depth,.012),mat,[(a[0]+b[0])/2,(a[1]+b[1])/2,z],[0,0,Math.atan2(b[1]-a[1],b[0]-a[0])-Math.PI/2],'镂空机械臂连杆');
 }
 function buildArm(){
  const cad=window.MineGuardCAD;if(!cad||cad.componentCount!==99)throw Error('本地 CHX-3 CAD 数据缺失或不完整');
  const root=new THREE.Group();root.name='CHX-3 原始六轴机械臂 / 车头中线下层安装';root.userData.partId='arm';root.position.set(-1.98,1.14,0);currentGroup.add(root);
  const owner=currentGroup;currentGroup=root;const records=[];
  const bytes=s=>{const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;};
  cad.parts.forEach((p,i)=>{
   const quantBytes=bytes(p.positions),q=new Uint16Array(quantBytes.buffer),v=new Float32Array(q.length);
   for(let k=0;k<q.length;k++)v[k]=p.min[k%3]+q[k]/65535*p.span[k%3];
   const normalBytes=bytes(p.normals),ib=bytes(p.indices),idx=p.indexType==='u16'?new Uint16Array(ib.buffer):new Uint32Array(ib.buffer);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(v,3));g.setAttribute('normal',new THREE.Int8BufferAttribute(new Int8Array(normalBytes.buffer),3,true));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeBoundingSphere();
   const n=p.name,m=/轴承|轴芯|中心轴|齿|涡轮|涡杆|传动轴|锁帽/.test(n)?materialSet.steel:/电机|油封|电箱/.test(n)?materialSet.dark:/大手臂|小手臂座|箱体底座/.test(n)?materialSet.amber:materialSet.silver;
   const o=mesh(g,m,[0,0,0],[0,0,0],n);o.userData.cadIndex=i;o.userData.sourceName=p.sourceName;o.userData.sourceBounds=p.sourceBounds;records.push(o);
  });
  partMap.get('arm').cadRecords=records;partMap.get('arm').cadMount=root.position.clone();
  currentGroup=owner;
 }

 function buildAlarm(){
  component('红色声光报警灯完整元件',()=>{
   mesh(extrude(roundedPath(-.32,-.23,.64,.46,.07),.08,.025),materialSet.ivory,[.82,2.87,-.65],[-Math.PI/2,0,0],'报警灯带倒角安装底座');
   const outer=roundedPath(-.285,-.205,.57,.41,.11),inner=roundedPath(-.258,-.178,.516,.356,.09,THREE.Path);outer.holes.push(inner);mesh(extrude(outer,.25,.012),materialSet.red,[.82,3.04,-.65],[-Math.PI/2,0,0],'报警灯中空透镜侧壁');mesh(extrude(roundedPath(-.285,-.205,.57,.41,.11),.024,.008),materialSet.red,[.82,3.177,-.65],[-Math.PI/2,0,0],'报警灯透镜顶盖');
   const path=roundedPath(-.286,-.206,.572,.412,.10).getPoints(48);for(let i=0;i<8;i++)tube(path.map(p=>[p.x+.82,2.94+i*.028,p.y-.65]),.004,materialSet.red,'报警透镜独立棱纹',true);
   component('报警 LED 驱动与光源组件',()=>{board([.82,2.94,-.65],.42,.28,materialSet.pcb,'报警灯 LED 驱动板');for(const x of [.72,.82,.92]){bevelBox([x,2.973,-.65],[.05,.025,.065],materialSet.ivory,'报警灯 LED 封装',.006);cylinder([x,2.991,-.65],.016,.010,materialSet.redLight).name='报警 LED 发光芯片';}});for(const x of [.54,1.10])bolt([x,2.94,-.65],.025);
   const seal=roundedPath(-.30,-.21,.60,.42,.075).getPoints(42);tube(seal.map(p=>[p.x+.82,2.918,p.y-.65]),.009,materialSet.rubber,'报警灯底座防水密封圈',true);for(const z of [-.83,-.47])box([.82,2.89,z],[.15,.04,.025],materialSet.steel,'报警灯底座锁止片');tube([[.82,2.88,-.72],[.90,2.77,-.76],[.97,2.66,-.75]],.010,materialSet.dark,'报警器电源进线');
  });
  component('前照明灯完整元件',()=>{const x=-1.30,y=2.46,z=.81;cylinder([x,y,z],.14,.19,materialSet.dark,'x',48).name='前照明灯筒身';for(let i=0;i<5;i++)torus([x-.07+i*.030,y,z],.14,.006,materialSet.steel,'x','照明灯筒散热环');cylinder([x-.11,y,z],.116,.016,materialSet.light,'x',48).name='前照明扩散面';torus([x-.12,y,z],.12,.010,materialSet.silver,'x').name='照明玻璃压圈';for(let i=0;i<7;i++){const a=i*Math.PI*2/7;cylinder([x-.123,y+.075*Math.cos(a),z+.075*Math.sin(a)],.016,.002,materialSet.ivory,'x',12).name='照明蜂窝光学单元';}bevelBox([x+.04,y-.16,z],[.12,.10,.22],materialSet.steel,'照明可调安装支座',.014);bolt([x+.10,y-.16,z],.025,'x');tube([[x+.10,y,z],[x+.16,y-.09,z],[x+.18,y-.25,z-.10]],.009,materialSet.dark,'照明进线');});
  component('蜂鸣提示器完整元件',()=>{cylinder([.86,2.89,.65],.16,.10,materialSet.dark).name='蜂鸣器声腔外壳';const s=new THREE.Shape();s.absarc(0,0,.147,0,Math.PI*2,false);for(let i=-2;i<=2;i++)s.holes.push(roundedPath(i*.045-.009,-.095,.018,.19,.007,THREE.Path));mesh(extrude(s,.015,.003),materialSet.steel,[.86,2.95,.65],[-Math.PI/2,0,0],'蜂鸣器真实开槽声栅');cylinder([.86,2.931,.65],.126,.006,materialSet.dark).name='蜂鸣器内部防尘网';for(const x of [.68,1.04]){bevelBox([x,2.868,.65],[.11,.035,.10],materialSet.dark,'蜂鸣器固定耳',.018);bolt([x,2.89,.65],.018);}});
 }
 function buildPower(){
  component('电源封装与固定总成',()=>{
   const shell=roundedPath(-.585,-.215,1.17,.43,.035),inner=roundedPath(-.557,-.186,1.114,.372,.022,THREE.Path);shell.holes.push(inner);mesh(extrude(shell,.78,.008),materialSet.dark,[.38,1.35,-.18],[0,0,0],'电源中空封装壳壁');bevelBox([.38,1.145,-.18],[1.17,.025,.78],materialSet.body,'电源壳底盖',.01);plate([.38,1.58,-.18],1.21,.81,.035,materialSet.body).name='电源上盖（开孔与倒角）';
   for(const x of [-.14,.90])for(const z of [-.50,.14])bolt([x,1.61,z],.021);
   for(const x of [.02,.74]){box([x,1.37,-.18],[.065,.49,.82],materialSet.rubber,'电源固定织带');const buckle=roundedPath(-.055,-.06,.11,.12,.015);buckle.holes.push(roundedPath(-.034,-.04,.068,.08,.009,THREE.Path));mesh(extrude(buckle,.016,.003),materialSet.steel,[x,1.63,-.18],[-Math.PI/2,0,0],'电源固定带镂空锁扣');tube([[x-.034,1.64,-.18],[x+.034,1.64,-.18]],.004,materialSet.steel,'锁扣压舌');}
   for(let k=0;k<7;k++)bevelBox([-.08+k*.15,1.50,-.581],[.055,.07,.018],materialSet.steel,'电源壳体散热加强筋',.005);
   for(const [z,m] of [[-.43,materialSet.wireRed],[.10,materialSet.dark]])component('供电插头与防折线束',()=>{bevelBox([.99,1.43,z],[.13,.12,.13],m,'带防反插结构电源接头',.012);box([1.061,1.43,z],[.006,.076,.085],materialSet.dark,'电源接头插腔');for(const zz of [-.026,.026])box([1.066,1.43,z+zz],[.012,.036,.012],materialSet.gold,'电源接头铜触点');box([1.0,1.50,z],[.065,.022,.035],materialSet.ivory,'电源接头防脱卡扣');tube([[1.02,1.43,z],[1.13,1.7,z],[.83,1.87,z+.2],[.36,1.99,.27]],.019,m,'电源配电线束');});
   for(const x of [-.20,.96])for(const z of [-.53,.17]){bevelBox([x,1.18,z],[.13,.045,.10],materialSet.steel,'电源安装耳',.015);bolt([x,1.21,z],.021);}
  });
 }

 function buildFire(){
  component('后置干粉灭火器完整总成',()=>{
   const x=1.94,z=0,bottom=1.18;
   const profile=[[0,0],[.22,0],[.30,.045],[.337,.16],[.337,1.20],[.326,1.29],[.29,1.39],[.22,1.47],[.105,1.52],[.103,1.59],[0,1.59]].map(p=>new THREE.Vector2(...p));
   mesh(new THREE.LatheGeometry(profile,80),materialSet.fireRed,[x,bottom,z],[0,0,0],'灭火器深红色压力瓶体');
   torus([x,bottom+.14,z],.337,.006,materialSet.dark,'y','瓶底环形焊缝');torus([x,bottom+1.25,z],.332,.004,materialSet.fireRed,'y','瓶肩卷压轮廓');
   const skirt=new THREE.Shape();skirt.absarc(0,0,.30,0,Math.PI*2,false);const hole=new THREE.Path();hole.absarc(0,0,.265,0,Math.PI*2,true);skirt.holes.push(hole);mesh(extrude(skirt,.065,.005),materialSet.dark,[x,1.22,z],[-Math.PI/2,0,0],'灭火器底部环形保护脚');
   // Raised geometric label plate; no bitmap or false capacity / pressure values.
   const label=bevelBox([x,1.91,.331],[.29,.50,.011],materialSet.ivory,'灭火器铭牌底片（无虚构额定数据）',.02);label.rotation.y=0;
   bevelBox([x,2.05,.339],[.24,.07,.004],materialSet.fireRed,'灭火器铭牌红色标识带',.006);for(let i=0;i<5;i++)box([x,1.97-i*.047,.339],[i%2?.18:.22,.008,.003],materialSet.steel,'铭牌几何说明刻线');
   // A small extruded flame emblem makes this immediately identifiable as fire equipment.
   const f=new THREE.Shape();f.moveTo(0,0);f.bezierCurveTo(-.09,.02,-.07,.10,-.015,.15);f.bezierCurveTo(.006,.095,.055,.12,.045,.18);f.bezierCurveTo(.14,.08,.085,-.012,0,0);mesh(extrude(f,.004,0),materialSet.fireRed,[x,1.69,.342],[0,0,0],'灭火器铭牌立体火焰标志');
   component('灭火器阀组与保险机构',()=>{cylinder([x,2.80,0],.09,.12,materialSet.gold,'y',6).name='瓶口六角锁紧螺母';torus([x,2.75,0],.102,.008,materialSet.rubber,'y','瓶口密封圈');
   bevelBox([x,2.90,0],[.17,.12,.18],materialSet.gold,'灭火器阀体',.015);cylinder([x+.11,2.90,0],.044,.16,materialSet.gold,'x',24).name='阀体侧出粉口';
   component('灭火器压力表总成',()=>{cylinder([x,2.94,.13],.037,.13,materialSet.gold,'z',24).name='压力表连接短管';cylinder([x,2.94,.205],.087,.040,materialSet.steel,'z',48).name='压力表金属表壳';cylinder([x,2.94,.230],.076,.005,materialSet.ivory,'z',48).name='压力表表盘';torus([x,2.94,.235],.078,.006,materialSet.silver).name='压力表玻璃压圈';
   for(let i=0;i<15;i++){const a=(i/14*1.5+.75)*Math.PI;const tick=box([x+Math.cos(a)*.061,2.94+Math.sin(a)*.061,.236],[.004,.014,.0015],materialSet.dark,'压力表独立刻度');tick.rotation.z=a-Math.PI/2;}
   const arc=new THREE.Curve();arc.getPoint=(t,target=V())=>target.set(x+Math.cos((1.15+t*.25)*Math.PI)*.052,2.94+Math.sin((1.15+t*.25)*Math.PI)*.052,.237);mesh(new THREE.TubeGeometry(arc,18,.003,5,false),materialSet.pcb,[0,0,0],[0,0,0],'压力表参考色区（静态外观）');
   tube([[x-.036,2.963,.240],[x,2.94,.240],[x+.010,2.933,.240]],.0028,materialSet.fireRed,'压力表静态指针');cylinder([x,2.94,.242],.008,.002,materialSet.steel,'z').name='压力表指针轴帽';});
   const handle=roundedPath(-.24,-.027,.48,.075,.025);handle.holes.push(roundedPath(-.13,-.008,.25,.027,.01,THREE.Path));mesh(extrude(handle,.058,.007),materialSet.dark,[x+.06,3.025,0],[0,0,.10],'灭火器固定提把');mesh(extrude(handle,.048,.006),materialSet.fireRed,[x+.06,3.095,0],[0,0,-.10],'灭火器压把');cylinder([x-.13,3.015,0],.025,.14,materialSet.silver,'z').name='压把铰接轴';bolt([x-.13,3.015,.078],.025,'z');
   cylinder([x-.075,2.988,.03],.012,.18,materialSet.silver,'z').name='保险销';torus([x-.075,2.988,.16],.05,.006,materialSet.silver,'z','保险销拉环');tube([[x-.075,2.99,.21],[x-.18,2.88,.22],[x-.17,2.78,.20]],.004,materialSet.wireGold,'保险封签线');bevelBox([x-.17,2.78,.20],[.035,.045,.012],materialSet.wireGold,'保险铅封外观',.005);});
   // One continuous stored hose. It remains a display assembly, not a fire physics simulation.
   component('喷射软管与收纳喷嘴',()=>{tube([[x+.18,2.90,0],[2.43,2.88,-.08],[2.52,2.46,-.25],[2.47,1.66,-.42],[2.13,1.42,-.48],[1.70,1.58,-.47],[1.72,2.31,-.45],[2.08,2.53,-.43],[2.35,2.30,-.45],[2.29,1.72,-.45]],.027,materialSet.rubber,'灭火器连续喷射软管');
   for(const y of [2.74,2.78,2.82])torus([2.47,y,-.12],.030,.005,materialSet.dark,'y','软管接口防折护套');
   cylinder([2.29,1.68,-.45],.045,.12,materialSet.steel,'y',24).name='软管收纳喷嘴接头';cylinder([2.29,1.51,-.45],.055,.26,materialSet.dark,'y',32,.085).name='灭火器收纳喷嘴筒体';torus([2.29,1.375,-.45],.055,.006,materialSet.steel,'y','喷嘴出口加强圈');cylinder([2.29,1.373,-.45],.043,.005,materialSet.dark).name='喷嘴出口暗腔';});
   for(const y of [1.48,2.28]){torus([x,y,0],.349,.025,materialSet.rubber,'y','瓶体固定箍防滑衬垫');torus([x,y,0],.371,.010,materialSet.steel,'y','瓶体金属固定箍');bevelBox([x,y,.385],[.15,.073,.045],materialSet.steel,'固定箍快拆锁扣',.007);bolt([x-.055,y,.414],.017,'z');bolt([x+.055,y,.414],.017,'z');box([x+.37,y,0],[.11,.07,.15],materialSet.body,'固定箍与背架连接座');}
  });
  component('灭火器后部承载背架',()=>{plate([1.96,1.12,0],1.13,1.12,.07,materialSet.body).name='灭火器尾部承载托板';for(const z of [-.47,.47]){bevelBox([2.32,1.96,z],[.09,1.72,.09],materialSet.steel,'灭火器背架立柱',.012);box([1.78,1.025,z],[1.53,.10,.10],materialSet.steel,'尾部托板纵向连接梁');for(const x of [1.13,2.40])bolt([x,x<1.3?1.09:1.17,z],.030);}for(const y of [1.27,2.65])bevelBox([2.32,y,0],[.08,.075,1.04],materialSet.body,'灭火器背架横撑',.015);box([2.36,1.94,0],[.028,1.15,.035],materialSet.amber,'背架识别饰条');for(const z of [-.47,.47])for(const y of [1.30,2.61])bolt([2.38,y,z],.023,'x');});
 }

 function buildRobot(){
  robot=new THREE.Group();robot.name='矿域智盾 / 程序化车体与原始 CAD 机械臂';scene.add(robot);materialSet=makeMaterials();
  const builders=[buildBase,buildFrame,buildVision,buildEnvironment,buildArm,buildControl,buildAlarm,buildPower,buildFire];
  PARTS.forEach((p,i)=>{currentGroup=new THREE.Group();currentGroup.name=p.name;currentGroup.userData.partId=p.id;robot.add(currentGroup);roots.set(p.id,currentGroup);builders[i]();currentGroup.updateMatrixWorld(true);p.bounds=new THREE.Box3().setFromObject(currentGroup);p.center=p.bounds.getCenter(V());p.size=p.bounds.getSize(V());p.meshCount=0;p.triangles=0;currentGroup.traverse(o=>{if(o.isMesh){p.meshCount+=o.isInstancedMesh?o.count:1;const n=o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count;p.triangles+=n/3*(o.isInstancedMesh?o.count:1);}});});
  robot.updateMatrixWorld(true);
 }

 // Workstation logic: procedural body, plus the explicitly authorized local CAD arm.
 const leaves=new Map(),leafByMesh=new Map();let isolatedMesh=null,selectionCorners,selectionMat,highlightMaterials=[],detailStamp='';const cadJoints=[];
 const originalMaterials=new Map();
 const overallBounds=new THREE.Box3();
 const demoSteps=[{id:null,e:0,view:'iso'},{id:null,e:1,view:'iso'},{id:'vision',e:1},{id:'arm',e:1},{id:'environment',e:1},{id:'control',e:1},{id:'fire',e:1},{id:null,e:0,view:'iso'}];let demoClock=0,demoStep=-1;
 function toast(msg){$('toast').textContent=msg;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2500);}
 function indexParts(){
  PARTS.forEach(p=>{let serial=0;p.leaves=[];overallBounds.union(p.bounds);roots.get(p.id).traverse(o=>{if(!o.isMesh)return;originalMaterials.set(o,o.material);const count=o.isInstancedMesh?o.count:1,ids=[];
   o.geometry.computeBoundingBox();for(let i=0;i<count;i++){
    const matrix=o.matrixWorld.clone();if(o.isInstancedMesh){const t=new THREE.Matrix4();o.getMatrixAt(i,t);matrix.multiply(t);}
    const bounds=o.geometry.boundingBox.clone().applyMatrix4(matrix);const id=`${p.id}-${++serial}`;
    const leaf={id,part:p.id,code:`${p.no}.${String(serial).padStart(3,'0')}`,name:o.name.replace(/^\d+\s*/,'')+(count>1?` · ${String(i+1).padStart(3,'0')}`:''),object:o,instance:o.isInstancedMesh?i:null,bounds,size:bounds.getSize(V()),center:bounds.getCenter(V())};
    let ancestor=o.parent;leaf.componentIds=[];while(ancestor&&ancestor!==robot){if(ancestor.userData.componentId){leaf.componentIds.push(ancestor.userData.componentId);assemblies.get(ancestor.userData.componentId).leaves.push(leaf);}ancestor=ancestor.parent;}leaf.componentId=leaf.componentIds[0]||null;
    leaf.originalPosition=o.position.clone();if(o.isInstancedMesh){leaf.originalMatrix=new THREE.Matrix4();o.getMatrixAt(i,leaf.originalMatrix);}
    leaf.detailVector=leaf.center.clone().sub(p.center).multiply(V(.48,.46,.64));if(leaf.detailVector.length()<.06)leaf.detailVector.y=((serial%3)-1)*.10;
    leaf.localDetail=leaf.detailVector.clone().applyQuaternion(o.parent.getWorldQuaternion(new THREE.Quaternion()).invert());leaves.set(id,leaf);p.leaves.push(leaf);ids.push(id);
   }leafByMesh.set(o,ids);
  });});
 }
 function boundsAt(p,e=state.explode,d=state.detailExplode){
  const rootId=p.part||p.id,shift=V(...partMap.get(rootId).offset).multiplyScalar(e);
  if(rootId===state.detailPart&&d>0){if(p.part)return p.bounds.clone().translate(shift.addScaledVector(p.detailVector,d));const b=new THREE.Box3();p.leaves.forEach(l=>b.union(l.bounds.clone().translate(shift.clone().addScaledVector(l.detailVector,d))));return b;}
  return p.bounds.clone().translate(shift);
 }
 function isolationMembers(leaf=leaves.get(state.leaf)){if(!leaf)return [];return state.preserveAssembly&&leaf.componentId?assemblies.get(leaf.componentId).leaves:[leaf];}
 function selectionBounds(e=state.targetExplode,d=state.targetDetail){if(!state.leaf)return boundsAt(partMap.get(state.selected),e,d);const b=new THREE.Box3();isolationMembers().forEach(l=>b.union(boundsAt(l,e,d)));return b;}
 function rebuildIsolation(){if(isolatedMesh){isolatedMesh.traverse(o=>{if(o.isMesh)o.material.dispose();});scene.remove(isolatedMesh);isolatedMesh=null;}if(!state.leaf)return;isolatedMesh=new THREE.Group();isolatedMesh.name='隔离元件';isolationMembers().forEach(l=>{const m=new THREE.Mesh(l.object.geometry,originalMaterials.get(l.object).clone());m.name=l.name;m.matrixAutoUpdate=false;m.userData.leafId=l.id;m.userData.partId=l.part;m.castShadow=true;m.receiveShadow=true;isolatedMesh.add(m);});scene.add(isolatedMesh);}
 function resetDetail(){state.detailPart=null;state.detailExplode=0;state.targetDetail=0;detailStamp='reset';}
 function updateDetailTransforms(){const stamp=state.detailPart+':'+state.detailExplode.toFixed(5);if(stamp===detailStamp)return;detailStamp=stamp;const touched=new Set();
  leaves.forEach(l=>{const v=state.detailPart===l.part?state.detailExplode:0;if(l.instance!==null){const m=l.originalMatrix.clone();m.elements[12]+=l.localDetail.x*v;m.elements[13]+=l.localDetail.y*v;m.elements[14]+=l.localDetail.z*v;l.object.setMatrixAt(l.instance,m);touched.add(l.object);}else l.object.position.copy(l.originalPosition).addScaledVector(l.localDetail,v);});touched.forEach(o=>{o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();});
 }
 function toggleDetail(){if(!state.selected)return;stopDemo();const id=state.selected;if(state.detailPart===id&&state.targetDetail>.5){state.targetDetail=0;state.isolated=false;updateVisibility();fitBox(visibleBounds(state.targetExplode));}else{selectPart(id);state.detailPart=id;state.targetDetail=1;state.isolated=true;state.shellTransparent=false;$('shell-view').setAttribute('aria-pressed','false');updateHighlight();fitBox(boundsAt(partMap.get(id),state.targetExplode,1));}renderInspector();dirty=true;}
 function visibleBounds(e=state.targetExplode){
  if(state.isolated&&state.leaf)return selectionBounds(e,state.targetDetail);
  const b=new THREE.Box3();PARTS.forEach(p=>{if(state.manualHidden.has(p.id)||(state.isolated&&p.id!==state.selected))return;b.union(boundsAt(p,e,state.targetDetail));});return b.isEmpty()?overallBounds.clone():b;
 }
 function fitBox(b,yaw=orbit.yaw,pitch=orbit.pitch,instant=false){
  const target=b.getCenter(V()),eye=V(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));const right=V().crossVectors(V(0,1,0),eye).normalize(),up=V().crossVectors(eye,right).normalize();const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),aspect=camera.aspect;
  let r=.030;const fitBoxes=(!state.selected&&!state.isolated&&state.targetExplode<.05&&state.targetDetail<.05)?[...leaves.values()].filter(l=>!state.manualHidden.has(l.part)).map(l=>l.bounds):[b];
  for(const box of fitBoxes)for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const q=V(x,y,z).sub(target),d=q.dot(eye);r=Math.max(r,Math.abs(q.dot(up))/(tan*.80)+d,Math.abs(q.dot(right))/(tan*aspect*.82)+d);}
  orbit.desiredTarget.copy(target);orbit.desiredRadius=THREE.MathUtils.clamp(r,.035,33);orbit.desiredYaw=yaw;orbit.desiredPitch=pitch;orbit.tween=1;
  if(instant||reduced){orbit.target.copy(target);orbit.radius=orbit.desiredRadius;orbit.yaw=yaw;orbit.pitch=pitch;orbit.tween=0;}dirty=true;
 }
 function preset(view='iso',instant=false){const v={iso:[-.73,.35],front:[-Math.PI/2,.04],rear:[Math.PI/2,.18],rearIso:[.78,.35],side:[0,.04],top:[-.04,1.5]}[view];state.view=view;fitBox(visibleBounds(),...v,instant);document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));}
 function focusSelection(){if(!state.selected){preset('iso');return;}const item=state.leaf?leaves.get(state.leaf):partMap.get(state.selected);fitBox(selectionBounds());toast('已聚焦：'+item.name);}
 function setExplode(value,{fit=true,manual=true}={}){
  if(manual)stopDemo();if(state.detailPart){resetDetail();state.isolated=false;}state.targetExplode=THREE.MathUtils.clamp(value,0,1);if(reduced)state.explode=state.targetExplode;
  $('explode').value=Math.round(value*100);$('explode').style.background=`linear-gradient(to right,var(--cyan) ${value*100}%,#293c4a ${value*100}%)`;$('explode-value').innerHTML=Math.round(value*100)+'<span>%</span>';
  $('assembly-state').textContent=value<.01?'完整装配':value>.99?'分层展开':'拆解程度';$('explode-toggle').querySelector('span').textContent=value>.5?'还原装配':'拆解模型';
  if(value<.01){state.isolated=false;state.manualHidden.clear();updateVisibility();}
  if(fit)fitBox(visibleBounds(value));dirty=true;
 }
 function updateVisibility(){
  PARTS.forEach(p=>{const on=!state.manualHidden.has(p.id)&&(!state.isolated||(!state.leaf&&state.selected===p.id));roots.get(p.id).visible=on;const row=$('part-list').querySelector(`[data-part="${p.id}"]`);row?.classList.toggle('is-hidden',state.manualHidden.has(p.id));const btn=row?.querySelector('.part-visibility');if(btn){btn.setAttribute('aria-pressed',String(!state.manualHidden.has(p.id)));btn.setAttribute('aria-label',(state.manualHidden.has(p.id)?'显示':'隐藏')+p.name);}});
  if(isolatedMesh)isolatedMesh.visible=state.isolated&&!!state.leaf;
  $('isolate').disabled=!state.selected;$('isolate').classList.toggle('active',state.isolated);$('isolate').querySelector('span').textContent=state.isolated?'退出隔离':state.leaf?'隔离零件':'隔离部件';dirty=true;
 }
 function updateHighlight(){
  pickables.forEach(o=>{o.material=originalMaterials.get(o)||o.material;if(o.isInstancedMesh&&o.instanceColor){for(let i=0;i<o.count;i++)o.setColorAt(i,new THREE.Color(0xffffff));o.instanceColor.needsUpdate=true;}});highlightMaterials.forEach(m=>m.dispose());highlightMaterials=[];
  const leaf=leaves.get(state.leaf),selected=leaf?[leaf.object]:state.selected?pickables.filter(o=>o.userData.partId===state.selected):[];const cache=new Map();
  selected.forEach(o=>{const original=originalMaterials.get(o);if(leaf&&o.isInstancedMesh){o.setColorAt(leaf.instance,new THREE.Color(0xffc377));o.instanceColor.needsUpdate=true;return;}if(!cache.has(original)){const m=original.clone();if(m.emissive&&leaf){m.emissive.lerp(new THREE.Color(0xf6b365),.14);m.emissiveIntensity=Math.max(.22,m.emissiveIntensity);}cache.set(original,m);highlightMaterials.push(m);}o.material=cache.get(original);});
  rebuildIsolation();
  if(state.shellTransparent)pickables.forEach(o=>{if(o.userData.isShell){const m=o.material.clone();m.transparent=true;m.opacity=(state.leaf&&leaves.get(state.leaf)?.object===o) ? .85 : .16;m.depthWrite=false;highlightMaterials.push(m);o.material=m;}});
  updateWireframe();updateVisibility();
 }
 function updateWireframe(){allMaterials.forEach(m=>m.wireframe=state.wireframe);highlightMaterials.forEach(m=>m.wireframe=state.wireframe);if(isolatedMesh)isolatedMesh.traverse(o=>{if(o.isMesh)o.material.wireframe=state.wireframe;});$('solid-mode').classList.toggle('active',!state.wireframe);$('wire-mode').classList.toggle('active',state.wireframe);$('solid-mode').setAttribute('aria-pressed',String(!state.wireframe));$('wire-mode').setAttribute('aria-pressed',String(state.wireframe));dirty=true;}
 function selectPart(id,leafId=null,{focus=false,manual=true}={}){
  if(manual)stopDemo();if(state.detailPart&&state.detailPart!==id){resetDetail();state.isolated=false;}state.selected=id;state.leaf=leafId;if(!id)state.isolated=false;if(id)state.manualHidden.delete(id);
  $('part-list').querySelectorAll('.part-row').forEach(r=>{const on=r.dataset.part===id;r.classList.toggle('selected',on);r.querySelector('.part-select').setAttribute('aria-pressed',String(on));});$('overview').classList.toggle('active',!id);
  $('view-title').textContent=leafId?leaves.get(leafId).name:id?partMap.get(id).name:'整机视图';updateHighlight();renderInspector();document.querySelector('.inspector').scrollTop=0;if(focus)focusSelection();dirty=true;
 }
 function toggleIsolate(){if(!state.selected)return;stopDemo();state.isolated=!state.isolated;updateVisibility();if(state.isolated)focusSelection();else fitBox(visibleBounds());renderInspector();}
 function renderList(){
  $('part-list').innerHTML=PARTS.map(p=>`<div class="part-row" data-part="${p.id}"><button class="part-select" aria-pressed="false"><span class="part-icon">${icon(p.icon)}</span><span class="part-text"><span class="part-title"><span class="part-number">${p.no}</span>${p.name}</span><span class="part-sub">${p.en}</span></span></button><button class="part-visibility" aria-label="隐藏${p.name}" aria-pressed="true">${icon('eye')}</button></div>`).join('');
  $('part-list').querySelectorAll('.part-row').forEach(row=>{const id=row.dataset.part;row.querySelector('.part-select').onclick=()=>selectPart(id);row.querySelector('.part-visibility').onclick=()=>{stopDemo();if(state.manualHidden.has(id))state.manualHidden.delete(id);else{state.manualHidden.add(id);if(state.selected===id)selectPart(null);}updateVisibility();};});
 }
 const dimensions=s=>`${Math.round(s.x*100)} × ${Math.round(s.z*100)} × ${Math.round(s.y*100)} mm`;
 function parameterRows(rows){return rows.map(([label,value,note])=>`<div class="param-row"><dt>${label}</dt><dd>${value}${note?`<em>${note}</em>`:''}</dd></div>`).join('');}
 function renderLeafList(p,filter=''){
  const q=filter.toLowerCase(),matches=p.leaves.filter(l=>(l.name+l.code).toLowerCase().includes(q));$('leaf-result').textContent=`${matches.length} 项`;
  $('leaf-list').innerHTML=matches.slice(0,60).map(l=>`<button class="leaf-row ${state.leaf===l.id?'active':''}" data-leaf="${l.id}"><small>${l.code}</small><span>${l.name}</span><b>↗</b></button>`).join('')+(matches.length>60?'<p class="leaf-more">显示前 60 项，可输入名称或编号精确查找。</p>':'');
  $('leaf-list').querySelectorAll('button').forEach(b=>b.onclick=()=>selectPart(p.id,b.dataset.leaf,{focus:true}));
 }
 function renderInspector(){
  const p=partMap.get(state.selected),leaf=leaves.get(state.leaf),shown=leaf&&state.isolated?isolationMembers(leaf):[],cad=leaf?.object.userData.cadIndex!==undefined,size=(shown.length>1?selectionBounds().getSize(V()):leaf?.size)||p?.size||overallBounds.getSize(V()),meshCount=leaf?(shown.length||1):p?p.meshCount:PARTS.reduce((a,p)=>a+p.meshCount,0),triangles=leaf?(shown.length?shown:[leaf]).reduce((a,l)=>a+(l.object.geometry.index?.count||l.object.geometry.attributes.position.count)/3,0):p?p.triangles:PARTS.reduce((a,p)=>a+p.triangles,0);
  const type=cad?'原始 CAD 显示网格':({'ExtrudeGeometry':'开孔 / 倒角拉伸','CylinderGeometry':'参数化圆柱','LatheGeometry':'截面回转','TorusGeometry':'圆环截面','TubeGeometry':'曲线路径','BoxGeometry':'参数化封装','ConeGeometry':'圆锥截面','CircleGeometry':'光学表面'})[leaf?.object.geometry.type]||'程序化几何';
  const params=leaf?[['所属系统',p.name],['几何来源',type,cad?'本地原始装配位姿保留':'独立程序化几何件'],['显示包围尺寸',dimensions(size),cad?'原机械臂 21.5% 等比例展示':'建模估计，非实测'],['零件编号',leaf.code]]:p?[...p.params,['显示包围尺寸',dimensions(size),'当前装配显示比例，非实测']]:[['终端架构','履带平台 + 多模态感知','项目资料架构'],['子系统','9 个可独立拆解模块'],['机械臂来源','CHX-3 本地原始 CAD','99 个源件实例，六轴结构'],['显示包围尺寸',dimensions(size),'整车展示比例，非实测'],['几何来源','程序化车体 + 本地 CAD 臂','不使用在线模型或图片贴图']];
  const componentItems=p?[...assemblies.values()].filter(a=>a.group.userData.partId===p.id&&!a.group.parent.userData.componentId):[];
  const detailOn=p&&state.detailPart===p.id&&state.targetDetail>.5;
  $('inspector-content').innerHTML=`<div class="inspector-intro"><div class="inspector-visual">${icon(p?.icon||'cube')}${p?.id==='arm'?'<span class="axis-six">SIX AXES / 99 CAD PARTS</span>':''}</div><div class="part-code">${leaf?'PART '+leaf.code:p?'SUBSYSTEM '+p.no:'MG–01 / SYSTEM OVERVIEW'}</div><h2>${leaf?leaf.name:p?p.name:'多模态移动终端'}</h2><div class="part-en">${p?.en||'MINE SAFETY ROBOT'}</div><p class="part-description">${leaf?(cad?'该零件直接来自用户提供的 CHX-3 CAD 显示网格。形状与原装配位姿保留，页面仅统一缩放并适配车头中线下层安装位置。':'独立程序化零件，可聚焦孔位、轮廓和连接细节，也可隔离查看；尺寸为显示模型估计。'):p?p.description:'封装机身承载视觉、环境感知与主控通信，原始六轴机械臂前置于车头中线，灭火器固定在车尾。可从子系统逐层深入到单个零件。'}</p><span class="source-badge">${p?.tag||'程序化车体 / 原始 CAD 机械臂'}</span>${leaf?'<button id="back-system" class="back-system">← 返回所属子系统</button>':''}
  ${leaf?`<div class="isolation-options"><label><input id="preserve-assembly" type="checkbox" ${state.preserveAssembly?'checked':''}>保留元件装配细节</label><p>${leaf.componentId?assemblies.get(leaf.componentId).name+' · '+assemblies.get(leaf.componentId).leaves.length+' 处独立几何':'该零件为独立几何；CAD 件保留原始网格。'}</p><span>隔离时保留所属元件的封装、引脚、焊盘及连接件；取消勾选可查看单个几何件。</span></div>`:''}
  ${p?`<button id="detail-explode" class="button detail-button ${detailOn?'active':''}">${icon('layers')}${detailOn?'还原组件内部零件':'逐零件展开'+(leaf?'所属组件':'')}</button><p class="detail-explain">各零件独立展开，便于观察连接关系；非真实拆装顺序。</p>`:''}</div>
  ${p?.id==='arm'?`<section class="inspector-section"><h3>六轴结构定位<span>CAD JOINT REFERENCE</span></h3><div class="joint-grid">${cadJoints.map(j=>`<button data-joint="${j.id}" class="${state.leaf===j.leafId?'active':''}" title="${j.reference}"><b>${j.id}</b>${j.name}</button>`).join('')}</div><label class="joint-toggle"><input id="show-axes" type="checkbox" ${state.showAxes?'checked':''}>显示关节结构标记</label><p class="material-note">定位参考原装配中的轴、法兰与减速机；非关节运动学仿真。</p></section>`:''}
  ${p&&!leaf&&componentItems.length?`<section class="inspector-section"><h3>完整元件<span>ASSEMBLIES</span></h3><div class="component-list">${componentItems.map(a=>`<button data-component="${a.group.userData.componentId}"><span>${a.name}</span><small>${a.leaves.length} 细节 ↗</small></button>`).join('')}</div><p class="material-note">点击元件后隔离，可保留表面器件与紧固件。</p></section>`:''}
  <section class="inspector-section"><h3>${leaf?'零件参数':'结构参数'}<span>SPECIFICATIONS</span></h3><dl class="params">${parameterRows(params)}</dl></section>
  <section class="inspector-section"><h3>几何细节<span>SEPARATE PART GEOMETRY</span></h3><div class="geometry-stats"><div><strong>${fmt(meshCount)}</strong><span>${shown.length>1?'当前隔离的几何细节':leaf?'选中几何件':'网格实例'}</span></div><div><strong>${triangles>=1000?(triangles/1000).toFixed(1)+'k':Math.round(triangles)}</strong><span>三角面</span></div></div><p class="material-note">${p?.material||'程序化材质 · 无图片贴图'}</p></section>
  <section class="inspector-section"><h3>工作关联<span>SYSTEM ROLE</span></h3><div class="flow">${(p?.flow||['现场感知','分析控制','移动执行']).map((v,i)=>(i?'<b>→</b>':'')+'<span>'+v+'</span>').join('')}</div></section>
  ${p?'<section class="inspector-section leaf-section"><h3>零件清单<span id="leaf-result"></span></h3><input id="leaf-search" class="leaf-search" type="search" placeholder="查找零件名称或编号" aria-label="查找零件"><div id="leaf-list" class="leaf-list"></div></section>':''}
  ${p?`<div class="inspector-actions"><button id="inspector-focus" class="button">${icon('target')}聚焦${leaf?'零件':'组件'}</button><button id="inspector-isolate" class="button">${icon('cube')}${state.isolated?'退出隔离':'单独查看'}</button></div>`:''}
  <p class="source-note">车体以实拍为参考，舱壳为优化设计；机械臂使用用户原 CAD。整车安装位置及比例为展示适配，未验证加工尺寸、承载和关节可达空间。</p>`;
  if(p){document.querySelectorAll('[data-component]').forEach(b=>b.onclick=()=>{const a=assemblies.get(b.dataset.component),l=a.leaves.find(l=>l.object.parent===a.group)||a.leaves[0];state.preserveAssembly=true;selectPart(p.id,l.id);state.isolated=true;updateVisibility();focusSelection();renderInspector();});renderLeafList(p);$('leaf-search').oninput=e=>renderLeafList(p,e.target.value);$('inspector-focus').onclick=focusSelection;$('inspector-isolate').onclick=toggleIsolate;$('detail-explode').onclick=toggleDetail;}
  if(leaf){$('back-system').onclick=()=>selectPart(p.id);$('preserve-assembly').onchange=e=>{state.preserveAssembly=e.target.checked;updateHighlight();focusSelection();renderInspector();};}
  if(p?.id==='arm'){document.querySelectorAll('[data-joint]').forEach(b=>b.onclick=()=>{const j=cadJoints.find(j=>j.id===b.dataset.joint);selectPart('arm',j.leafId,{focus:true});});$('show-axes').onchange=e=>{state.showAxes=e.target.checked;dirty=true;};}
 }
 function buildJointMarkers(){
  const refs=[[80,'J1','底座回转'],[10,'J2','肩部关节'],[5,'J3','肘部关节'],[36,'J4','腕部回转'],[54,'J5','腕部俯仰'],[53,'J6','末端回转']];
  const p=partMap.get('arm');refs.forEach(([index,id,name])=>{const object=p.cadRecords[index],leafId=leafByMesh.get(object)[0],leaf=leaves.get(leafId),t=window.MineGuardCAD.parts[index].transform,axis=V(-t[9],t[10],-t[8]).normalize();
   const group=new THREE.Group(),ring=new THREE.Mesh(new THREE.TorusGeometry(.24,.008,6,48),new THREE.MeshBasicMaterial({color:0xe6b974,transparent:true,opacity:.66,depthTest:false}));ring.quaternion.setFromUnitVectors(V(0,0,1),axis);group.add(ring);
   const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([axis.clone().multiplyScalar(-.40),axis.clone().multiplyScalar(.40)]),new THREE.LineBasicMaterial({color:0xe6b974,transparent:true,opacity:.58,depthTest:false}));group.add(line);group.renderOrder=22;scene.add(group);
   const label=document.createElement('button');label.className='joint-label';label.textContent=id;label.title=id+' '+name+' / '+object.name;label.setAttribute('aria-label',id+' '+name);label.onclick=()=>selectPart('arm',leafId,{focus:true});$('labels').appendChild(label);cadJoints.push({id,name,leafId,group,label,reference:object.name});
  });
 }
 function updateJointMarkers(){
  const w=$('stage').clientWidth,h=$('stage').clientHeight;cadJoints.forEach((j,i)=>{const leaf=leaves.get(j.leafId),b=boundsAt(leaf),on=state.selected==='arm'&&state.showAxes&&!state.manualHidden.has('arm')&&(!state.isolated||!state.leaf)&&(!state.leaf||state.leaf===j.leafId);j.group.visible=on;j.label.style.display=on&&state.labels?'block':'none';if(!on)return;j.group.position.copy(b.getCenter(V()));const q=j.group.position.clone().project(camera);j.label.style.left=THREE.MathUtils.clamp((q.x*.5+.5)*w+(i>=3?(i-4)*28:0),35,w-35)+'px';j.label.style.top=THREE.MathUtils.clamp((-.5*q.y+.5)*h-25-(i>=3?15:0),65,h-50)+'px';});
 }

 function buildGuides(){
  PARTS.forEach(p=>{const g=new THREE.BufferGeometry().setFromPoints([p.center,p.center]);const m=new THREE.LineDashedMaterial({color:0x62b0bc,transparent:true,opacity:.18,dashSize:.075,gapSize:.06,depthWrite:false});const line=new THREE.Line(g,m);line.computeLineDistances();scene.add(line);guides.set(p.id,line);
   const label=document.createElement('button');label.className='part-label';label.innerHTML=`<small>${p.no}</small>${p.name}`;label.onclick=()=>selectPart(p.id);$('labels').appendChild(label);labels.set(p.id,label);
  });
  selectionMat=new THREE.LineBasicMaterial({color:0xf4bd79,transparent:true,opacity:.72,depthTest:false});selectionCorners=new THREE.LineSegments(new THREE.BufferGeometry(),selectionMat);selectionCorners.renderOrder=20;scene.add(selectionCorners);
 }
 function updateSelectionBox(){
  if(!state.selected){selectionCorners.visible=false;return;}const item=state.leaf?leaves.get(state.leaf):partMap.get(state.selected),b=(state.leaf&&state.isolated?selectionBounds(state.explode,state.detailExplode):boundsAt(item)).expandByScalar(state.leaf ? .025 : .065),s=b.getSize(V()),l=Math.min(s.x,s.y,s.z)*.25+.025,verts=[];
  for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){for(let axis=0;axis<3;axis++){const p=[x,y,z],q=p.slice();q[axis]+=p[axis]===[b.min.x,b.min.y,b.min.z][axis]?l:-l;verts.push(...p,...q);}}
  selectionCorners.geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));selectionCorners.geometry.computeBoundingSphere();selectionCorners.visible=!state.manualHidden.has(state.selected);
 }
 function updateLabels(){
  const w=$('stage').clientWidth,h=$('stage').clientHeight,display=[];
  PARTS.forEach(p=>{const root=roots.get(p.id),line=guides.get(p.id),end=p.center.clone().add(root.position);line.visible=state.explode>.04&&root.visible&&!state.isolated;
   if(line.visible){const a=line.geometry.attributes.position;a.setXYZ(0,p.center.x,p.center.y,p.center.z);a.setXYZ(1,end.x,end.y,end.z);a.needsUpdate=true;line.computeLineDistances();line.material.color.set(p.id===state.selected?0xe5b77e:0x62b0bc);}
   const label=labels.get(p.id);let on=state.labels&&root.visible&&(state.explode>.15||p.id===state.selected||['vision','arm','base'].includes(p.id));if(w<580&&!state.selected&&state.explode<.15)on=p.id==='vision'&&state.labels&&root.visible;if(w<430&&state.selected)on=p.id===state.selected&&state.labels&&root.visible;
   const q=end.project(camera);on=on&&q.z<1&&q.z>-1;label.style.display=on?'block':'none';if(!on)return;display.push({p,label,x:(q.x*.5+.5)*w,y:(-.5*q.y+.5)*h,right:q.x>0});
  });
  const lines=[];for(const right of [false,true]){const list=display.filter(d=>d.right===right).sort((a,b)=>a.y-b.y);let last=55;list.forEach((d,i)=>{const x=right?w-138:106,y=Math.max(last+34,Math.min(h-62-(list.length-1-i)*34,Math.max(76,d.y)));last=y;d.label.style.left=x+'px';d.label.style.top=y+'px';d.label.classList.toggle('selected',d.p.id===state.selected);const ex=x+(right?-66:66),mx=(d.x+ex)/2;lines.push(`<polyline points="${d.x.toFixed(1)},${d.y.toFixed(1)} ${mx.toFixed(1)},${d.y.toFixed(1)} ${ex},${y}" fill="none" stroke="${d.p.id===state.selected?'#d9ae74':'#4e7c91'}" stroke-width=".8" opacity=".65"/><circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="2" fill="${d.p.id===state.selected?'#e8be84':'#7bb8c8'}"/>`);});}
  $('leader-lines').innerHTML=lines.join('');
 }
 function updateOrientation(){const q=camera.quaternion.clone().invert(),axes=[['X',V(1,0,0),'#ce9c86'],['Y',V(0,1,0),'#85bba8'],['Z',V(0,0,1),'#7aabc8']];document.querySelector('.orientation').innerHTML=`<svg viewBox="0 0 60 60" style="width:60px;height:60px">${axes.map(([n,v,c])=>{v.applyQuaternion(q);const x=29+v.x*18,y=29-v.y*18;return `<path d="M29 29L${x} ${y}" stroke="${c}" stroke-width="1"/><text x="${x+3}" y="${y+1}" fill="${c}" stroke="none" font-size="8">${n}</text>`;}).join('')}<circle cx="29" cy="29" r="1.7" fill="#9db4c2" stroke="none"/></svg>`;}
 function stopDemo(){if(!state.demo)return;state.demo=false;$('demo').classList.remove('active');$('demo').querySelector('span').textContent='演示模式';dirty=true;}
 function startDemo(){state.demo=true;state.autoRotate=false;state.manualHidden.clear();state.isolated=false;demoClock=0;demoStep=-1;$('demo').classList.add('active');$('demo').querySelector('span').textContent='停止演示';$('auto-rotate').setAttribute('aria-pressed','false');toast('开始结构演示，可随时操作以停止');}
 function updateDemo(dt){if(!state.demo)return;demoClock+=dt;const i=Math.min(demoSteps.length-1,Math.floor(demoClock/4));if(i!==demoStep){demoStep=i;const step=demoSteps[i];selectPart(step.id,null,{manual:false});setExplode(step.e,{fit:false,manual:false});if(step.id)fitBox(boundsAt(partMap.get(step.id),step.e));else preset(step.view);}if(demoClock>demoSteps.length*4){stopDemo();toast('结构演示结束');}}
 function bindControls(){
  $('explode').oninput=e=>setExplode(Number(e.target.value)/100);$('explode-toggle').onclick=()=>setExplode(state.targetExplode>.5?0:1);$('isolate').onclick=toggleIsolate;$('overview').onclick=()=>{selectPart(null);preset('iso');};
  $('reset-view').onclick=()=>{stopDemo();preset('iso');};$('focus-view').onclick=()=>{stopDemo();focusSelection();};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{stopDemo();preset(b.dataset.view);});
  $('solid-mode').onclick=()=>{state.wireframe=false;updateWireframe();};$('wire-mode').onclick=()=>{state.wireframe=true;updateWireframe();};
  $('show-labels').onchange=e=>{state.labels=e.target.checked;dirty=true;};$('show-grid').onchange=e=>{state.grid=e.target.checked;grid.visible=ring.visible=state.grid;dirty=true;};
  $('shell-view').onclick=()=>{state.shellTransparent=!state.shellTransparent;$('shell-view').setAttribute('aria-pressed',String(state.shellTransparent));updateHighlight();toast(state.shellTransparent?'舱壳透视已开启，可查看舱内器件':'舱壳恢复实体显示');};
  $('auto-rotate').onclick=()=>{stopDemo();state.autoRotate=!state.autoRotate;$('auto-rotate').setAttribute('aria-pressed',String(state.autoRotate));};$('demo').onclick=()=>state.demo?stopDemo():startDemo();
  $('help').onclick=()=>$('help-dialog').showModal();$('close-help').onclick=$('help-done').onclick=()=>$('help-dialog').close();
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('当前浏览器不支持全屏，可使用 F11');}};
  $('screenshot').onclick=()=>{try{renderer.render(scene,camera);const a=document.createElement('a');a.download=`MineGuard_${state.leaf||state.selected||'assembly'}_${Math.round(state.explode*100)}.png`;a.href=renderer.domElement.toDataURL('image/png');a.click();toast('已导出当前三维画面');}catch{toast('当前浏览器无法导出画面');}};
  document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||$('help-dialog').open)return;if(e.key.toLowerCase()==='e'){e.preventDefault();setExplode(state.targetExplode>.5?0:1);}if(e.key.toLowerCase()==='d')toggleDetail();if(e.key.toLowerCase()==='r')preset('iso');if(e.key.toLowerCase()==='f')focusSelection();if(e.key==='Escape'){if(state.isolated)toggleIsolate();else selectPart(null);}if(e.code==='Space'){e.preventDefault();state.demo?stopDemo():startDemo();}});
  let pointers=new Map(),start=null,moved=0,lastPinch=0;
  const canvas=$('scene');canvas.oncontextmenu=e=>e.preventDefault();
  canvas.addEventListener('pointerdown',e=>{stopDemo();state.autoRotate=false;$('auto-rotate').setAttribute('aria-pressed','false');canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});start={x:e.clientX,y:e.clientY,button:e.button,shift:e.shiftKey};moved=0;orbit.tween=0;canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{const p=pointers.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});moved+=Math.hypot(dx,dy);
   if(pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch){orbit.radius=THREE.MathUtils.clamp(orbit.radius*lastPinch/d,.035,36);orbit.desiredRadius=orbit.radius;}lastPinch=d;}
   else if(start?.button===2||e.shiftKey){const scale=orbit.radius*.0013,right=V(1,0,0).applyQuaternion(camera.quaternion),up=V(0,1,0).applyQuaternion(camera.quaternion);orbit.target.addScaledVector(right,-dx*scale).addScaledVector(up,dy*scale);orbit.desiredTarget.copy(orbit.target);}
   else{orbit.yaw-=dx*.006;orbit.pitch=THREE.MathUtils.clamp(orbit.pitch+dy*.005,-.14,1.53);orbit.desiredYaw=orbit.yaw;orbit.desiredPitch=orbit.pitch;}dirty=true;
  });
  function pick(e,focus=false){const rect=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const visible=state.isolated&&state.leaf?[isolatedMesh]:pickables.filter(o=>roots.get(o.userData.partId)?.visible);const hit=raycaster.intersectObjects(visible,true)[0];if(hit){const o=hit.object,leafId=o.userData.leafId||(leafByMesh.get(o)||[])[hit.instanceId??0];selectPart(o.userData.partId,leafId,{focus});}else if(!state.isolated)selectPart(null);}
  canvas.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(moved<5&&start?.button!==2)pick(e);if(!pointers.size){start=null;lastPinch=0;canvas.classList.remove('dragging');}});canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);start=null;lastPinch=0;canvas.classList.remove('dragging');});canvas.addEventListener('dblclick',e=>pick(e,true));
  canvas.addEventListener('wheel',e=>{e.preventDefault();stopDemo();orbit.tween=0;orbit.radius=THREE.MathUtils.clamp(orbit.radius*Math.exp(e.deltaY*.001),.035,36);orbit.desiredRadius=orbit.radius;dirty=true;},{passive:false});
 }
 function resize(){const stage=$('stage'),w=stage.clientWidth,h=stage.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,mobileView()&&!highQuality?1.15:1.7));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(ready){if(state.isolated&&state.selected)focusSelection();else fitBox(visibleBounds(),orbit.yaw,orbit.pitch,true);}dirty=true;}
 function init(){
  const safe=new URLSearchParams(location.search).has('safe')||(mobileView()&&!highQuality);document.body.dataset.renderQuality=safe?'smooth':'high';renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:!safe,alpha:true,preserveDrawingBuffer:true,powerPreference:safe?'low-power':'default'});renderer.setClearColor(0x0b1420,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.shadowMap.enabled=!safe;renderer.shadowMap.type=THREE.PCFShadowMap;
  scene=new THREE.Scene();scene.fog=new THREE.Fog(0x0e1b28,20,47);camera=new THREE.PerspectiveCamera(38,1,.001,90);raycaster=new THREE.Raycaster();clock=new THREE.Clock();
  scene.add(new THREE.HemisphereLight(0xb5d9eb,0x23333d,3.4));const light=(color,intensity,pos)=>{const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);return l;};const key=light(0xe3f2ff,4.0,[-5,8,5]);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=12;key.shadow.camera.bottom=-7;key.shadow.camera.near=.1;key.shadow.camera.far=30;key.shadow.normalBias=.025;key.shadow.bias=-.0004;light(0x7cb7d7,2.5,[3,5,-5]);light(0xffd6a2,1.8,[-4,3,-2]);
  ground=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:0x112231,metalness:.05,roughness:.95,transparent:true,opacity:.70}));ground.rotation.x=-Math.PI/2;ground.position.y=.015;ground.receiveShadow=true;scene.add(ground);
  grid=new THREE.GridHelper(32,64,0x385568,0x253e51);grid.position.y=.025;grid.material.transparent=true;grid.material.opacity=.24;scene.add(grid);
  ring=new THREE.Mesh(new THREE.RingGeometry(3.10,3.106,128),new THREE.MeshBasicMaterial({color:0x3c7487,transparent:true,opacity:.3,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.032;scene.add(ring);
  buildRobot();indexParts();buildGuides();buildJointMarkers();renderList();bindControls();resize();ready=true;preset('iso',true);selectPart(null);$('mesh-stat').textContent=fmt(PARTS.reduce((a,p)=>a+p.meshCount,0))+' 网格实例';$('triangle-stat').textContent=fmt(Math.round(PARTS.reduce((a,p)=>a+p.triangles,0)))+' 三角面';$('runtime-status').textContent='工作台就绪 · THREE r'+THREE.REVISION+(mobileView()&&!highQuality?' · 流畅渲染':'');$('loading').classList.add('done');
  new ResizeObserver(resize).observe($('stage'));$('scene').addEventListener('webglcontextlost',e=>{e.preventDefault();$('render-error').hidden=false;$('render-error').innerHTML='图形上下文已暂停。可等待浏览器恢复，或降低图形负载后重试。<button class="button" id="safe-retry">以兼容模式重新打开</button>';$('safe-retry').onclick=()=>{const u=new URL(location.href);u.searchParams.set('safe','1');location.href=u.href;};document.body.dataset.contextLost='true';cancelAnimationFrame(frameId);});$('scene').addEventListener('webglcontextrestored',()=>{$('render-error').hidden=true;delete document.body.dataset.contextLost;dirty=true;prevTime=performance.now();animate(prevTime);});
  window.MineGuard={state,parts:PARTS.map(p=>({id:p.id,name:p.name,leaves:p.leaves.length})),components:()=>[...assemblies.entries()].map(([id,a])=>({id,name:a.name,part:a.group.userData.partId,leaf:a.leaves[0]?.id,count:a.leaves.length})),findLeaves:(q)=>[...leaves.values()].filter(l=>l.name.includes(q)).map(l=>({id:l.id,name:l.name,part:l.part,component:l.componentId,size:l.size.toArray()})),get leafCount(){return leaves.size;},select:(id)=>selectPart(id),selectLeaf:(id)=>{const l=leaves.get(id);if(l)selectPart(l.part,l.id);},explode:value=>setExplode(value),detail:toggleDetail,focus:focusSelection,isolate:toggleIsolate,preset,reset:()=>{resetDetail();state.shellTransparent=false;$('shell-view').setAttribute('aria-pressed','false');state.manualHidden.clear();selectPart(null);setExplode(0);preset('iso');},stats:()=>({componentAssemblies:assemblies.size,isolatedGeometry:isolatedMesh&&state.isolated?isolatedMesh.children.length:0,frontArmMount:partMap.get('arm').cadMount.toArray(),rearFirePosition:partMap.get('fire').center.toArray(),revision:THREE.REVISION,meshes:pickables.length,leafCount:leaves.size,triangles:Math.round(PARTS.reduce((a,p)=>a+p.triangles,0)),cadComponents:partMap.get('arm').cadRecords.length,axes:cadJoints.length,armCabinClearance:-1.06-Math.max(...partMap.get('arm').cadRecords.map(o=>new THREE.Box3().setFromObject(o).max.x)),drawCalls:renderer.info.render.calls,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,explode:state.explode,detail:state.detailExplode,detailPart:state.detailPart,selected:state.selected,leaf:state.leaf,isolated:state.isolated,contextLost:document.body.dataset.contextLost==='true',hidden:[...state.manualHidden]})};
  document.body.dataset.ready='true';animate(0);
 }
 function animate(time){frameId=requestAnimationFrame(animate);const dt=Math.min((time-prevTime)/1000||.016,.05);prevTime=time;updateDemo(dt);
  if(Math.abs(state.targetExplode-state.explode)>.0002){state.explode=reduced?state.targetExplode:THREE.MathUtils.lerp(state.explode,state.targetExplode,1-Math.exp(-dt*7));dirty=true;}else state.explode=state.targetExplode;
  if(Math.abs(state.targetDetail-state.detailExplode)>.0002){state.detailExplode=reduced?state.targetDetail:THREE.MathUtils.lerp(state.detailExplode,state.targetDetail,1-Math.exp(-dt*6));dirty=true;}else state.detailExplode=state.targetDetail;updateDetailTransforms();
  PARTS.forEach(p=>roots.get(p.id).position.set(...p.offset).multiplyScalar(state.explode));
  if(state.autoRotate){orbit.yaw+=dt*.18;orbit.desiredYaw=orbit.yaw;dirty=true;}
  if(orbit.tween){const a=1-Math.exp(-dt*5.8);orbit.target.lerp(orbit.desiredTarget,a);orbit.radius=THREE.MathUtils.lerp(orbit.radius,orbit.desiredRadius,a);orbit.yaw=THREE.MathUtils.lerp(orbit.yaw,orbit.desiredYaw,a);orbit.pitch=THREE.MathUtils.lerp(orbit.pitch,orbit.desiredPitch,a);if(orbit.target.distanceTo(orbit.desiredTarget)<.001&&Math.abs(orbit.radius-orbit.desiredRadius)<.001&&Math.abs(orbit.yaw-orbit.desiredYaw)<.001)orbit.tween=0;dirty=true;}
  camera.position.copy(orbit.target).add(V(Math.sin(orbit.yaw)*Math.cos(orbit.pitch),Math.sin(orbit.pitch),Math.cos(orbit.yaw)*Math.cos(orbit.pitch)).multiplyScalar(orbit.radius));camera.lookAt(orbit.target);camera.updateMatrixWorld();robot.updateMatrixWorld(true);
  if(isolatedMesh&&state.leaf)isolatedMesh.children.forEach(o=>{const l=leaves.get(o.userData.leafId);o.matrix.copy(l.object.matrixWorld);if(l.instance!==null){const t=new THREE.Matrix4();l.object.getMatrixAt(l.instance,t);o.matrix.multiply(t);}o.matrixWorldNeedsUpdate=true;});
  if(dirty){updateSelectionBox();updateLabels();updateJointMarkers();updateOrientation();$('scene-caption').textContent=state.targetDetail>.01?'逐零件展开 · '+partMap.get(state.detailPart).name:state.isolated?(state.leaf?(isolationMembers().length>1?'完整元件隔离 · '+isolationMembers().length+' 处几何细节':'单零件隔离'):'子系统隔离'):state.targetExplode>.01?'模块分层 · '+Math.round(state.explode*100)+'%':'完整装配 · 九大子系统';renderer.render(scene,camera);dirty=false;}
 }
 try{init();}catch(error){console.error(error);$('render-error').hidden=false;$('render-error').textContent='三维工作台初始化失败：'+error.message+'。请使用支持 WebGL 2 的浏览器。';$('runtime-status').textContent='初始化未完成';document.body.dataset.error=error.message;}
})();
