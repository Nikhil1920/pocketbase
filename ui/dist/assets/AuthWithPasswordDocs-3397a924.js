import{S as Se,i as ve,s as we,M as ke,e as s,w as f,b as u,c as Ot,f as h,g as r,h as o,m as Tt,x as At,N as ce,O as ye,k as ge,P as Pe,n as $e,t as tt,a as et,o as c,d as Mt,T as Re,C as de,p as Ce,r as lt,u as Oe}from"./index-3d896dce.js";import{S as Te}from"./SdkTabs-fa899b66.js";function ue(n,e,l){const i=n.slice();return i[8]=e[l],i}function fe(n,e,l){const i=n.slice();return i[8]=e[l],i}function Ae(n){let e;return{c(){e=f("email")},m(l,i){r(l,e,i)},d(l){l&&c(e)}}}function Me(n){let e;return{c(){e=f("username")},m(l,i){r(l,e,i)},d(l){l&&c(e)}}}function Ue(n){let e;return{c(){e=f("username/email")},m(l,i){r(l,e,i)},d(l){l&&c(e)}}}function pe(n){let e;return{c(){e=s("strong"),e.textContent="username"},m(l,i){r(l,e,i)},d(l){l&&c(e)}}}function be(n){let e;return{c(){e=f("or")},m(l,i){r(l,e,i)},d(l){l&&c(e)}}}function me(n){let e;return{c(){e=s("strong"),e.textContent="email"},m(l,i){r(l,e,i)},d(l){l&&c(e)}}}function he(n,e){let l,i=e[8].code+"",S,m,p,d;function _(){return e[7](e[8])}return{key:n,first:null,c(){l=s("button"),S=f(i),m=u(),h(l,"class","tab-item"),lt(l,"active",e[3]===e[8].code),this.first=l},m(R,C){r(R,l,C),o(l,S),o(l,m),p||(d=Oe(l,"click",_),p=!0)},p(R,C){e=R,C&16&&i!==(i=e[8].code+"")&&At(S,i),C&24&&lt(l,"active",e[3]===e[8].code)},d(R){R&&c(l),p=!1,d()}}}function _e(n,e){let l,i,S,m;return i=new ke({props:{content:e[8].body}}),{key:n,first:null,c(){l=s("div"),Ot(i.$$.fragment),S=u(),h(l,"class","tab-item"),lt(l,"active",e[3]===e[8].code),this.first=l},m(p,d){r(p,l,d),Tt(i,l,null),o(l,S),m=!0},p(p,d){e=p;const _={};d&16&&(_.content=e[8].body),i.$set(_),(!m||d&24)&&lt(l,"active",e[3]===e[8].code)},i(p){m||(tt(i.$$.fragment,p),m=!0)},o(p){et(i.$$.fragment,p),m=!1},d(p){p&&c(l),Mt(i)}}}function De(n){var se,ne;let e,l,i=n[0].name+"",S,m,p,d,_,R,C,O,B,Ut,ot,A,at,F,st,M,G,Dt,X,N,Et,nt,Z=n[0].name+"",it,Wt,rt,I,ct,U,dt,Lt,V,D,ut,Bt,ft,Ht,P,Yt,pt,bt,mt,qt,ht,_t,j,kt,E,St,Ft,vt,W,wt,Nt,yt,It,k,Vt,H,jt,Jt,Kt,gt,Qt,Pt,zt,Gt,Xt,$t,Zt,Rt,J,Ct,L,K,T=[],xt=new Map,te,Q,v=[],ee=new Map,Y;function le(t,a){if(t[1]&&t[2])return Ue;if(t[1])return Me;if(t[2])return Ae}let q=le(n),$=q&&q(n);A=new Te({props:{js:`
        import PocketBase from 'pocketbase';

        const pb = new PocketBase('${n[6]}');

        ...

        const authData = await pb.collection('${(se=n[0])==null?void 0:se.name}').authWithPassword(
            '${n[5]}',
            'YOUR_PASSWORD',
        );

        // after the above you can also access the auth data from the authStore
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.model.id);

        // "logout" the last authenticated account
        pb.authStore.clear();
    `,dart:`
        import 'package:pocketbase/pocketbase.dart';

        final pb = PocketBase('${n[6]}');

        ...

        final authData = await pb.collection('${(ne=n[0])==null?void 0:ne.name}').authWithPassword(
          '${n[5]}',
          'YOUR_PASSWORD',
        );

        // after the above you can also access the auth data from the authStore
        print(pb.authStore.isValid);
        print(pb.authStore.token);
        print(pb.authStore.model.id);

        // "logout" the last authenticated account
        pb.authStore.clear();
    `}});let w=n[1]&&pe(),y=n[1]&&n[2]&&be(),g=n[2]&&me();H=new ke({props:{content:"?expand=relField1,relField2.subRelField"}});let x=n[4];const oe=t=>t[8].code;for(let t=0;t<x.length;t+=1){let a=fe(n,x,t),b=oe(a);xt.set(b,T[t]=he(b,a))}let z=n[4];const ae=t=>t[8].code;for(let t=0;t<z.length;t+=1){let a=ue(n,z,t),b=ae(a);ee.set(b,v[t]=_e(b,a))}return{c(){e=s("h3"),l=f("Auth with password ("),S=f(i),m=f(")"),p=u(),d=s("div"),_=s("p"),R=f(`Returns new auth token and account data by a combination of
        `),C=s("strong"),$&&$.c(),O=f(`
        and `),B=s("strong"),B.textContent="password",Ut=f("."),ot=u(),Ot(A.$$.fragment),at=u(),F=s("h6"),F.textContent="API details",st=u(),M=s("div"),G=s("strong"),G.textContent="POST",Dt=u(),X=s("div"),N=s("p"),Et=f("/api/collections/"),nt=s("strong"),it=f(Z),Wt=f("/auth-with-password"),rt=u(),I=s("div"),I.textContent="Body Parameters",ct=u(),U=s("table"),dt=s("thead"),dt.innerHTML=`<tr><th>Param</th> 
            <th>Type</th> 
            <th width="50%">Description</th></tr>`,Lt=u(),V=s("tbody"),D=s("tr"),ut=s("td"),ut.innerHTML=`<div class="inline-flex"><span class="label label-success">Required</span> 
                    <span>identity</span></div>`,Bt=u(),ft=s("td"),ft.innerHTML='<span class="label">String</span>',Ht=u(),P=s("td"),Yt=f(`The
                `),w&&w.c(),pt=u(),y&&y.c(),bt=u(),g&&g.c(),mt=f(`
                of the record to authenticate.`),qt=u(),ht=s("tr"),ht.innerHTML=`<td><div class="inline-flex"><span class="label label-success">Required</span> 
                    <span>password</span></div></td> 
            <td><span class="label">String</span></td> 
            <td>The auth record password.</td>`,_t=u(),j=s("div"),j.textContent="Query parameters",kt=u(),E=s("table"),St=s("thead"),St.innerHTML=`<tr><th>Param</th> 
            <th>Type</th> 
            <th width="60%">Description</th></tr>`,Ft=u(),vt=s("tbody"),W=s("tr"),wt=s("td"),wt.textContent="expand",Nt=u(),yt=s("td"),yt.innerHTML='<span class="label">String</span>',It=u(),k=s("td"),Vt=f(`Auto expand record relations. Ex.:
                `),Ot(H.$$.fragment),jt=f(`
                Supports up to 6-levels depth nested relations expansion. `),Jt=s("br"),Kt=f(`
                The expanded relations will be appended to the record under the
                `),gt=s("code"),gt.textContent="expand",Qt=f(" property (eg. "),Pt=s("code"),Pt.textContent='"expand": {"relField1": {...}, ...}',zt=f(`).
                `),Gt=s("br"),Xt=f(`
                Only the relations to which the request user has permissions to `),$t=s("strong"),$t.textContent="view",Zt=f(" will be expanded."),Rt=u(),J=s("div"),J.textContent="Responses",Ct=u(),L=s("div"),K=s("div");for(let t=0;t<T.length;t+=1)T[t].c();te=u(),Q=s("div");for(let t=0;t<v.length;t+=1)v[t].c();h(e,"class","m-b-sm"),h(d,"class","content txt-lg m-b-sm"),h(F,"class","m-b-xs"),h(G,"class","label label-primary"),h(X,"class","content"),h(M,"class","alert alert-success"),h(I,"class","section-title"),h(U,"class","table-compact table-border m-b-base"),h(j,"class","section-title"),h(E,"class","table-compact table-border m-b-base"),h(J,"class","section-title"),h(K,"class","tabs-header compact left"),h(Q,"class","tabs-content"),h(L,"class","tabs")},m(t,a){r(t,e,a),o(e,l),o(e,S),o(e,m),r(t,p,a),r(t,d,a),o(d,_),o(_,R),o(_,C),$&&$.m(C,null),o(_,O),o(_,B),o(_,Ut),r(t,ot,a),Tt(A,t,a),r(t,at,a),r(t,F,a),r(t,st,a),r(t,M,a),o(M,G),o(M,Dt),o(M,X),o(X,N),o(N,Et),o(N,nt),o(nt,it),o(N,Wt),r(t,rt,a),r(t,I,a),r(t,ct,a),r(t,U,a),o(U,dt),o(U,Lt),o(U,V),o(V,D),o(D,ut),o(D,Bt),o(D,ft),o(D,Ht),o(D,P),o(P,Yt),w&&w.m(P,null),o(P,pt),y&&y.m(P,null),o(P,bt),g&&g.m(P,null),o(P,mt),o(V,qt),o(V,ht),r(t,_t,a),r(t,j,a),r(t,kt,a),r(t,E,a),o(E,St),o(E,Ft),o(E,vt),o(vt,W),o(W,wt),o(W,Nt),o(W,yt),o(W,It),o(W,k),o(k,Vt),Tt(H,k,null),o(k,jt),o(k,Jt),o(k,Kt),o(k,gt),o(k,Qt),o(k,Pt),o(k,zt),o(k,Gt),o(k,Xt),o(k,$t),o(k,Zt),r(t,Rt,a),r(t,J,a),r(t,Ct,a),r(t,L,a),o(L,K);for(let b=0;b<T.length;b+=1)T[b]&&T[b].m(K,null);o(L,te),o(L,Q);for(let b=0;b<v.length;b+=1)v[b]&&v[b].m(Q,null);Y=!0},p(t,[a]){var ie,re;(!Y||a&1)&&i!==(i=t[0].name+"")&&At(S,i),q!==(q=le(t))&&($&&$.d(1),$=q&&q(t),$&&($.c(),$.m(C,null)));const b={};a&97&&(b.js=`
        import PocketBase from 'pocketbase';

        const pb = new PocketBase('${t[6]}');

        ...

        const authData = await pb.collection('${(ie=t[0])==null?void 0:ie.name}').authWithPassword(
            '${t[5]}',
            'YOUR_PASSWORD',
        );

        // after the above you can also access the auth data from the authStore
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.model.id);

        // "logout" the last authenticated account
        pb.authStore.clear();
    `),a&97&&(b.dart=`
        import 'package:pocketbase/pocketbase.dart';

        final pb = PocketBase('${t[6]}');

        ...

        final authData = await pb.collection('${(re=t[0])==null?void 0:re.name}').authWithPassword(
          '${t[5]}',
          'YOUR_PASSWORD',
        );

        // after the above you can also access the auth data from the authStore
        print(pb.authStore.isValid);
        print(pb.authStore.token);
        print(pb.authStore.model.id);

        // "logout" the last authenticated account
        pb.authStore.clear();
    `),A.$set(b),(!Y||a&1)&&Z!==(Z=t[0].name+"")&&At(it,Z),t[1]?w||(w=pe(),w.c(),w.m(P,pt)):w&&(w.d(1),w=null),t[1]&&t[2]?y||(y=be(),y.c(),y.m(P,bt)):y&&(y.d(1),y=null),t[2]?g||(g=me(),g.c(),g.m(P,mt)):g&&(g.d(1),g=null),a&24&&(x=t[4],T=ce(T,a,oe,1,t,x,xt,K,ye,he,null,fe)),a&24&&(z=t[4],ge(),v=ce(v,a,ae,1,t,z,ee,Q,Pe,_e,null,ue),$e())},i(t){if(!Y){tt(A.$$.fragment,t),tt(H.$$.fragment,t);for(let a=0;a<z.length;a+=1)tt(v[a]);Y=!0}},o(t){et(A.$$.fragment,t),et(H.$$.fragment,t);for(let a=0;a<v.length;a+=1)et(v[a]);Y=!1},d(t){t&&c(e),t&&c(p),t&&c(d),$&&$.d(),t&&c(ot),Mt(A,t),t&&c(at),t&&c(F),t&&c(st),t&&c(M),t&&c(rt),t&&c(I),t&&c(ct),t&&c(U),w&&w.d(),y&&y.d(),g&&g.d(),t&&c(_t),t&&c(j),t&&c(kt),t&&c(E),Mt(H),t&&c(Rt),t&&c(J),t&&c(Ct),t&&c(L);for(let a=0;a<T.length;a+=1)T[a].d();for(let a=0;a<v.length;a+=1)v[a].d()}}}function Ee(n,e,l){let i,S,m,p,{collection:d=new Re}=e,_=200,R=[];const C=O=>l(3,_=O.code);return n.$$set=O=>{"collection"in O&&l(0,d=O.collection)},n.$$.update=()=>{var O,B;n.$$.dirty&1&&l(2,S=(O=d==null?void 0:d.options)==null?void 0:O.allowEmailAuth),n.$$.dirty&1&&l(1,m=(B=d==null?void 0:d.options)==null?void 0:B.allowUsernameAuth),n.$$.dirty&6&&l(5,p=m&&S?"YOUR_USERNAME_OR_EMAIL":m?"YOUR_USERNAME":"YOUR_EMAIL"),n.$$.dirty&1&&l(4,R=[{code:200,body:JSON.stringify({token:"JWT_TOKEN",record:de.dummyCollectionRecord(d)},null,2)},{code:400,body:`
                {
                  "code": 400,
                  "message": "Failed to authenticate.",
                  "data": {
                    "identity": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}])},l(6,i=de.getApiExampleUrl(Ce.baseUrl)),[d,m,S,_,R,p,i,C]}class Be extends Se{constructor(e){super(),ve(this,e,Ee,De,we,{collection:0})}}export{Be as default};
