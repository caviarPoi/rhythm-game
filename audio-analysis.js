// One pass: millisecond peaks and 10 ms onset envelope, off the UI thread.
self.onmessage=({data:{channels,sr}})=>{
 const a=channels[0],hop=Math.max(1,Math.round(sr*.01)),N=Math.floor(a.length/hop),flux=new Float32Array(N),peaks=new Float32Array(Math.ceil(a.length/sr*1000)+1);
 let prev=0,old=0,low=0,high=0,k=0,next=Math.ceil(sr/1000),max=0;
 for(let i=0;i<a.length;i++){
  const v=a[i];let amp=Math.abs(v);for(let c=1;c<channels.length;c++)amp=Math.max(amp,Math.abs(channels[c][i]));
  if(i>=next){peaks[k++]=max;max=0;next=Math.ceil((k+1)*sr/1000)}max=Math.max(max,amp);
  low+=v*v;const d=v-prev;high+=d*d;prev=v;
  if((i+1)%hop===0){const j=(i+1)/hop-1,e=Math.log1p(100*Math.sqrt(low/hop))+Math.log1p(100*Math.sqrt(high/hop));if(j)flux[j]=Math.max(0,e-old);old=e;low=high=0}
 }peaks[k]=max;
 self.postMessage({peaks,flux,hop,sr},[peaks.buffer,flux.buffer]);
};
