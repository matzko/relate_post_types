var FilosofoJS=function(a){var r=function(B,w,d){if(B.addEventListener){B.addEventListener(w,d,false)}else{if(B.attachEvent){B.attachEvent("on"+w,function(){return d.call(B,k.event)})}}},x=document,k=window,j=(function(){var w,d=[function(){return new a.ActiveXObject("Microsoft.XMLHTTP")},function(){return new a.ActiveXObject("Msxml2.XMLHTTP.3.0")},function(){return new a.ActiveXObject("Msxml2.XMLHTTP.6.0")},function(){return new XMLHttpRequest()}];for(w=d.length;w--;){try{if(d[w]()){return d[w]}}catch(B){}}})(),A=function(d,C,E){d=d||"admin-ajax.php";C=C||{};var w,B=new j;w=p(C);try{if("undefined"==typeof E){E=function(){}}B.open("POST",d,true);B.setRequestHeader("Content-Type","application/x-www-form-urlencoded");B.onreadystatechange=function(){if(4==B.readyState){B.onreadystatechange=function(){};if(200<=B.status&&300>B.status||("undefined"==typeof B.status)){E(B.responseText)}}};B.send(w)}catch(D){}},b=function(B,d){var w=B.constructor.prototype[d];return("undefined"==typeof w||d!==B[w])},p=function(d){var B,w,C=[];for(B in d){if(b(d,B)){if("[]"==B.substr(B.length-2,B.length)){for(w=0;w<d[B].length;w++){C[C.length]=l(B)+"="+l(d[B][w])}}else{C[C.length]=l(B)+"="+l(d[B])}}}return C.join("&")},l=(function(){var d=function(w){return encodeURIComponent(w).replace(/%20/,"+").replace(/(.{0,3})(%0A)/g,function(C,D,B){return D+(D=="%0D"?"":"%0D")+B}).replace(/(%0D)(.{0,3})/g,function(C,D,B){return D+(B=="%0A"?"":"%0A")+B})};if(typeof encodeURIComponent!="undefined"&&String.prototype.replace&&d("\n \r")=="%0D%0A+%0D%0A"){return d}})(),v=function(d){d=d||k.event;return d.target||d.srcElement},y=function(w,B){var d=/([^\[]*)\[([^\]]*)\]/.exec(w);if(d&&d[0]&&d[1]&&d[2]){if(!this[d[1]]){this[d[1]]={}}this[d[1]][d[2]]=B}else{if(d&&d[0]&&d[1]&&""===d[2]){if(!this[d[1]]||!this[d[1]][0]){this[d[1]]=[]}this[d[1]][this[d[1]].length]=B}else{this[w]=B}}},q=function(w){if(!w){return{}}var C=["button","input","select","textarea"],G,E=C.length,D=0,B,F={},H,d;while(E--){H=w.getElementsByTagName(C[E]);G=H.length;while(G--){if(H[G]&&H[G].name){B=(H[G].type+"").toLowerCase();if("select-multiple"==B){D=H[G].options.length;if(-1<H[G].selectedIndex){F[H[G].name]=[];d=[];while(D--){if(H[G].options[D].selected){d[d.length]=H[G].options[D].value}}y.call(F,H[G].name,d)}}else{if("select"==H[G].name){if(H[G].options&&H[G].options[H[G].selectedIndex]){y.call(F,H[G].name,H[G].options[H[G].selectedIndex])}else{if(H[G].value){y.call(F,H[G].name,H[G].value)}}}else{if("button"==H[G].nodeName.toLowerCase()){if(H[G].name){if(H[G].getAttribute("value")){y.call(F,H[G].name,H[G].getAttribute("value"))}else{if(H[G].value){y.call(F,H[G].name,H[G].value)}else{if(H[G].innerText||H[G].textContent){y.call(F,H[G].name,(H[G].innerText||H[G].textContent))}}}}}else{if("checkbox"==B){if(H[G].checked){y.call(F,H[G].name,H[G].value)}}else{if(!B||"radio"!=B||("radio"==B&&H[G].checked)){y.call(F,H[G].name,H[G].value)}}}}}}}}return F},o=function(B,C,D){var w=new Date(),d="";if(D){w.setTime(w.getTime()+(D*24*60*60*1000));d="; expires="+(w.toUTCString?w.toUTCString():w.toGMTString())}x.cookie=B+"="+C+d+"; path=/"},u=function(w){var C=w+"=",d=x.cookie.split(";"),B;for(B=0;B<d.length;B++){while(d[B].charAt(0)==" "){d[B]=d[B].substring(1,d[B].length)}if(d[B].indexOf(C)==0){return d[B].substring(C.length,d[B].length)}}return null},h=function(B,d,w){return((1-w)*B)+(w*d)},e=function(C,d,B){var w=h(C,d,B*B*(3-2*B));return w},f=false,c=function(B){if(f){return}var d=B,I=0,G=0,F=25,D=400,H=D/F,w,C,E;while(d.offsetParent&&d!=x.dElement){I+=d.offsetTop;d=d.offsetParent}I=I-30;I=0>I?0:I;if(x.documentElement&&x.documentElement.scrollTop){G=x.documentElement.scrollTop}else{if(x.body&&x.body.scrollTop){G=x.body.scrollTop}else{if(x.getElementsByTagName("body")){G=x.getElementsByTagName("body")[0].scrollTop}}}w=G-I;C=w/H;for(E=0;E<H;E++){(function(){var L=Math.ceil(G-(e(0,1,(E/H))*w)),J=E,K=(E+1)<H?false:true;setTimeout(function(){if(K){f=false}scrollTo(0,L)},J*F)})()}},z=function(d,w){return{animate:function(){if(this.inProgress){return}this.inProgress=true;w=w||function(){};var B=this.time/this.rate,C,E=false,F,D=this;for(C=0;C<B;C++){E=(C+1)<B?false:true;F=this.easing(0,1,(C/B))*d;(function(G){var I=C,H=E,J=F;setTimeout(function(){if(H){D.inProgress=false}G.apply(D,[J,H])},I*D.rate)})(w)}},easing:e,rate:20,time:500}},t=function(C,w,D){if(!C){return}w=w||-1;D=D||function(){};if(-1===w){C.style.opacity=1;C.style.filter="alpha(opacity=100)"}else{if(1===w){C.style.opacity=0;C.style.filter="alpha(opacity=0)";C.style.display="block"}}var B=function(F,E){var G=-1===w?100+F:F;C.style.opacity=G/100;C.style.filter="alpha(opacity="+G+")";if(E){D.call(C);if(-1===w){C.style.opacity=0;C.style.filter="alpha(opacity=0)";C.style.display="none"}else{C.style.opacity=1;C.style.filter="alpha(opacity=100)";C.style.display="block"}}},d;if(C){if(-1===w){d=new z(-100,B),d.animate()}else{d=new z(100,B);d.animate()}}},s=function(w,B,d){if(!d){d=x}if(!w||!B){return false}(function(E,F,D){var C=new RegExp("\\b"+E+"\\b");r(D,"click",function(I){var G=true,H=v(I);do{if(H.className&&C.exec(H.className)){G=F.call(H,I);if(!G){if(I.stopPropagation){I.stopPropagation()}if(I.preventDefault){I.preventDefault()}I.cancelBubble=true;I.returnValue=false;return false}else{return true}}else{H=H.parentNode}}while(H&&H!=D)})})(w,B,d)},m=function(d){if(d){n=d}r(x,"DOMContentLoaded",i);r(k,"load",i)},g=false,n=function(){},i=function(){if(g){return false}g=true;n()};return{addEvent:r,Animation:z,attachClassClickListener:s,doWhenReady:m,fade:t,getCookie:u,getEventTarget:v,getFormData:q,isObjProperty:b,postReq:A,scrollToElement:c,setCookie:o}};