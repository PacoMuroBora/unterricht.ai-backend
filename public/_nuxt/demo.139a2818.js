import{_ as r,r as u,q as h,c as o,b as p,w as _,T as b,u as t,s as f,o as s,a as d,t as n,p as m,f as x}from"./entry.0876b31b.js";const g=a=>(m("data-v-3c144194"),a=a(),x(),a),v={class:"container mx-auto flex flex-col items-center h-full"},y=g(()=>d("h2",{class:"text-5xl font-bold mb-8 text-white"},"AI Stundenplan Demo",-1)),k={class:"text-3xl font-bold"},w={key:0,class:"flex-1"},S={__name:"demo",setup(a){const e=u(0),l=[{title:"Region",input:"region",desc:"Please state where your institution is located so we can evaluate the applicable legislation."},{title:"Methodology",input:"methodology",desc:"Please state which teaching methods you like to apply."},{title:"Submit",input:"submit",desc:"Thank you."}],c=h(()=>l[e.value]),i=()=>{e.value<l.length-1?e.value+=1:console.log("Form Submitted!")};return(I,P)=>(s(),o("div",v,[y,p(b,{name:"fade",mode:"out-in"},{default:_(()=>[(s(),o("div",{key:t(e),class:"page text-center h-full flex flex-col flex-1"},[d("h1",k,"Page "+n(t(e)+1),1),t(e)!==l.length-1?(s(),o("div",w,n(t(c).title)+" "+n(t(c).desc),1)):(s(),o("button",{key:1,onClick:i,class:"border-2 bg-white border-black hover:bg-blue-500 hover:text-white px-6 py-2 rounded-full font-bold"}," Submit "))]))]),_:1}),t(e)!==l.length-1?(s(),o("button",{key:0,onClick:i,class:"border-2 bg-white border-black hover:bg-blue-500 hover:text-white px-6 py-2 rounded-full font-bold"}," Continue ")):f("",!0)]))}},N=r(S,[["__scopeId","data-v-3c144194"]]);export{N as default};