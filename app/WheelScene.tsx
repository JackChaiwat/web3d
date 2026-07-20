"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const vertexSource = `
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aUv; attribute float aMaterial;
uniform float uAspect,uRotX,uRotY,uRotZ,uLift,uLayer,uExplode,uStrip,uProcess,uMotion,uZoom;
varying vec3 vNormal,vLocal; varying vec2 vUv; varying float vMaterial,vLayer,vSheet,vFacing;
vec3 rx(vec3 p,float a){a+=sin(uMotion*6.2831853)*.14;float c=cos(a),s=sin(a);return vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);}
vec3 ry(vec3 p,float a){a+=uMotion*6.2831853;float c=cos(a),s=sin(a);return vec3(p.x*c+p.z*s,p.y,-p.x*s+p.z*c);}
vec3 rz(vec3 p,float a){a+=sin(uMotion*3.14159265)*.22;float c=cos(a),s=sin(a);return vec3(p.x*c-p.y*s,p.x*s+p.y*c,p.z);}
void main(){vec3 local=aPosition;float angle=fract(atan(aPosition.y,aPosition.x)/6.2831853+.5);float sheet=fract(uStrip-angle+1.0);if(uLayer>.5){float wet=sin(smoothstep(.02,.48,uProcess)*3.14159265);local.z+=uExplode*(.008+wet*.032);}vec3 p=rz(rx(ry(local,uRotY),uRotX),uRotZ);vec3 n=normalize(rz(rx(ry(aNormal,uRotY),uRotX),uRotZ));p.y+=uLift;float vz=5.9-p.z,f=2.3*uZoom,nr=.1,fr=30.0;gl_Position=vec4(p.x*f/uAspect,p.y*f,((fr+nr)/(fr-nr))*vz-(2.0*fr*nr)/(fr-nr),vz);vNormal=n;vLocal=aPosition;vUv=aUv;vMaterial=aMaterial;vLayer=uLayer;vSheet=sheet;vFacing=aNormal.z;}`;

const fragmentSource = `
precision highp float;
varying vec3 vNormal,vLocal; varying vec2 vUv; varying float vMaterial,vLayer,vSheet,vFacing; uniform float uProcess,uWater;
void main(){
  vec3 n=normalize(vNormal),ld=normalize(vec3(-.48,.72,1.0));
  float dif=max(dot(n,ld),0.0);
  float radial=length(vLocal.xy);
  float sideSurface=1.0-smoothstep(.12,.58,abs(vFacing));
  float surfaceAngle=fract(atan(vLocal.y,vLocal.x)/6.2831853+.5);
  float angleRad=surfaceAngle*6.2831853;
  float cells=.50+.10*sin(radial*14.0+surfaceAngle*18.0)+.07*sin(radial*22.0-surfaceAngle*9.0);
  float fine=.50+.04*sin(radial*30.0+surfaceAngle*40.0)+.025*sin(radial*44.0-surfaceAngle*14.0);
  cells=clamp(cells,0.0,1.0);
  fine=clamp(fine,0.0,1.0);
  float peelMap=mix(cells,fine,.08);
  float sp=smoothstep(.06,.92,uProcess);
  float paintable=1.0;
  float flowing=.50+.13*sin(angleRad*3.0+radial*2.7)+.075*sin(angleRad*7.0-radial*4.2);
  flowing+=(peelMap-.5)*.16+.035*sin(radial*9.0-angleRad*2.0);
  float stripped=smoothstep(flowing-.060,flowing+.060,sp)*paintable;
  stripped=mix(stripped,1.0,smoothstep(.80,.92,uProcess));
  vec3 alloy=vec3(.68,.695,.705);
  vec3 oldPaint=vec3(.055,.060,.062); float oldWear=0.0;
  vec3 newPaint=oldPaint;
  if(vLayer>.5){
    if(vMaterial<.40||vLayer>1.5)discard;
    float wetNoise=.50+.25*sin(radial*9.2+angleRad*5.0)+.19*sin(radial*17.0-angleRad*11.0);
    wetNoise=clamp(wetNoise,0.0,1.0);
    float localStage=flowing+(wetNoise-.5)*.10;
    float active=smoothstep(localStage-.095,localStage-.020,sp)*(1.0-smoothstep(localStage+.018,localStage+.115,sp));
    float fracture=abs(sin(radial*29.0+angleRad*13.0+sin(radial*7.0-angleRad*4.0)*2.1));
    float liftedIslands=smoothstep(.18,.72,wetNoise+.20*(1.0-fracture));
    float sheetMask=active*(.16+liftedIslands*.84);
    if(sheetMask<.035||sp<.015||sp>.985)discard;
    float shellSpec=pow(max(dot(reflect(-ld,n),vec3(0,0,1)),0.0),72.0);
    float tornEdge=1.0-smoothstep(.035,.16,fracture);
    vec3 liquidColor=oldPaint*(.24+dif*.48)+vec3(shellSpec*.78)+vec3(.22,.23,.235)*tornEdge*.34;
    gl_FragColor=vec4(liquidColor,sheetMask*(.72+tornEdge*.22));
    return;
  }
  vec3 glossBlack=oldPaint,centerGraphite=oldPaint;
  float centerMask=1.0-smoothstep(.43,.58,length(vLocal.xy));
  vec3 twoToneFinish=mix(glossBlack,newPaint,paintable);twoToneFinish=mix(twoToneFinish,centerGraphite,centerMask);
  vec3 initialTwoTone=twoToneFinish+vec3(oldWear*(1.0-paintable));
  vec3 strippedSurface=mix(initialTwoTone,alloy,stripped);
  vec3 base=strippedSurface;
  float finishPolish=paintable*(1.0-stripped);
  float ndv=max(dot(n,vec3(0,0,1)),0.0),specPower=mix(64.0,42.0,clamp(paintable*.72+stripped*.52,0.0,1.0));
  float spec=pow(max(dot(reflect(-ld,n),vec3(0,0,1)),0.0),specPower);
  float fillSpec=pow(max(dot(reflect(-normalize(vec3(.72,.28,.75)),n),vec3(0,0,1)),0.0),38.0);
  float clearcoat=pow(max(dot(reflect(-normalize(vec3(-.15,.95,.55)),n),vec3(0,0,1)),0.0),72.0);
  float rim=pow(1.0-max(dot(n,vec3(0,0,1)),0.0),2.1);
  float edgeDelta=sp-flowing;
  float peelEdge=(1.0-smoothstep(.006,.036,abs(edgeDelta)))*step(.03,sp)*step(sp,.97);
  float paintLip=(1.0-smoothstep(.004,.020,abs(edgeDelta+.020)))*(1.0-stripped);
  float undercut=(1.0-smoothstep(.006,.026,abs(edgeDelta-.022)))*stripped;
  float crackField=abs(sin(radial*31.0+angleRad*17.0+sin(radial*8.0-angleRad*5.0)*2.4));
  float crackBand=1.0-smoothstep(.025,.105,crackField);
  float crackZone=(1.0-smoothstep(.055,.19,abs(edgeDelta)))*(1.0-stripped);
  float paintCracks=crackBand*crackZone;
  vec3 reflected=reflect(vec3(0.0,0.0,-1.0),n);
  vec3 environment=mix(vec3(.16,.17,.18),vec3(.72,.745,.765),smoothstep(-.82,.82,reflected.y));
  float softboxSide=pow(max(reflected.x,0.0),3.2),softboxTop=smoothstep(.68,.94,abs(reflected.y));
  environment+=vec3(.22,.23,.235)*softboxSide;
  environment+=vec3(.25,.265,.275)*softboxTop;
  float edgeFresnel=pow(1.0-ndv,5.0);
  float exposed=stripped;
  float metallic=mix(.035,.92,exposed);
  float reflectionMix=clamp(mix(.12,.69,metallic)+edgeFresnel*.08,0.0,.82);
  vec3 aluminumF0=vec3(.91);
  vec3 metalReflection=environment*aluminumF0+base*.055;
  vec3 metalBase=mix(base,metalReflection,reflectionMix);
  float hubContact=1.0-.17*exp(-pow((radial-.58)/.115,2.0));
  float cavityAO=mix(.76,1.0,smoothstep(.10,.70,vFacing));
  float studioBand=smoothstep(.16,.48,reflected.y)*(1.0-smoothstep(.72,.94,reflected.y));
  float diffuseWeight=mix(.82,.25,metallic);
  float microSpec=mix(1.0,.32,clamp(paintCracks+peelEdge*.42,0.0,1.0));
  vec3 color=metalBase*(.24+dif*diffuseWeight)+vec3(spec*microSpec*(.08+metallic*.64)+fillSpec*(.04+metallic*.22)+clearcoat*(.03+finishPolish*.28))+vec3(.34,.36,.365)*rim*(.17+metallic*.38);
  color*=hubContact*cavityAO*(1.0-peelEdge*.30);
  color*=1.0-paintCracks*.34-undercut*.20;
  color+=vec3(.29,.305,.31)*paintLip*.34;
  color+=vec3(.16,.175,.175)*peelEdge*stripped*.20;
  color+=vec3(.24,.255,.26)*studioBand*(.08+metallic*.42);
  color+=vec3(.42,.44,.445)*pow(1.0-ndv,3.4)*(.08+metallic*.31);
  float exposedAluminum=stripped;
  vec3 cleanN=n;
  vec3 viewDir=vec3(0.0,0.0,1.0);
  float cleanDif=max(dot(cleanN,ld),0.0);
  vec3 cleanReflected=reflect(-viewDir,cleanN);
  float cleanFresnel=pow(1.0-max(dot(cleanN,viewDir),0.0),5.0);
  vec3 studioMetal=mix(vec3(.15,.165,.18),vec3(.64,.675,.705),smoothstep(-.82,.82,cleanReflected.y));
  float leftSoftbox=smoothstep(-.88,-.48,cleanReflected.x)*(1.0-smoothstep(-.10,.28,cleanReflected.x));
  float rightSoftbox=smoothstep(.18,.48,cleanReflected.x)*(1.0-smoothstep(.68,.94,cleanReflected.x));
  float overheadSoftbox=smoothstep(.50,.88,cleanReflected.y);
  float horizonGlow=1.0-smoothstep(.08,.34,abs(cleanReflected.y-.03));
  studioMetal+=vec3(.22,.23,.24)*leftSoftbox;
  studioMetal+=vec3(.13,.145,.155)*rightSoftbox;
  studioMetal+=vec3(.18,.195,.21)*overheadSoftbox;
  studioMetal+=vec3(.09,.095,.10)*horizonGlow;
  float cleanSpec=pow(max(dot(reflect(-ld,cleanN),viewDir),0.0),56.0);
  float broadHighlight=pow(max(dot(reflect(-ld,cleanN),viewDir),0.0),10.0);
  float cleanFill=pow(max(dot(reflect(-normalize(vec3(.72,.28,.75)),cleanN),viewDir),0.0),34.0);
  float depthShade=mix(.72,1.0,smoothstep(-.92,.16,vLocal.z));
  float metalAO=hubContact*mix(.78,1.0,cavityAO)*depthShade;
  vec3 cleanAluminum=studioMetal*(.62+cleanFresnel*.24)+alloy*(.16+cleanDif*.17);
  cleanAluminum+=vec3(cleanSpec*.48+broadHighlight*.12+cleanFill*.20);
  cleanAluminum+=vec3(.30,.32,.335)*rim*(.18+cleanFresnel*.38)*(1.0-sideSurface*.48);
  cleanAluminum*=metalAO;
  cleanAluminum=max(cleanAluminum,alloy*.24);
  cleanAluminum=min(cleanAluminum,vec3(.90,.92,.94));
  float barrelMask=sideSurface*smoothstep(.72,1.08,radial);
  float barrelKey=pow(max(dot(cleanReflected,normalize(vec3(-.72,.18,.67))),0.0),5.0);
  float barrelFill=pow(max(dot(cleanReflected,normalize(vec3(.58,-.12,.80))),0.0),9.0);
  float barrelSweep=.5+.5*cos((vLocal.z+.18)*3.4);
  vec3 barrelAluminum=mix(vec3(.27,.29,.315),vec3(.61,.645,.68),smoothstep(-.72,.72,cleanReflected.y));
  barrelAluminum+=vec3(.26,.275,.29)*barrelKey+vec3(.12,.135,.15)*barrelFill;
  barrelAluminum*=.91+barrelSweep*.07;
  barrelAluminum=max(barrelAluminum,alloy*.34);
  barrelAluminum=min(barrelAluminum,vec3(.82,.85,.88));
  cleanAluminum=mix(cleanAluminum,barrelAluminum,barrelMask*.88);
  color=mix(color,cleanAluminum,exposedAluminum);
  float streakColumn=(vLocal.x+2.2)*10.0;
  float streakCell=floor(streakColumn);
  float streakSeed=fract(sin(streakCell*41.3+vLocal.z*17.9)*7853.13);
  float streakCenter=.24+streakSeed*.52;
  float streakWidth=.045+streakSeed*.055;
  float streakDistance=abs(fract(streakColumn)-streakCenter);
  float trailMask=1.0-smoothstep(streakWidth,streakWidth+.055,streakDistance);
  float flowHead=mix(1.95,-1.95,uWater);
  float passed=smoothstep(flowHead,flowHead+.20,vLocal.y);
  float brokenEdge=.72+.28*sin(vLocal.y*(8.0+streakSeed*7.0)+streakSeed*19.0);
  float wetness=passed*trailMask*smoothstep(.04,.18,uWater)*brokenEdge;
  wetness*=1.0-smoothstep(.15,.75,exposedAluminum);
  float wetFresnel=pow(1.0-ndv,3.0);
  color=mix(color,color*.56,wetness*.52);
  color+=environment*wetness*(.055+wetFresnel*.19);
  color+=vec3(spec*1.45+fillSpec*.42)*wetness;
  gl_FragColor=vec4(color,1.0);
}`;

const particleVertexSource = `
attribute vec4 aFlow; attribute vec4 aFlowMeta;
uniform float uAspect,uRotX,uRotY,uRotZ,uMotion,uZoom,uBurst,uRadius;
varying float vAlpha,vAcross,vAlong,vRibbonSeed;
vec3 rxp(vec3 p,float a){a+=sin(uMotion*6.2831853)*.14;float c=cos(a),s=sin(a);return vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);}
vec3 ryp(vec3 p,float a){a+=uMotion*6.2831853;float c=cos(a),s=sin(a);return vec3(p.x*c+p.z*s,p.y,-p.x*s+p.z*c);}
vec3 rzp(vec3 p,float a){a+=sin(uMotion*3.14159265)*.22;float c=cos(a),s=sin(a);return vec3(p.x*c-p.y*s,p.x*s+p.y*c,p.z);}
void main(){
  float envelope=sin(uBurst*3.14159265);
  float t=aFlow.w,side=aFlow.z,startAngle=aFlowMeta.x,seed=aFlowMeta.y;
  vec2 radial=vec2(cos(startAngle),sin(startAngle)),tangent=vec2(-radial.y,radial.x);
  float startRadius=mix(uRadius*.32,uRadius*.92,fract(seed*7.31+.17));
  vec2 attached=radial*startRadius+tangent*t*uRadius*(.035+seed*.035);
  float reveal=smoothstep(0.0,.23,envelope-t*.18);
  vec2 center=mix(attached,aFlow.xy,envelope*reveal);
  float width=(.020+.060*fract(seed*11.7))*sin(t*3.14159265)*(.25+envelope);
  center+=aFlowMeta.zw*side*width*reveal;
  vec3 local=vec3(center,.32+sin(t*3.14159265)*(.06+seed*.24)*envelope);
  local.z+=sin(t*13.0+seed*29.0)*.026*envelope;
  vec3 p=rzp(rxp(ryp(local,uRotY),uRotX),uRotZ);
  float vz=5.9-p.z,f=2.3*uZoom,nr=.1,fr=30.0;
  gl_Position=vec4(p.x*f/uAspect,p.y*f,((fr+nr)/(fr-nr))*vz-(2.0*fr*nr)/(fr-nr),vz);
  vAlpha=envelope*reveal*pow(sin(t*3.14159265),.48)*(1.0-smoothstep(.82,1.0,uBurst));
  vAcross=side;
  vAlong=t;
  vRibbonSeed=seed;
}`;

const particleFragmentSource = `
precision highp float;
varying float vAlpha,vAcross,vAlong,vRibbonSeed;
void main(){
  float fibers=pow(.5+.5*cos(vAcross*(40.0+vRibbonSeed*28.0)+sin(vAlong*23.0)*1.45),7.0);
  float crossThread=pow(.5+.5*cos(vAlong*(118.0+vRibbonSeed*38.0)+vAcross*2.6),13.0);
  float broken=.48+.52*smoothstep(.12,.86,fract(vAlong*17.0+vRibbonSeed*9.0));
  float edge=1.0-smoothstep(.72,1.0,abs(vAcross));
  float silver=pow(.5+.5*sin(vAlong*31.0-vRibbonSeed*17.0),8.0);
  vec3 color=mix(vec3(.018,.022,.026),vec3(.72,.745,.76),(.22+silver*.78)*(.28+fibers*.72));
  float alpha=vAlpha*edge*(.055+fibers*.84+crossThread*.20)*broken;
  gl_FragColor=vec4(color,alpha);
}`;

const waterVertexSource = `
attribute vec3 aSeed,aVelocity; attribute vec2 aInfo;
uniform float uAspect,uRotX,uRotY,uRotZ,uMotion,uZoom,uWater,uDpr;
varying float vAlpha,vSize,vLife;
vec3 rxw(vec3 p,float a){a+=sin(uMotion*6.2831853)*.14;float c=cos(a),s=sin(a);return vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);}
vec3 ryw(vec3 p,float a){a+=uMotion*6.2831853;float c=cos(a),s=sin(a);return vec3(p.x*c+p.z*s,p.y,-p.x*s+p.z*c);}
vec3 rzw(vec3 p,float a){a+=sin(uMotion*3.14159265)*.22;float c=cos(a),s=sin(a);return vec3(p.x*c-p.y*s,p.x*s+p.y*c,p.z);}
void main(){
  float life=clamp(uWater*1.50-aInfo.x*.58,0.0,1.0);
  float appear=smoothstep(.025,.13,life)*(1.0-smoothstep(.84,1.0,life));
  vec3 local=aSeed;
  float radius=max(length(local.xy),.001);
  vec2 radial=local.xy/radius;
  vec2 gravity=vec2(0.0,-1.0);
  vec2 tangent=gravity-radial*dot(gravity,radial);
  float rimFollow=smoothstep(1.08,1.52,radius);
  vec2 surfaceDir=normalize(mix(gravity,tangent,rimFollow)+vec2(aVelocity.x*.10,0.0));
  float hold=smoothstep(.06,.24,life);
  float slideDist=hold*hold*(.24+aInfo.y*.56);
  local.xy+=surfaceDir*slideDist;
  if(rimFollow>.5)local.xy=normalize(local.xy)*radius;
  local.z+=.006+aVelocity.z*.006;
  vec3 p=rzw(rxw(ryw(local,uRotY),uRotX),uRotZ);
  float vz=5.9-p.z,f=2.3*uZoom,nr=.1,fr=30.0;
  gl_Position=vec4(p.x*f/uAspect,p.y*f,((fr+nr)/(fr-nr))*vz-(2.0*fr*nr)/(fr-nr),vz);
  gl_PointSize=(3.0+pow(aInfo.y,2.45)*17.0)*uDpr*(5.9/vz);
  vAlpha=appear*(.38+aInfo.y*.48);
  vSize=aInfo.y;
  vLife=life;
}`;

const waterFragmentSource = `
precision highp float;
varying float vAlpha,vSize,vLife;
void main(){
  vec2 q=gl_PointCoord-.5;
  q.x+=sin((q.y+vLife)*13.0)*(.018+.018*vSize);
  q.y*=mix(1.45,4.35,smoothstep(.12,.88,vLife)*(1.0-vSize*.22));
  float d=length(q*vec2(1.0+.10*sin(q.y*19.0),1.0));
  if(d>.5)discard;

  float rim=smoothstep(.28,.50,d);
  vec2 hp=q-vec2(-.15,.16);
  float spec=pow(1.0-smoothstep(.0,.10,length(hp)),2.0);
  vec2 hp2=q-vec2(.14,-.08);
  float amb=1.0-smoothstep(.0,.22,length(hp2));

  vec3 glassDark=vec3(.03,.05,.06);
  vec3 glassBright=vec3(.82,.90,.93);
  vec3 color=mix(glassDark,glassBright,spec*.85+amb*.22);

  float body=1.0-smoothstep(.10,.46,d);
  float edge=1.0-smoothstep(.40,.50,d);
  float tail=mix(.30,1.0,smoothstep(-.48,.32,q.y));
  float alpha=vAlpha*edge*tail*(0.24+rim*0.38+body*0.18+spec*0.55);
  gl_FragColor=vec4(color,clamp(alpha,0.0,1.0));
}`;

type Geo={p:number[];n:number[];uv:number[];m:number[];i:number[]};
const SEG=96;
function compile(gl:WebGLRenderingContext,type:number,source:string){const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"shader");return s;}
function vertex(g:Geo,p:number[],n:number[],uv:number[],m:number){g.p.push(...p);g.n.push(...n);g.uv.push(...uv);g.m.push(m);}
function quad(g:Geo,a:number[],b:number[],c:number[],d:number[],m:number){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[d[0]-a[0],d[1]-a[1],d[2]-a[2]],x=u[1]*v[2]-u[2]*v[1],y=u[2]*v[0]-u[0]*v[2],z=u[0]*v[1]-u[1]*v[0],l=Math.hypot(x,y,z)||1,n=[x/l,y/l,z/l],k=g.p.length/3;vertex(g,a,n,[0,0],m);vertex(g,b,n,[1,0],m);vertex(g,c,n,[1,1],m);vertex(g,d,n,[0,1],m);g.i.push(k,k+1,k+2,k,k+2,k+3);}
function torus(g:Geo,R:number,r:number,z0:number,m:number){const V=22,k=g.p.length/3;for(let u=0;u<=SEG;u++){const au=u/SEG*Math.PI*2,cu=Math.cos(au),su=Math.sin(au);for(let v=0;v<=V;v++){const av=v/V*Math.PI*2,cv=Math.cos(av),sv=Math.sin(av);vertex(g,[(R+r*cv)*cu,(R+r*cv)*su,z0+r*sv],[cv*cu,cv*su,sv],[u/SEG,v/V],m);}}for(let u=0;u<SEG;u++)for(let v=0;v<V;v++){const a=k+u*(V+1)+v,b=a+V+1;g.i.push(a,b,a+1,b,b+1,a+1);}}
function torusOffset(g:Geo,cx:number,cy:number,R:number,r:number,z0:number,m:number){const S=40,V=14,k=g.p.length/3;for(let u=0;u<=S;u++){const au=u/S*Math.PI*2,cu=Math.cos(au),su=Math.sin(au);for(let v=0;v<=V;v++){const av=v/V*Math.PI*2,cv=Math.cos(av),sv=Math.sin(av);vertex(g,[cx+(R+r*cv)*cu,cy+(R+r*cv)*su,z0+r*sv],[cv*cu,cv*su,sv],[u/S,v/V],m);}}for(let u=0;u<S;u++)for(let v=0;v<V;v++){const a=k+u*(V+1)+v,b=a+V+1;g.i.push(a,b,a+1,b,b+1,a+1);}}
function tube(g:Geo,r:number,zFront:number,zBack:number,inward:boolean,m:number){const k=g.p.length/3;for(let s=0;s<=SEG;s++){const a=s/SEG*Math.PI*2,x=Math.cos(a),y=Math.sin(a),d=inward?-1:1;vertex(g,[x*r,y*r,zBack],[x*d,y*d,0],[s/SEG,0],m);vertex(g,[x*r,y*r,zFront],[x*d,y*d,0],[s/SEG,1],m);}for(let s=0;s<SEG;s++){const a=k+s*2;g.i.push(a,a+2,a+1,a+1,a+2,a+3);}}
function ring(g:Geo,outer:number,inner:number,z:number,front:boolean,m:number){const k=g.p.length/3,n=[0,0,front?1:-1];for(let s=0;s<=SEG;s++){const a=s/SEG*Math.PI*2,x=Math.cos(a),y=Math.sin(a);vertex(g,[x*outer,y*outer,z],n,[s/SEG,1],m);vertex(g,[x*inner,y*inner,z],n,[s/SEG,0],m);}for(let s=0;s<SEG;s++){const a=k+s*2;g.i.push(a,a+2,a+1,a+1,a+2,a+3);}}
function cylinder(g:Geo,cx:number,cy:number,r:number,zFront:number,zBack:number,m:number){tubeOffset(g,cx,cy,r,zFront,zBack,m);for(const [z,nz] of [[zFront,1],[zBack,-1]]){const c=g.p.length/3;vertex(g,[cx,cy,z as number],[0,0,nz as number],[.5,.5],m);for(let s=0;s<=48;s++){const a=s/48*Math.PI*2,x=Math.cos(a),y=Math.sin(a);vertex(g,[cx+x*r,cy+y*r,z as number],[0,0,nz as number],[x*.5+.5,y*.5+.5],m);}for(let s=0;s<48;s++)g.i.push(c,c+1+s,c+2+s);}}
function tubeOffset(g:Geo,cx:number,cy:number,r:number,zFront:number,zBack:number,m:number){const S=48,k=g.p.length/3;for(let s=0;s<=S;s++){const a=s/S*Math.PI*2,x=Math.cos(a),y=Math.sin(a);vertex(g,[cx+x*r,cy+y*r,zBack],[x,y,0],[s/S,0],m);vertex(g,[cx+x*r,cy+y*r,zFront],[x,y,0],[s/S,1],m);}for(let s=0;s<S;s++){const a=k+s*2;g.i.push(a,a+2,a+1,a+1,a+2,a+3);}}
function countersink(g:Geo,cx:number,cy:number,rTop:number,rBottom:number,zTop:number,zBottom:number,m:number){
  const S=32,k=g.p.length/3,slope=Math.atan2(rTop-rBottom,zTop-zBottom),nz=Math.sin(slope),nr=Math.cos(slope);
  for(let s=0;s<=S;s++){const a=s/S*Math.PI*2,cA=Math.cos(a),sA=Math.sin(a);vertex(g,[cx+cA*rBottom,cy+sA*rBottom,zBottom],[cA*nr,sA*nr,nz],[s/S,0],m);vertex(g,[cx+cA*rTop,cy+sA*rTop,zTop],[cA*nr,sA*nr,nz],[s/S,1],m);}
  for(let s=0;s<S;s++){const a=k+s*2;g.i.push(a,a+2,a+1,a+1,a+2,a+3);}
}
function prism(g:Geo,points:number[][],zf:number,zb:number,m:number){const front:number[][]=[],back:number[][]=[];for(const [x,y] of points){front.push([x,y,zf]);back.push([x,y,zb]);}let k=g.p.length/3;for(const p of front)vertex(g,p,[0,0,1],[p[0],p[1]],m);for(let q=1;q<points.length-1;q++)g.i.push(k,k+q,k+q+1);k=g.p.length/3;for(const p of back)vertex(g,p,[0,0,-1],[p[0],p[1]],m);for(let q=1;q<points.length-1;q++)g.i.push(k,k+q+1,k+q);for(let q=0;q<points.length;q++)quad(g,back[q],back[(q+1)%points.length],front[(q+1)%points.length],front[q],m);}
function localPoint(a:number,r:number,y:number){return [Math.cos(a)*r-Math.sin(a)*y,Math.sin(a)*r+Math.cos(a)*y];}
function roundedSpokeShape(a:number,ri:number,ro:number,wi:number,wo:number){
  const p:number[][]=[],S=10,C=10;
  for(let s=0;s<=S;s++){const t=s/S,w=wi+(wo-wi)*Math.pow(t,.72);p.push(localPoint(a,ri+(ro-ri)*t,-w));}
  for(let s=1;s<=C;s++){const q=-Math.PI/2+s/C*Math.PI;p.push(localPoint(a,ro+Math.cos(q)*.075,Math.sin(q)*wo));}
  for(let s=S-1;s>=0;s--){const t=s/S,w=wi+(wo-wi)*Math.pow(t,.72);p.push(localPoint(a,ri+(ro-ri)*t,w));}
  for(let s=1;s<C;s++){const q=Math.PI/2+s/C*Math.PI;p.push(localPoint(a,ri+Math.cos(q)*.055,Math.sin(q)*wi));}
  return p;
}
function crownSpoke(g:Geo,a:number,ri:number,ro:number,wi:number,wo:number,z:number,m:number){
  const R=22,W=10,k=g.p.length/3,ca=Math.cos(a),sa=Math.sin(a);
  for(let r=0;r<=R;r++){
    const t=r/R,rad=ri+(ro-ri)*t,w=wi+(wo-wi)*Math.pow(t,.72);
    for(let s=0;s<=W;s++){
      const q=s/W*2-1,[x,y]=localPoint(a,rad,q*w),dish=(1-q*q)*.020,crest=Math.exp(-q*q*6)*.014,nr=-Math.cos(t*Math.PI)*.09,nt=q*.42,nz=1,l=Math.hypot(nr,nt,nz);
      vertex(g,[x,y,z-q*q*.046+dish+crest+Math.sin(t*Math.PI)*.016],[(ca*nr-sa*nt)/l,(sa*nr+ca*nt)/l,nz/l],[t,s/W],m);
    }
  }
  for(let r=0;r<R;r++)for(let s=0;s<W;s++){const v=k+r*(W+1)+s,n=v+W+1;g.i.push(v,n,v+1,n,n+1,v+1);}
}
function spoke(g:Geo,a:number){
  prism(g,roundedSpokeShape(a,.44,1.56,.205,.165),.183,-.255,.48);
  prism(g,roundedSpokeShape(a,.49,1.545,.170,.137),.221,.180,.68);
  crownSpoke(g,a,.52,1.54,.135,.100,.247,.86);
}
function geometry(){
  const g:Geo={p:[],n:[],uv:[],m:[],i:[]};
  tube(g,1.76,.22,-1.33,false,.08);tube(g,1.54,.12,-1.28,true,.20);ring(g,1.76,1.69,.22,true,.14);ring(g,1.75,1.66,-1.29,false,.18);torus(g,1.70,.065,.22,.08);torus(g,1.69,.052,-1.22,.20);torus(g,1.55,.028,-1.26,.27);
  tube(g,1.615,.135,.005,false,.16);torus(g,1.615,.042,.135,.16);torus(g,1.615,.030,.005,.22);
  cylinder(g,0,0,.64,.26,-.40,.52);torus(g,.61,.038,.25,.74);for(let k=0;k<5;k++)spoke(g,k/5*Math.PI*2-Math.PI/2);torus(g,.69,.026,.19,.56);torus(g,1.585,.055,.155,.60);torus(g,1.635,.018,.158,.82);
  for(let k=0;k<5;k++){const a=k/5*Math.PI*2-Math.PI/2,cx=Math.cos(a)*.466,cy=Math.sin(a)*.466;countersink(g,cx,cy,.092,.052,.295,.230,1);torusOffset(g,cx,cy,.070,.014,.294,.86);cylinder(g,cx,cy,.052,.230,-.02,2);cylinder(g,cx,cy,.065,-.365,-.395,2);}
  torus(g,.282,.022,.302,.88);torus(g,.282,.022,-.368,.62);cylinder(g,0,0,.292,.312,.02,.74);cylinder(g,0,0,.273,.322,.298,2);cylinder(g,0,0,.273,-.35,-.40,2);const va=.34,vx=Math.cos(va)*1.51,vy=Math.sin(va)*1.51;prism(g,[[vx-.018,vy-.035],[vx+.018,vy-.035],[vx+.018,vy+.10],[vx-.018,vy+.10]],.205,.08,2);return g;
}

type GltfAccessor={bufferView:number;byteOffset?:number;componentType:number;count:number;type:string;normalized?:boolean};
type GltfView={byteOffset?:number;byteStride?:number};
type GltfDoc={accessors:GltfAccessor[];bufferViews:GltfView[];meshes:{primitives:{attributes:{POSITION:number;NORMAL:number;TEXCOORD_0?:number};indices:number;material?:number}[]}[]};
function readGltfAccessor(doc:GltfDoc,buffer:ArrayBuffer,index:number){
  const acc=doc.accessors[index],view=doc.bufferViews[acc.bufferView],size=acc.type==="VEC3"?3:acc.type==="VEC2"?2:1,bytes=acc.componentType===5126||acc.componentType===5125?4:acc.componentType===5120||acc.componentType===5121?1:2,stride=view.byteStride??size*bytes,offset=(view.byteOffset??0)+(acc.byteOffset??0),data=new DataView(buffer),out:number[]=[];
  for(let i=0;i<acc.count;i++)for(let c=0;c<size;c++){const p=offset+i*stride+c*bytes;let value=acc.componentType===5126?data.getFloat32(p,true):acc.componentType===5125?data.getUint32(p,true):acc.componentType===5123?data.getUint16(p,true):acc.componentType===5122?data.getInt16(p,true):acc.componentType===5121?data.getUint8(p):data.getInt8(p);if(acc.normalized)value=acc.componentType===5122?Math.max(value/32767,-1):acc.componentType===5120?Math.max(value/127,-1):value/(acc.componentType===5123?65535:255);out.push(value);}
  return out;
}
async function loadSportWheel(model:"lite"|"full"="full"):Promise<Geo>{
  const suffix=model==="lite"?"-lite":"";
  const [doc,buffer]=await Promise.all([fetch(`/models/rays-homura/scene${suffix}.gltf`).then(r=>r.json() as Promise<GltfDoc>),fetch(`/models/rays-homura/scene${suffix}.bin`).then(r=>r.arrayBuffer())]),g:Geo={p:[],n:[],uv:[],m:[],i:[]};
  for(let meshIndex=0;meshIndex<doc.meshes.length;meshIndex++)for(const primitive of doc.meshes[meshIndex].primitives){
    const positions=readGltfAccessor(doc,buffer,primitive.attributes.POSITION),normals=readGltfAccessor(doc,buffer,primitive.attributes.NORMAL),uvs=primitive.attributes.TEXCOORD_0===undefined?null:readGltfAccessor(doc,buffer,primitive.attributes.TEXCOORD_0),indices=readGltfAccessor(doc,buffer,primitive.indices),base=g.p.length/3,material=[.64,1.10,1.20,1.30,1.40][primitive.material??0]??.64;
    for(let v=0;v<positions.length;v+=3){const sx=positions[v],sy=positions[v+1],sz=positions[v+2],nx=normals[v]/.27,ny=normals[v+1]/.27,nz=-normals[v+2]/.20,l=Math.hypot(nx,ny,nz)||1,uvIndex=v/3*2;g.p.push(sx*.27,sy*.27,.28+(-5.938-sz)*.20);g.n.push(nx/l,ny/l,nz/l);g.uv.push(uvs?.[uvIndex]??0,uvs?.[uvIndex+1]??0);g.m.push(material);}
    for(const index of indices)g.i.push(base+index);
  }
  return g;
}

// Kept as a lightweight code fallback for the imported GLTF wheel.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProceduralWheelScene({ onReady }: { onReady: () => void }){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const canvas=ref.current!,gl=canvas.getContext("webgl",{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl){onReady();return;}const program=gl.createProgram()!;gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.error("Wheel fallback shader unavailable",gl.getProgramInfoLog(program));onReady();return;}gl.useProgram(program);const g=geometry(),bind=(name:string,size:number,data:number[])=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const l=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);};bind("aPosition",3,g.p);bind("aNormal",3,g.n);bind("aUv",2,g.uv);bind("aMaterial",1,g.m);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.i),gl.STATIC_DRAW);const u=(n:string)=>gl.getUniformLocation(program,n),aspect=u("uAspect"),rx=u("uRotX"),ry=u("uRotY"),rz=u("uRotZ"),lift=u("uLift"),process=u("uProcess"),layer=u("uLayer"),explode=u("uExplode"),stripUniform=u("uStrip");let raf=0,scroll=window.scrollY,px=0,py=0;const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*.36;py=(e.clientY/innerHeight-.5)*.12;};addEventListener("pointermove",pointer,{passive:true});const render=(time:number)=>{const d=Math.min(devicePixelRatio||1,innerWidth<700?1.0:1.2),w=Math.max(1,canvas.clientWidth*d),h=Math.max(1,canvas.clientHeight*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}scroll+=(scrollY-scroll)*.075;const phase=scroll/Math.max(innerHeight,1),progress=Math.min(phase/1.65,1),strip=smoothstepJs(.02,.45,progress);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.uniform1f(aspect,w/h);gl.uniform1f(rx,-.045+py);gl.uniform1f(ry,.28+px+Math.sin(Math.min(phase,1.7)*1.1)*.14);gl.uniform1f(rz,phase*.48+time*.00005);gl.uniform1f(lift,Math.sin(time*.0012)*.025);gl.uniform1f(process,progress);gl.uniform1f(stripUniform,strip);gl.uniform1f(explode,Math.sin(strip*Math.PI));gl.uniform1f(layer,0);gl.drawElements(gl.TRIANGLES,g.i.length,gl.UNSIGNED_SHORT,0);if(strip>.01&&strip<.99){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);for(let shell=1;shell<=2;shell++){gl.uniform1f(layer,shell);gl.drawElements(gl.TRIANGLES,g.i.length,gl.UNSIGNED_SHORT,0);}gl.depthMask(true);gl.disable(gl.BLEND);gl.uniform1f(layer,0);}raf=requestAnimationFrame(render);};raf=requestAnimationFrame(render);onReady();return()=>{cancelAnimationFrame(raf);removeEventListener("pointermove",pointer);};},[onReady]);return <canvas ref={ref} className="wheel-canvas" aria-label="ล้อแม็กสามมิติระหว่างโหลดโมเดลรายละเอียดสูง"/>;}

function ImportedWheelScene({ onReady,onUnavailable,model="full" }: { onReady: () => void; onUnavailable: () => void; model?: "lite"|"full" }){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current!,gl=canvas.getContext("webgl",{alpha:true,antialias:true,premultipliedAlpha:false});
    if(!gl){onUnavailable();return;}
    let raf=0,disposed=false,px=0,py=0,didSignalReady=false,readinessFrames=0,smoothedWheelMotion=0;
    const contextLost=(event:Event)=>{event.preventDefault();onUnavailable();};
    canvas.addEventListener("webglcontextlost",contextLost);
    const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*.36;py=(e.clientY/innerHeight-.5)*.12;};
    addEventListener("pointermove",pointer,{passive:true});
    void loadSportWheel(model).then(g=>{
      if(disposed)return;
      const program=gl.createProgram()!;
      gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||"wheel program");gl.useProgram(program);
      const wheelBindings:{buffer:WebGLBuffer|null;location:number;size:number}[]=[];
      const bind=(name:string,size:number,data:number[])=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const l=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);wheelBindings.push({buffer:b,location:l,size});};
      bind("aPosition",3,g.p);bind("aNormal",3,g.n);bind("aUv",2,g.uv);bind("aMaterial",1,g.m);
      const useUint32=g.p.length/3>65535;
      if(useUint32&&!gl.getExtension("OES_element_index_uint"))throw new Error("This alloy wheel requires 32-bit WebGL indices");
      const indexType=useUint32?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT;
      const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,useUint32?new Uint32Array(g.i):new Uint16Array(g.i),gl.STATIC_DRAW);
      const u=(n:string)=>gl.getUniformLocation(program,n),aspect=u("uAspect"),rx=u("uRotX"),ry=u("uRotY"),rz=u("uRotZ"),lift=u("uLift"),process=u("uProcess"),motion=u("uMotion"),zoom=u("uZoom"),layer=u("uLayer"),explode=u("uExplode"),stripUniform=u("uStrip"),surfaceWater=u("uWater");
      let seed=94721;
      const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
      const vertexCount=g.p.length/3,frontSurface:number[]=[];let maxWheelRadius=0;
      for(let vertexIndex=0;vertexIndex<vertexCount;vertexIndex++)maxWheelRadius=Math.max(maxWheelRadius,Math.hypot(g.p[vertexIndex*3],g.p[vertexIndex*3+1]));
      for(let vertexIndex=0;vertexIndex<vertexCount;vertexIndex++){const source=vertexIndex*3;if(g.n[source+2]>.50&&g.p[source+2]>.23&&Math.hypot(g.p[source],g.p[source+1])<maxWheelRadius*.88)frontSurface.push(source);}
      const dropletSources=frontSurface.length?frontSurface:Array.from({length:vertexCount},(_,index)=>index*3);
      const flowEffect=false?(()=>{try{
        const particleProgram=gl.createProgram()!;
        gl.attachShader(particleProgram,compile(gl,gl.VERTEX_SHADER,particleVertexSource));gl.attachShader(particleProgram,compile(gl,gl.FRAGMENT_SHADER,particleFragmentSource));gl.linkProgram(particleProgram);
        if(!gl.getProgramParameter(particleProgram,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(particleProgram)||"flow program");
        const ribbonCount=26,ribbonSegments=72,ribbonVerticesPerStrip=(ribbonSegments+1)*2,flowData:number[]=[],flowMeta:number[]=[];
        const flowPotential=(x:number,y:number,s:number)=>Math.sin(x*1.34+s*6.7)+Math.sin(y*1.83-x*.46-s*4.1)*.62+Math.cos((x+y)*2.16+s*8.3)*.38+Math.sin(x*2.72-y*1.18+s*3.6)*.24;
        for(let ribbon=0;ribbon<ribbonCount;ribbon++){
          const ribbonSeed=(ribbon+.35)/ribbonCount,startAngle=ribbon/ribbonCount*Math.PI*2+(random()-.5)*.28,startRadius=maxWheelRadius*(.32+.60*((ribbon*7)%ribbonCount)/ribbonCount),points:{x:number;y:number}[]=[];
          let flowX=Math.cos(startAngle)*startRadius,flowY=Math.sin(startAngle)*startRadius;const spinDirection=ribbon%2===0?1:-1;
          for(let segment=0;segment<=ribbonSegments;segment++){const along=segment/ribbonSegments;if(segment>0){const nx=flowX/maxWheelRadius,ny=flowY/maxWheelRadius,e=.026,gradX=(flowPotential(nx+e,ny,ribbonSeed)-flowPotential(nx-e,ny,ribbonSeed))/(e*2),gradY=(flowPotential(nx,ny+e,ribbonSeed)-flowPotential(nx,ny-e,ribbonSeed))/(e*2);let dirX=gradY,dirY=-gradX,dirLength=Math.hypot(dirX,dirY)||1;dirX/=dirLength;dirY/=dirLength;const radius=Math.hypot(flowX,flowY)||1,radialX=flowX/radius,radialY=flowY/radius,tangentX=-radialY*spinDirection,tangentY=radialX*spinDirection;dirX=dirX*.72+tangentX*.24+radialX*(.07+along*.13);dirY=dirY*.72+tangentY*.24+radialY*(.07+along*.13);dirLength=Math.hypot(dirX,dirY)||1;const step=maxWheelRadius*(.017+along*.026)*(.86+ribbonSeed*.36);flowX+=dirX/dirLength*step;flowY+=dirY/dirLength*step;}points.push({x:flowX,y:flowY});}
          for(let segment=0;segment<=ribbonSegments;segment++){const along=segment/ribbonSegments,previous=points[Math.max(0,segment-1)],next=points[Math.min(ribbonSegments,segment+1)],dx=next.x-previous.x,dy=next.y-previous.y,length=Math.hypot(dx,dy)||1,normalX=-dy/length,normalY=dx/length,point=points[segment];flowData.push(point.x,point.y,-1,along,point.x,point.y,1,along);flowMeta.push(startAngle,ribbonSeed,normalX,normalY,startAngle,ribbonSeed,normalX,normalY);}
        }
        const particleBuffer=gl.createBuffer(),particleMetaBuffer=gl.createBuffer(),particleLocation=gl.getAttribLocation(particleProgram,"aFlow"),particleMetaLocation=gl.getAttribLocation(particleProgram,"aFlowMeta");
        gl.bindBuffer(gl.ARRAY_BUFFER,particleBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(flowData),gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,particleMetaBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(flowMeta),gl.STATIC_DRAW);
        const pu=(n:string)=>gl.getUniformLocation(particleProgram,n);
        return{particleProgram,particleBuffer,particleMetaBuffer,particleLocation,particleMetaLocation,ribbonCount,ribbonVerticesPerStrip,pAspect:pu("uAspect"),pRx:pu("uRotX"),pRy:pu("uRotY"),pRz:pu("uRotZ"),pMotion:pu("uMotion"),pZoom:pu("uZoom"),pBurst:pu("uBurst"),pRadius:pu("uRadius")};
      }catch(error){console.error("Flow field disabled",error);return null;}})():null;
      const waterProgram=gl.createProgram()!;
      gl.attachShader(waterProgram,compile(gl,gl.VERTEX_SHADER,waterVertexSource));gl.attachShader(waterProgram,compile(gl,gl.FRAGMENT_SHADER,waterFragmentSource));gl.linkProgram(waterProgram);
      const waterSeeds:number[]=[],waterVelocities:number[]=[],waterInfo:number[]=[];
      for(let i=0;i<360;i++){
        const source=dropletSources[Math.floor(random()*dropletSources.length)],x=g.p[source],y=g.p[source+1],z=g.p[source+2]+.025;
        const radius=Math.hypot(x,y)||1,radialX=x/radius,side=random()-.5,speed=.04+random()*.28;
        waterSeeds.push(x,y,z);
        waterVelocities.push(radialX*speed+side*.16,-.08-random()*.34,(random()-.40)*.20);
        waterInfo.push(Math.pow(random(),.65),Math.pow(random(),1.65));
      }
      const waterSeedBuffer=gl.createBuffer(),waterVelocityBuffer=gl.createBuffer(),waterInfoBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,waterSeedBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(waterSeeds),gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER,waterVelocityBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(waterVelocities),gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER,waterInfoBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(waterInfo),gl.STATIC_DRAW);
      const waterSeedLocation=gl.getAttribLocation(waterProgram,"aSeed"),waterVelocityLocation=gl.getAttribLocation(waterProgram,"aVelocity"),waterInfoLocation=gl.getAttribLocation(waterProgram,"aInfo");
      const wu=(n:string)=>gl.getUniformLocation(waterProgram,n),wAspect=wu("uAspect"),wRx=wu("uRotX"),wRy=wu("uRotY"),wRz=wu("uRotZ"),wMotion=wu("uMotion"),wZoom=wu("uZoom"),wWater=wu("uWater"),wDpr=wu("uDpr");
      const render=()=>{
        const sequence=canvas.closest(".wheel-sequence") as HTMLElement|null;
        const sequenceRect=sequence?.getBoundingClientRect();
        const shouldDraw=!document.hidden&&(!sequenceRect||(sequenceRect.bottom>0&&sequenceRect.top<innerHeight*1.10));
        if(!shouldDraw){raf=requestAnimationFrame(render);return;}
        const d=Math.min(Math.max(devicePixelRatio||1,1.2),innerWidth<700?1.25:1.4),w=Math.max(1,canvas.clientWidth*d),h=Math.max(1,canvas.clientHeight*d);
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
        const maxScroll=Math.max((sequenceRect?.height??document.documentElement.scrollHeight)-innerHeight,1);
        const pageProgress=sequenceRect
          ? Math.max(0,Math.min(1,-sequenceRect.top/maxScroll))
          : Math.max(0,Math.min(1,scrollY/maxScroll));
        const processProgress=smoothstepJs(.06,.94,pageProgress);
        const targetWheelMotion=motionTrack(pageProgress);
        smoothedWheelMotion+=(targetWheelMotion-smoothedWheelMotion)*.038;
        const wheelMotion=smoothedWheelMotion;
        const introZoom=1-smoothstepJs(.015,.145,pageProgress);
        const zoomValue=zoomTrack(pageProgress);
        const strip=smoothstepJs(.06,.92,processProgress);
        const waterProgress=smoothstepJs(.285,.60,pageProgress);
        const serviceFocus=smoothstepJs(.29,.36,pageProgress)*(1-smoothstepJs(.53,.60,pageProgress));
        const rotX=(-.01+py*.55+Math.sin(pageProgress*Math.PI)*.045)*(1-serviceFocus),rotY=(.015+px*.55)*(1-serviceFocus),rotZ=(-.015+pageProgress*.10)*(1-serviceFocus);
        gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);
        gl.useProgram(program);for(const binding of wheelBindings){gl.bindBuffer(gl.ARRAY_BUFFER,binding.buffer);gl.enableVertexAttribArray(binding.location);gl.vertexAttribPointer(binding.location,binding.size,gl.FLOAT,false,0,0);}gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);
        const introLift=-.08*introZoom;
        const scrollLift=introLift+Math.sin(pageProgress*Math.PI)*.018*(1-smoothstepJs(.55,.72,pageProgress));
        gl.uniform1f(aspect,w/h);gl.uniform1f(rx,rotX);gl.uniform1f(ry,rotY);gl.uniform1f(rz,rotZ);gl.uniform1f(lift,scrollLift);gl.uniform1f(process,processProgress);gl.uniform1f(motion,wheelMotion);gl.uniform1f(zoom,zoomValue);gl.uniform1f(stripUniform,strip);gl.uniform1f(surfaceWater,waterProgress);gl.uniform1f(explode,Math.sin(strip*Math.PI));gl.uniform1f(layer,0);
        gl.drawElements(gl.TRIANGLES,g.i.length,indexType,0);
        if(strip>.015&&strip<.985){
          gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
          gl.uniform1f(layer,1);gl.drawElements(gl.TRIANGLES,g.i.length,indexType,0);
          gl.uniform1f(layer,0);gl.depthMask(true);gl.disable(gl.BLEND);
        }
        if(!didSignalReady){
          readinessFrames++;
          const sample=new Uint8Array(4),samplePoints=[[.50,.50],[.32,.50],[.68,.50],[.50,.32],[.50,.68]];
          let hasVisiblePixel=false;
          for(const [sampleX,sampleY] of samplePoints){gl.readPixels(Math.floor(w*sampleX),Math.floor(h*sampleY),1,1,gl.RGBA,gl.UNSIGNED_BYTE,sample);if(sample[3]>8){hasVisiblePixel=true;break;}}
          if(hasVisiblePixel){didSignalReady=true;onReady();}
          else if(readinessFrames>=30){didSignalReady=true;onUnavailable();}
        }
        if(waterProgress>.001&&waterProgress<.999){
          gl.useProgram(waterProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER,waterSeedBuffer);gl.enableVertexAttribArray(waterSeedLocation);gl.vertexAttribPointer(waterSeedLocation,3,gl.FLOAT,false,0,0);
          gl.bindBuffer(gl.ARRAY_BUFFER,waterVelocityBuffer);gl.enableVertexAttribArray(waterVelocityLocation);gl.vertexAttribPointer(waterVelocityLocation,3,gl.FLOAT,false,0,0);
          gl.bindBuffer(gl.ARRAY_BUFFER,waterInfoBuffer);gl.enableVertexAttribArray(waterInfoLocation);gl.vertexAttribPointer(waterInfoLocation,2,gl.FLOAT,false,0,0);
          gl.uniform1f(wAspect,w/h);gl.uniform1f(wRx,rotX);gl.uniform1f(wRy,rotY);gl.uniform1f(wRz,rotZ);gl.uniform1f(wMotion,wheelMotion);gl.uniform1f(wZoom,zoomValue);gl.uniform1f(wWater,waterProgress);gl.uniform1f(wDpr,d);
          gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.drawArrays(gl.POINTS,0,waterSeeds.length/3);gl.depthMask(true);gl.disable(gl.BLEND);
        }
        if(flowEffect&&strip>.015&&strip<.985){const f=flowEffect;gl.useProgram(f.particleProgram);gl.bindBuffer(gl.ARRAY_BUFFER,f.particleBuffer);gl.enableVertexAttribArray(f.particleLocation);gl.vertexAttribPointer(f.particleLocation,4,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,f.particleMetaBuffer);gl.enableVertexAttribArray(f.particleMetaLocation);gl.vertexAttribPointer(f.particleMetaLocation,4,gl.FLOAT,false,0,0);gl.uniform1f(f.pAspect,w/h);gl.uniform1f(f.pRx,rotX);gl.uniform1f(f.pRy,rotY);gl.uniform1f(f.pRz,rotZ);gl.uniform1f(f.pMotion,wheelMotion);gl.uniform1f(f.pZoom,zoomValue);gl.uniform1f(f.pBurst,strip);gl.uniform1f(f.pRadius,maxWheelRadius);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);for(let ribbon=0;ribbon<f.ribbonCount;ribbon++)gl.drawArrays(gl.TRIANGLE_STRIP,ribbon*f.ribbonVerticesPerStrip,f.ribbonVerticesPerStrip);gl.depthMask(true);gl.disable(gl.BLEND);}
        raf=requestAnimationFrame(render);
      };
      raf=requestAnimationFrame(render);
    }).catch(error=>{console.error("Unable to load sport wheel",error);onUnavailable();});
    return()=>{disposed=true;cancelAnimationFrame(raf);removeEventListener("pointermove",pointer);canvas.removeEventListener("webglcontextlost",contextLost);};
  },[onReady,onUnavailable,model]);
  return <canvas ref={ref} className="wheel-canvas" aria-label="โมเดลล้อแม็ก Sport Alloy Wheel Rim แบบสามมิติที่หมุนและลอกสีตามการเลื่อนหน้าเว็บ"/>;
}

export function WheelScene({ onReady }: { onReady?: () => void }){
  const [liteReady,setLiteReady]=useState(false);
  const [fullReady,setFullReady]=useState(false);
  const [showLite,setShowLite]=useState(true);
  const [modelAttempt,setModelAttempt]=useState(0);
  const retryTimer=useRef<number|undefined>(undefined);
  const handleLiteReady=useCallback(()=>{setLiteReady(true);onReady?.();},[onReady]);
  const handleLiteUnavailable=useCallback(()=>{
    setLiteReady(false);
    window.clearTimeout(retryTimer.current);
    retryTimer.current=window.setTimeout(()=>setModelAttempt(attempt=>attempt+1),1200);
  },[]);
  const handleFullReady=useCallback(()=>setFullReady(true),[]);
  const handleFullUnavailable=useCallback(()=>{},[]);
  useEffect(()=>()=>window.clearTimeout(retryTimer.current),[]);
  useEffect(()=>{if(!fullReady)return;const timer=window.setTimeout(()=>setShowLite(false),1500);return()=>window.clearTimeout(timer);},[fullReady]);
  return (
    <div className={`wheel-shell${liteReady ? " is-lite-ready" : ""}${fullReady ? " is-full-ready" : ""}`}>
      {showLite&&<div className="wheel-lite-layer">
        <ImportedWheelScene key={modelAttempt} model="lite" onReady={handleLiteReady} onUnavailable={handleLiteUnavailable} />
      </div>}
      <div className="wheel-full-layer">
        {liteReady&&<ImportedWheelScene model="full" onReady={handleFullReady} onUnavailable={handleFullUnavailable} />}
      </div>
    </div>
  );
}

function smoothstepJs(edge0:number,edge1:number,x:number){const t=Math.max(0,Math.min(1,(x-edge0)/(edge1-edge0)));return t*t*(3-2*t);}

function motionTrack(progress:number){
  const keys:[number,number][]=[[0,0],[.14,.08],[.28,.26],[.36,.42],[.55,.42],[.72,.68],[.88,.92],[1,1.12]];
  for(let i=1;i<keys.length;i++){
    const [endAt,endValue]=keys[i],[startAt,startValue]=keys[i-1];
    if(progress<=endAt)return startValue+(endValue-startValue)*smoothstepJs(startAt,endAt,progress);
  }
  return 1;
}

function zoomTrack(progress:number){
  const keys:[number,number][]=[[0,.90],[.16,.98],[.34,1.12],[.52,.94],[.70,1.05],[.86,.91],[1,.86]];
  for(let i=1;i<keys.length;i++){
    const [endAt,endValue]=keys[i],[startAt,startValue]=keys[i-1];
    if(progress<=endAt)return startValue+(endValue-startValue)*smoothstepJs(startAt,endAt,progress);
  }
  return .32;
}
